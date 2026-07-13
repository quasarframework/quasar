import { createServer } from 'vite'
import { watch as chokidarWatch } from 'chokidar'

import { AppDevserver } from '../../app-devserver.js'
import { openBrowser } from '../../utils/open-browser.js'
import { quasarPwaConfig } from './pwa-config.js'
import { buildPwaServiceWorker, injectPwaManifest } from './pwa-utils.js'
import { updateHtmlVariables } from '../../plugins/vite.html.js'
import { log } from '../../utils/logger.js'
import { debounce } from '../../utils/rate-limit.js'

export class QuasarModeDevserver extends AppDevserver {
  // also update ssr-devserver.js when changing here
  #pwaManifestWatcher = null
  #pwaServiceWorkerWatcher = null

  run(quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    // also update ssr-devserver.js when changing here
    if (diff('pwaManifest', quasarConf)) {
      this.clientNeedsReload = false
      return queue(() => this.#compilePwaManifest(quasarConf))
    }

    // also update ssr-devserver.js when changing here
    if (diff('pwaServiceWorker', quasarConf)) {
      this.clientNeedsReload = false
      return queue(() => this.#compilePwaServiceWorker(quasarConf, queue))
    }

    if (diff('htmlTemplate', quasarConf)) {
      this.clientNeedsReload = true
      updateHtmlVariables(quasarConf)
    }

    // also update ssr-devserver.js when changing here
    if (diff('vite', quasarConf)) {
      this.clientNeedsReload = false
      return queue(() => this.#runVite(quasarConf, diff('viteUrl', quasarConf)))
    }

    if (this.clientNeedsReload) this.reloadClient()
  }

  async #runVite(quasarConf, urlDiffers) {
    const viteConfig = await quasarPwaConfig.vite(quasarConf)
    const server = await createServer(viteConfig)

    await this.rebootClient(server)

    this.printBanner(quasarConf)

    if (urlDiffers && quasarConf.metaConf.openBrowser) {
      const { metaConf } = quasarConf
      openBrowser({
        url: metaConf.APP_URL,
        opts: metaConf.openBrowser !== true ? metaConf.openBrowser : false
      })
    }
  }

  // also update ssr-devserver.js when changing here
  async #compilePwaManifest(quasarConf) {
    if (this.#pwaManifestWatcher !== null) {
      const watcher = this.#pwaManifestWatcher
      this.#pwaManifestWatcher = null
      await watcher.close()
    }

    async function inject() {
      await injectPwaManifest(
        quasarConf,
        quasarConf.ctx.appPaths.resolve.entry(
          `service-worker/${quasarConf.pwa.manifestFilename}`
        )
      )

      log(
        `Generated the PWA manifest file (${quasarConf.pwa.manifestFilename})`
      )
    }

    this.#pwaManifestWatcher = chokidarWatch(
      quasarConf.metaConf.pwaManifestFile,
      {
        ignoreInitial: true
      }
    ).on(
      'change',
      debounce(async () => {
        await inject()
        updateHtmlVariables(quasarConf)
        this.reloadClient()
      }, 550)
    )

    await inject()
  }

  // also update ssr-devserver.js when changing here
  async #compilePwaServiceWorker(quasarConf, queue) {
    if (this.#pwaServiceWorkerWatcher !== null) {
      const watcher = this.#pwaServiceWorkerWatcher
      this.#pwaServiceWorkerWatcher = null
      await watcher.close()
    }

    const workboxConfig = await quasarPwaConfig.workbox(quasarConf)

    if (quasarConf.pwa.workboxMode === 'InjectManifest') {
      const rolldownConfig = await quasarPwaConfig.customSw(quasarConf)
      await this.watchWithRolldown(
        'InjectManifest Custom SW',
        rolldownConfig,
        () => {
          queue(() =>
            buildPwaServiceWorker(quasarConf, workboxConfig).then(() =>
              this.reloadClient()
            )
          )
        }
      ).then(watcher => {
        this.#pwaServiceWorkerWatcher = watcher
      })
    }

    await buildPwaServiceWorker(quasarConf, workboxConfig)
  }
}
