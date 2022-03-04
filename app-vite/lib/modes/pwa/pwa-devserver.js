const { createServer } = require('vite')
const chokidar = require('chokidar')
const debounce = require('lodash.debounce')

const AppDevserver = require('../../app-devserver')
const openBrowser = require('../../helpers/open-browser')
const config = require('./pwa-config')
const { injectPwaManifest, buildServiceWorker } = require('./utils')
const { log } = require('../../helpers/logger')

class PwaDevServer extends AppDevserver {
  #server
  #manifestWatcher
  #serviceWorkerWatcher

  constructor (opts) {
    super(opts)

    this.registerDiff('pwaManifest', quasarConf => [
      quasarConf.pwa.injectPwaMetaTags,
      quasarConf.pwa.manifestFilename,
      quasarConf.pwa.extendManifestJson,
      quasarConf.pwa.useCredentialsForManifestTag
    ])

    this.registerDiff('pwaServiceWorker', quasarConf => [
      quasarConf.pwa.workboxMode,
      quasarConf.pwa.precacheFromPublicFolder,
      quasarConf.pwa.swFilename,
      quasarConf.pwa[
        quasarConf.pwa.workboxMode === 'generateSW'
          ? 'extendGenerateSWOptions'
          : 'extendInjectManifestOptions'
      ],
      quasarConf.pwa.workboxMode === 'injectManifest'
        ? [ quasarConf.build.env, quasarConf.build.rawDefine ]
        : ''
    ])

    this.registerDiff('viteFilenames', quasarConf => [
      quasarConf.pwa.swFilename
    ])
  }

  run (quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    if (diff('pwaManifest', quasarConf) === true) {
      return queue(() => this.#compileManifest(quasarConf))
    }

    if (diff('pwaServiceWorker', quasarConf) === true) {
      return queue(() => this.#compileServiceWorker(quasarConf, queue))
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

  #compileManifest (quasarConf) {
    if (this.#manifestWatcher !== void 0) {
      this.#manifestWatcher.close()
    }

    function inject () {
      injectPwaManifest(quasarConf)
      log(`Generated the PWA manifest file (${quasarConf.pwa.manifestFilename})`)
    }

    this.#manifestWatcher = chokidar.watch(
      quasarConf.metaConf.pwaManifestFile,
      { watchers: { chokidar: { ignoreInitial: true } } }
    ).on('change', debounce(() => {
      inject()

      if (this.#server !== void 0) {
        this.#server.ws.send({
          type: 'full-reload',
          path: '*'
        })
      }
    }, 550))

    inject()
  }

  async #compileServiceWorker (quasarConf, queue) {
    if (this.#serviceWorkerWatcher) {
      await this.#serviceWorkerWatcher.close()
    }

    const workboxConfig = await config.workbox(quasarConf)

    if (quasarConf.pwa.workboxMode === 'injectManifest') {
      const esbuildConfig = await config.customSw(quasarConf)
      await this.buildWithEsbuild('injectManifest Custom SW', esbuildConfig, () => {
        queue(() => buildServiceWorker(quasarConf.pwa.workboxMode, workboxConfig))
      }).then(result => {
        this.#serviceWorkerWatcher = result
      })
    }

    await buildServiceWorker(quasarConf.pwa.workboxMode, workboxConfig)
  }
}

module.exports = PwaDevServer
