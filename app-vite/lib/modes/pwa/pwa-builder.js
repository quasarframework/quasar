import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { AppBuilder } from '../../app-builder.js'
import { quasarPwaConfig } from './pwa-config.js'
import { injectPwaManifest, buildPwaServiceWorker } from './utils.js'

export class QuasarModeBuilder extends AppBuilder {
  async build () {
    injectPwaManifest(this.quasarConf)

    const viteConfig = await quasarPwaConfig.vite(this.quasarConf)
    await this.buildWithVite('PWA UI', viteConfig)

    // also update ssr-builder.js when changing here
    writeFileSync(
      join(this.quasarConf.build.distDir, this.quasarConf.pwa.manifestFilename),
      JSON.stringify(
        this.quasarConf.htmlVariables.pwaManifest,
        null,
        this.quasarConf.build.minify !== false ? void 0 : 2
      ),
      'utf-8'
    )

    // also update ssr-builder.js when changing here
    if (this.quasarConf.pwa.workboxMode === 'InjectManifest') {
      const esbuildConfig = await quasarPwaConfig.customSw(this.quasarConf)
      await this.buildWithEsbuild('InjectManifest Custom SW', esbuildConfig)
    }

    // also update ssr-builder.js when changing here
    const workboxConfig = await quasarPwaConfig.workbox(this.quasarConf)
    await buildPwaServiceWorker(this.quasarConf, workboxConfig)

    this.printSummary(this.quasarConf.build.distDir, true)
  }
}
