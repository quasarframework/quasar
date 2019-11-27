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
}
