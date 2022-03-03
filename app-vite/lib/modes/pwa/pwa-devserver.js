const { createServer } = require('vite')
const chokidar = require('chokidar')
const debounce = require('lodash.debounce')

const AppDevserver = require('../../app-devserver')
const openBrowser = require('../../helpers/open-browser')
const config = require('./pwa-config')
const { injectPwaManifest } = require('./utils')
const { info, success, log, dot } = require('../../helpers/logger')

const getPackage = require('../../helpers/get-package')
const workboxBuild = getPackage('workbox-build')

class PwaDevServer extends AppDevserver {
  #server
  #manifestWatcher

  constructor (opts) {
    super(opts)

    this.registerDiff('pwaManifest', quasarConf => [
      quasarConf.pwa.injectPwaMetaTags,
      quasarConf.pwa.manifestFilename,
      quasarConf.pwa.extendManifestJson,
      quasarConf.pwa.useCredentials
    ])

    this.registerDiff('pwaServiceWorker', quasarConf => [
      quasarConf.pwa.workboxMode,
      quasarConf.pwa.precacheFromPublicFolder,
      quasarConf.pwa.swFilename,
      quasarConf.pwa[
        quasarConf.pwa.workboxMode === 'GenerateSW'
          ? 'extendGenerateSWOptions'
          : 'extendInjectManifestOptions'
      ]
    ])

    this.registerDiff('viteFilenames', quasarConf => [
      quasarConf.pwa.swFilename
    ])
  }

  run (quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    if (diff('pwaManifest', quasarConf) === true) {
      return queue(() => this.#runPwaManifest(quasarConf))
    }

    if (diff('pwaServiceWorker', quasarConf) === true) {
      return queue(() => this.#runPwaServiceWorker(quasarConf))
    }

    if (diff([ 'vite', 'viteFilenames' ], quasarConf) === true) {
      return queue(() => this.#runVite(quasarConf, diff('viteUrl', quasarConf)))
    }
  }

  async #runVite (quasarConf, urlDiffers) {
    if (this.#server !== void 0) {
      this.#server.close()
    }

    const viteConfig = await config.vite(quasarConf)

    injectPwaManifest(quasarConf, true)

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
      log(`Generated the PWA manifest file (${quasarConf.pwa.manifestFilename})`)

      if (this.#server !== void 0) {
        this.#server.ws.send({
          type: 'full-reload',
          path: '*'
        })
      }
    }, 550))

    injectPwaManifest(quasarConf)
    log(`Generated the PWA manifest file (${quasarConf.pwa.manifestFilename})`)
  }

  async #runPwaServiceWorker (quasarConf) {
    const workboxConfig = await config.workbox(quasarConf)

    if (quasarConf.pwa.workboxMode === 'GenerateSW') {
      const startTime = Date.now()
      info(`Compiling of Service Worker with Workbox in progress...`, 'WAIT')
      await workboxBuild.generateSW(workboxConfig)

      const diffTime = +new Date() - startTime
      success(`Service worker compiled with success ${dot} ${diffTime}ms`, 'DONE')
      log()
    }
    else { // InjectManifest
      // this.#buildWithEsbuild
    }
  }
}

module.exports = PwaDevServer
