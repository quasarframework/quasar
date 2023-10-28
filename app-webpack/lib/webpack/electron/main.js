const appPaths = require('../../app-paths')
const createNodeChain = require('./create-node-chain')

module.exports = function (cfg, configName) {
  const chain = createNodeChain('main', cfg, configName)

  chain.output
    .libraryTarget('commonjs2')

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
      appPaths.resolve.app('package-lock.json'),
      appPaths.resolve.app('.yarnrc'),
      appPaths.resolve.app('yarn.lock'),
      appPaths.resolve.app('pnpm-lock.yaml'),
      appPaths.resolve.app('bun.lockb')
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
