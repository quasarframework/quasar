const chalk = require('chalk')

module.exports = function logger (banner, color = 'green') {
  return function (msg) {
    console.log(
      msg ? ` ${chalk[color](banner)} ${msg}` : ''
    )
  }
}

module.exports.warn = function warn (msg) {
  if (msg) {
    console.error(chalk.red(` ⚠️  ${msg}\n`))
  }
  else {
    console.log()
  }
}

module.exports.log = function log (msg) {
  console.log(
    msg ? ` ${chalk.green('*')} ${msg}` : ''
  )
}
