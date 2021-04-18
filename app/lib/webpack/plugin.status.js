const { green } = require('chalk')

const appPaths = require('../app-paths')
const { success, info, error, warning, clearConsole } = require('../helpers/logger')
const { quasarVersion, cliAppVersion } = require('../helpers/banner')
const isMinimalTerminal = require('../helpers/is-minimal-terminal')
const { printWebpackWarnings, printWebpackErrors } = require('../helpers/print-webpack-issue')

const compilations = []

function getBanner (cfg) {
  if (['spa', 'pwa', 'ssr'].includes(cfg.ctx.modeName) === false) {
    return null
  }

  return [
    ` App dir........... ${green(appPaths.appDir)}`,
    ` App URL........... ${green(cfg.build.APP_URL)}`,
    ` Dev mode.......... ${green(cfg.ctx.modeName + (cfg.ctx.mode.ssr && cfg.ctx.mode.pwa ? ' + pwa' : ''))}`,
    ` Pkg quasar........ ${green('v' + quasarVersion)}`,
    ` Pkg @quasar/app... ${green('v' + cliAppVersion)}`,
    ` Transpiled JS..... ${cfg.__transpileBanner}`
  ].join('\n') + '\n'
}

module.exports.WebpackStatusPlugin = class WebpackStatusPlugin {
  constructor ({ name, cfg }) {
    const enableStartHooks = isMinimalTerminal || cfg.build.showProgress !== true

    this.opts = {
      name,
      banner: getBanner(cfg),
      initHook: enableStartHooks === true,
      recompileHook: enableStartHooks === true && cfg.ctx.dev === true,
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
        const errors = compilations.filter(entry => entry.errors !== null)
        if (errors.length > 0) {
          setTimeout(() => {
            clearConsole()
            errors.forEach(entry => { printWebpackErrors(entry.errors) })
            error(`Please check the log above for details.\n`, 'COMPILATION FAILED')
          })
          return
        }

        this.state.compiled = true

        if (compilations.every(entry => entry.compiled === true)) {
          setTimeout(() => {
            const webpackCompilations = compilations.map(c => `"${c.name}"`).join(', ')

            clearConsole()
            success(`Compiled: ${webpackCompilations}`, 'DONE')

            if (this.opts.banner !== null) {
              console.log(this.opts.banner)
            }
          })
        }

        const warnings = compilations.filter(entry => entry.warnings !== null)
        if (warnings.length > 0) {
          setTimeout(() => {
            warnings.forEach(entry => { printWebpackWarnings(entry.warnings) })
            warning(`Compilation succeeded but there are warning(s). Please check the log above.\n`)
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
