const fs = require('node:fs')
const fse = require('fs-extra')

const { log, warn } = require('../../utils/logger.js')

const bexDeps = {
  events: '^3.3.0'
}

function isModeInstalled (appPaths) {
  return fs.existsSync(appPaths.bexDir)
}
module.exports.isModeInstalled = isModeInstalled

module.exports.addMode = async function addMode ({
  ctx: { appPaths, cacheProxy },
  silent
}) {
  if (isModeInstalled(appPaths)) {
    if (silent !== true) {
      warn('Browser Extension support detected already. Aborting.')
    }
    return
  }

  const nodePackager = cacheProxy.getModule('nodePackager')
  nodePackager.installPackage(
    Object.entries(bexDeps).map(([ name, version ]) => `${ name }@${ version }`),
    { displayName: 'BEX dependencies' }
  )

  console.log()
  const { default: inquirer } = await import('inquirer')
  const answer = await inquirer.prompt([ {
    name: 'manifestVersion',
    type: 'list',
    choices: [
      { name: 'Manifest v2 (works with both Chrome and FF)', value: 'manifest-v2' },
      { name: 'Manifest v3 (works with Chrome only currently)', value: 'manifest-v3' }
    ],
    message: 'What version of manifest would you like?'
  } ])

  log('Creating Browser Extension source folder...')

  fse.copySync(appPaths.resolve.cli('templates/bex/common'), appPaths.bexDir)
  fse.copySync(appPaths.resolve.cli('templates/bex/bex-flag.d.ts'), appPaths.resolve.bex('bex-flag.d.ts'))

  const hasTypescript = cacheProxy.getModule('hasTypescript')
  const format = hasTypescript ? 'ts' : 'default'
  fse.copySync(appPaths.resolve.cli(`templates/bex/${ format }/${ answer.manifestVersion }`), appPaths.bexDir)

  log('Browser Extension support was added')
}

module.exports.removeMode = function removeMode ({
  ctx: { appPaths, cacheProxy }
}) {
  if (!isModeInstalled(appPaths)) {
    warn('No Browser Extension support detected. Aborting.')
    return
  }

  log('Removing Browser Extension source folder')
  fse.removeSync(appPaths.bexDir)

  const nodePackager = cacheProxy.getModule('nodePackager')
  nodePackager.uninstallPackage(
    Object.keys(bexDeps),
    { displayName: 'BEX dependencies' }
  )

  log('Browser Extension support was removed')
}
