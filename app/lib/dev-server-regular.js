const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const openBrowser = require('./helpers/open-browser')
const { log } = require('./helpers/logger')

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
        if (this.__started) { return }

        // start dev server if there are no errors
        if (stats.hasErrors() === true) {
          return
        }

        this.__started = true

        this.server.listen(cfg.devServer.port, cfg.devServer.host, () => {
          resolve()

          if (openedBrowser === false) {
            openedBrowser = true

            if (cfg.__devServer.open && ['spa', 'pwa'].includes(cfg.ctx.modeName)) {
              openBrowser({ url: cfg.build.APP_URL, opts: cfg.__devServer.openOptions })
            }
          }
        })
      })

      // start building & launch server
      this.server = new WebpackDevServer(compiler, cfg.devServer)
    })
  }

  stop () {
    if (this.server !== null) {
      return new Promise(resolve => {
        this.server.close(resolve)
        this.server = null
      })
    }
  }
}
