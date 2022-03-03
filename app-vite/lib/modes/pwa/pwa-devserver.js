const { createServer } = require('vite')
const chokidar = require('chokidar')
const debounce = require('lodash.debounce')

const AppDevserver = require('../../app-devserver')
const openBrowser = require('../../helpers/open-browser')
const config = require('./pwa-config')
const { injectPwaManifest } = require('./utils')

const getPackage = require('../../helpers/get-package')
const workboxBuild = getPackage('workbox-build')

class PwaDevServer extends AppDevserver {
  #server
  #manifestWatcher

  constructor (opts) {
    super(opts)

    this.registerDiff('pwa', quasarConf => [
      quasarConf.pwa
    ])
  }

  run (quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    if (diff([ 'vite', 'pwa' ], quasarConf) === true) {
      return queue(() => {
        this.#runPwaManifest(quasarConf)
        return this.#runPwaServiceWorker(quasarConf)
          .then(() => this.#runVite(quasarConf, diff('viteUrl', quasarConf)))
      })
    }
  }

  async #runVite (quasarConf, urlDiffers) {
    if (this.#server !== void 0) {
      this.#server.close()
    }

    const viteConfig = await config.vite(quasarConf)

    this.#server = await createServer(viteConfig)
    await this.#server.listen()

    this.printBanner(quasarConf)

    if (urlDiffers === true && quasarConf.metaConf.openBrowser) {
      const { metaConf } = quasarConf
      openBrowser({
        url: metaConf.APP_URL,
        opts: metaConf.openBrowser !== true ? metaConf.openBrowser : false
      })
    }
  }

  #runPwaManifest (quasarConf) {
    if (this.#manifestWatcher !== void 0) {
      this.#manifestWatcher.close()
    }

    this.#manifestWatcher = chokidar.watch(
      quasarConf.metaConf.pwaManifestFile,
      { watchers: { chokidar: { ignoreInitial: true } } }
    ).on('change', debounce(() => {
      injectPwaManifest(quasarConf)

      if (this.#server !== void 0) {
        this.#server.ws.send({
          type: 'full-reload',
          path: '*'
        })
      }
    }, 550))

    injectPwaManifest(quasarConf)
  }

  async #runPwaServiceWorker (quasarConf) {
    const workboxConfig = config.workbox(quasarConf)

    if (quasarConf.pwa.workboxMode === 'GenerateSW') {
      await workboxBuild.generateSW(workboxConfig)
    }
  }
}

module.exports = PwaDevServer
