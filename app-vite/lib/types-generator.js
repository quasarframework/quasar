import { readFileSync, writeFileSync, statSync } from 'node:fs'
import { ensureFileSync } from 'fs-extra'
import { join, relative } from 'node:path'

export async function generateTypes (quasarConf) {
  const { appPaths, cacheProxy } = quasarConf.ctx
  const hasTypescript = await cacheProxy.getModule('hasTypescript')
  if (hasTypescript) {
    const tsConfigPath = appPaths.resolve.app('.quasar/tsconfig.json')
    ensureFileSync(tsConfigPath)
    writeFileSync(tsConfigPath, JSON.stringify(generateTsConfig(quasarConf), null, 2), 'utf-8')
  }

  // TODO: generate types feature flags within .quasar folder instead
  // TODO: generate types files, e.g. src/quasar.d.ts, src/shims-vue.d.ts
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
