import fse from 'fs-extra'

/**
 * @param {import('../../types/app-paths').QuasarAppPaths} appPaths
 * @param {import('../../types/configuration/context').QuasarMode} modeName
 * @returns {boolean}
 */
export function isModeInstalled(appPaths, modeName) {
  return (
    modeName === 'spa' || // always installed
    fse.existsSync(appPaths[`${modeName}Dir`])
  )
}
