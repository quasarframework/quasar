const fs = require('fs')
const { join } = require('path')
const spawn = require('cross-spawn').sync

const { fatal } = require('./logger')

function isInstalled (cmd) {
  try {
    return spawn(cmd, ['--version']).status === 0
  }
  catch (err) {
    return false
  }
}

function getPackager (root) {
  if (fs.existsSync(join(root, 'yarn.lock'))) {
    return 'yarn'
  }

  if (fs.existsSync(join(root, 'package-lock.json'))) {
    return 'npm'
  }

  if (isInstalled('yarn')) {
    return 'yarn'
  }

  if (isInstalled('npm')) {
    return 'npm'
  }

  fatal('⚠️  Please install Yarn or NPM before running this command.\n')
}

module.exports = getPackager
