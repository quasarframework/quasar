const
  injectHtml = require('../inject.html'),
  injectClientSpecifics = require('../inject.client-specifics'),
  injectHotUpdate = require('../inject.hot-update'),
  HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')

module.exports = function (chain, cfg) {
  injectHtml(chain, cfg)
  injectClientSpecifics(chain, cfg)
  injectHotUpdate(chain, cfg)

  if (cfg.ctx.mode.tauri && cfg.ctx.prod && !cfg.tauri.embeddedServer.active) {
    chain.plugin('html-webpack-inline-source')
      .use(HtmlWebpackInlineSourcePlugin)
  }
}
