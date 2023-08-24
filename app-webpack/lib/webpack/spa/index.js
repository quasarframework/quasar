const { injectHtml } = require('../inject.html.js')

module.exports.injectSpa = function injectSpa (chain, cfg) {
  injectHtml(chain, cfg)
}
