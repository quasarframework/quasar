
/**
 * Initially forked from friendly-errors-webpack-plugin 2.0.0-beta.2
 */

const { yellow } = require('chalk')
const { concat } = require('../utils')

const infos = [
  'You may use special comments to disable some warnings.',
  'Use ' + yellow('// eslint-disable-next-line') + ' to ignore the next line.',
  'Use ' + yellow('/* eslint-disable */') + ' to ignore all warnings in a file.'
];

function displayError (error) {
  return [ error.message, '' ]
}

module.exports = function format (errors) {
  const lintErrors = errors.filter(e => e.type === 'lint-error')

  if (lintErrors.length > 0) {
    const flatten = (accum, curr) => accum.concat(curr)
    return concat(
      lintErrors
        .map(error => displayError(error))
        .reduce(flatten, []),
      infos
    )
  }

  return []
}
