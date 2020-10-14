const path = require('path')
const QuasarSSRClientPlugin = require('@quasar/ssr-helpers/webpack-client-plugin')

const injectClientSpecifics = require('../inject.client-specifics')
const injectHotUpdate = require('../inject.hot-update')
const injectHtml = require('../inject.html')

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

  injectClientSpecifics(chain, cfg)
  injectHotUpdate(chain, cfg)

  chain.plugin('quasar-ssr-client')
    .use(QuasarSSRClientPlugin, [{
      filename: '../quasar.client-manifest.json'
    }])
}
