const
  ms = require('ms'),
  chalk = require('chalk')

let prevTime

module.exports = function (banner, color = 'green') {
  return function (msg) {
    const
      curr = +new Date(),
      diff = curr - (prevTime || curr)

    prevTime = curr

    console.log(
      msg
        ? ` ${chalk[color](banner)} ${msg} ${chalk.gray(`+${ms(diff)}`)}`
        : ''
    )
  }
}
