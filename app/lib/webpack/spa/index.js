const injectHtml = require('../inject.html')
const injectHotUpdate = require('../inject.hot-update')

module.exports = function (chain, cfg) {
  injectHtml(chain, cfg)
  injectHotUpdate(chain, cfg)
}
