
const fs = require('fs')
const fse = require('fs-extra')

const appPaths = require('../../app-paths')
const { log, warn } = require('../../helpers/logger')

function isInstalled () {
  return fs.existsSync(appPaths.ssrDir)
}

function add (silent) {
  if (isInstalled()) {
    if (silent !== true) {
      warn(`SSR support detected already. Aborting.`)
    }
    return
  }

  log(`Creating SSR source folder...`)
  fse.copySync(appPaths.resolve.cli('templates/ssr'), appPaths.ssrDir)
  log(`SSR support was added`)
}

function remove () {
  if (!isInstalled()) {
    warn(`No SSR support detected. Aborting.`)
    return
  }

  log(`Removing SSR source folder`)
  fse.removeSync(appPaths.ssrDir)
  log(`SSR support was removed`)
}

module.exports = {
  isInstalled,
  add,
  remove
}
