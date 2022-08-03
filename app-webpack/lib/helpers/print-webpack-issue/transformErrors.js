/**
 * Initially forked from friendly-errors-webpack-plugin 2.0.0-beta.2
 */

const extractError = require('./extractWebpackError')
const transformersList = require('./transformers')

module.exports = function transformErrors (errors) {
  const transform = (error, transformer) => transformer(error)
  const applyTransformations = error => transformersList.reduce(transform, error)

  return errors.map(extractError).map(applyTransformations)
}
