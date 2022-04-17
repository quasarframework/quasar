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
        if (this.__started === true) { return }

        // start dev server if there are no errors
        if (stats.hasErrors() === true) {
          return
        }

        this.__started = true

        resolve()

        if (openedBrowser === false) {
          openedBrowser = true

          if (['spa', 'pwa'].includes(cfg.ctx.modeName)) {
            const url = cfg.build.APP_URL

            cfg.__devServer.open
              ? openBrowser({ url, opts: cfg.__devServer.openOptions })
              : log('Running at ' + url + '\n')
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
