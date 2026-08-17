import { green, red } from 'kolorist'
import { isCI } from 'ci-info'

const banner = '*'

const logBanner = green(banner)
const warnBanner = red(banner)

export function log(msg) {
  console.log(msg ? ` ${logBanner} ${msg}` : '')
}

export function warn(msg) {
  console.warn(msg ? ` ${warnBanner} ⚠️  ${msg}\n` : '')
}

export function fatal(msg) {
  console.error(msg ? ` ${warnBanner} ⚠️  ${msg}` : '')
  process.exit(1)
}

/**
 * Alternate Screen
 */

export function enterAlternateScreen(message) {
  // with piped stdio the escapes below would only pollute the log
  if (isCI || process.stdout.isTTY !== true) return

  // Enter Alternate Screen Buffer (hides current terminal history)
  process.stdout.write('\u001B[?1049h')
  // Move cursor to top left
  process.stdout.write('\u001B[H')

  if (message) console.log(`>>> ${message}\n`)
}

export function exitAlternateScreen() {
  if (isCI || process.stdout.isTTY !== true) return
  process.stdout.write('\u001B[?1049l')
}

export function waitForKey() {
  // Are we in a real terminal?
  // If not (e.g., CI pipeline or piped stdio), resolve immediately so the
  // script doesn't hang forever. A non-TTY stdin has no setRawMode() either,
  // so calling it below would throw and mask the error that led us here.
  if (isCI || process.stdin.isTTY !== true) return Promise.resolve()

  const { stdin } = process
  process.stdout.write('Press any key to continue...')

  const { promise, resolve: resolvePromise } = Promise.withResolvers()

  // Enable raw mode to bypass the 'Enter' key requirement
  stdin.setRawMode(true)
  stdin.resume()
  stdin.setEncoding('utf8')

  const handleKey = key => {
    stdin.off('data', handleKey)
    stdin.setRawMode(false)
    stdin.pause()

    // Explicitly handle Ctrl+C
    if (key === '\u0003') {
      console.log('\nProcess cancelled by user (Ctrl+C)\n')
      process.exit(1)
    }

    resolvePromise()
  }

  stdin.on('data', handleKey)
  return promise
}
