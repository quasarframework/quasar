import readline from 'node:readline'
import { isCI } from 'ci-info'
import {
  bgGreen,
  bgRed,
  bgYellow,
  black,
  green,
  inverse,
  red,
  white,
  yellow
} from 'kolorist'

let isSuppressed = false

export function supressLogger() {
  isSuppressed = true
}

export const dot = '•'

/**
 * Pills
 */

export const successPill = msg => bgGreen(black(` ${msg} `))
export const infoPill = msg => inverse(` ${msg} `)
export const errorPill = msg => bgRed(white(` ${msg} `))
export const warningPill = msg => bgYellow(black(` ${msg} `))

/**
 * Main approach - App CLI related
 */

const banner = 'App ' + dot
const greenBanner = green(banner)
const redBanner = red(banner)
const yellowBanner = yellow(banner)
const tipBanner = `${green('App')} ${dot} ${successPill('TIP')} ${dot} 🚀 `

export const clearConsole = process.stdout.isTTY
  ? () => {
      // Fill screen with blank lines. Then move to 0 (beginning of visible part) and clear it
      console.log('\n'.repeat(process.stdout.rows))
      readline.cursorTo(process.stdout, 0, 0)
      readline.clearScreenDown(process.stdout)
    }
  : () => {}

export function tip(msg) {
  if (isSuppressed) return
  console.log(msg ? ` ${tipBanner} ${msg}` : '')
}

export function log(msg, pill) {
  if (isSuppressed) return
  const pillBanner = pill !== void 0 ? green(`${pill} ${dot} `) : ''
  console.log(msg ? ` ${greenBanner} ${pillBanner}${msg}` : '')
}

export function warn(msg, pill) {
  if (isSuppressed) return
  if (msg !== void 0) {
    const pillBanner = pill !== void 0 ? warningPill(pill) + ' ' : ''
    console.warn(` ${yellowBanner} ⚠️  ${pillBanner}${msg}`)
  } else {
    console.warn()
  }
}

export function fatal(msg, pill) {
  // suppression only silences the output;
  // a fatal error must still exit the process
  if (!isSuppressed) {
    if (msg !== void 0) {
      const pillBanner = pill !== void 0 ? errorPill(pill) + ' ' : ''

      console.error(`\n ${redBanner} ⚠️  ${pillBanner}${msg}\n`)
    } else {
      console.error()
    }
  }

  process.exit(1)
}

/**
 * Extended approach - Compilation status & pills
 */

export function success(msg, title = 'SUCCESS') {
  if (isSuppressed) return
  console.log(` ${greenBanner} ${successPill(title)} ${green(dot + ' ' + msg)}`)
}
export function getSuccess(msg, title = 'SUCCESS') {
  return ` ${greenBanner} ${successPill(title)} ${green(dot + ' ' + msg)}`
}

export function info(msg, title = 'INFO') {
  if (isSuppressed) return
  console.log(` ${greenBanner} ${infoPill(title)} ${green(dot)} ${msg}`)
}
export function getInfo(msg, title = 'INFO') {
  return ` ${greenBanner} ${infoPill(title)} ${green(dot)} ${msg}`
}

export function error(msg, title = 'ERROR') {
  if (isSuppressed) return
  console.log(` ${redBanner} ${errorPill(title)} ${red(dot + ' ' + msg)}`)
}
export function getError(msg, title = 'ERROR') {
  return ` ${redBanner} ${errorPill(title)} ${red(dot + ' ' + msg)}`
}

export function warning(msg, title = 'WARNING') {
  if (isSuppressed) return
  console.log(
    ` ${yellowBanner} ${warningPill(title)} ${yellow(dot + ' ' + msg)}`
  )
}
export function getWarning(msg, title = 'WARNING') {
  return ` ${yellowBanner} ${warningPill(title)} ${yellow(dot + ' ' + msg)}`
}

/**
 * Progress related
 */

export function progress({ tool, waitAction, doneAction, target }) {
  const targetBanner = target ? ` ${target}` : ''
  info(`${tool} ${dot} ${waitAction}${targetBanner}...`, 'WAIT')

  const startTime = Date.now()
  return opts => {
    const diffTime = Date.now() - startTime
    success(
      `${tool} ${dot} ${opts?.doneAction ?? doneAction}${opts?.target ?? targetBanner} ${dot} ${diffTime}ms`,
      'DONE'
    )
  }
}

/**
 * Prompts
 */

let promptSession = null

export async function createPromptSession(message) {
  if (promptSession !== null) {
    return {
      ...promptSession,
      end() {}
    }
  }

  const {
    intro,
    outro,
    isCancel,
    cancel,
    confirm,
    select,
    text,
    taskLog,
    note,
    log: promptsLog
  } = await import('@clack/prompts')

  log()
  intro(message)

  promptSession = {
    intro,
    outro,
    cancel,
    confirm,
    select,
    text,
    taskLog,
    log: promptsLog,
    note,

    async prompt(questions) {
      const scope = {}
      for (const key in questions) {
        const question = questions[key]
        const answer = await question()
        if (isCancel(answer)) {
          cancel('Operation cancelled.')
          process.exit(1)
        }

        scope[key] = answer
      }
      return scope
    },

    end(endMessage = 'Done!') {
      outro(endMessage)
      promptSession = null
    }
  }

  return promptSession
}

// returns a Promise!
export function taskLogger(message) {
  if (promptSession !== null) {
    return promptSession.taskLog({ title: message })
  }

  log(message)

  return Promise.resolve({
    log,
    success() {},
    error(msg) {
      warn()
      warn(msg)
    }
  })
}

export function cancelPromptSession(message) {
  promptSession?.cancel(message)
}

/**
 * Alternate Screen
 */

export function enterAlternateScreen(message) {
  if (isCI) return

  // Enter Alternate Screen Buffer (hides current terminal history)
  process.stdout.write('\u001B[?1049h')
  // Move cursor to top left
  process.stdout.write('\u001B[H')

  if (message) console.log(`>>> ${message}\n`)
}

export function exitAlternateScreen() {
  if (isCI) return
  process.stdout.write('\u001B[?1049l')
}

export function waitForKey() {
  // Are we in a real terminal?
  // If not (e.g., CI pipeline), resolve immediately so the script doesn't hang forever.
  if (isCI) return Promise.resolve()

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
