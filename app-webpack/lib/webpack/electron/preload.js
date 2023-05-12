
const appPaths = require('../../app-paths.js')
const { createNodeChain } = require('./create-node-chain.js')

module.exports.injectElectronPreload = function injectElectronPreload (cfg, configName) {
  const chain = createNodeChain('preload', cfg, configName)

  chain.entry('electron-preload')
    .add(appPaths.resolve.app(
      cfg.sourceFiles.electronPreload
    ))

  return chain
}
