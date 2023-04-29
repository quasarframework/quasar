
const { existsSync, mkdirSync, readFileSync, writeFileSync, lstatSync } = require('fs')
const { removeSync, copySync } = require('fs-extra')
const path = require('path')
const compileTemplate = require('lodash/template')

const appPaths = require('./app-paths')
const quasarFolder = appPaths.resolve.app('.quasar')

class EntryFilesGenerator {
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
        'server-entry.js',
        'ssr-middlewares.js',
        `ssr-${ ctx.dev ? 'dev' : 'prod' }-webserver.js`
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
      removeSync(quasarFolder)
      mkdirSync(quasarFolder)
    }

    this.#files.forEach(file => {
      writeFileSync(file.dest, file.template(quasarConf), 'utf-8')
    })

    this.#folders.forEach(folder => {
      copySync(folder.src, folder.dest)
    })
  }
}

module.exports = ctx => new EntryFilesGenerator(ctx)
