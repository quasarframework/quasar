
const { writeFileSync } = require('fs')
const { join } = require('path')

const AppBuilder = require('../../app-builder')
const config = require('./pwa-config')
const { injectPwaManifest, buildPwaServiceWorker } = require('./utils')

class PwaBuilder extends AppBuilder {
  async build () {
    injectPwaManifest(this.quasarConf)

    const viteConfig = await config.vite(this.quasarConf)
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
      const esbuildConfig = await config.customSw(this.quasarConf)
      await this.buildWithEsbuild('injectManifest Custom SW', esbuildConfig)
    }

    // also update ssr-builder.js when changing here
    const workboxConfig = await config.workbox(this.quasarConf)
    await buildPwaServiceWorker(this.quasarConf.pwa.workboxMode, workboxConfig)

    this.printSummary(this.quasarConf.build.distDir, true)
  }
}

module.exports = PwaBuilder
