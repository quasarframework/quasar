const
  fs = require('fs'),
  fse = require('fs-extra'),
  path = require('path'),
  compileTemplate = require('lodash.template')

const
  log = require('./helpers/logger')('app:generator')
  appPaths = require('./app-paths'),
  quasarFolder = appPaths.resolve.app('.quasar')

class Generator {
  constructor (quasarConfig) {
    const { ctx, loadingBar, preFetch } = quasarConfig.getBuildConfig()

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
      const
        content = fs.readFileSync(
          appPaths.resolve.cli(`templates/entry/${file}`),
          'utf-8'
        ),
        filename = path.basename(file)

      return {
        filename,
        dest: path.join(quasarFolder, filename),
        template: compileTemplate(content)
      }
    })
  }

  prepare () {
    const
      now = Date.now() / 1000,
      then = now - 100,
      appVariablesFile = appPaths.resolve.cli('templates/app/variables.styl'),
      appStylFile = appPaths.resolve.cli('templates/app/app.styl'),
      emptyStylFile = path.join(quasarFolder, 'empty.styl')

    function copy (file) {
      const dest = path.join(quasarFolder, path.basename(file))
      fse.copySync(file, dest)
      fs.utimes(dest, then, then, function (err) { if (err) throw err })
    }

    copy(appStylFile)
    copy(appVariablesFile)

    fs.writeFileSync(emptyStylFile, '', 'utf-8'),
    fs.utimes(emptyStylFile, then, then, function (err) { if (err) throw err })
  }

  build () {
    log(`Generating Webpack entry point`)
    const data = this.quasarConfig.getBuildConfig()

    this.files.forEach(file => {
      fs.writeFileSync(file.dest, file.template(data), 'utf-8')
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
