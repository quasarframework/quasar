const
  fs = require('fs-extra'),
  path = require('path'),
  compileTemplate = require('lodash.template')

const
  log = require('./helpers/logger')('app:generator')
  appPaths = require('./app-paths'),
  quasarFolder = appPaths.resolve.app('.quasar')

class Generator {
  constructor (quasarConfig) {
    const { ctx, preFetch, ...cfg } = quasarConfig.getBuildConfig()

    this.alreadyGenerated = false
    this.quasarConfig = quasarConfig

    const paths = [
      'app.js',
      'client-entry.js',
      'import-quasar.js'
    ]

    this.files = []

    if (preFetch) {
      paths.push('client-prefetch.js')
    }
    if (ctx.mode.ssr) {
      paths.push('server-entry.js')
    }
    if (ctx.mode.tauri) {
      const { generate } = require(require.resolve('@quasar/tauri/mode/entry', {
        paths: [ appPaths.appDir ]
      }))
      generate(quasarFolder, cfg, ctx)
    }

    this.files = this.files.concat(paths.map(file => {
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
    }))
  }

  build () {
    log(`Generating Webpack entry point`)
    const data = this.quasarConfig.getBuildConfig()

    // ensure .quasar folder and that it is NOT a file
    fs.existsSync(quasarFolder, (exists) => {
      if (exists) { // somehow its a file, not a folder
        fs.remove(quasarFolder).then(() => {
          fs.ensureDirSync(quasarFolder)
        })
      } else {
        fs.ensureDirSync(quasarFolder)
      }
    })

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
