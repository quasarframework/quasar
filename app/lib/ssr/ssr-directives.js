const webpack = require('webpack')
const chalk = require('chalk')

const { log, warn } = require('../helpers/logger')
const directivesWebpackConf = require('./webpack.directives')

class SSRDirectives {
  constructor (onBuildChange) {
    this.onBuildChange = onBuildChange
    this.webpackConf = directivesWebpackConf().toConfig()
  }

  async run () {
    const compiler = webpack(this.webpackConf)

    log(`Building devland SSR directives...`)

    let firstRun = true

    return new Promise(resolve => {
      compiler.watch({}, async (err, stats) => {
        if (err) {
          console.log(err)
          return
        }

        if (stats.hasErrors()) {
          warn(`The devland SSR directives build failed with errors`)
          return
        }

        log(`Webpack built the devland SSR directives`)

        if (firstRun === true) {
          firstRun = false
          resolve()
        }
        else {
          this.onBuildChange()
        }
      })
    })
  }

  build () {
    log(`Building the devland SSR directives...`)

    return new Promise(resolve => {
      webpack(this.webpackConf, async (err, stats) => {
        if (err) {
          console.error(err.stack || err)

          if (err.details) {
            console.error(err.details)
          }

          process.exit(1)
        }

        if (stats.hasErrors() !== true) {
          resolve()
          return
        }

        const info = stats.toJson()
        const errNumber = info.errors.length
        const errDetails = `${errNumber} error${errNumber > 1 ? 's' : ''}`

        warn()
        warn(chalk.red(`${errDetails} encountered:\n`))

        info.errors.forEach(err => {
          console.error(err)
        })

        warn()
        warn(chalk.red(`[FAIL] Devland SSR directives build failed with ${errDetails}. Check log above.\n`))

        process.exit(1)
      })
    })
  }
}

module.exports = SSRDirectives
