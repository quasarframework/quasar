/**
 * Initially forked from friendly-errors-webpack-plugin 2.0.0-beta.2
 */

const formattersList = require('./formatters')

/**
 * Applies formatters to all AnnotatedErrors.
 *
 * A formatter has the following signature: FormattedError => Array<String>.
 * It takes a formatted error produced by a transformer and returns a list
 * of log statements to print.
 *
 */
module.exports = function formatErrors (errors, errorType) {
  const format = formatter => (formatter(errors, errorType) || [])
  const flatten = (accum, curr) => accum.concat(curr)

  return formattersList.map(format).reduce(flatten, [])
}
