const
  injectHtml = require('../inject.html'),
  injectClientSpecifics = require('../inject.client-specifics'),
  injectHotUpdate = require('../inject.hot-update'),
  HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')

module.exports = function (chain, cfg) {
  injectHtml(chain, cfg)
  injectClientSpecifics(chain, cfg)
  injectHotUpdate(chain, cfg)
  chain.plugin('html-webpack-inline-source')
    .use(HtmlWebpackInlineSourcePlugin)
}
