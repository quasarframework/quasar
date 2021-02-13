const appPaths = require('../../app-paths')
const createNodeChain = require('./create-node-chain')

module.exports = function (cfg, configName) {
  const chain = createNodeChain('main', cfg, configName)

  chain.entry('electron-main')
    .add(appPaths.resolve.app(
      cfg.sourceFiles.electronMain
    ))

  if (cfg.ctx.prod) {
    const ElectronPackageJson = require('./plugin.electron-package-json')

    // write package.json file
    chain.plugin('package-json')
      .use(ElectronPackageJson, [ cfg ])

    const patterns = [
      appPaths.resolve.app('.npmrc'),
      appPaths.resolve.app('.yarnrc')
    ].map(filename => ({
      from: filename,
      to: '.',
      noErrorOnMissing: true
    }))

    const CopyWebpackPlugin = require('copy-webpack-plugin')
    chain.plugin('copy-webpack')
      .use(CopyWebpackPlugin, [{ patterns }])
  }

  return chain
}
