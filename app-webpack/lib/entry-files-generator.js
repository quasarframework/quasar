const fs = require('node:fs')
const path = require('node:path')
const compileTemplate = require('lodash/template.js')

const appPaths = require('./app-paths.js')
const quasarFolder = appPaths.resolve.app('.quasar')

module.exports.EntryFilesGenerator = class EntryFilesGenerator {
  #alreadyGenerated
  #quasarConfFile
  #files

  constructor (quasarConfFile) {
    const { ctx } = quasarConfFile.quasarConf

    this.#alreadyGenerated = false
    this.#quasarConfFile = quasarConfFile

    const paths = [
      'app.js',
      'client-entry.js',
      'client-prefetch.js',
      'quasar-user-options.js'
    ]

    if (ctx.mode.ssr) {
      paths.push(
        'server-entry.js',
        'ssr-middlewares.js',
        `ssr-${ ctx.dev ? 'dev' : 'prod' }-webserver.js`
      )
    }

    this.#files = paths.map(file => {
      const content = fs.readFileSync(
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
  }

  build () {
    const data = this.#quasarConfFile.quasarConf

    // ensure .quasar folder
    if (!fs.existsSync(quasarFolder)) {
      fs.mkdirSync(quasarFolder)
    }
    else if (!fs.lstatSync(quasarFolder).isDirectory()) {
      const { removeSync } = require('fs-extra')
      removeSync(quasarFolder)
      fs.mkdirSync(quasarFolder)
    }

    this.#files.forEach(file => {
      fs.writeFileSync(file.dest, file.template(data), 'utf-8')
    })

    if (!this.#alreadyGenerated) {
      const then = Date.now() / 1000 - 120

      this.#files.forEach(file => {
        fs.utimes(file.dest, then, then, function (err) { if (err) throw err })
      })

      this.#alreadyGenerated = true
    }
  }
}
