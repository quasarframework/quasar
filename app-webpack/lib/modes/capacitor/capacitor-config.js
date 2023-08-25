const { createWebpackChain, extendWebpackChain } = require('../../config-tools.js')
const { injectWebpackHtml } = require('../../utils/html-template.js')

const quasarCapacitorConfig = {
  webpack: async quasarConf => {
    const { ctx } = quasarConf
    const { appPaths } = ctx

    const webpackChain = await createWebpackChain(quasarConf, { compileId: 'webpack-capacitor', threadName: 'Capacitor UI' })
    const capNodeModules = appPaths.resolve.capacitor('node_modules')

    webpackChain.resolve.modules
      .merge([ capNodeModules ])

    webpackChain.resolveLoader.modules
      .merge([ capNodeModules ])

    if (ctx.prod) {
      webpackChain.output
        .path(
          appPaths.resolve.capacitor('www')
        )
    }

    injectWebpackHtml(webpackChain, quasarConf)

    return extendWebpackChain(webpackChain, quasarConf, { isClient: true })
  }
}

module.exports.quasarCapacitorConfig = quasarCapacitorConfig
module.exports.modeConfig = quasarCapacitorConfig
