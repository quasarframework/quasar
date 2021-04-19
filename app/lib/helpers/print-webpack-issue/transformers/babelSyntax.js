
const babelError = require('../formatters/babelError')

module.exports = function transform (error) {
  return error.name === 'ModuleBuildError'
    ? {
        ...error,
        __severity: 1000,
        __formatter: babelError
      }
    : error
}
