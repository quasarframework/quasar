const { ProgressPlugin } = require('webpack')
const throttle = require('lodash.throttle')
const chalk = require('chalk')
const logUpdate = require('log-update')

const appPaths = require('../app-paths')
const { success, info, error, warning, clearConsole } = require('../helpers/logger')
const { quasarVersion, cliAppVersion } = require('../helpers/banner')
const isMinimalTerminal = require('../helpers/is-minimal-terminal')
const { printWebpackWarnings, printWebpackErrors } = require('../helpers/print-webpack-issue')

let maxLengthName = 0
let isDev = false

const compilations = []

function isCompilationIdle () {
  return compilations.every(entry => entry.idle === true)
}

function isExternalProgressIdle () {
  return compilations.every(entry => entry.externalWork === false)
}

function createState (name, hasExternalWork) {
  const state = {
    name,
    idle: true,
    compiled: false,
    warnings: null,
    errors: null,
    progress: {
      currentValue: 0,
      running: false
    },
    externalWork: hasExternalWork === true
  }

  const len = name.length
  if (len > maxLengthName) {
    maxLengthName = len
  }

  compilations.push(state)
  return state
}

/**
 * Progress bar related
 */

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

function printBars () {
  const prefixLen = compilations.length - 1

  const lines = compilations.map((state, index) => {
    const progress = state.progress
    const prefix = index < prefixLen ? '├──' : '└──'

    const name = chalk.green(state.name.padEnd(maxLengthName))

    const barWidth = Math.floor(progress.currentValue * barProgressFactor)
    const bar = barString
      .map((char, index) => index <= barWidth ? char : ' ')
      .join('')

    const details = [
      progress.msg,
      progress.running
        ? (progress.details ? [ progress.details[0], progress.details[1] ].filter(s => s).join(' ') : '')
        : progress.doneStamp
    ].filter(m => m).join(' ')

    return ` ${prefix} ${name} ${bar} ${progress.currentValue + '%'} ${chalk.grey(details)}\n`
  })

  logLine(`\n • ${chalk.green.bold('Compiling')}:\n` + lines.join(''))
}

const renderBars = throttle(printBars, 200)

/**
 * Status related
 */

const greenTop = chalk.green('┌─')
const greenMid = chalk.green('├─')
const greenBot = chalk.green('└─')

let readyBanner = false

function printReadyBanner () {
  const webpackCompilations = compilations.map(c => `"${c.name}"`).join(', ')

  clearConsole()
  success(`Compiled: ${webpackCompilations}`, 'READY')

  if (readyBanner !== false) {
    console.log(readyBanner)
  }
}

function getReadyBanner (cfg) {
  if (['spa', 'pwa', 'ssr'].includes(cfg.ctx.modeName) === false) {
    return false
  }

  return [
    ` ${greenTop} App dir........... ${chalk.green(appPaths.appDir)}`,
    ` ${greenMid} App URL........... ${chalk.green(cfg.build.APP_URL)}`,
    ` ${greenMid} Dev mode.......... ${chalk.green(cfg.ctx.modeName + (cfg.ctx.mode.ssr && cfg.ctx.mode.pwa ? ' + pwa' : ''))}`,
    ` ${greenMid} Pkg quasar........ ${chalk.green('v' + quasarVersion)}`,
    ` ${greenMid} Pkg @quasar/app... ${chalk.green('v' + cliAppVersion)}`,
    ` ${greenBot} Transpiled JS..... ${cfg.__transpileBanner}`
  ].join('\n') + '\n'
}

function printStatus () {
  if (isDev === true && (isCompilationIdle() === false || isExternalProgressIdle() === false)) {
    return
  }

  const entriesWithErrors = compilations.filter(entry => entry.errors !== null)
  if (entriesWithErrors.length > 0) {
    setTimeout(() => {
      isDev === true && clearConsole()

      entriesWithErrors.forEach(entry => { printWebpackErrors(entry.name, entry.errors) })
      console.log()
      error('Please check the log above for details.', 'COMPILATION FAILED')

      if (isDev === false) {
        process.exit(1)
      }
    })

    return
  }

  if (isDev === true) {
    if (compilations.every(entry => entry.compiled === true)) {
      setTimeout(printReadyBanner)
    }
  }
  else if (isCompilationIdle() === false || isExternalProgressIdle() === false) {
    return
  }

  const entriesWithWarnings = compilations.filter(entry => entry.warnings !== null)
  if (entriesWithWarnings.length > 0) {
    setTimeout(() => {
      entriesWithWarnings.forEach(entry => { printWebpackWarnings(entry.name, entry.warnings) })
      warning('Compilation succeeded but there are warning(s). Please check the log above.\n')
    })
  }
}

