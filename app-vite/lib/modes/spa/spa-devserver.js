import { createServer } from 'vite'

import { AppDevserver } from '../../app-devserver.js'
import { updateHtmlVariables } from '../../plugins/vite.html.js'
import { quasarSpaConfig } from './spa-config.js'

export class QuasarModeDevserver extends AppDevserver {
  constructor(opts) {
    super(opts)

    this.registerRunSteps([
      {
        diff: 'htmlTemplate',
        fn: quasarConf => {
          this.clientNeedsReload = true
          updateHtmlVariables(quasarConf)
        }
      },

      {
        diff: 'vite',
        fn: this.#runVite.bind(this)
      },

      {
        diff: 'viteUrl',
        fn: this.openBrowser.bind(this)
      }
    ])
  }

  async #runVite(quasarConf) {
    this.clientNeedsReload = false

    const viteConfig = await quasarSpaConfig.vite(quasarConf)
    const server = await createServer(viteConfig)

    await this.rebootClient(server)

    this.printBanner(quasarConf)
  }
}
