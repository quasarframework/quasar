const eslintError = require('../formatters/eslintError.js')

module.exports = function transform (error) {
  return error.__formatter === void 0 && (
    error.name === 'ESLintError'
    || error.originalStack.some(stackframe => stackframe.fileName && stackframe.fileName.indexOf('eslint-loader') > 0)
  )
    ? {
        ...error,
        __severity: 100,
        __formatter: eslintError
      }
    : error
}
