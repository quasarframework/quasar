const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const { AppDevserver } = require('../../app-devserver.js')
const { openBrowser } = require('../../utils/open-browser.js')
const { quasarSpaConfig } = require('./spa-config.js')

module.exports.QuasarModeDevserver = class QuasarModeDevserver extends AppDevserver {
  #server

  run (quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    if (diff('webpack', quasarConf)) {
      return queue(() => this.#runWebpack(quasarConf, diff('webpackUrl', quasarConf)))
    }
  }

  async #runWebpack (quasarConf, urlDiffers) {
    if (this.#server !== void 0) {
      await this.#server.stop()
      this.#server = null
    }

    const webpackConf = await quasarSpaConfig.webpack(quasarConf)

    let started = false

    return new Promise(resolve => {
      const compiler = webpack(webpackConf)

      compiler.hooks.done.tap('done-compiling', stats => {
        if (started === true) { return }

        // start dev server if there are no errors
        if (stats.hasErrors() === true) {
          return
        }

        started = true
        resolve()

        if (urlDiffers === true && quasarConf.metaConf.openBrowser) {
          const { metaConf } = quasarConf
          openBrowser({
            url: metaConf.APP_URL,
            opts: metaConf.openBrowser !== true ? metaConf.openBrowser : false
          })
        }

        this.printBanner(quasarConf)
      })

      // start building & launch server
      this.#server = new WebpackDevServer(quasarConf.devServer, compiler)
      this.#server.start()
    })
  }
}
