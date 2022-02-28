const appPaths = require('../../app-paths')
const injectHtml = require('../inject.html')

const capNodeModules = appPaths.resolve.capacitor('node_modules')

module.exports = function (chain, cfg) {
  // need to also look into /src-capacitor
  // for deps like @capacitor/core
  chain.resolve.modules
    .merge([ capNodeModules ])

  chain.resolveLoader.modules
    .merge([ capNodeModules ])

  injectHtml(chain, cfg)
}
