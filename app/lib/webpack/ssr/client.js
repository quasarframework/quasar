const injectClientSpecifics = require('../inject.client-specifics')
const injectHotUpdate = require('../inject.hot-update')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const injectHtml = require('../inject.html')

module.exports = function (chain, cfg) {
  if (cfg.ctx.mode.ssr && cfg.ctx.mode.pwa) {
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

  chain.plugin('vue-ssr-client')
    .use(VueSSRClientPlugin, [{
      filename: '../quasar.client-manifest.json'
    }])
}
