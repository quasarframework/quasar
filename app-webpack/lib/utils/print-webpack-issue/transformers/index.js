const babelSyntax = require('./babelSyntax.js')
const moduleNotFound = require('./moduleNotFound.js')
const esLintError = require('./esLintError.js')
const stringError = require('./stringError.js')
const defaultTransformer = require('./defaultTransformer.js')

module.exports = [
  babelSyntax,
  moduleNotFound,
  esLintError,
  stringError,
  defaultTransformer
]
