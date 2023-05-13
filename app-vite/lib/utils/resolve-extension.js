
const { existsSync } = require('node:fs')

const extensions = [ '', '.js', '.ts', '.jsx', '.tsx' ]

module.exports.resolveExtension = function resolveExtension (file) {
  for (const ext of extensions) {
    const entry = file + ext
    if (existsSync(entry) === true) {
      return entry
    }
  }
}
