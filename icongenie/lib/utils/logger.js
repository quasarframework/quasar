
import { green, red } from 'kolorist'

const banner = '*'

const logBanner = green(banner)
const warnBanner = red(banner)

export function log (msg) {
  console.log(msg ? ` ${ logBanner } ${ msg }` : '')
}

export function warn (msg) {
  console.warn(msg ? ` ${ warnBanner } ⚠️  ${ msg }\n` : '')
}

export function fatal (msg) {
  console.error(msg ? ` ${ warnBanner } ⚠️  ${ msg }` : '')
  process.exit(1)
}
