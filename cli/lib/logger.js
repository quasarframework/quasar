// Adapted from Vue CLI v2 "init" command

const { gray, white, red } = require('kolorist')
const format = require('util').format

/**
 * Prefix.
 */

const prefix = '  Quasar CLI'
const sep = gray('·')

/**
 * Log a `message` to the console.
 *
 * @param {String} message
 */

exports.log = function (...args) {
  const msg = format.apply(format, args)
  console.log(white(prefix), sep, msg)
}

/**
 * Log an error `message` to the console and exit.
 *
 * @param {String} message
 */

module.exports.fatal = function (...args) {
  if (args[0] instanceof Error) args[0] = args[0].message.trim()
  const msg = format.apply(format, args)
  console.error(red(prefix), sep, msg)
  process.exit(1)
}

/**
 * Log a success `message` to the console and exit.
 *
 * @param {String} message
 */

module.exports.success = function (...args) {
  const msg = format.apply(format, args)
  console.log(white(prefix), sep, msg)
}
