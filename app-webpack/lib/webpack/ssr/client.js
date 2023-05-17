const path = require('node:path')
const webpack = require('webpack')

const { injectHtml } = require('../inject.html.js')
const { QuasarSSRClientPlugin } = require('./plugin.client-side.js')

module.exports.injectSSRClient = function injectSSRClient (chain, cfg) {
  if (cfg.ctx.prod) {
    chain.output
      .path(path.join(cfg.build.distDir, 'www'))
  }
  else if (cfg.devServer.hot) {
    chain.plugin('hot-module-replacement')
      .use(webpack.HotModuleReplacementPlugin)
  }

  if (cfg.ctx.mode.pwa) {
    // this will generate the offline.html
    // which runs as standalone PWA only
    // so we need to tweak the ctx

    const templateParam = JSON.parse(JSON.stringify(cfg.htmlVariables))

    templateParam.ctx.mode = { pwa: true }
    templateParam.ctx.modeName = 'pwa'
    if (templateParam.process && templateParam.process.env) {
      templateParam.process.env.MODE = 'pwa'
    }

    injectHtml(chain, cfg, templateParam)
  }

  if (cfg.ctx.prod) {
    chain.plugin('quasar-ssr-client')
      .use(QuasarSSRClientPlugin, [ {
        filename: '../quasar.client-manifest.json'
      } ])
  }
}
