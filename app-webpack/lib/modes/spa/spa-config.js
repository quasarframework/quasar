const { createWebpackChain, extendWebpackChain } = require('../../config-tools.js')
const { injectWebpackHtml } = require('../../utils/html-template.js')

const quasarSpaConfig = {
  webpack: async quasarConf => {
    const webpackChain = await createWebpackChain(quasarConf, { compileId: 'webpack-spa', threadName: 'SPA UI' })

    injectWebpackHtml(webpackChain, quasarConf)

    return extendWebpackChain(webpackChain, quasarConf, { isClient: true })
  }
}

module.exports.quasarSpaConfig = quasarSpaConfig
module.exports.modeConfig = quasarSpaConfig
