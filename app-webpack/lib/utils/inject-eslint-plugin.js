const fse = require('fs-extra')

const { encodeForDiff } = require('./encode-for-diff.js')

function extractPluginConfig ({
  cache,
  cacheLocation, // injected by us

  formatter,
  fix,
  warnings,
  errors,
  exclude = [],

  rawWebpackEslintPluginOptions = {}
}) {
  return {
    cache,
    cacheLocation,
    formatter,
    emitError: errors,
    emitWarning: warnings,
    extensions: [ 'js', 'jsx', 'vue' ],
    exclude: [
      'node_modules',
      ...exclude
    ],
    fix,
    ...rawWebpackEslintPluginOptions
  }
}

module.exports.injectESLintPlugin = function injectESLintPlugin (webpackChain, quasarConf, compileId) {
  const { appPaths, cacheProxy } = quasarConf.ctx

  const cacheId = `eslint-${ compileId }`
  const cacheLocation = appPaths.resolve.cache(cacheId)
  const { rawEsbuildEslintOptions, ...eslintOptions } = quasarConf.eslint

  const config = {
    ...eslintOptions,
    cacheLocation
  }

  if (config.cache === true) {
    const configHash = encodeForDiff(config)
    const cachedHash = cacheProxy.getRuntime(cacheId, () => '')

    if (cachedHash !== configHash) {
      cacheProxy.setRuntime(cacheId, configHash)

      if (config.cache === true) {
        // clear cache as we have a new config
        fse.removeSync(cacheLocation)
        fse.ensureDirSync(cacheLocation)
      }
    }
  }

  const { EslintWebpackPlugin } = cacheProxy.getModule('eslint')
  webpackChain.plugin('eslint-webpack-plugin')
    .use(EslintWebpackPlugin, [ extractPluginConfig(config) ])
}
