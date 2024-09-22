import { readFileSync } from 'node:fs'
import fse from 'fs-extra'
import compileTemplate from 'lodash/template.js'

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
        'bex-app.js'
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
