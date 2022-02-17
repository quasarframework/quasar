const ci = require('ci-info')

const isMinimal = (
  ci.isCI ||
  process.env.NODE_ENV === 'test' ||
  !process.stdout.isTTY
)

module.exports = isMinimal
