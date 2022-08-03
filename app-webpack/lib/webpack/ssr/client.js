const path = require('path')

const injectHtml = require('../inject.html')
const { QuasarSSRClientPlugin } = require('./plugin.client-side')

module.exports = function (chain, cfg) {
  if (cfg.ctx.prod) {
    chain.output
      .path(path.join(cfg.build.distDir, 'www'))
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
      .use(QuasarSSRClientPlugin, [{
        filename: '../quasar.client-manifest.json'
      }])
  }
}
