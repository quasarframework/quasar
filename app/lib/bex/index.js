const webpack = require('webpack')

const { log, warn } = require('../helpers/logger')

class BexRunner {
  constructor () {
    this.watcher = null
  }

  init () {}

  async run (quasarConfig) {
    this.stop()

    const compiler = webpack(quasarConfig.getWebpackConfig().main)

    return new Promise(resolve => {
      log(`Building background process...`)

      this.watcher = compiler.watch({}, (err, stats) => {
        if (err) {
          console.log(err)
          return
        }

        log(`Webpack built background process`)

        if (stats.hasErrors()) {
          warn(`BEX Background build failed with errors`)
          return
        }

        resolve()
      })
    })
  }

  stop () {
    if (this.watcher) {
      this.watcher.close()
      this.watcher = null
    }
  }
}

module.exports = new BexRunner()
