
const fs = require('fs')
const fse = require('fs-extra')

const appPaths = require('../../app-paths')
const { log, warn } = require('../../helpers/logger')

function isInstalled () {
  return fs.existsSync(appPaths.bexDir)
}

function add (silent) {
  if (isInstalled()) {
    if (silent !== true) {
      warn(`Browser Extension support detected already. Aborting.`)
    }
    return
  }

  log(`Creating Browser Extension source folder...`)
  fse.copySync(appPaths.resolve.cli('templates/bex'), appPaths.bexDir)
  log(`Browser Extension support was added`)
}

function remove () {
  if (!isInstalled()) {
    warn(`No Browser Extension support detected. Aborting.`)
    return
  }

  log(`Removing Browser Extension source folder`)
  fse.removeSync(appPaths.bexDir)
  log(`Browser Extension support was removed`)
}

module.exports = {
  isInstalled,
  add,
  remove
}
