const fs = require('node:fs')
const fse = require('fs-extra')

const { log, warn } = require('../../utils/logger.js')

const pwaDeps = {
  'workbox-webpack-plugin': '^7.0.0'
}

function isModeInstalled (appPaths) {
  return fs.existsSync(appPaths.pwaDir)
}
module.exports.isModeInstalled = isModeInstalled

module.exports.addMode = function addMode ({
  ctx: { appPaths, cacheProxy },
  silent
}) {
  if (isModeInstalled(appPaths)) {
    if (silent !== true) {
      warn('PWA support detected already. Aborting.')
    }
    return
  }

  const nodePackager = cacheProxy.getModule('nodePackager')
  nodePackager.installPackage(
    Object.entries(pwaDeps).map(([ name, version ]) => `${ name }@${ version }`),
    { isDevDependency: true, displayName: 'PWA dependencies' }
  )

  log('Creating PWA source folder...')

  const hasTypescript = cacheProxy.getModule('hasTypescript')
  const { hasEslint } = cacheProxy.getModule('eslint')
  const format = hasTypescript ? 'ts' : 'default'

  fse.copySync(
    appPaths.resolve.cli(`templates/pwa/${ format }`),
    appPaths.pwaDir,
    // Copy .eslintrc.js only if the app has ESLint
    hasEslint === true ? { filter: src => !src.endsWith('/.eslintrc.cjs') } : void 0
  )

  fse.copySync(
    appPaths.resolve.cli('templates/pwa/pwa-flag.d.ts'),
    appPaths.resolve.pwa('pwa-flag.d.ts')
  )

  log('Copying PWA icons to /public/icons/ (if they are not already there)...')
  fse.copySync(
    appPaths.resolve.cli('templates/pwa-icons'),
    appPaths.resolve.app('public/icons'),
    { overwrite: false }
  )

  log('PWA support was added')
}

module.exports.removeMode = function removeMode ({
  ctx: { appPaths, cacheProxy }
}) {
  if (!isModeInstalled(appPaths)) {
    warn('No PWA support detected. Aborting.')
    return
  }

  log('Removing PWA source folder')
  fse.removeSync(appPaths.pwaDir)

  const nodePackager = cacheProxy.getModule('nodePackager')
  nodePackager.uninstallPackage(Object.keys(pwaDeps), {
    displayName: 'PWA dependencies'
  })

  log('PWA support was removed')
}
