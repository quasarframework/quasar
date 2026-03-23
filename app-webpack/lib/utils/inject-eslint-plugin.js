const fse = require('fs-extra')

const { encodeForDiff } = require('./encode-for-diff.js')

function extractPluginConfig({
  cwd, // injected by us
  configType, // injected by us

  cache,
  cacheLocation, // injected by us

  formatter,
  fix,
  warnings,
  errors,
  exclude = [],

  rawWebpackEslintPluginOptions = {}
}) {
  const acc = {
    cwd,
    cache,
    cacheLocation,
    formatter,
    emitError: errors,
    emitWarning: warnings,
    extensions: ['js', 'jsx', 'ts', 'tsx', 'vue'],
    exclude: ['node_modules', ...exclude],
    fix,
    ...rawWebpackEslintPluginOptions
  }

  if (configType === 'flat') {
    acc.configType = 'flat'
  }

  return acc
}

module.exports.injectESLintPlugin = function injectESLintPlugin(
  webpackChain,
  quasarConf,
  compileId
) {
  const { appPaths, cacheProxy } = quasarConf.ctx

  const cacheId = `eslint-${compileId}`
  const cacheLocation = appPaths.resolve.cache(cacheId)
  const { rawEsbuildEslintOptions, ...eslintOptions } = quasarConf.eslint
  const { configType, EslintWebpackPlugin } = cacheProxy.getModule('eslint')

  const config = {
    ...eslintOptions,
    cwd: appPaths.appDir,
    configType,
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

  webpackChain
    .plugin('eslint-webpack-plugin')
    .use(EslintWebpackPlugin, [extractPluginConfig(config)])
}