module.exports = class WebpackProgressPlugin extends ProgressPlugin {
  constructor ({ name, cfg, hasExternalWork }) {
    const useBars = isMinimalTerminal !== true && cfg.build.showProgress === true

    if (useBars === true) {
      super({
        handler: (percent, msg, ...details) => {
          this.updateBars(percent, msg, details)
        }
      })
    }
    else {
      super({ handler: () => {} })
    }

    this.state = createState(name, hasExternalWork)

    this.opts = {
      name,
      useBars,
      hasExternalWork
    }

    isDev = cfg.ctx.dev === true
    readyBanner = cfg.ctx.dev === true && getReadyBanner(cfg)
  }

  apply (compiler) {
    if (this.opts.useBars) {
      super.apply(compiler)
    }

    compiler.hooks.watchClose.tap('QuasarProgressPlugin', () => {
      this.destroyed = true

      const index = compilations.indexOf(this.state)
      compilations.splice(index, 1)

      delete this.state

      if (this.opts.useBars === true) {
        renderBars.cancel()
        logLine.done()

        maxLengthName = compilations.reduce(
          (acc, entry) => entry.name.length > acc ? entry.name.length : acc,
          0
        )
      }
    })

    compiler.hooks.compile.tap('QuasarProgressPlugin', () => {
      if (this.destroyed === true) {
        this.state = createState(this.opts.name, this.opts.hasExternalWork)
      }
      else {
        this.resetStats()
      }

      this.state.idle = false
      if (this.opts.hasExternalWork === true) {
        this.state.externalWork = true
      }
      if (this.opts.useBars === false) {
        info(`Compiling of "${this.state.name}" in progress...`, 'WAIT')
      }
    })

    compiler.hooks.done.tap('QuasarStatusPlugin', stats => {
      this.state.idle = true
      this.resetStats()

      if (stats.hasErrors()) {
        this.state.errors = stats

        if (this.opts.hasExternalWork === true) {
          this.state.externalWork = false
        }
      }
      else {
        this.state.compiled = true
        if (stats.hasWarnings()) {
          this.state.warnings = stats
        }
      }

      if (this.opts.useBars === false) {
        if (this.state.errors !== null) {
          error(`"${this.state.name}" compiled with errors`, 'DONE')
        }
        else if (this.state.warnings !== null) {
          warning(`"${this.state.name}" compiled, but with warnings`, 'DONE')
        }
        else {
          success(`"${this.state.name}" compiled with success`, 'DONE')
        }
      }

      printStatus()
    })
  }

  resetStats () {
    this.state.errors = null
    this.state.warnings = null
  }

  updateBars (percent, msg, details) {
    // it may still be called even after compilation was closed
    // due to Webpack's delayed call of handler
    if (this.destroyed === true) { return }

    const progress = Math.floor(percent * 100)
    const wasRunning = this.state.progress.running
    const running = progress < 100

    Object.assign(this.state.progress, {
      currentValue: progress,
      msg: running && msg ? msg : '',
      details,
      running
    })

    if (!wasRunning && running) {
      this.state.progress.startTime = +new Date()
    }
    else if (wasRunning && !running) {
      const diff = +new Date() - this.state.progress.startTime
      this.state.progress.doneStamp = `done in ${diff} ms`
    }

    if (running) {
      renderBars()
    }
    else if (isCompilationIdle()) {
      renderBars.cancel()
      printBars()
      logLine.done()
    }
  }
}

module.exports.doneExternalWork = function doneExternalWork (webpackName) {
  const state = compilations.find(entry => entry.name === webpackName)
  state.externalWork = false
  setTimeout(printStatus)
}
