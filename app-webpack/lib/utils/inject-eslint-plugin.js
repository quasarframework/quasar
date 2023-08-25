const fse = require('fs-extra')

const { encodeForDiff } = require('./encode-for-diff.js')

// TODO: a way to disable eslint webpack plugin even if hasEslint is true
module.exports.injectESLintPlugin = function injectESLintPlugin (webpackChain, quasarConf, compileId) {
  const { appPaths, cacheProxy } = quasarConf.ctx

  const cacheId = `eslint-${ compileId }`
  const cacheLocation = appPaths.resolve.cache(cacheId)

  const eslintPluginConfig = {
    ...quasarConf.build.webpackEslintPluginOptions,
    cacheLocation
  }

  if (eslintPluginConfig.cache === true) {
    const configHash = encodeForDiff(eslintPluginConfig)
    const cachedHash = cacheProxy.getRuntime(cacheId, () => '')

    if (cachedHash !== configHash) {
      cacheProxy.setRuntime(cacheId, configHash)

      if (eslintPluginConfig.cache === true) {
        // clear cache as we have a new config
        fse.removeSync(cacheLocation)
        fse.ensureDirSync(cacheLocation)
      }
    }
  }

  const { EslintWebpackPlugin } = cacheProxy.getModule('eslint')
  webpackChain.plugin('eslint-webpack-plugin')
    .use(EslintWebpackPlugin, [ eslintPluginConfig ])
}
