const { AppBuilder } = require('../../app-builder.js')
const { quasarPwaConfig } = require('./pwa-config.js')

module.exports.QuasarModeBuilder = class QuasarModeBuilder extends AppBuilder {
  async build () {
    // also update ssr-builder.js when changing here
    if (this.quasarConf.pwa.workboxMode === 'InjectManifest') {
      const esbuildConfig = await quasarPwaConfig.customSw(this.quasarConf)
      await this.buildWithEsbuild('InjectManifest Custom SW', esbuildConfig)
    }

    const webpackConf = await quasarPwaConfig.webpack(this.quasarConf)
    await this.buildWithWebpack('PWA UI', webpackConf)

    this.printSummary(this.quasarConf.build.distDir, true)
  }
}
