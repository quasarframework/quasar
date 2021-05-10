const { green, red } = require('chalk')

const banner = '*'

const logBanner = green(banner)
const warnBanner = red(banner)

module.exports.log = function (msg) {
  console.log(msg ? ` ${logBanner} ${msg}` : '')
}

module.exports.warn = function (msg) {
  console.warn(msg ? ` ${warnBanner} ⚠️  ${msg}\n` : '')
}

module.exports.fatal = function (msg) {
  console.error(msg ? ` ${warnBanner} ⚠️  ${msg}` : '')
  process.exit(1)
}
