const { ProgressPlugin } = require('webpack')
const throttle = require('lodash.throttle')
const chalk = require('chalk')
const { log } = require('../helpers/logger')
const logUpdate = require('log-update')

const isMinimalTerminal = require('../helpers/is-minimal-terminal')
const logLine = isMinimalTerminal
  ? () => {}
  : logUpdate.create(process.stdout, { showCursor: true })

const compilations = {}

const barLength = 20
const barProgressFactor = barLength / 100
const barString = Array.apply(null, { length: barLength })
  .map((_, index) => {
    const p = index / barLength
    const color = p <= 0.5
      ? chalk.rgb(255, Math.round(p * 510), 0)
      : chalk.rgb(255 - Math.round(p * 122), 255, 0)

    return color('█')
  })

let maxLengthName = 0

function isRunningGlobally () {
  return Object.values(compilations).find(c => c.running) !== void 0
}

function printState () {
  const threads = Object.values(compilations)
  const prefixLen = threads.length - 1

  const lines = threads.map((state, index) => {
    const prefix = index < prefixLen ? '├──' : '└──'

    const name = chalk.green(state.name.padEnd(maxLengthName))

    const barWidth = Math.floor(state.progress * barProgressFactor)
    const bar = barString
      .map((char, index) => index <= barWidth ? char : ' ')
      .join('')

    const progress = state.progress + '%'

    const details = [
      state.msg,
      state.running
        ? (state.details ? [ state.details[0], state.details[1] ].filter(s => s).join(' ') : '')
        : state.doneStamp
    ].filter(m => m).join(' ')

    return ` ${prefix} ${name} ${bar} ${progress} ${chalk.grey(details)}\n`
  })

  logLine(`\n • ${chalk.bold(chalk.green('Compiling'))}:\n` + lines.join(''))
}

const render = throttle(printState, 200)

module.exports = class WebpackProgress extends ProgressPlugin {
  constructor (opts = {}) {
    super({
      handler: (percent, msg, ...details) => {
        this.updateProgress(percent, msg, details)
      }
    })

    this.opts = opts

    if (this.state) { return }

    const len = opts.name.length

    if (len > maxLengthName) {
      maxLengthName = len
    }

    compilations[opts.name] = {
      name: opts.name,
      progress: 0,
      running: false
    }
  }

  get state () {
    return compilations[this.opts.name]
  }

  updateProgress (percent, msg, details) {
    const progress = Math.floor(percent * 100)
    const wasRunning = this.state.running
    const running = progress < 100

    Object.assign(this.state, {
      progress,
      msg: running && msg ? msg : '',
      details,
      running
    })

    if (!wasRunning && running) {
      this.state.startTime = +new Date()

      if (isMinimalTerminal) {
        log(`Compiling ${this.state.name}...`)
      }
    }
    else if (wasRunning && !running) {
      const diff = +new Date() - this.state.startTime
      this.state.doneStamp = `done in ${diff} ms`

      if (isMinimalTerminal) {
        log(`Compiled ${this.state.name} ${this.state.doneStamp}`)
      }
    }

    if (isMinimalTerminal) {
      return
    }

    if (running && isRunningGlobally()) {
      render()
    }
    else {
      render.cancel()
      printState()
      logLine.done()
    }
  }
}
