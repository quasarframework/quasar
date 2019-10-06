const injectHtml = require('../inject.html'),
  injectClientSpecifics = require('../inject.client-specifics'),
  injectHotUpdate = require('../inject.hot-update'),
  appPaths = require('../../app-paths')

module.exports = function(chain, cfg) {
  if (!cfg.capacitor || cfg.capacitor.autoHideSplashscreen !== false) {
    // Hide splashcreen when app is loaded
    cfg.boot.push({
      path: appPaths.resolve.app(
        'node_modules/@quasar/app/lib/capacitor/hide-splashscreen.js'
      )
    })
  }
  injectHtml(chain, cfg)
  injectClientSpecifics(chain, cfg)
  injectHotUpdate(chain, cfg)
}
