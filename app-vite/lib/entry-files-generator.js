import { readFileSync } from 'node:fs'
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
    this.#templateFiles.push({
      /**
       * @param {import('../types/configuration/conf').QuasarConf} quasarConf
       * @returns {string}
       */
      template: (quasarConf) => {
        const toTsPath = (path) => {
          const relativePath = relative(appPaths.resolve.app('.quasar'), path)
          if (relativePath.length === 0) {
            return '.'
          }
          if (!relativePath.startsWith('.')) {
            return './' + relativePath
          }
          return relativePath
        }

        const aliases = { ...quasarConf.build.alias }

        const { mode } = quasarConf.ctx

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

        // TODO: add a property/hook to quasar.conf file to allow user to customize this (for dynamic use cases)
        return JSON.stringify({
          // TODO: add a strict option to use the strict tsconfig preset
          // TODO: consider embedding the tsconfig preset in the template for better control
          extends: '@quasar/app-vite/tsconfig-preset',
          compilerOptions: {
            paths: Object.fromEntries(
              Object.entries(aliases).map(([ alias, path ]) => {
                // TODO: handle folder module aliases too (without the /*) (e.g. 'src' and not have to use 'src/index')
                // TODO: handle file aliases too (without the /*) (use stats.isFile())
                if (path.includes('/node_modules/')) {
                  return [ alias, [ toTsPath(path) ] ]
                }
                return [ `${ alias }/*`, [ `${ toTsPath(path) }/*` ] ]
              })
            )
          },
          exclude: [
            toTsPath('dist'),
            toTsPath('.quasar/*/*.js'),
            toTsPath('node_modules'),
            toTsPath('src-capacitor'),
            toTsPath('src-cordova'),
            toTsPath('quasar.config.*.temporary.compiled*')
          ]
        }, null, 2)
      },
      dest: appPaths.resolve.app('.quasar/tsconfig.json')
    })

    this.#regularFiles = regularFiles.map(file => ({
      src: appPaths.resolve.cli(`templates/entry/${ file }`),
      dest: appPaths.resolve.entry(file)
    }))
  }

  generate (quasarConf) {
    this.#templateFiles.forEach(file => {
      fse.ensureFileSync(file.dest)
      fse.writeFileSync(file.dest, file.template(quasarConf), 'utf-8')
    })

    this.#regularFiles.forEach(file => {
      fse.ensureFileSync(file.dest)
      fse.copySync(file.src, file.dest)
    })
  }
}
