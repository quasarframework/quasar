import { readFileSync } from 'node:fs'
import fse from 'fs-extra'

import { compileTemplateToFn } from './utils/template.js'

export class EntryFilesGenerator {
  #templateFiles // templated
  #regularFiles // copied as-is

  constructor(ctx) {
    const regularFiles = []
    const templateFiles = [
      'app.js',
      'client-entry.js',
      'client-prefetch.js',
      'quasar-user-options.js'
    ]

    if (ctx.mode.ssr || ctx.mode.ssg) {
      regularFiles.push('ssr-nonce.js')
    }

    if (ctx.mode.ssr) {
      templateFiles.push(
        'server-entry.js',
        'ssr-middlewares.js',
        `ssr-${ctx.dev ? 'dev' : 'prod'}-webserver.js`
      )
    } else if (ctx.mode.ssg) {
      templateFiles.push('server-entry.js')
      if (ctx.prod) {
        templateFiles.push('ssg-script.js')
      }
    } else if (ctx.mode.bex) {
      regularFiles.push('bex-app.js')
    }

    const { appPaths } = ctx

    this.#templateFiles = templateFiles.map(file => {
      const content = readFileSync(
        appPaths.resolve.cli(`templates/entry/${file}`),
        'utf8'
      )

      return {
        render: compileTemplateToFn(content, { varName: 'quasarConf' }),
        dest: appPaths.resolve.entry(file)
      }
    })

    this.#regularFiles = regularFiles.map(file => ({
      src: appPaths.resolve.cli(`templates/entry/${file}`),
      dest: appPaths.resolve.entry(file)
    }))
  }

  generate(quasarConf) {
    this.#templateFiles.forEach(file => {
      fse.ensureFileSync(file.dest)
      fse.writeFileSync(file.dest, file.render(quasarConf), 'utf8')
    })

    this.#regularFiles.forEach(file => {
      fse.ensureFileSync(file.dest)
      fse.copySync(file.src, file.dest)
    })
  }
}
