
const { writeFileSync } = require('node:fs')
const { join } = require('node:path')

const { AppBuilder } = require('../../app-builder.js')
const { quasarPwaConfig } = require('./pwa-config.js')
const { injectPwaManifest, buildPwaServiceWorker } = require('./utils.js')

module.exports.QuasarModeBuilder = class QuasarModeBuilder extends AppBuilder {
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
    if (this.quasarConf.pwa.workboxMode === 'injectManifest') {
      const esbuildConfig = await quasarPwaConfig.customSw(this.quasarConf)
      await this.buildWithEsbuild('injectManifest Custom SW', esbuildConfig)
    }

    // also update ssr-builder.js when changing here
    const workboxConfig = await quasarPwaConfig.workbox(this.quasarConf)
    await buildPwaServiceWorker(this.quasarConf.pwa.workboxMode, workboxConfig)

    this.printSummary(this.quasarConf.build.distDir, true)
  }
}
