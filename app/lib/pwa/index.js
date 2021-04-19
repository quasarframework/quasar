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

    return new Promise(resolve => {
      this.cswWatcher = cswCompiler.watch({}, async (err, stats) => {
        if (err) {
          console.log(err)
          return
        }

        if (stats.hasErrors() === false) {
          resolve()

        }
      })
    })
  }

  build (quasarConfFile) {
    if (quasarConfFile.quasarConf.pwa.workboxPluginMode !== 'InjectManifest') {
      return
    }

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
          resolve()
        }

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
