const fs = require('fs')

const appPaths = require('../app-paths')
const spawn = require('cross-spawn').sync
const { warn } = require('./logger')

function isInstalled (cmd) {
  try {
    return spawn(cmd, ['--version']).status === 0
  }
  catch (err) {
    return false
  }
}

function getPackager () {
  if (fs.existsSync(appPaths.resolve.app('yarn.lock'))) {
    return 'yarn'
  }

  if (fs.existsSync(appPaths.resolve.app('package-lock.json'))) {
    return 'npm'
  }

  if (isInstalled('yarn')) {
    return 'yarn'
  }

  if (isInstalled('npm')) {
    return 'npm'
  }

  warn('Please install Yarn or NPM before running this command.\n')
}

module.exports = getPackager()
