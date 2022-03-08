
const { writeFileSync } = require('fs')
const { join } = require('path')

const AppBuilder = require('../../app-builder')
const config = require('./pwa-config')
const { injectPwaManifest, buildServiceWorker } = require('./utils')

class PwaBuilder extends AppBuilder {
  async build () {
    injectPwaManifest(this.quasarConf)

    const viteConfig = await config.vite(this.quasarConf)
    await this.buildWithVite('PWA UI', viteConfig)

    writeFileSync(
      join(this.quasarConf.build.distDir, this.quasarConf.pwa.manifestFilename),
      JSON.stringify(
        this.quasarConf.metaConf.pwaManifest,
        null,
        this.quasarConf.build.minify !== false ? void 0 : 2
      ),
      'utf-8'
    )

    if (this.quasarConf.pwa.workboxMode === 'injectManifest') {
      const esbuildConfig = await config.customSw(this.quasarConf)
      await this.buildWithEsbuild('injectManifest Custom SW', esbuildConfig)
    }

    const workboxConfig = await config.workbox(this.quasarConf)
    await buildServiceWorker(this.quasarConf.pwa.workboxMode, workboxConfig)
  }
}

module.exports = PwaBuilder
