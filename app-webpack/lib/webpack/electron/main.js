const appPaths = require('../../app-paths.js')
const { createNodeChain } = require('./create-node-chain.js')

module.exports.injectElectronMain = function injectElectronMain (cfg, configName) {
  const chain = createNodeChain('main', cfg, configName)

  chain.entry('electron-main')
    .add(appPaths.resolve.app(
      cfg.sourceFiles.electronMain
    ))

  if (cfg.ctx.prod) {
    const { ElectronPackageJsonPlugin } = require('./plugin.electron-package-json.js')

    // write package.json file
    chain.plugin('package-json')
      .use(ElectronPackageJsonPlugin, [ cfg ])

    const patterns = [
      appPaths.resolve.app('.npmrc'),
      appPaths.resolve.app('package-lock.json'),
      appPaths.resolve.app('.yarnrc'),
      appPaths.resolve.app('yarn.lock')
    ].map(filename => ({
      from: filename,
      to: '.',
      noErrorOnMissing: true
    }))

    patterns.push({
      from: appPaths.resolve.electron('icons'),
      to: './icons',
      noErrorOnMissing: true
    })

    const CopyWebpackPlugin = require('copy-webpack-plugin')
    chain.plugin('copy-webpack')
      .use(CopyWebpackPlugin, [ { patterns } ])
  }

  return chain
}
