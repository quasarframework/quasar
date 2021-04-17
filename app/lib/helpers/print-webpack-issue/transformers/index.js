const moduleNotFound = require('./moduleNotFound')
const babelSyntax = require('./babelSyntax')
const esLintError = require('./esLintError')

module.exports = [
  babelSyntax,
  esLintError,
  moduleNotFound
]
