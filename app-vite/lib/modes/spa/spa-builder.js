import { AppBuilder } from '../../app-builder.js'
import { quasarSpaConfig } from './spa-config.js'

export class QuasarModeBuilder extends AppBuilder {
  async build () {
    const viteConfig = await quasarSpaConfig.vite(this.quasarConf)
    await this.buildWithVite('SPA UI', viteConfig)

    this.printSummary(this.quasarConf.build.distDir, true)
  }
}
