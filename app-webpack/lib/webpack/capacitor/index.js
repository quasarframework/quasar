const appPaths = require('../../app-paths.js')
const { injectHtml } = require('../inject.html.js')

const capNodeModules = appPaths.resolve.capacitor('node_modules')

module.exports.injectCapacitor = function injectCapacitor (chain, cfg) {
  // need to also look into /src-capacitor
  // for deps like @capacitor/core
  chain.resolve.modules
    .merge([ capNodeModules ])

  chain.resolveLoader.modules
    .merge([ capNodeModules ])

  injectHtml(chain, cfg)
}
