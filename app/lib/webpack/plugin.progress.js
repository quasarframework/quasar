const
  { ProgressPlugin } = require('webpack'),
  throttle = require('lodash.throttle'),
  { green, grey } = require('chalk'),
  log = require('../helpers/logger')('app:progress'),
  logUpdate = require('log-update'),
  ms = require('ms')

const
  isMinimalTerminal = require('../helpers/is-minimal-terminal'),
  logLine = isMinimalTerminal
    ? () => {}
    : logUpdate.create(process.stdout, { showCursor: true })

const
  compilations = {},
  barLength = 25,
  barItems = Array.apply(null, { length: barLength })

let maxLengthName = 0

function isRunningGlobally () {
  return Object.values(compilations).find(c => c.running) !== void 0
}

function renderBar (progress, color) {
  const width = progress * (barLength / 100)

  return barItems
    .map((_, index) => index < width ? '█' : ' ')
    .join('')
}

function printState () {
  const lines = Object.values(compilations).map(state => {
    return [
      ' ' + green( state.name.padEnd(maxLengthName) + ' ' + renderBar(state.progress)),
      state.msg,
      `[${state.progress}%]`.padStart(4),
      state.running
        ? grey(state.details
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
    const
      progress = Math.floor(percent * 100),
      wasRunning = this.state.running,
      running = progress < 100

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
