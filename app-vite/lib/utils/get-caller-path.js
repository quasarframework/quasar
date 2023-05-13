const path = require('node:path')

module.exports.getCallerPath = function getCallerPath () {
  const _prepareStackTrace = Error.prepareStackTrace
  Error.prepareStackTrace = (_, stack) => stack
  const stack = new Error().stack.slice(1)
  Error.prepareStackTrace = _prepareStackTrace
  return path.dirname(stack[ 1 ].getFileName())
}
