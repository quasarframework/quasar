import { createServer } from 'vite'

import { AppDevserver } from '../../app-devserver.js'
import { openBrowser } from '../../utils/open-browser.js'
import { quasarSpaConfig } from './spa-config.js'

export class QuasarModeDevserver extends AppDevserver {
  #server = null

  run (quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    if (diff('vite', quasarConf) === true) {
      return queue(() => this.#runVite(quasarConf, diff('viteUrl', quasarConf)))
    }
  }

  async #runVite (quasarConf, urlDiffers) {
    if (this.#server !== null) {
      await this.#server.close()
      this.#server = null
    }

    const viteConfig = await quasarSpaConfig.vite(quasarConf)

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
}
