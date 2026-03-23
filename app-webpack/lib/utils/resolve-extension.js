const { existsSync } = require('node:fs')

const extensions = ['', '.js', '.ts', '.jsx', '.tsx']

module.exports.resolveExtension = function resolveExtension(
  file,
  extList = extensions
) {
  for (const ext of extList) {
    const entry = file + ext
    if (existsSync(entry) === true) {
      return entry
    }
  }
}
