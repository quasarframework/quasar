/**
 * Initially forked from friendly-errors-webpack-plugin 2.0.0-beta.2
 */

const { warn } = require('../logger')
const { uniqueBy } = require('./utils')
const formatErrors = require('./formatErrors')
const transformErrors = require('./transformErrors')

function extract (stats, severity) {
  if (stats.stats !== void 0) {
    const errors = stats.stats
      .reduce((errors, stats) => errors.concat(extract(stats, severity)), [])

    // Dedupe to avoid showing the same error many times when multiple
    // compilers depend on the same module.
    return uniqueBy(errors, error => error.message)
  }

  const type = severity + 's'

  const findErrorsRecursive = compilation => {
    const errors = compilation[type]
    if (errors.length === 0 && compilation.children) {
      for (const child of compilation.children) {
        errors.push(...findErrorsRecursive(child))
      }
    }

    return uniqueBy(errors, error => error.message)
  }

  return findErrorsRecursive(stats.compilation)
}

function getMaxSeverityErrors (errors) {
  const maxSeverity = errors.reduce(
    (res, curr) => (curr.severity > res ? curr.severity : res),
    0
  )

  return errors.filter(e => e.severity === maxSeverity)
}

function display (stats, severity) {
  const errors = extract(stats, severity)

  const errorsBag = transformErrors(errors)
  const topErrors = getMaxSeverityErrors(errorsBag)
  const summary = `${topErrors.length} ${severity}${topErrors.length > 1 ? 's' : ''}`

  warn()

  if (severity === 'error') {
    warn(`Failed to compile with ${summary}:\n`, 'FAIL')
  }
  else {
    warn(`Compiled with ${summary}:\n`)
  }

  formatErrors(topErrors, severity).forEach(entry => {
    console.log(entry)
  })

  warn()

  return summary
}

module.exports.printWebpackWarnings = function printWebpackWarnings (stats) {
  return display(stats, 'warning')
}

module.exports.printWebpackErrors = function printWebpackErrors (stats) {
  return display(stats, 'error')
}
