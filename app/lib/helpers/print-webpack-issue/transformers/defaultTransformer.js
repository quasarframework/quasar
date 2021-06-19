
const defaultError = require('../formatters/defaultError')

module.exports = function transform (error) {
  return error.__formatter === void 0
    ? {
        ...error,
        __severity: 0,
        __formatter: defaultError
      }
    : error
}
