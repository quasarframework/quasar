const fs = require('fs')
const path = require('path')
const compileTemplate = require('lodash.template')

const log = require('./helpers/logger')('app:generator')
const appPaths = require('./app-paths')

class Generator {
  constructor (quasarConfig) {
    const { ctx, preFetch } = quasarConfig.getBuildConfig()

    this.alreadyGenerated = false
    this.quasarConfig = quasarConfig

    this.quasarFolder = appPaths.resolve.app('.quasar')

    const paths = [
      'app.js',
      'client-entry.js',
      'import-quasar.js'
    ]

    if (preFetch) {
      paths.push('client-prefetch.js')
    }
    if (ctx.mode.ssr) {
      paths.push('server-entry.js')
    }

    this.files = paths.map(file => {
      const content = fs.readFileSync(
        appPaths.resolve.cli(`templates/entry/${file}`),
        'utf-8'
      )

      const filename = path.basename(file)

      return {
        filename,
        dest: path.join(this.quasarFolder, filename),
        template: compileTemplate(content)
      }
    })

    if (ctx.prod && ctx.mode.ssr) {
      const ssrFile = path.join(__dirname, 'ssr/template.prod-webserver.js')

      this.files.push({
        filename: 'ssr.js',
        dest: path.join(this.quasarFolder, 'ssr-config.js'),
        template: compileTemplate(fs.readFileSync(ssrFile, 'utf-8')),
        dataFn: quasarConfig => ({
          opts: quasarConfig.ssr.__templateOpts,
          flags: quasarConfig.ssr.__templateFlags
        })
      })
    }
  }

  build () {
    log(`Generating Webpack entry point`)
    const data = this.quasarConfig.getBuildConfig()

    const quasarBaseFolder = appPaths.resolve.appQ('.quasar')
    // ensure .quasar folder
    if (!fs.existsSync(quasarBaseFolder)) {
      fs.mkdirSync(quasarBaseFolder)
    }
    else if (!fs.lstatSync(quasarBaseFolder).isDirectory()) {
      const { removeSync } = require('fs-extra')
      removeSync(quasarBaseFolder)
      fs.mkdirSync(quasarBaseFolder)
    }

    // ensure .quasar/{mode} folder
    if (!fs.existsSync(this.quasarFolder)) {
      fs.mkdirSync(this.quasarFolder)
    }
    else if (!fs.lstatSync(this.quasarFolder).isDirectory()) {
      const { removeSync } = require('fs-extra')
      removeSync(this.quasarFolder)
      fs.mkdirSync(this.quasarFolder)
    }

    this.files.forEach(file => {
      const templateData = file.dataFn !== void 0
        ? file.dataFn(data)
        : data

      fs.writeFileSync(file.dest, file.template(templateData), 'utf-8')
    })

    if (!this.alreadyGenerated) {
      const then = Date.now() / 1000 - 120

      this.files.forEach(file => {
        fs.utimes(file.dest, then, then, function (err) { if (err) throw err })
      })

      this.alreadyGenerated = true
    }
  }
}

module.exports = Generator
