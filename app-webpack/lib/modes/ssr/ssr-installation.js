const fse = require('fs-extra')

const { log, warn } = require('../../utils/logger.js')
const { isModeInstalled } = require('../modes-utils.js')

/**
 * @param {{
 *   ctx: import('../../../types/configuration/context').InternalQuasarContext,
 *   silent: boolean
 * }} options
 */
module.exports.addMode = function addMode({
  ctx: { appPaths, cacheProxy },
  silent
}) {
  if (isModeInstalled(appPaths, 'ssr')) {
    if (silent !== true) {
      warn('SSR support detected already. Aborting.')
    }
    return
  }

  log('Creating SSR source folder...')
  const hasTypescript = cacheProxy.getModule('hasTypescript')
  const format = hasTypescript ? 'ts' : 'js'
  fse.copySync(appPaths.resolve.cli(`templates/ssr/${format}`), appPaths.ssrDir)

  log('SSR support was added')
}

/**
 * @param {{
 *   ctx: import('../../../types/configuration/context').InternalQuasarContext,
 * }} options
 */
module.exports.removeMode = function removeMode({ ctx: { appPaths } }) {
  if (isModeInstalled(appPaths, 'ssr') === false) {
    warn('No SSR support detected. Aborting.')
    return
  }

  log('Removing SSR source folder')
  fse.removeSync(appPaths.ssrDir)
  log('SSR support was removed')
}
