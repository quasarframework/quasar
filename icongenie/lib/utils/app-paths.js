const fs = require('fs')
const { normalize, join, sep } = require('path')

function getAppDir () {
  let dir = process.cwd()

  while (dir.length && dir[dir.length - 1] !== sep) {
    if (fs.existsSync(join(dir, 'quasar.conf.js'))) {
      return dir
    }

    dir = normalize(join(dir, '..'))
  }

  const { warn } = require('./logger')

  warn(`Error. This command must be executed inside a Quasar v1+ project folder.`)
  warn()
  process.exit(1)
}

const appDir = getAppDir()

module.exports.appDir = appDir
module.exports.resolveDir = dir => join(appDir, dir)
