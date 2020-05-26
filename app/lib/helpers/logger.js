const chalk = require('chalk')

module.exports = function (banner, color = 'green') {
  return function (msg) {
    console.log(
      msg
        ? ` ${chalk[color](banner.padEnd(20))} ${msg}`
        : ''
    )
  }
}
