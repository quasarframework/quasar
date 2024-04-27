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
    chain.plugin('package-json')
      .use(ElectronPackageJson, [ cfg ])

    const NpmrcPlugin = require('./plugin.npmrc')
    chain.plugin('npmrc')
      .use(NpmrcPlugin, [ cfg ])

    const patterns = [
      appPaths.resolve.app('.yarnrc'),
      appPaths.resolve.app('package-lock.json'),
      appPaths.resolve.app('yarn.lock'),
      appPaths.resolve.app('pnpm-lock.yaml')
      // bun.lockb should be ignored since it error out with devDeps in package.json
      // (error: lockfile has changes, but lockfile is frozen)
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
