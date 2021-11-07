
const moduleNotFound = require('../formatters/moduleNotFound')

module.exports = function transform (error) {
  return (
    error.__formatter === void 0
    && error.name === 'ModuleNotFoundError'
    && error.message.indexOf('Module not found') === 0
  )
    ? {
        ...error,
        __severity: 900,
        __formatter: moduleNotFound
      }
    : error
}
