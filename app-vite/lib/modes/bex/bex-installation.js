
const fs = require('fs')
const fse = require('fs-extra')

const appPaths = require('../../app-paths')
const { log, warn } = require('../../helpers/logger')
const { spawnSync } = require('../../helpers/spawn')
const nodePackager = require('../../helpers/node-packager')

const bexDeps = {
  'events': '^3.3.0'
}

function isInstalled () {
  return fs.existsSync(appPaths.bexDir)
}

async function add (silent) {
  if (isInstalled()) {
    if (silent !== true) {
      warn(`Browser Extension support detected already. Aborting.`)
    }
    return
  }

  const cmdParam = nodePackager === 'npm'
    ? ['install']
    : ['add']

  log(`Installing BEX dependencies...`)
  spawnSync(
    nodePackager,
    cmdParam.concat(Object.keys(bexDeps).map(dep => {
      return `${dep}@${bexDeps[dep]}`
    })),
    { cwd: appPaths.appDir, env: { ...process.env, NODE_ENV: 'development' } },
    () => fatal('Failed to install BEX dependencies', 'FAIL')
  )

  const inquirer = require('inquirer')

  console.log()
  const answer = await inquirer.prompt([{
    name: 'manifestVersion',
    type: 'list',
    choices: [
      { name: 'Manifest v2 (works with both Chrome and FF)', value: 'manifest-v2' },
      { name: 'Manifest v3 (works with Chrome only currently)', value: 'manifest-v3' }
    ],
    message: 'What version of manifest would you like?'
  }])

  log(`Creating Browser Extension source folder...`)
  fse.copySync(appPaths.resolve.cli('templates/bex/' + answer.manifestVersion), appPaths.bexDir)
  log(`Browser Extension support was added`)
}

function remove () {
  if (!isInstalled()) {
    warn(`No Browser Extension support detected. Aborting.`)
    return
  }

  log(`Removing Browser Extension source folder`)
  fse.removeSync(appPaths.bexDir)

  const cmdParam = nodePackager === 'npm'
    ? ['uninstall', '--save']
    : ['remove']

  const deps = Object.keys(bexDeps)

  log(`Uninstalling BEX dependencies...`)
  spawnSync(
    nodePackager,
    cmdParam.concat(deps),
    { cwd: appPaths.appDir, env: { ...process.env, NODE_ENV: 'development' } },
    () => fatal('Failed to uninstall BEX dependencies', 'FAIL')
  )

  log(`Browser Extension support was removed`)
}

module.exports = {
  isInstalled,
  add,
  remove
}
