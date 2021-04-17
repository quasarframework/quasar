const { green } = require('chalk')

const appPaths = require('../app-paths')
const { success, info, clearConsole } = require('../helpers/status')
const { quasarVersion, cliAppVersion } = require('../helpers/banner')
const isMinimalTerminal = require('../helpers/is-minimal-terminal')
// const { log } = require('../helpers/logger')
const { printWebpackWarnings, printWebpackErrors } = require('../helpers/print-webpack-issue')

const compilations = {}

function canPrintStatus () {
  return Object.values(compilations).some(c => c.ready === false) === false
}

function printReadyBanner (banner) {
  // need setTimeout() because of Webpack's progress plugin
  // which does not immediately trigger the update, so our
  // own progress plugin does not have a chance to clear its output
  setTimeout(() => {
    const webpackCompilations = Object.values(compilations).map(c => `"${c.name}"`).join(', ')

    clearConsole()
    success(`Compiled: ${webpackCompilations}`, 'DONE')

    if (banner !== null) {
      console.log(banner)
    }

    Object.values(compilations).forEach(c => {
      if (c.stats !== null) {
        printWebpackWarnings(c.stats)
      }
    })
  })
}

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

module.exports.printReadyBanner = printReadyBanner

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

    compilations[name] = {
      name,
      ready: false,
      stats: null
    }
  }

  apply (compiler) {
    const target = compilations[this.opts.name]

    this.opts.initHook && compiler.hooks.initialize.tap('QuasarStatusPlugin', () => {
      target.ready = false
      target.stats = null
      info(`Compiling "${this.opts.name}"...`, 'WAIT')
    })

    this.opts.recompileHook && compiler.hooks.invalid.tap('QuasarStatusPlugin', () => {
      target.ready = false
      target.stats = null
      info(`"${this.opts.name}" is being recompiled...`, 'WAIT')
    })

    this.opts.readyHook && compiler.hooks.done.tap('QuasarStatusPlugin', stats => {
      target.stats = null

      if (stats.hasErrors() === true) {
        target.ready = false
        clearConsole()
        printWebpackErrors(stats)
      }
      else {
        target.ready = true

        if (stats.hasWarnings()) {
          target.stats = stats
        }

        if (canPrintStatus() === true) {
          printReadyBanner(this.opts.banner)
        }
      }
    })
  }
}
