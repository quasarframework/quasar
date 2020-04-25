const { ProgressPlugin } = require('webpack')
const throttle = require('lodash.throttle')
const chalk = require('chalk')
const log = require('../helpers/logger')('app:progress')
const logUpdate = require('log-update')
const ms = require('ms')

const isMinimalTerminal = require('../helpers/is-minimal-terminal')
const logLine = isMinimalTerminal
  ? () => {}
  : logUpdate.create(process.stdout, { showCursor: true })

const compilations = {}
const barLength = 20
const barColors = Array.apply(null, { length: barLength })
  .map((_, index) => {
    const p = index / barLength

    return p <= 0.5
      ? chalk.rgb(
          255,
          Math.round(p * 510),
          0
        )
      : chalk.rgb(
        255 - Math.round(p * 122),
        255,
        0
      )
  })

let maxLengthName = 0

function isRunningGlobally () {
  return Object.values(compilations).find(c => c.running) !== void 0
}

function renderBar (progress) {
  const width = progress * (barLength / 100)

  return barColors
    .map((color, index) => index < width ? color('█') : ' ')
    .join('')
}

function printState () {
  const lines = Object.values(compilations).map(state => {
    return [
      ' ' + chalk.green(state.name.padEnd(maxLengthName)) + ' ' + renderBar(state.progress),
      state.msg,
      `[${state.progress}%]`.padStart(4),
      state.running
        ? chalk.grey(state.details
            ? [ state.details[0], state.details[1] ].filter(s => s).join(' ')
            : ''
        )
        : state.doneStamp
    ].filter(m => m).join(' ') + '\n'
  })

  logLine('\n' + lines.join(''))
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
      this.state.doneStamp = `in ~${ms(diff)}`

      if (isMinimalTerminal) {
        log(`Compiled ${this.state.name} ${this.state.doneStamp}`)
      }
    }

    if (!isMinimalTerminal) {
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
}
