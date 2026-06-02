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
    const value = cliPkg.exports[key]
    if (Object(value) === value) {
      if (value.types) {
        localMap[localMapKey] = resolveToCliDir(value.types)
      }
    } else if (typeof value === 'string' && dTsRE.test(value)) {
      localMap[localMapKey] = resolveToCliDir(value)
    }
  }

  return localMap
})()

// We generate all the files for JS projects as well, because they provide
// better autocomplete and type checking in the IDE.
/**
 * @param {import('../types/configuration/conf').ResolvedQuasarConf} quasarConf
 */
export function generateTypes(quasarConf) {
  const { appPaths } = quasarConf.ctx
  const tsConfigDir = appPaths.resolve.app('.quasar')

  const fsUtils = {
    tsConfigDir,
    writeFileSync(filename, content) {
      const file = join(tsConfigDir, filename)

      // Avoid unnecessary writes which will trigger rolldown
      // to recompile & apply quasar.config file changes
      if (!fse.existsSync(file) || fse.readFileSync(file, 'utf8') !== content) {
        fse.writeFileSync(file, content, 'utf8')
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
function generateTsConfig(quasarConf, fsUtils) {
  const { appPaths, pkg } = quasarConf.ctx

  /** Returns the path relative to the tsconfig.json file, in POSIX format */
  const toTsPath = pathToTransform => {
    // Folder aliases are defined as absolute paths.
    // So, the rest, e.g. `'some-pkg': 'another-pkg'`, is not absolute and must be resolved as a package.
    const itemPath = isAbsolute(pathToTransform)
      ? pathToTransform
      : // Try to resolve the package path first, it's crucial to some monorepo setups like npm/yarn/bun workspaces
        getPackagePath(pathToTransform, appPaths.appDir) ||
        join('node_modules', pathToTransform)

    const relativePath = relative(fsUtils.tsConfigDir, itemPath).replaceAll(
      '\\',
      '/'
    )

    if (relativePath.length === 0) return '.'
    if (!relativePath.startsWith('./')) return `./${relativePath}`
    return relativePath
  }

  // TypeScript's auto-import suggester picks the first matching alias in declaration order, so order matters here.
  // `build.alias` is already ordered user-first by quasar-config-file.js, so nothing special to do here.
  const aliasMap = { ...quasarConf.build.alias }

  // TS aliases doesn't play well with package.json#exports: https://github.com/microsoft/TypeScript/issues/60460
  // So, we had to specify each entry point separately here
  delete aliasMap['#q-app'] // remove the existing one so that all the added ones are listed under each other
  Object.assign(aliasMap, qAppPaths)

  if (isModeInstalled(appPaths, 'capacitor')) {
    const target = appPaths.resolve.capacitor('node_modules')
    const { dependencies } = pkg.capacitorPkg
    if (dependencies) {
      Object.keys(dependencies).forEach(dep => {
        aliasMap[dep] = join(target, dep)
      })
    }
  }

  if (isModeInstalled(appPaths, 'electron')) {
    const target = appPaths.resolve.electron('node_modules')

    // We alias `electron` itself because it's a runtime dep
    // (and specified in devDependencies)
    aliasMap['electron'] = join(target, 'electron')

    const { dependencies } = pkg.electronPkg
    if (dependencies) {
      Object.keys(dependencies).forEach(dep => {
        aliasMap[dep] = join(target, dep)
      })
    }
  }

  if (isModeInstalled(appPaths, 'pwa')) {
    const target = appPaths.resolve.pwa('node_modules')
    const { dependencies } = pkg.pwaPkg
    if (dependencies) {
      Object.keys(dependencies).forEach(dep => {
        aliasMap[dep] = join(target, dep)
      })
    }
  }

  if (isModeInstalled(appPaths, 'bex')) {
    const target = appPaths.resolve.bex('node_modules')
    const { dependencies } = pkg.bexPkg
    if (dependencies) {
      Object.keys(dependencies).forEach(dep => {
        aliasMap[dep] = join(target, dep)
      })
    }
  }

  const paths = {}
  Object.keys(aliasMap).forEach(alias => {
    const rawPath = aliasMap[alias]
    const tsPath = toTsPath(rawPath)

    const stats = statSync(join(fsUtils.tsConfigDir, tsPath), {
      throwIfNoEntry: false
    })

    // import ... from '@' (resolves to 'src/index')
    paths[alias] = [tsPath]

    if (stats === void 0 || stats.isFile()) return

    // import ... from '@/something' (resolves to 'src/something.ts' or 'src/something/index.ts')
    paths[`${alias}/*`] = [`${tsPath}/*`]
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

      lib: ['esnext', 'dom', 'dom.iterable'],

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
    include: ['./*.d.ts', './../**/*'],
    exclude: [
      './../dist',
      './../node_modules',
      './../src-capacitor',
      './../src-cordova',
      './../quasar.config.*.temporary.compiled*'
    ]
  }

  if (quasarConf.build.filenameBasedRouting) {
    tsConfig.compilerOptions.moduleResolution = 'Bundler'
    tsConfig.vueCompilerOptions = {
      plugins: [
        'vue-router/volar/sfc-route-blocks',
        'vue-router/volar/sfc-typed-router'
      ]
    }
  }

  quasarConf.build.typescript.extendTsConfig?.(tsConfig)

  fsUtils.writeFileSync('tsconfig.json', JSON.stringify(tsConfig, null, 2))
}

// We don't have a specific entry for the augmenting file in `package.json > exports`
// We rely on the wildcard entry, so we use a deep import, instead of let's say `quasar/feature-flags`
// When using TypeScript `moduleResolution: "bundler"`, it requires the file extension.
// This may sound unusual, but that's because it seems to treat wildcard entries differently.
const featureFlagsTemplate = `/* oxlint-disable */
/* eslint-disable */
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
function writeFeatureFlags(quasarConf, fsUtils) {
  const { appPaths } = quasarConf.ctx

  const featureFlags = new Set()

  if (quasarConf.metaConf.hasStore) {
    featureFlags.add('store')
  }

  // spa does not have a feature flag, so we skip it
  const modes = ['pwa', 'ssr', 'cordova', 'capacitor', 'electron', 'bex']
  for (const modeName of modes) {
    if (isModeInstalled(appPaths, modeName)) {
      featureFlags.add(modeName)
    }
  }

  const flagDefinitions = [...featureFlags]
    .map(flag => `${flag}: true;`)
    .join('\n    ')
  const contents = featureFlagsTemplate.replace(
    '__INJECTION_POINT__',
    flagDefinitions || '// no feature flags'
  )

  fsUtils.writeFileSync('feature-flags.d.ts', contents)
}

/**
 * Load q/app-vite's augmentations for `quasar` package.
 * It will augment CLI-specific features, including
 * import.meta.env interface.
 * It also loads vite's client types.
 */
const declarationsTemplate = `/* oxlint-disable */
/* eslint-disable */
/// <reference types="@quasar/app-vite" />
/// <reference types="@quasar/app-vite/client" />

// https://quasar.dev/quasar-cli-vite/handling-import-meta-env#type-inference
`

// Mocks all files ending in `.vue` showing them as plain Vue instances
const vueShimsTemplate = `/* oxlint-disable */
/* eslint-disable */
declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent;
  export default component;
}
`

const piniaTemplate = `/* oxlint-disable */
/* eslint-disable */
import { Router } from 'vue-router';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router;
  }
}
`

const validDeclareConstKeyRE = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/
function getStrDefineType(value) {
  if (value === 'true' || value === 'false') return 'boolean'
  if (value === 'null') return 'null'

  const trimmed = value.trim()
  return trimmed !== '' && !Number.isNaN(Number(trimmed)) ? 'number' : 'string'
}

function getImportMetaEnvDeclaration(quasarConf) {
  const { define, env } = quasarConf.build
  if (env.ignoreType === 'all') {
    return `\ninterface ImportMetaEnv {}\n`
  }

  const { clientEnvDefineList, backendEnvDefineList } = quasarConf.metaConf
  const ignoreType =
    Array.isArray(env.ignoreType) && env.ignoreType.length !== 0
      ? env.ignoreType
      : false

  let defineKeys = Object.keys(define)
  let clientEnvKeys = Object.keys(clientEnvDefineList)
  let backendEnvKeys = Object.keys(backendEnvDefineList)

  if (ignoreType) {
    const ignoreTypeSet = new Set(ignoreType)
    defineKeys = defineKeys.filter(key => !ignoreTypeSet.has(key))
    clientEnvKeys = clientEnvKeys.filter(key => !ignoreTypeSet.has(key))
    backendEnvKeys = backendEnvKeys.filter(key => !ignoreTypeSet.has(key))
  }

  const defineSet = new Set(defineKeys)
  const clientSet = new Set(clientEnvKeys).difference(defineSet)
  const backendSet = new Set(backendEnvKeys)
    .difference(defineSet)
    .difference(clientSet)

  const importMetaEnv = [
    ...defineKeys
      .filter(
        key =>
          key.startsWith('import.meta.env.') &&
          !key.startsWith('import.meta.env.QUASAR_')
      )
      .map(
        key =>
          `  readonly ${key.replace('import.meta.env.', '')}: ${getStrDefineType(define[key])};`
      ),

    ...[...clientSet].map(
      key =>
        `  readonly ${key.replace('import.meta.env.', '')}: ${getStrDefineType(clientEnvDefineList[key])};`
    ),

    ...[...backendSet].map(
      key =>
        `  readonly ${key.replace('import.meta.env.', '')}?: ${getStrDefineType(backendEnvDefineList[key])};`
    )
  ].join('\n')

  const globalDeclaration = defineKeys
    // implicit filtering out of `import.meta.env` keys
    .filter(key => validDeclareConstKeyRE.test(key))
    .map(key => `declare const ${key}: ${getStrDefineType(define[key])};`)
    .join('\n')

  return (
    (globalDeclaration
      ? `\n// Automatically generated from raw build.define\n${globalDeclaration}\n`
      : '') +
    `\n// Automatically generated from process.env & dotenv files & build.define & build.defineEnv;` +
    `\n// Backend-only are not available in client code, so they are marked as optional` +
    `\ninterface ImportMetaEnv {\n${importMetaEnv}\n}\n`
  )
}

/**
 * @param {import('../types/configuration/conf').ResolvedQuasarConf} quasarConf
 */
function writeDeclarations(quasarConf, fsUtils) {
  fsUtils.writeFileSync(
    'quasar.d.ts',
    declarationsTemplate + getImportMetaEnvDeclaration(quasarConf)
  )

  if (quasarConf.build.typescript.vueShim) {
    fsUtils.writeFileSync('shims-vue.d.ts', vueShimsTemplate)
  }

  const { hasStore, storePackage } = quasarConf.metaConf
  if (hasStore && storePackage === 'pinia') {
    fsUtils.writeFileSync('pinia.d.ts', piniaTemplate)
  }
}
