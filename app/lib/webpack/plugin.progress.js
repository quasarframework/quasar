const { ProgressPlugin } = require('webpack')
const throttle = require('lodash.throttle')
const chalk = require('chalk')
const logUpdate = require('log-update')

const compilations = []
const logLine = logUpdate.create(process.stdout, { showCursor: true })

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
  return compilations.find(c => c.running) !== void 0
}

function printState () {
  const prefixLen = compilations.length - 1

  const lines = compilations.map((state, index) => {
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

module.exports = class WebpackProgressPlugin extends ProgressPlugin {
  constructor (opts = {}) {
    super({
      handler: (percent, msg, ...details) => {
        this.updateProgress(percent, msg, details)
      }
    })

    this.opts = opts

    const len = opts.name.length

    if (len > maxLengthName) {
      maxLengthName = len
    }

    this.state = {
      name: opts.name,
      progress: 0,
      running: false
    }

    compilations.push(this.state)
  }

  apply (compiler) {
    super.apply(compiler)

    compiler.hooks.watchClose.tap('QuasarProgressPlugin', () => {
      const index = compilations.indexOf(this.state)
      compilations.splice(index, 1)

      render.cancel()
      logLine.done()

      this.destroyed = true
    })
  }

  updateProgress (percent, msg, details) {
    // it may still be called even after compilation was closed
    // due to Webpack's delayed call of handler
    if (this.destroyed === true) { return }

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
    }
    else if (wasRunning && !running) {
      const diff = +new Date() - this.state.startTime
      this.state.doneStamp = `done in ${diff} ms`
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
