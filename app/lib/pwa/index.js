const webpack = require('webpack')

class PwaRunner {
  constructor () {
    this.cswWatcher = null
  }

  init () {}

  shouldAbort (quasarConfFile) {
    return (
      quasarConfFile.quasarConf.pwa.workboxPluginMode !== 'InjectManifest'
      || (quasarConfFile.quasarConf.ctx.mode.ssr === true && quasarConfFile.quasarConf.ctx.mode.pwa !== true)
    )
  }

  async run (quasarConfFile) {
    if (this.cswWatcher) {
      await this.stop()
    }

    if (this.shouldAbort(quasarConfFile)) {
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
    if (this.shouldAbort(quasarConfFile)) {
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
