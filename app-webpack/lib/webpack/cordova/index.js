const { injectHtml } = require('../inject.html.js')

module.exports.injectCordova = function injectCordova (chain, cfg) {
  injectHtml(chain, cfg)
}
