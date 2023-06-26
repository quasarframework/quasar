
import { existsSync, mkdirSync, readFileSync, writeFileSync, lstatSync } from 'node:fs'
import fse from 'fs-extra'
import path from 'node:path'
import compileTemplate from 'lodash/template.js'

import appPaths from './app-paths.js'
const quasarFolder = appPaths.resolve.app('.quasar')

export class EntryFilesGenerator {
  #files
  #folders

  constructor (ctx) {
    const folderPaths = []
    const filePaths = [
      'app.js',
      'client-entry.js',
      'client-prefetch.js',
      'quasar-user-options.js'
    ]

    if (ctx.mode.ssr) {
      filePaths.push(
        'server-entry.mjs',
        'ssr-middlewares.mjs',
        `ssr-${ ctx.dev ? 'dev' : 'prod' }-webserver.mjs`
      )
    }

    if (ctx.mode.bex) {
      folderPaths.push('bex')
    }

    this.#files = filePaths.map(file => {
      const content = readFileSync(
        appPaths.resolve.cli(`templates/entry/${ file }`),
        'utf-8'
      )

      const filename = path.basename(file)

      return {
        filename,
        dest: path.join(quasarFolder, filename),
        template: compileTemplate(content)
      }
    })

    this.#folders = folderPaths.map(folder => ({
      src: appPaths.resolve.cli(`templates/entry/${ folder }`),
      dest: path.join(quasarFolder, folder)
    }))
  }

  generate (quasarConf) {
    // ensure .quasar folder
    if (!existsSync(quasarFolder)) {
      mkdirSync(quasarFolder)
    }
    else if (!lstatSync(quasarFolder).isDirectory()) {
      fse.removeSync(quasarFolder)
      mkdirSync(quasarFolder)
    }

    this.#files.forEach(file => {
      writeFileSync(file.dest, file.template(quasarConf), 'utf-8')
    })

    this.#folders.forEach(folder => {
      fse.copySync(folder.src, folder.dest)
    })
  }
}
