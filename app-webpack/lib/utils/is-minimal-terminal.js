const ci = require('ci-info')

const inMinimalTerminal = (
  ci.isCI
  || process.env.NODE_ENV === 'test'
  || !process.stdout.isTTY
)

module.exports.inMinimalTerminal = inMinimalTerminal
