// Adapted from Vue CLI v2 "init" command

import { gray, white, red } from 'kolorist'
import { format } from 'node:util'

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

export function log (...args) {
  const msg = format.apply(format, args)
  console.log(white(prefix), sep, msg)
}

/**
 * Log an error `message` to the console and exit.
 *
 * @param {String} message
 */

export function fatal (...args) {
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

export function success (...args) {
  const msg = format.apply(format, args)
  console.log(white(prefix), sep, msg)
}
