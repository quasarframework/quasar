const ci = require('ci-info')

module.exports.isMinimalTerminal = (
  ci.isCI
  || process.env.NODE_ENV === 'test'
  || !process.stdout.isTTY
)
