const { ProgressPlugin } = require('webpack')
const throttle = require('lodash.throttle')

const { success, info, clearConsole } = require('../helpers/status')
// const { log } = require('../helpers/logger')
const { printWebpackWarnings, printWebpackErrors } = require('../helpers/print-webpack-issue')

const compilations = {}

function canPrintStatus () {
  return Object.values(compilations).some(c => c.ready === false) === false
}

function printStatusBanner (banner) {
  clearConsole()
  success('Devserver is ready', 'DONE')

  if (banner) {
    console.log(banner)
  }

  Object.values(compilations).forEach(c => {
    if (c.stats !== null) {
      printWebpackWarnings(c.stats)
    }
  })
}

module.exports.printStatusBanner = printStatusBanner

module.exports.WebpackPluginStatus = class WebpackPluginStatus {
  // { name, banner }
  constructor (opts) {
    this.opts = opts

    compilations[opts.name] = {
      name: opts.name,
      ready: false,
      stats: null
    }
  }

  apply (compiler) {
    const target = compilations[this.opts.name]

    compiler.hooks.invalid.tap('QuasarStatusPlugin', () => {
      target.ready = false
      target.stats = null
      info('Compiling...', 'WAIT')
    })

    compiler.hooks.done.tap('QuasarStatusPlugin', stats => {
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
          printStatusBanner(this.opts.banner)
        }
      }
    })
  }
}
