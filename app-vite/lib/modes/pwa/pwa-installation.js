import fs from 'node:fs'
import fse from 'fs-extra'

import { log, warn } from '../../utils/logger.js'

const defaultVersion = '^7.0.0'

const pwaDevDeps = {
  'workbox-core': defaultVersion,
  'workbox-routing': defaultVersion,
  'workbox-strategies': defaultVersion,
  'workbox-expiration': defaultVersion,
  'workbox-precaching': defaultVersion,
  'workbox-cacheable-response': defaultVersion,
  'workbox-build': defaultVersion
}

const pwaDeps = {
  'register-service-worker': '^1.7.2'
}

export function isModeInstalled (appPaths) {
  return fs.existsSync(appPaths.pwaDir)
}

export async function addMode ({
  ctx: { appPaths, cacheProxy },
  silent
}) {
  if (isModeInstalled(appPaths)) {
    if (silent !== true) {
      warn('PWA support detected already. Aborting.')
    }
    return
  }

  const nodePackager = await cacheProxy.getModule('nodePackager')
  nodePackager.installPackage(
    Object.entries(pwaDevDeps).map(([ name, version ]) => `${ name }@${ version }`),
    { isDevDependency: true, displayName: 'PWA dev dependencies' }
  )
  nodePackager.installPackage(
    Object.entries(pwaDeps).map(([ name, version ]) => `${ name }@${ version }`),
    { displayName: 'PWA dependencies' }
  )

  log('Creating PWA source folder...')

  const hasTypescript = await cacheProxy.getModule('hasTypescript')
  const { hasEslint } = await cacheProxy.getModule('eslint')
  const format = hasTypescript ? 'ts' : 'default'

  fse.copySync(
    appPaths.resolve.cli(`templates/pwa/${ format }`),
    appPaths.pwaDir,
    // Copy .eslintrc.js only if the app has ESLint
    hasEslint === true ? { filter: src => !src.endsWith('/.eslintrc.cjs') } : void 0
  )

  log('Copying PWA icons to /public/icons/ (if they are not already there)...')
  fse.copySync(
    appPaths.resolve.cli('templates/pwa-icons'),
    appPaths.resolve.app('public/icons'),
    { overwrite: false }
  )

  log('PWA support was added')
}

export async function removeMode ({
  ctx: { appPaths, cacheProxy }
}) {
  if (!isModeInstalled(appPaths)) {
    warn('No PWA support detected. Aborting.')
    return
  }

  log('Removing PWA source folder')
  fse.removeSync(appPaths.pwaDir)

  const nodePackager = await cacheProxy.getModule('nodePackager')
  nodePackager.uninstallPackage(Object.keys(pwaDevDeps), {
    displayName: 'PWA dev dependencies'
  })
  nodePackager.uninstallPackage(Object.keys(pwaDeps), {
    displayName: 'PWA dependencies'
  })

  log('PWA support was removed')
}
