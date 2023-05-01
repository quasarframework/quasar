
const fs = require('fs')
const fse = require('fs-extra')

const appPaths = require('../../app-paths')
const { log, warn } = require('../../helpers/logger')
const nodePackager = require('../../helpers/node-packager')
const hasTypescript = require('../../helpers/has-typescript')

const bexDeps = {
  events: '^3.3.0'
}

function isInstalled () {
  return fs.existsSync(appPaths.bexDir)
}

async function add (silent) {
  if (isInstalled()) {
    if (silent !== true) {
      warn('Browser Extension support detected already. Aborting.')
    }
    return
  }

  nodePackager.installPackage(
    Object.entries(bexDeps).map(([ name, version ]) => `${ name }@${ version }`),
    { displayName: 'BEX dependencies' }
  )

  const inquirer = require('inquirer')

  console.log()
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

  const format = hasTypescript ? 'ts' : 'default'
  fse.copySync(appPaths.resolve.cli(`templates/bex/${ format }/${ answer.manifestVersion }`), appPaths.bexDir)

  log('Browser Extension support was added')
}

function remove () {
  if (!isInstalled()) {
    warn('No Browser Extension support detected. Aborting.')
    return
  }

  log('Removing Browser Extension source folder')
  fse.removeSync(appPaths.bexDir)

  nodePackager.uninstallPackage(
    Object.keys(bexDeps),
    { displayName: 'BEX dependencies' }
  )

  log('Browser Extension support was removed')
}

module.exports = {
  isInstalled,
  add,
  remove
}
