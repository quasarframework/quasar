import { createServer } from 'vite'
import chokidar from 'chokidar'
import debounce from 'lodash/debounce.js'

import { AppDevserver } from '../../app-devserver.js'
import { openBrowser } from '../../utils/open-browser.js'
import { quasarPwaConfig } from './pwa-config.js'
import { injectPwaManifest, buildPwaServiceWorker } from './utils.js'
import { log } from '../../utils/logger.js'

export class QuasarModeDevserver extends AppDevserver {
  #server = null

  // also update ssr-devserver.js when changing here
  #pwaManifestWatcher
  #pwaServiceWorkerWatcher

  constructor (opts) {
    super(opts)

    // also update ssr-devserver.js when changing here
    this.registerDiff('pwaManifest', quasarConf => [
      quasarConf.pwa.manifestFilename,
      quasarConf.pwa.extendManifestJson
    ])

    // also update ssr-devserver.js when changing here
    this.registerDiff('vitePWA', (quasarConf, diffMap) => [
      quasarConf.pwa.injectPwaMetaTags,
      quasarConf.pwa.manifestFilename,
      quasarConf.pwa.extendManifestJson,
      quasarConf.pwa.useCredentialsForManifestTag,
      quasarConf.pwa.swFilename,

      // extends 'vite' diff
      ...diffMap.vite(quasarConf)
    ])

    // also update ssr-devserver.js when changing here
    this.registerDiff('pwaServiceWorker', quasarConf => [
      quasarConf.pwa.workboxMode,
      quasarConf.pwa.swFilename,
      quasarConf.build,
      quasarConf.pwa.workboxMode === 'GenerateSW'
        ? quasarConf.pwa.extendGenerateSWOptions
        : [
            quasarConf.pwa.extendInjectManifestOptions,
            quasarConf.pwa.swFilename,
            quasarConf.pwa.extendPWACustomSWConf,
            quasarConf.sourceFiles.pwaServiceWorker
          ]
    ])

    // also update ssr-devserver.js when changing here
    this.registerDiff('pwaFilenames', quasarConf => [
      quasarConf.pwa.swFilename
    ])
  }

  run (quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    // also update ssr-devserver.js when changing here
    if (diff('pwaManifest', quasarConf) === true) {
      return queue(() => this.#compilePwaManifest(quasarConf))
    }

    // also update ssr-devserver.js when changing here
    if (diff('pwaServiceWorker', quasarConf) === true) {
      return queue(() => this.#compilePwaServiceWorker(quasarConf, queue))
    }

    // also update ssr-devserver.js when changing here
    if (diff('vitePWA', quasarConf) === true) {
      return queue(() => this.#runVite(quasarConf, diff('viteUrl', quasarConf)))
    }
  }

  async #runVite (quasarConf, urlDiffers) {
    if (this.#server !== null) {
      await this.#server.close()
      this.#server = null
    }

    injectPwaManifest(quasarConf, true)

    this.#server = await createServer(await quasarPwaConfig.vite(quasarConf))
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

  // also update ssr-devserver.js when changing here
  #compilePwaManifest (quasarConf) {
    if (this.#pwaManifestWatcher !== void 0) {
      this.#pwaManifestWatcher.close()
    }

    function inject () {
      injectPwaManifest(quasarConf)
      log(`Generated the PWA manifest file (${ quasarConf.pwa.manifestFilename })`)
    }

    this.#pwaManifestWatcher = chokidar.watch(
      quasarConf.metaConf.pwaManifestFile,
      { ignoreInitial: true }
    ).on('change', debounce(() => {
      inject()
      this.#server?.ws.send({ type: 'full-reload' })
    }, 550))

    inject()
  }

  // also update ssr-devserver.js when changing here
  async #compilePwaServiceWorker (quasarConf, queue) {
    if (this.#pwaServiceWorkerWatcher) {
      await this.#pwaServiceWorkerWatcher.close()
    }

    const workboxConfig = await quasarPwaConfig.workbox(quasarConf)

    if (quasarConf.pwa.workboxMode === 'InjectManifest') {
      const esbuildConfig = await quasarPwaConfig.customSw(quasarConf)
      await this.watchWithEsbuild('InjectManifest Custom SW', esbuildConfig, () => {
        queue(() => buildPwaServiceWorker(quasarConf, workboxConfig))
      }).then(esbuildCtx => {
        this.#pwaServiceWorkerWatcher = { close: esbuildCtx.dispose }
      })
    }

    await buildPwaServiceWorker(quasarConf, workboxConfig)
  }
}
