const { AppBuilder } = require('../../app-builder.js')
const { quasarSpaConfig } = require('./spa-config.js')

module.exports.QuasarModeBuilder = class QuasarModeBuilder extends AppBuilder {
  async build () {
    const webpackConf = await quasarSpaConfig.webpack(this.quasarConf)

    await this.buildWithWebpack('SPA UI', webpackConf)

    this.printSummary(this.quasarConf.build.distDir, true)
  }
}
