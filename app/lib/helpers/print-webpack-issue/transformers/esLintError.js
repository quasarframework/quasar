
const eslintError = require('../formatters/eslintError')

module.exports = function transform (error) {
  return error.name === 'ESLintError'
    ? {
        ...error,
        __severity: 100,
        __formatter: eslintError
      }
    : error
}
