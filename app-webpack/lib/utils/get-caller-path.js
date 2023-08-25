const { dirname } = require('node:path')
const { fileURLToPath } = require('node:url')

module.exports.getCallerPath = function getCallerPath () {
  const _prepareStackTrace = Error.prepareStackTrace
  Error.prepareStackTrace = (_, stack) => stack
  const stack = new Error().stack.slice(1)
  Error.prepareStackTrace = _prepareStackTrace
  const filename = stack[ 1 ].getFileName()
  return dirname(
    filename.startsWith('file://')
      ? fileURLToPath(filename)
      : filename
  )
}
