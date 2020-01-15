const ms = require('ms')
const chalk = require('chalk')

let prevTime

module.exports = function (banner, color = 'green') {
  return function (msg) {
    const curr = Date.now()
    const diff = curr - (prevTime || curr)

    prevTime = curr

    console.log(
      msg
        ? ` ${chalk[color](banner)} ${msg} ${chalk.gray(`+${ms(diff)}`)}`
        : ''
    )
  }
}
