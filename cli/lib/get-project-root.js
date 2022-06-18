const { existsSync } = require('fs')
const { sep, normalize, join } = require('path')

module.exports = function () {
  let dir = process.cwd()

  while (dir.length && dir[dir.length - 1] !== sep) {
    if (
      existsSync(join(dir, 'quasar.conf.js')) ||
      existsSync(join(dir, 'quasar.config.js'))
    ) {
      return dir
    }

    dir = normalize(join(dir, '..'))
  }
}
