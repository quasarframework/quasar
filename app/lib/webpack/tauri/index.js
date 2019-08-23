const
  injectHtml = require('../inject.html'),
  injectClientSpecifics = require('../inject.client-specifics'),
  injectHotUpdate = require('../inject.hot-update'),
  appPaths = require('../../app-paths')

module.exports = function (chain, cfg) {
  injectHtml(chain, cfg)
  injectClientSpecifics(chain, cfg)
  injectHotUpdate(chain, cfg)

  require(require.resolve('@quasar/tauri/mode/webpack', {
    paths: [appPaths.appDir]
  })).chain(chain, cfg)
}
