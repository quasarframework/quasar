/**
 * This endpoint is used exclusively by @quasar/testing AEs
 */

const { getCtx } = require('./utils/get-ctx.js')
const { QuasarConfigFile } = require('./quasar-config-file.js')
const { quasarSpaConfig } = require('./modes/spa/spa-config.js')

/**
 * Retrieve the webpack config (SPA only) for @quasar/testing AE
 * @param {*} ctxParams
 * @returns {Promise<import('webpack').Configuration>}
 */
module.exports.getTestingConfig = async function getTestingConfig (ctxParams = {}) {
  const ctx = getCtx({
    mode: 'spa',
    dev: true,
    ...ctxParams
  })

  const quasarConfFile = new QuasarConfigFile({
    ctx,
    port: 8080,
    host: 'localhost'
  })

  await quasarConfFile.init()

  const quasarConf = await quasarConfFile.read()
  const webpackConf = await quasarSpaConfig.webpack(quasarConf)

  return webpackConf
}
