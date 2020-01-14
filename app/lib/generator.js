const fs = require('fs')
const path = require('path')
const compileTemplate = require('lodash.template')

const log = require('./helpers/logger')('app:generator')
const appPaths = require('./app-paths')
const quasarFolder = appPaths.resolve.app('.quasar')

class Generator {
  constructor (quasarConfig) {
    const { ctx, preFetch } = quasarConfig.getBuildConfig()

    this.alreadyGenerated = false
    this.quasarConfig = quasarConfig

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
        dest: path.join(quasarFolder, filename),
        template: compileTemplate(content)
      }
    })

    if (ctx.prod && ctx.mode.ssr) {
      const ssrFile = path.join(__dirname, 'ssr/template.prod-webserver.js')

      this.files.push({
        filename: 'ssr.js',
        dest: path.join(quasarFolder, 'ssr-config.js'),
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

    // ensure .quasar folder
    if (!fs.existsSync(quasarFolder)) {
      fs.mkdirSync(quasarFolder)
    }
    else if (!fs.lstatSync(quasarFolder).isDirectory()) {
      const { removeSync } = require('fs-extra')
      removeSync(quasarFolder)
      fs.mkdirSync(quasarFolder)
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
