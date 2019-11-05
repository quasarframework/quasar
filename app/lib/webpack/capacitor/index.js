const
  injectHtml = require('../inject.html'),
  injectClientSpecifics = require('../inject.client-specifics'),
  injectHotUpdate = require('../inject.hot-update')

module.exports = function (chain, cfg) {
  injectHtml(chain, cfg)
  injectClientSpecifics(chain, cfg)
  injectHotUpdate(chain, cfg)
}
