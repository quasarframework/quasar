const { createWebpackChain, extendWebpackChain } = require('../../config-tools.js')
const { injectWebpackHtml } = require('../../utils/html-template.js')

const quasarCordovaConfig = {
  webpack: async quasarConf => {
    const { ctx } = quasarConf

    const webpackChain = await createWebpackChain(quasarConf, { compileId: 'webpack-cordova', threadName: 'Cordova UI' })

    if (ctx.prod) {
      webpackChain.output
        .path(
          ctx.appPaths.resolve.cordova('www')
        )
    }

    injectWebpackHtml(webpackChain, quasarConf)

    return extendWebpackChain(webpackChain, quasarConf, { isClient: true })
  }
}

module.exports.quasarCordovaConfig = quasarCordovaConfig
module.exports.modeConfig = quasarCordovaConfig
