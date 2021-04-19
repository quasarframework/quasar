const { green } = require('chalk')

const appPaths = require('../app-paths')
const { success, info, error, warning, clearConsole } = require('../helpers/logger')
const { quasarVersion, cliAppVersion } = require('../helpers/banner')
const isMinimalTerminal = require('../helpers/is-minimal-terminal')
const { printWebpackWarnings, printWebpackErrors } = require('../helpers/print-webpack-issue')

const compilations = []

const greenTop = green('┌─')
const greenMid = green('├─')
const greenBot = green('└─')

function getBanner (cfg) {
  if (['spa', 'pwa', 'ssr'].includes(cfg.ctx.modeName) === false) {
    return null
  }

  return [
    ` ${greenTop} App dir........... ${green(appPaths.appDir)}`,
    ` ${greenMid} App URL........... ${green(cfg.build.APP_URL)}`,
    ` ${greenMid} Dev mode.......... ${green(cfg.ctx.modeName + (cfg.ctx.mode.ssr && cfg.ctx.mode.pwa ? ' + pwa' : ''))}`,
    ` ${greenMid} Pkg quasar........ ${green('v' + quasarVersion)}`,
    ` ${greenMid} Pkg @quasar/app... ${green('v' + cliAppVersion)}`,
    ` ${greenBot} Transpiled JS..... ${cfg.__transpileBanner}`
  ].join('\n') + '\n'
}

module.exports.WebpackStatusPlugin = class WebpackStatusPlugin {
  constructor ({ name, cfg }) {
    const hasProgressPlugin = isMinimalTerminal || cfg.build.showProgress !== true

    this.opts = {
      name,
      banner: getBanner(cfg),
      initHook: hasProgressPlugin === true,
      recompileHook: hasProgressPlugin === true && cfg.ctx.dev === true,
      readyHook: cfg.ctx.dev === true
    }

    this.state = {
      name,
      idle: true,
      compiled: false,
      warnings: null,
      errors: null
    }

    compilations.push(this.state)
  }

  resetStats () {
    this.state.errors = null
    this.state.warnings = null
  }

  apply (compiler) {
    this.opts.initHook && compiler.hooks.initialize.tap('QuasarStatusPlugin', () => {
      this.state.idle = false
      this.resetStats()
      info(`Compiling of "${this.opts.name}" in progress...`, 'WAIT')
    })

    this.opts.recompileHook && compiler.hooks.invalid.tap('QuasarStatusPlugin', () => {
      this.state.idle = false
      this.resetStats()
      info(`"${this.opts.name}" is being recompiled...`, 'WAIT')
    })

    this.opts.readyHook && compiler.hooks.done.tap('QuasarStatusPlugin', stats => {
      this.state.idle = true
      this.resetStats()

      if (stats.hasErrors()) {
        this.state.errors = stats
      }
      else if (stats.hasWarnings()) {
        this.state.warnings = stats
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

        if (compilations.every(entry => entry.compiled === true)) {
          setTimeout(() => {
            const webpackCompilations = compilations.map(c => `"${c.name}"`).join(', ')

            clearConsole()
            success(`Compiled: ${webpackCompilations}`, 'READY')

            if (this.opts.banner !== null) {
              console.log(this.opts.banner)
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

    compiler.hooks.watchClose.tap('QuasarStatusPlugin', () => {
      const index = compilations.indexOf(this.state)
      compilations.splice(index, 1)
    })
  }
}
