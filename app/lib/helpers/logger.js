const { green, red, bgRed, bgYellow } = require('chalk')

const banner = 'App ·'

const logBanner = green(banner)
const warnBanner = red(banner)

module.exports.log = function (msg) {
  console.log(msg ? ` ${logBanner} ${msg}` : '')
}

module.exports.warn = function (msg, pill) {
  if (msg !== void 0) {
    const pillBanner = pill !== void 0
      ? bgYellow.black('', pill, '') + ' '
      : ''

    console.warn(` ${warnBanner} ⚠️  ${pillBanner}${msg}`)
  }
  else {
    console.warn()
  }
}

module.exports.fatal = function (msg, pill) {
  if (msg !== void 0) {
    const pillBanner = pill !== void 0
      ? bgRed.black('', pill, '') + ' '
      : ''

    console.error(` ${warnBanner} ⚠️  ${pillBanner}${msg}`)
  }
  else {
    console.error()
  }

  process.exit(1)
}
