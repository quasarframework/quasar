const webpack = require('webpack')
const chalk = require('chalk')

const { log, warn } = require('../helpers/logger')

class PwaRunner {
  constructor () {
    this.cswWatcher = null
  }

  init () {}

  async run (quasarConfFile) {
    if (this.cswWatcher) {
      await this.stop()
    }

    if (quasarConfFile.quasarConf.pwa.workboxPluginMode !== 'InjectManifest') {
      return
    }

    const cswCompiler = webpack(quasarConfFile.webpackConf.csw)

    log(`Building the custom service worker...`)

    return new Promise(resolve => {
      this.cswWatcher = cswCompiler.watch({}, async (err, stats) => {
        if (err) {
          console.log(err)
          return
        }

        log(`Webpack built the custom service worker`)
        log()
        process.stdout.write(stats.toString({
          colors: true,
          modules: false,
          children: false,
          chunks: false,
          chunkModules: false
        }) + '\n')
        log()

        if (stats.hasErrors()) {
          warn(`The custom service worker build failed with errors`)
          return
        }

        resolve()
      })
    })
  }

  build (quasarConfFile) {
    if (quasarConfFile.quasarConf.pwa.workboxPluginMode !== 'InjectManifest') {
      return
    }

    log(`Building the custom service worker...`)

    return new Promise(resolve => {
      webpack(quasarConfFile.webpackConf.csw, async (err, stats) => {
        if (err) {
          console.error(err.stack || err)

          if (err.details) {
            console.error(err.details)
          }

          process.exit(1)
        }

        if (stats.hasErrors() !== true) {
          const printWebpackStats = require('../helpers/print-webpack-stats')

          console.log()
          printWebpackStats(stats, quasarConfFile.webpackConf.csw.output.path, 'Custom Service Worker')

          return resolve()
        }

        const info = stats.toJson()
        const errNumber = info.errors.length
        const errDetails = `${errNumber} error${errNumber > 1 ? 's' : ''}`

        warn()
        warn(chalk.red(`${errDetails} encountered:\n`))

        info.errors.forEach(err => {
          console.error(err)
        })

        warn()
        warn(chalk.red(`[FAIL] Custom service worker build failed with ${errDetails}. Check log above.\n`))

        process.exit(1)
      })
    })
  }

  stop () {
    if (this.cswWatcher) {
      return new Promise(resolve => {
        this.cswWatcher.close(resolve)
        this.cswWatcher = null
      })
    }
  }
}

module.exports = new PwaRunner()
