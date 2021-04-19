const babelSyntax = require('./babelSyntax')
const moduleNotFound = require('./moduleNotFound')
const esLintError = require('./esLintError')
const defaultTransformer = require('./defaultTransformer')

module.exports = [
  babelSyntax,
  moduleNotFound,
  esLintError,
  defaultTransformer
]
