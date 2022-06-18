const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const openBrowser = require('./helpers/open-browser')

let openedBrowser = false

module.exports = class DevServer {
  constructor (quasarConfFile) {
    this.quasarConfFile = quasarConfFile
    this.server = null
  }

  listen () {
    const cfg = this.quasarConfFile.quasarConf
    const webpackConf = this.quasarConfFile.webpackConf

    return new Promise(resolve => {
      const compiler = webpack(webpackConf.renderer)

      compiler.hooks.done.tap('done-compiling', stats => {
        if (this.__started === true) { return }

        // start dev server if there are no errors
        if (stats.hasErrors() === true) {
          return
        }

        this.__started = true

        resolve()

        if (openedBrowser === false) {
          openedBrowser = true

          if (cfg.__devServer.open && ['spa', 'pwa'].includes(cfg.ctx.modeName)) {
            openBrowser({ url: cfg.build.APP_URL, opts: cfg.__devServer.openOptions })
          }
        }
      })

      // start building & launch server
      this.server = new WebpackDevServer(cfg.devServer, compiler)
      this.server.start()
    })
  }

  stop () {
    return this.server !== null
      ? this.server.stop().finally(() => { this.server = null })
      : Promise.resolve()
  }
}
