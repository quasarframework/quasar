
const stringError = require('../formatters/stringError')

module.exports = function transform (error) {
  return (
    error.__formatter === void 0
    && typeof error.webpackError === 'string'
  )
    ? {
        ...error,
        __severity: 1100,
        __formatter: stringError
      }
    : error
}
