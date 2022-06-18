const {
  bgGreen, green,
  inverse,
  bgRed, red,
  bgYellow, yellow
} = require('chalk')

const readline = require('readline')

/**
 * Main approach - App CLI related
 */

const dot = '•'
const banner = 'App ' + dot
const greenBanner = green(banner)
const redBanner = red(banner)
const yellowBanner = yellow(banner)

module.exports.clearConsole = process.stdout.isTTY
  ? () => {
      // Fill screen with blank lines. Then move to 0 (beginning of visible part) and clear it
      const blank = '\n'.repeat(process.stdout.rows)
      console.log(blank)
      readline.cursorTo(process.stdout, 0, 0)
      readline.clearScreenDown(process.stdout)
    }
  : () => {}

module.exports.log = function (msg) {
  console.log(msg ? ` ${greenBanner} ${msg}` : '')
}

module.exports.warn = function (msg, pill) {
  if (msg !== void 0) {
    const pillBanner = pill !== void 0
      ? bgYellow.black('', pill, '') + ' '
      : ''

    console.warn(` ${yellowBanner} ⚠️  ${pillBanner}${msg}`)
  }
  else {
    console.warn()
  }
}

module.exports.fatal = function (msg, pill) {
  if (msg !== void 0) {
    const pillBanner = pill !== void 0
      ? errorPill(pill) + ' '
      : ''

    console.error(`\n ${redBanner} ⚠️  ${pillBanner}${msg}\n`)
  }
  else {
    console.error()
  }

  process.exit(1)
}

/**
 * Extended approach - Compilation status & pills
 */

const successPill = msg => bgGreen.black('', msg, '')
const infoPill = msg => inverse('', msg, '')
const errorPill = msg => bgRed.white('', msg, '')
const warningPill = msg => bgYellow.black('', msg, '')

module.exports.successPill = successPill
module.exports.success = function (msg, title = 'SUCCESS') {
  console.log(` ${greenBanner} ${successPill(title)} ${green(dot + ' ' + msg)}`)
}
module.exports.getSuccess = function (msg, title) {
  return ` ${greenBanner} ${successPill(title)} ${green(dot + ' ' + msg)}`
}

module.exports.infoPill = infoPill
module.exports.info = function (msg, title = 'INFO') {
  console.log(` ${greenBanner} ${infoPill(title)} ${green(dot)} ${msg}`)
}
module.exports.getInfo = function (msg, title) {
  return ` ${greenBanner} ${infoPill(title)} ${green(dot)} ${msg}`
}

module.exports.errorPill = errorPill
module.exports.error = function (msg, title = 'ERROR') {
  console.log(` ${redBanner} ${errorPill(title)} ${red(dot + ' ' + msg)}`)
}
module.exports.getError = function (msg, title = 'ERROR') {
  return ` ${redBanner} ${errorPill(title)} ${red(dot + ' ' + msg)}`
}

module.exports.warningPill = warningPill
module.exports.warning = function (msg, title = 'WARNING') {
  console.log(` ${yellowBanner} ${warningPill(title)} ${yellow(dot + ' ' + msg)}`)
}
module.exports.getWarning = function (msg, title = 'WARNING') {
  return ` ${yellowBanner} ${warningPill(title)} ${yellow(dot + ' ' + msg)}`
}
