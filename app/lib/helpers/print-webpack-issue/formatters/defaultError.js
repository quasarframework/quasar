
/**
 * Initially forked from friendly-errors-webpack-plugin 2.0.0-beta.2
 */

const { concat } = require('../utils')
const { redPill, yellowPill } = require('../../logger')

const pillMap = {
  error: redPill('ERROR'),
  warning: yellowPill('WARNING')
}

function displayError (error, pill) {
  return concat(
    `${pill} ${removeLoaders(error.file)}`,
    '',
    error.message,
    error.origin ? error.origin : null,
    error.infos ? '' : null,
    error.infos ? error.infos : null
  )
}

function removeLoaders (file) {
  if (!file) {
    return ''
  }

  const split = file.split('!')
  const filePath = split[split.length - 1]
  return `in ${filePath}`
}

function isDefaultError (error) {
  return !error.type
}

/**
 * Format errors without a type
 */
module.exports = function format (errors, severity) {
  const pill = pillMap[severity]

  return errors
    .filter(isDefaultError)
    .reduce((accum, error) => (
      accum.concat(displayError(error, pill))
    ), [])
}
