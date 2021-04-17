
/**
 * Initially forked from friendly-errors-webpack-plugin 2.0.0-beta.2
 */

function isEslintError (e) {
  return e.originalStack.some(
    stackframe => stackframe.fileName && stackframe.fileName.indexOf('eslint-loader') > 0
  )
}

module.exports = function transform (error) {
  return isEslintError(error) === true
    ? {
        ...error,
        name: 'Lint error',
        type: 'lint-error',
      }
    : error
}
