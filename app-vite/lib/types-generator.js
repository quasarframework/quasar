import { isAbsolute, join, relative } from 'node:path'
import { statSync } from 'node:fs'
import fse from 'fs-extra'

import { cliPkg, resolveToCliDir } from './utils/cli-runtime.js'
import { isModeInstalled } from './modes/modes-utils.js'
import { getPackagePath } from './utils/get-package-path.js'

const qAppPaths = (() => {
  const exportsRE = /^\./
  const dTsRE = /\.d\.ts$/

  const localMap = {}

  for (const key in cliPkg.exports) {
    const localMapKey = key.replace(exportsRE, '#q-app')
    const value = cliPkg.exports[ key ]
    if (Object(value) === value) {
      if (value.types) {
        localMap[ localMapKey ] = resolveToCliDir(value.types)
      }
    }
    else if (typeof value === 'string') {
      if (dTsRE.test(value)) {
        localMap[ localMapKey ] = resolveToCliDir(value)
      }
    }
  }

  return localMap
})()

// We generate all the files for JS projects as well, because they provide
// better autocomplete and type checking in the IDE.
/**
 * @param {import('../types/configuration/conf').ResolvedQuasarConf} quasarConf
 */
export function generateTypes (quasarConf) {
  const { appPaths } = quasarConf.ctx
  const tsConfigDir = appPaths.resolve.app('.quasar')

  const fsUtils = {
    tsConfigDir,
    writeFileSync (filename, content) {
      const file = join(tsConfigDir, filename)

      // Avoid unnecessary writes which will trigger esbuild
      // to recompile & apply quasar.config file changes
      if (
        fse.existsSync(file) === false
        || fse.readFileSync(file, 'utf-8') !== content
      ) {
        fse.writeFileSync(file, content, 'utf-8')
      }
    }
  }

  fse.ensureDirSync(tsConfigDir)

  generateTsConfig(quasarConf, fsUtils)
  writeFeatureFlags(quasarConf, fsUtils)
  writeDeclarations(quasarConf, fsUtils)
}

/**
 * @param {import('../types/configuration/conf').ResolvedQuasarConf} quasarConf
 */
function generateTsConfig (quasarConf, fsUtils) {
  const { appPaths } = quasarConf.ctx

  /** Returns the path relative to the tsconfig.json file, in POSIX format */
  const toTsPath = pathToTransform => {
    // Folder aliases are defined as absolute paths.
    // So, the rest, e.g. `'some-pkg': 'another-pkg'`, is not absolute and must be resolved as a package.
    const itemPath = isAbsolute(pathToTransform) === false
      // Try to resolve the package path first, it's crucial to some monorepo setups like npm/yarn/bun workspaces
      ? (getPackagePath(pathToTransform, appPaths.appDir) || join('node_modules', pathToTransform))
      : pathToTransform

    const relativePath = relative(fsUtils.tsConfigDir, itemPath).replaceAll('\\', '/')

    if (relativePath.length === 0) return '.'
    if (relativePath.startsWith('./') === false) return ('./' + relativePath)
    return relativePath
  }

  const aliasMap = { ...quasarConf.build.alias }

  // TS aliases doesn't play well with package.json#exports: https://github.com/microsoft/TypeScript/issues/60460
  // So, we had to specify each entry point separately here
  delete aliasMap[ '#q-app' ] // remove the existing one so that all the added ones are listed under each other
  Object.assign(aliasMap, qAppPaths)

  if (isModeInstalled(appPaths, 'capacitor')) {
    const target = appPaths.resolve.capacitor('node_modules')
    const { dependencies } = JSON.parse(
      fse.readFileSync(appPaths.resolve.capacitor('package.json'), 'utf-8')
    )

    Object.keys(dependencies).forEach(dep => {
      aliasMap[ dep ] = join(target, dep)
    })
  }

  const paths = {}
  Object.keys(aliasMap).forEach(alias => {
    const rawPath = aliasMap[ alias ]
    const tsPath = toTsPath(rawPath)

    const stats = statSync(
      join(fsUtils.tsConfigDir, tsPath),
      { throwIfNoEntry: false }
    )

    // import ... from 'src' (resolves to 'src/index')
    paths[ alias ] = [ tsPath ]

    if (stats === void 0 || stats.isFile() === true) return

    // import ... from 'src/something' (resolves to 'src/something.ts' or 'src/something/index.ts')
    paths[ `${ alias }/*` ] = [ `${ tsPath }/*` ]
  })

  // See https://www.totaltypescript.com/tsconfig-cheat-sheet
  // We use ESNext since we are transpiling and pretty much everything should work
  // We recommend `@typescript-eslint/consistent-type-imports` instead of `verbatimModuleSyntax`, if using linting (using both can cause conflicts)
  const tsConfig = {
    compilerOptions: {
      esModuleInterop: true,
      skipLibCheck: true,
      target: 'esnext',
      allowJs: true,
      resolveJsonModule: true,
      moduleDetection: 'force',
      isolatedModules: true,

      // We are not transpiling with tsc, so leave it to the bundler
      module: 'preserve', // implies `moduleResolution: 'bundler'`
      noEmit: true,

      lib: [ 'esnext', 'dom', 'dom.iterable' ],

      /**
       * Keep in sync with the description of `typescript.strict` in {@link file://./../types/configuration/build.d.ts}
       */
      ...(quasarConf.build.typescript.strict
        ? {
            strict: true,
            allowUnreachableCode: false,
            allowUnusedLabels: false,
            noImplicitOverride: true,
            exactOptionalPropertyTypes: true,
            noUncheckedIndexedAccess: true
          }
        : {}),

      paths
    },
    // include and exclude are relative to .quasar
    include: [
      './**/*.d.ts', // Since .quasar starts with a dot, it won't be included by default
      './../**/*'
    ],
    exclude: [
      './../dist',
      './../node_modules',
      './../src-capacitor',
      './../src-cordova',
      './../quasar.config.*.temporary.compiled*'
    ]
  }

  quasarConf.build.typescript.extendTsConfig?.(tsConfig)

  fsUtils.writeFileSync(
    'tsconfig.json',
    JSON.stringify(tsConfig, null, 2)
  )
}

