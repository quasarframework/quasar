const {
  bgGreen, green,
  inverse,
  bgRed, red,
  bgYellow, yellow
} = require('chalk')

const readline = require('readline')

const greenPill = msg => bgGreen.black('', msg, '')
const inversePill = msg => inverse('', msg, '')
const redPill = msg => bgRed.black('', msg, '')
const yellowPill = msg => bgYellow.black('', msg, '')

module.exports.clearConsole = process.stdout.isTTY
  ? () => {
      // Fill screen with blank lines. Then move to 0 (beginning of visible part) and clear it
      const blank = '\n'.repeat(process.stdout.rows)
      console.log(blank)
      readline.cursorTo(process.stdout, 0, 0)
      readline.clearScreenDown(process.stdout)
    }
  : () => {}

module.exports.greenPill = greenPill
module.exports.success = function (msg, title = 'SUCCESS') {
  console.log(`\n ${greenPill(title)} ${green(msg)}\n`)
}

module.exports.inversePill = inversePill
module.exports.info = function (msg, title = 'INFO') {
  console.log(`\n ${inversePill(title)} ${msg}\n`)
}

module.exports.redPill = redPill
module.exports.error = function (msg, title = 'ERROR') {
  console.log(`\n ${redPill(title)} ${red(msg)}\n`)
}

module.exports.yellowPill = yellowPill
module.exports.warning = function (msg, title = 'WARNING') {
  console.log(`\n ${yellowPill(title)} ${yellow(msg)}\n`)
}
