/**
 * This endpoint is used exclusively by @quasar/testing
 */

import { getCtx } from './utils/get-ctx.js'
import { QuasarConfigFile } from './quasar-config-file.js'
import { quasarSpaConfig } from './modes/spa/spa-config.js'

/**
 * Retrieve the vite config (SPA only) for @quasar/testing AE
 * @param {*} ctxParams
 * @returns {Promise<import('vite').UserConfig>}
 */
export async function getTestingConfig (ctxParams = {}) {
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
  const viteConf = await quasarSpaConfig.vite(quasarConf)

  return viteConf
}
