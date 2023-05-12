const { injectHtml } = require('../inject.html.js')

module.exports.injectSpa = function injectPwa (chain, cfg) {
  injectHtml(chain, cfg)
}
