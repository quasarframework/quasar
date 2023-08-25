
const fs = require('node:fs')
const fse = require('fs-extra')

const { log, warn } = require('../../utils/logger.js')

function isModeInstalled (appPaths) {
  return fs.existsSync(appPaths.ssrDir)
}
module.exports.isModeInstalled = isModeInstalled

module.exports.addMode = function addMode ({
  ctx: { appPaths, cacheProxy },
  silent
}) {
  if (isModeInstalled(appPaths)) {
    if (silent !== true) {
      warn('SSR support detected already. Aborting.')
    }
    return
  }

  log('Creating SSR source folder...')
  const hasTypescript = cacheProxy.getModule('hasTypescript')
  const format = hasTypescript ? 'ts' : 'default'
  fse.copySync(
    appPaths.resolve.cli(`templates/ssr/${ format }`),
    appPaths.ssrDir
  )

  fse.copySync(
    appPaths.resolve.cli('templates/ssr/ssr-flag.d.ts'),
    appPaths.resolve.ssr('ssr-flag.d.ts')
  )

  log('SSR support was added')
}

module.exports.removeMode = function removeMode ({
  ctx: { appPaths }
}) {
  if (!isModeInstalled(appPaths)) {
    warn('No SSR support detected. Aborting.')
    return
  }

  log('Removing SSR source folder')
  fse.removeSync(appPaths.ssrDir)
  log('SSR support was removed')
}