// We don't have a specific entry for the augmenting file in `package.json > exports`
// We rely on the wildcard entry, so we use a deep import, instead of let's say `quasar/feature-flags`
// When using TypeScript `moduleResolution: "bundler"`, it requires the file extension.
// This may sound unusual, but that's because it seems to treat wildcard entries differently.
const featureFlagsTemplate = `/* eslint-disable */
import "quasar/dist/types/feature-flag.d.ts";

declare module "quasar/dist/types/feature-flag.d.ts" {
  interface QuasarFeatureFlags {
    __INJECTION_POINT__
  }
}
`

/**
 * Flags are also available in JS codebases because feature flags still
 * benefit JS users by providing autocomplete.
 *
 * @param {import('../types/configuration/conf').ResolvedQuasarConf} quasarConf
 */
function writeFeatureFlags (quasarConf, fsUtils) {
  const { appPaths } = quasarConf.ctx

  const featureFlags = new Set()

  if (quasarConf.metaConf.hasStore === true) {
    featureFlags.add('store')
  }

  // spa does not have a feature flag, so we skip it
  const modes = [ 'pwa', 'ssr', 'cordova', 'capacitor', 'electron', 'bex' ]
  for (const modeName of modes) {
    if (isModeInstalled(appPaths, modeName)) {
      featureFlags.add(modeName)
    }
  }

  const flagDefinitions = Array.from(featureFlags)
    .map(flag => `${ flag }: true;`)
    .join('\n    ')
  const contents = featureFlagsTemplate.replace(
    '__INJECTION_POINT__',
    flagDefinitions || '// no feature flags'
  )

  fsUtils.writeFileSync('feature-flags.d.ts', contents)
}

/*
  Load app-vite's augmentations for `quasar` package.
  It will augment CLI-specific features.

  Load Vite's client types, see https://vitejs.dev/guide/features#client-types
*/
const declarationsTemplate = `/* eslint-disable */
/// <reference types="@quasar/app-vite" />

/// <reference types="vite/client" />
`

// Mocks all files ending in `.vue` showing them as plain Vue instances
const vueShimsTemplate = `/* eslint-disable */
declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent;
  export default component;
}
`

const piniaTemplate = `/* eslint-disable */
import { Router } from 'vue-router';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router;
  }
}
`

/**
 * @param {import('../types/configuration/conf').ResolvedQuasarConf} quasarConf
 */
function writeDeclarations (quasarConf, fsUtils) {
  fsUtils.writeFileSync('quasar.d.ts', declarationsTemplate)

  if (quasarConf.build.typescript.vueShim) {
    fsUtils.writeFileSync('shims-vue.d.ts', vueShimsTemplate)
  }

  const { hasStore, storePackage } = quasarConf.metaConf
  if (hasStore && storePackage === 'pinia') {
    fsUtils.writeFileSync('pinia.d.ts', piniaTemplate)
  }
}
