const { createServer } = require('vite')

const DevServer = require('../../devserver')
const openBrowser = require('../../helpers/open-browser')
const config = require('./spa-config')

class SpaDevServer extends DevServer {
  #server

  run (quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    if (diff('vite', quasarConf) === true) {
      return queue(() => this.#runVite(quasarConf, diff('viteUrl', quasarConf)))
    }
  }

  async #runVite (quasarConf, urlDiffers) {
    if (this.#server !== void 0) {
      this.#server.close()
    }

    const viteConfig = config.vite(quasarConf)

    this.#server = await createServer(viteConfig)
    await this.#server.listen()

    if (urlDiffers === true && quasarConf.metaConf.openBrowser) {
      const { metaConf } = quasarConf
      openBrowser({
        url: metaConf.APP_URL,
        opts: metaConf.openBrowser !== true ? metaConf.openBrowser : false
      })
    }
  }
}

module.exports = SpaDevServer
