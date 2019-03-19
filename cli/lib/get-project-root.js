const
  { existsSync } = require('fs'),
  { sep, normalize, join } = require('path')

module.exports = function () {
  let dir = process.cwd()

  while (dir.length && dir[dir.length - 1] !== sep) {
    if (existsSync(join(dir, 'quasar.conf.js'))) {
      return dir
    }

    dir = normalize(join(dir, '..'))
  }

  const { fatal } = require('./logger')
  fatal(`⚠️  Error. This command must be executed inside a Quasar project folder only.`)
}
