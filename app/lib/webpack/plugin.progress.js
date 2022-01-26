const { ProgressPlugin } = require('webpack')
const throttle = require('lodash.throttle')
const chalk = require('chalk')

const appPaths = require('../app-paths')
const { success, info, error, warning, clearConsole } = require('../helpers/logger')
const { quasarVersion, cliAppVersion } = require('../helpers/banner')
const isMinimalTerminal = require('../helpers/is-minimal-terminal')
const { printWebpackWarnings, printWebpackErrors } = require('../helpers/print-webpack-issue')
const progressLog = require('../helpers/progress-log')

let maxLengthName = 0
let isDev = false
let ipList

const compilations = []

function isCompilationIdle () {
  return compilations.every(entry => entry.idle === true)
}

function isExternalProgressIdle () {
  return compilations.every(entry => entry.externalWork === false)
}

function getIPList () {
  // expensive operation, so cache the response
  if (ipList === void 0) {
    const { getIPs } = require('../helpers/net')
    ipList = getIPs().map(ip => ip === '127.0.0.1' ? 'localhost' : ip)
  }

  return ipList
}

function createState (name, hasExternalWork) {
  const state = {
    name,
    idle: true,
    compiled: false,
    warnings: null,
    errors: null,
    startTime: null,
    progress: null,
    progressMessage: '',
    progressDetails: '',
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
  if (progressLog.isActive !== true) {
    return
  }

  const prefixLen = compilations.length - 1

  const lines = compilations.map((state, index) => {
    const prefix = index < prefixLen ? '├──' : '└──'

    const name = chalk.green(state.name.padEnd(maxLengthName))

    const barWidth = Math.floor(state.progress * barProgressFactor)
    const bar = barString
      .map((char, index) => index <= barWidth ? char : ' ')
      .join('')

    const details = state.idle === false
      ? state.progress + '% ' + ([
          state.progressMessage,
          state.progressDetails ? [ state.progressDetails[0], state.progressDetails[1] ].filter(s => s).join(' ') : ''
        ].filter(m => m).join(' '))
      : 'idle'

    return ` ${prefix} ${name} ${bar} ${chalk.grey(details)}\n`
  })

  progressLog(`\n • ${chalk.green.bold('Compiling')}:\n` + lines.join(''))
}

const renderBars = throttle(printBars, 200)

/**
 * Status related
 */

const greenBanner = chalk.green('»')

let readyBanner = false

function printReadyBanner () {
  const webpackCompilations = compilations.map(c => `"${c.name}"`).join(', ')

  clearConsole()
  console.log()
  success(`Compiled: ${webpackCompilations}\n`, 'READY')

  if (readyBanner !== false) {
    console.log(readyBanner)
  }
}

function getReadyBanner (cfg) {
  if (cfg.ctx.mode.bex === true) {
    return [
      ` ${greenBanner} App dir........... ${chalk.green(appPaths.appDir)}`,
      ` ${greenBanner} Dev mode.......... ${chalk.green(cfg.ctx.modeName + (cfg.ctx.mode.ssr && cfg.ctx.mode.pwa ? ' + pwa' : ''))}`,
      ` ${greenBanner} Pkg quasar........ ${chalk.green('v' + quasarVersion)}`,
      ` ${greenBanner} Pkg @quasar/app... ${chalk.green('v' + cliAppVersion)}`,
      ` ${greenBanner} Transpiled JS..... ${cfg.__transpileBanner}`,
      ` --------------------`,
      ` ${greenBanner} Load the dev extension from:`,
      `   · Chrome(ium): ${chalk.green(appPaths.bexDir)}`,
      `   · Firefox:     ${chalk.green(appPaths.resolve.bex('manifest.json'))}`
    ].join('\n') + '\n'
  }

  if (['spa', 'pwa', 'ssr'].includes(cfg.ctx.modeName) === false) {
    return false
  }

  const urlList = cfg.devServer.host === '0.0.0.0'
    ? getIPList().map(ip => chalk.green(cfg.__getUrl(ip))).join(`\n                      `)
    : chalk.green(cfg.build.APP_URL)

  return [
    ` ${greenBanner} App dir........... ${chalk.green(appPaths.appDir)}`,
    ` ${greenBanner} App URL........... ${urlList}`,
    ` ${greenBanner} Dev mode.......... ${chalk.green(cfg.ctx.modeName + (cfg.ctx.mode.ssr && cfg.ctx.mode.pwa ? ' + pwa' : ''))}`,
    ` ${greenBanner} Pkg quasar........ ${chalk.green('v' + quasarVersion)}`,
    ` ${greenBanner} Pkg @quasar/app... ${chalk.green('v' + cliAppVersion)}`,
    ` ${greenBanner} Transpiled JS..... ${cfg.__transpileBanner}`
  ].join('\n') + '\n'
}

function printStatus () {
  if (isDev === true && (isCompilationIdle() === false || isExternalProgressIdle() === false)) {
    return
  }

  const entriesWithErrors = compilations.filter(entry => entry.errors !== null)
  if (entriesWithErrors.length > 0) {
    isDev === true && clearConsole()

    entriesWithErrors.forEach(entry => { printWebpackErrors(entry.name, entry.errors) })
    console.log()
    error('Please check the log above for details.\n', 'COMPILATION FAILED')

    if (isDev === false) {
      process.exit(1)
    }

    return
  }

  if (isDev === true) {
    if (compilations.every(entry => entry.compiled === true)) {
      printReadyBanner()
    }
  }
  else if (isCompilationIdle() === false || isExternalProgressIdle() === false) {
    return
  }

  const entriesWithWarnings = compilations.filter(entry => entry.warnings !== null)
  if (entriesWithWarnings.length > 0) {
    entriesWithWarnings.forEach(entry => { printWebpackWarnings(entry.name, entry.warnings) })
    console.log()
    warning('Compilation succeeded but there are warning(s). Please check the log above.\n')
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
      const index = compilations.indexOf(this.state)
      compilations.splice(index, 1)

      delete this.state

      if (this.opts.useBars === true) {
        if (compilations.length === 0) {
          // ensure progress log is stopped!
          progressLog.stop()
        }

        maxLengthName = compilations.reduce(
          (acc, entry) => entry.name.length > acc ? entry.name.length : acc,
          0
        )
      }
    })

    compiler.hooks.compile.tap('QuasarProgressPlugin', () => {
      if (this.state === void 0) {
        this.state = createState(this.opts.name, this.opts.hasExternalWork)
      }
      else {
        this.resetStats()
      }

      this.state.idle = false

      if (this.opts.hasExternalWork === true) {
        this.state.externalWork = true
      }

      info(`Compiling of "${this.state.name}" in progress...`, 'WAIT')

      if (this.opts.useBars === true) {
        progressLog.start()
      }

      this.state.startTime = +new Date()
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

      if (this.opts.useBars === true && isCompilationIdle() === true) {
        progressLog.stop()
      }

      const diffTime = +new Date() - this.state.startTime

      if (this.state.errors !== null) {
        error(`"${this.state.name}" compiled with errors • ${diffTime}ms`, 'DONE')
      }
      else if (this.state.warnings !== null) {
        warning(`"${this.state.name}" compiled, but with warnings • ${diffTime}ms`, 'DONE')
      }
      else {
        success(`"${this.state.name}" compiled with success • ${diffTime}ms`, 'DONE')
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
    if (this.state === void 0) { return }

    const progress = Math.floor(percent * 100)
    const running = progress < 100

    this.state.progress = progress
    this.state.progressMessage = running && msg ? msg : ''
    this.state.progressDetails = details

    this.opts.useBars === true && renderBars()
  }
}

module.exports.doneExternalWork = function doneExternalWork (webpackName) {
  const state = compilations.find(entry => entry.name === webpackName)
  state.externalWork = false
  printStatus()
}
