import { readFileSync, writeFileSync, statSync } from 'node:fs'
import { ensureFileSync } from 'fs-extra'
import { join, relative } from 'node:path'

// We generate all the files for JS projects as well, because they provide
// better autocomplete and type checking in the IDE.
export async function generateTypes (quasarConf) {
  const { appPaths } = quasarConf.ctx

  const tsConfigPath = appPaths.resolve.app('.quasar/tsconfig.json')
  ensureFileSync(tsConfigPath)
  writeFileSync(tsConfigPath, JSON.stringify(generateTsConfig(quasarConf), null, 2), 'utf-8')

  await writeFeatureFlags(quasarConf)

  writeDeclarations(quasarConf)
}

/**
 * @param {import('../types/configuration/conf').QuasarConf} quasarConf
 */
function generateTsConfig (quasarConf) {
  const { appPaths, mode } = quasarConf.ctx

  const toTsPath = (path) => {
    const relativePath = relative(appPaths.resolve.app('.quasar'), path)
    if (relativePath.length === 0) {
      return '.'
    }
    if (!relativePath.startsWith('./')) {
      return './' + relativePath
    }
    return relativePath
  }

  const aliases = { ...quasarConf.build.alias }

  // TS aliases doesn't play well with package.json#exports: https://github.com/microsoft/TypeScript/issues/60460
  // So, we had to specify each entry point separately here
  const appVitePath = 'node_modules/@quasar/app-vite'
  delete aliases[ '#q-app' ] // remove the existing one so that all the added ones are listed under each other
  aliases[ '#q-app' ] = toTsPath(join(appVitePath, 'types/index.d.ts'))
  aliases[ '#q-app/wrappers' ] = toTsPath(join(appVitePath, 'types/app-wrappers.d.ts'))
  aliases[ '#q-app/bex/background' ] = toTsPath(join(appVitePath, 'types/bex/entrypoints/background.d.ts'))
  aliases[ '#q-app/bex/content' ] = toTsPath(join(appVitePath, 'types/bex/entrypoints/content.d.ts'))

  if (mode.capacitor) {
    // Can't use cacheProxy.getRuntime('runtimeCapacitorConfig') as it's not available here yet
    const { dependencies } = JSON.parse(
      readFileSync(appPaths.resolve.capacitor('package.json'), 'utf-8')
    )
    const target = appPaths.resolve.capacitor('node_modules')
    const depsList = Object.keys(dependencies)
    depsList.forEach(dep => {
      aliases[ dep ] = join(target, dep)
    })
  }

  const paths = Object.fromEntries(
    Object.entries(aliases).flatMap(([ alias, path ]) => {
      const stats = statSync(path, { throwIfNoEntry: false })
      // If the path doesn't exist, don't add an alias for it yet (e.g. src/stores)
      if (!stats) {
        return []
      }

      if (stats.isFile()) {
        return [
          [ alias, [ toTsPath(path) ] ]
        ]
      }

      return [
        // import ... from 'src' (resolves to 'src/index')
        [ alias, [ toTsPath(path) ] ],
        // import ... from 'src/something' (resolves to 'src/something.ts' or 'src/something/index.ts')
        [ `${ alias }/*`, [ `${ toTsPath(path) }/*` ] ]
      ]
    })
  )

  // See https://www.totaltypescript.com/tsconfig-cheat-sheet
  // We use ESNext since we are transpiling and pretty much everything should work
  const tsConfig = {
    compilerOptions: {
      esModuleInterop: true,
      skipLibCheck: true,
      target: 'esnext',
      allowJs: true,
      resolveJsonModule: true,
      moduleDetection: 'force',
      isolatedModules: true,
      // force using `import type`/`export type`
      verbatimModuleSyntax: true,

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
    exclude: [
      'dist',
      '.quasar/*/*.js',
      'node_modules',
      'src-capacitor',
      'src-cordova',
      'quasar.config.*.temporary.compiled*'
    ].map(path => toTsPath(path))
  }

  quasarConf.build.typescript.extendTsConfig?.(tsConfig)

  return tsConfig
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
 * @param {import('../types/configuration/conf').QuasarConf} quasarConf
 */
async function writeFeatureFlags (quasarConf) {
  const { appPaths } = quasarConf.ctx

  const featureFlags = new Set()

  if (quasarConf.metaConf.hasStore === true) {
    featureFlags.add('store')
  }

  // spa does not have a feature flag, so we skip it
  const modes = [ 'pwa', 'ssr', 'cordova', 'capacitor', 'electron', 'bex' ]
  for (const modeName of modes) {
    const { isModeInstalled } = await import(`./modes/${ modeName }/${ modeName }-installation.js`)
    if (isModeInstalled(quasarConf.ctx.appPaths)) {
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

  writeFileSync(appPaths.resolve.app('.quasar/feature-flags.d.ts'), contents)
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

/**
 * @param {import('../types/configuration/conf').QuasarConf} quasarConf
 */
function writeDeclarations (quasarConf) {
  const { appPaths } = quasarConf.ctx

  writeFileSync(appPaths.resolve.app('.quasar/quasar.d.ts'), declarationsTemplate)
  if (quasarConf.build.typescript.vueShim) {
    writeFileSync(appPaths.resolve.app('.quasar/shims-vue.d.ts'), vueShimsTemplate)
  }
}
