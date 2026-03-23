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
  if (isModeInstalled(appPaths, 'bex')) {
    if (silent !== true) {
      warn('Browser Extension support detected already. Aborting.')
    }
    return
  }

  console.log()
  log('Creating Browser Extension source folder...')

  fse.copySync(appPaths.resolve.cli('templates/bex/common'), appPaths.bexDir)

  const hasTypescript = cacheProxy.getModule('hasTypescript')
  const format = hasTypescript ? 'ts' : 'js'
  fse.copySync(appPaths.resolve.cli(`templates/bex/${format}`), appPaths.bexDir)

  log('Browser Extension support was added')
}

/**
 * @param {{
 *   ctx: import('../../../types/configuration/context').InternalQuasarContext,
 * }} options
 */
module.exports.removeMode = function removeMode({ ctx: { appPaths } }) {
  if (isModeInstalled(appPaths, 'bex') === false) {
    warn('No Browser Extension support detected. Aborting.')
    return
  }

  log('Removing Browser Extension source folder')
  fse.removeSync(appPaths.bexDir)

  log('Browser Extension support was removed')
}
