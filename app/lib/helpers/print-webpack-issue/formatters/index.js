const defaultError = require('./defaultError')
const eslintError = require('./eslintError')
const moduleNotFound = require('./moduleNotFound')

module.exports = [
  defaultError,
  eslintError,
  moduleNotFound
]
