import { appPkg } from '../../app-pkg.js'
import { getPackage } from '../../utils/get-package.js'
import { fatal } from '../../utils/logger.js'
import { nodePackager } from '../../utils/node-packager.js'

const versions = {
  packager: '17.1.1',
  builder: '24.3.0'
}

function isValidName (bundlerName) {
  return [ 'packager', 'builder' ].includes(bundlerName)
}

function installBundler (bundlerName) {
  nodePackager.installPackage(
    `electron-${ bundlerName }@^${ versions[ bundlerName ] }`,
    { isDevDependency: true, displayName: `electron-${ bundlerName }` }
  )
}

export function bundlerIsInstalled (bundlerName) {
  const pgkName = `electron-${ bundlerName }`
  return (
    (appPkg.devDependencies && appPkg.devDependencies[ pgkName ])
    || (appPkg.dependencies && appPkg.dependencies[ pgkName ])
  ) !== void 0
}

export function ensureInstall (bundlerName) {
  if (!isValidName(bundlerName)) {
    fatal(`Unknown bundler "${ bundlerName }" for Electron`)
  }

  if (!bundlerIsInstalled(bundlerName)) {
    installBundler(bundlerName)
  }
}

export function getDefaultName () {
  if (bundlerIsInstalled('packager')) {
    return 'packager'
  }

  if (bundlerIsInstalled('builder')) {
    return 'builder'
  }

  return 'packager'
}

export function getBundler (bundlerName) {
  return getPackage(`electron-${ bundlerName }`)
}
