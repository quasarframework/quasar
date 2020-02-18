const injectHtml = require('../inject.html')
const injectClientSpecifics = require('../inject.client-specifics')
const injectHotUpdate = require('../inject.hot-update')
const injectPreload = require('../inject.preload')

module.exports = function (chain, cfg) {
  injectHtml(chain, cfg)
  injectClientSpecifics(chain, cfg)
  injectHotUpdate(chain, cfg)
  injectPreload(chain, cfg)
}
