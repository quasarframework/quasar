const { existsSync, mkdirSync, readFileSync, writeFileSync, lstatSync, utimes } = require('node:fs')
const fse = require('fs-extra')
const path = require('node:path')
const compileTemplate = require('lodash/template.js')

const appPaths = require('./app-paths.js')
const quasarFolder = appPaths.resolve.app('.quasar')

module.exports.EntryFilesGenerator = class EntryFilesGenerator {
  #alreadyGenerated
  #quasarConfFile
  #files
  #folders

  constructor (quasarConfFile) {
    const { ctx } = quasarConfFile.quasarConf

    this.#alreadyGenerated = false
    this.#quasarConfFile = quasarConfFile

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
    else if (ctx.mode.bex) {
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

  build () {
    const data = this.#quasarConfFile.quasarConf

    // ensure .quasar folder
    if (!existsSync(quasarFolder)) {
      mkdirSync(quasarFolder)
    }
    else if (!lstatSync(quasarFolder).isDirectory()) {
      const { removeSync } = require('fs-extra')
      removeSync(quasarFolder)
      mkdirSync(quasarFolder)
    }

    this.#files.forEach(file => {
      writeFileSync(file.dest, file.template(data), 'utf-8')
    })

    this.#folders.forEach(folder => {
      fse.copySync(folder.src, folder.dest)
    })

    if (!this.#alreadyGenerated) {
      const then = Date.now() / 1000 - 120

      this.#files.forEach(file => {
        utimes(file.dest, then, then, function (err) { if (err) throw err })
      })

      this.#alreadyGenerated = true
    }
  }
}
