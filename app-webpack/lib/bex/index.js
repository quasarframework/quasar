const webpack = require('webpack')

class BexRunner {
  constructor () {
    this.watcher = null
  }

  init () {}

  async run (quasarConfFile) {
    this.stop()

    const compiler = webpack(quasarConfFile.webpackConf.main)

    return new Promise(resolve => {
      this.watcher = compiler.watch({}, (err, stats) => {
        if (err) {
          console.log(err)
          return
        }

        if (stats.hasErrors() !== true) {
          resolve()
        }
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
