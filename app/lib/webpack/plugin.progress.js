const { ProgressPlugin } = require('webpack')
const throttle = require('lodash.throttle')
const chalk = require('chalk')
const logUpdate = require('log-update')

const appPaths = require('../app-paths')
const { success, info, error, warning, clearConsole } = require('../helpers/logger')
const { quasarVersion, cliAppVersion } = require('../helpers/banner')
const isMinimalTerminal = require('../helpers/is-minimal-terminal')
const { printWebpackWarnings, printWebpackErrors } = require('../helpers/print-webpack-issue')

const compilations = []
let maxLengthName = 0

function isRunningGlobally () {
  return compilations.find(c => c.running) !== void 0
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

module.exports = class WebpackProgressPlugin extends ProgressPlugin {
  constructor ({ name, cfg }) {
    const useBars = isMinimalTerminal !== true && cfg.build.showProgress === true

    if (useBars === true) {
      super({
        handler: (percent, msg, ...details) => {
          this.updateBars(percent, msg, details)
        }
      })

      const len = name.length
      if (len > maxLengthName) {
        maxLengthName = len
      }
    }
    else {
      super({ handler: () => {} })
    }

    this.state = {
      name,
      idle: true,
      compiled: false,
      warnings: null,
      errors: null,
      progress: {
        currentValue: 0,
        running: false
      }
    }

    compilations.push(this.state)

    this.opts = {
      useBars,
      dev: cfg.ctx.dev === true,
      readyBanner: cfg.ctx.dev === true && getReadyBanner(cfg)
    }
  }

  apply (compiler) {
    if (this.opts.useBars) {
      super.apply(compiler)
    }

    compiler.hooks.watchClose.tap('QuasarProgressPlugin', () => {
      this.destroyed = true

      const index = compilations.indexOf(this.state)
      compilations.splice(index, 1)

      if (this.opts.useBars === true) {
        renderBars.cancel()
        logLine.done()

        maxLengthName = compilations.reduce(
          (acc, entry) => entry.name.length > acc ? entry.name.length : acc,
          0
        )
      }
    })

    compiler.hooks.initialize.tap('QuasarStatusPlugin', () => {
      this.state.idle = false
      this.resetStats()
      if (this.opts.useBars === false) {
        info(`Compiling of "${this.state.name}" in progress...`, 'WAIT')
      }
    })

    compiler.hooks.invalid.tap('QuasarStatusPlugin', () => {
      this.state.idle = false
      this.resetStats()
      if (this.opts.useBars === false) {
        info(`"${this.state.name}" is being recompiled...`, 'WAIT')
      }
    })

    compiler.hooks.done.tap('QuasarStatusPlugin', stats => {
      this.state.idle = true
      this.resetStats()

      if (stats.hasErrors()) {
        this.state.errors = stats
      }
      else if (stats.hasWarnings()) {
        this.state.warnings = stats
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

      if (compilations.every(entry => entry.idle === true)) {
        const entriesWithErrors = compilations.filter(entry => entry.errors !== null)
        if (entriesWithErrors.length > 0) {
          setTimeout(() => {
            clearConsole()
            entriesWithErrors.forEach(entry => { printWebpackErrors(entry.name, entry.errors) })
            console.log()
            error('Please check the log above for details.', 'COMPILATION FAILED')
          })
          return
        }

        this.state.compiled = true

        if (this.opts.dev === true && compilations.every(entry => entry.compiled === true)) {
          setTimeout(() => {
            const webpackCompilations = compilations.map(c => `"${c.name}"`).join(', ')

            clearConsole()
            success(`Compiled: ${webpackCompilations}`, 'READY')

            if (this.opts.readyBanner !== false) {
              console.log(this.opts.readyBanner)
            }
          })
        }

        const entriesWithWarnings = compilations.filter(entry => entry.warnings !== null)
        if (entriesWithWarnings.length > 0) {
          setTimeout(() => {
            entriesWithWarnings.forEach(entry => { printWebpackWarnings(entry.name, entry.warnings) })
            warning('Compilation succeeded but there are warning(s). Please check the log above.\n')
          })
        }
      }
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
    else if (compilations.every(entry => entry.idle === true)) {
      renderBars.cancel()
      printBars()
      logLine.done()
    }
  }
}
