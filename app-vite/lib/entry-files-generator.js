import { readFileSync, statSync } from 'node:fs'
import fse from 'fs-extra'
import compileTemplate from 'lodash/template.js'
import { join, relative } from 'node:path'

export class EntryFilesGenerator {
  #templateFiles // templated
  #regularFiles // copied as-is

  constructor (ctx) {
    const regularFiles = []
    const templateFiles = [
      'app.js',
      'client-entry.js',
      'client-prefetch.js',
      'quasar-user-options.js'
    ]

    if (ctx.mode.ssr) {
      templateFiles.push(
        'server-entry.mjs',
        'ssr-middlewares.mjs',
        `ssr-${ ctx.dev ? 'dev' : 'prod' }-webserver.mjs`
      )
    }
    else if (ctx.mode.bex) {
      regularFiles.push(
        'bex-bridge.js',
        'bex-entry-background.js',
        'bex-entry-dom.js',
        'bex-window-event-listener.js'
      )
    }

    const { appPaths } = ctx

    this.#templateFiles = templateFiles.map(file => {
      const content = readFileSync(
        appPaths.resolve.cli(`templates/entry/${ file }`),
        'utf-8'
      )

      return {
        template: compileTemplate(content),
        dest: appPaths.resolve.entry(file)
      }
    })

    this.#regularFiles = regularFiles.map(file => ({
      src: appPaths.resolve.cli(`templates/entry/${ file }`),
      dest: appPaths.resolve.entry(file)
    }))
  }

  async generate (quasarConf) {
    this.#templateFiles.forEach(file => {
      fse.ensureFileSync(file.dest)
      fse.writeFileSync(file.dest, file.template(quasarConf), 'utf-8')
    })

    this.#regularFiles.forEach(file => {
      fse.ensureFileSync(file.dest)
      fse.copySync(file.src, file.dest)
    })

    const { appPaths, cacheProxy } = quasarConf.ctx
    const hasTypescript = await cacheProxy.getModule('hasTypescript')
    if (hasTypescript) {
      const tsConfigPath = appPaths.resolve.app('.quasar/tsconfig.json')
      fse.ensureFileSync(tsConfigPath)
      fse.writeFileSync(tsConfigPath, JSON.stringify(this.#generateTsConfig(quasarConf), null, 2), 'utf-8')
    }
  }

  /**
   * @param {import('../types/configuration/conf').QuasarConf} quasarConf
   * @returns {Record<string, unknown>}
   */
  #generateTsConfig (quasarConf) {
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
        const stats = statSync(path)
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
}
