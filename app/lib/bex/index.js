const webpack = require('webpack')

const
  logger = require('../helpers/logger'),
  log = logger('app:bex'),
  warn = logger('app:bex', 'red')

class BexRunner {
  async run (quasarConfig, extraParams) {
    const compiler = webpack(quasarConfig.getWebpackConfig().main)

    return new Promise((resolve, reject) => {
      log(`Building BEX background process...`)
      compiler.watch({}, (err, stats) => {
        if (err) {
          console.log(err)
          return
        }

        log(`Webpack built Bex background process`)

        if (stats.hasErrors()) {
          warn(`BEX main build failed with errors`)
          return
        }

        resolve()
      })
    })
  }
}

module.exports = new BexRunner()
