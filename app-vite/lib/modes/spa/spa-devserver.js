import { createServer } from 'vite'

import { AppDevserver } from '../../app-devserver.js'
import { openBrowser } from '../../utils/open-browser.js'
import { updateHtmlVariables } from '../../plugins/vite.html.js'
import { quasarSpaConfig } from './spa-config.js'

export class QuasarModeDevserver extends AppDevserver {
  run(quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    if (diff('vueDevtools', quasarConf)) {
      return queue(() => this.installVueDevtools(quasarConf))
    }

    if (diff('htmlTemplate', quasarConf)) {
      this.clientNeedsReload = true
      updateHtmlVariables(quasarConf)
    }

    if (diff('vite', quasarConf)) {
      this.clientNeedsReload = false
      return queue(() => this.#runVite(quasarConf, diff('viteUrl', quasarConf)))
    }

    if (this.clientNeedsReload) this.reloadClient()
  }

  async #runVite(quasarConf, urlDiffers) {
    const viteConfig = await quasarSpaConfig.vite(quasarConf)
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
}
