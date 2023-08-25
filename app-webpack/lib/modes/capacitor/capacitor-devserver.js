const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const { AppDevserver } = require('../../app-devserver.js')
const { CapacitorConfigFile } = require('./config-file.js')
const { log, fatal } = require('../../utils/logger.js')
const { spawn } = require('../../utils/spawn.js')
const { onShutdown } = require('../../utils/on-shutdown.js')
const { openIDE } = require('../../utils/open-ide.js')
const { quasarCapacitorConfig } = require('./capacitor-config.js')
const { fixAndroidCleartext } = require('../../utils/fix-android-cleartext.js')

module.exports.QuasarModeDevserver = class QuasarModeDevserver extends AppDevserver {
  #pid = 0
  #server
  #target
  #capacitorConfigFile = new CapacitorConfigFile()

  constructor (opts) {
    super(opts)

    this.#target = this.ctx.targetName

    if (this.#target === 'android') {
      fixAndroidCleartext(this.ctx.appPaths, 'capacitor')
    }

    onShutdown(() => {
      this.#stopCapacitor()
    })

    this.registerDiff('capacitor', quasarConf => [
      quasarConf.metaConf.APP_URL,
      quasarConf.capacitor
    ])
  }

  run (quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    if (diff('webpack', quasarConf)) {
      return queue(() => this.#runWebpack(quasarConf))
    }

    if (diff('capacitor', quasarConf)) {
      return queue(() => this.#runCapacitor(quasarConf))
    }
  }

  async #runWebpack (quasarConf) {
    if (this.#server) {
      await this.#server.stop()
      this.#server = null
    }

    const webpackConf = await quasarCapacitorConfig.webpack(quasarConf)

    let started = false

    return new Promise(resolve => {
      const compiler = webpack(webpackConf)

      compiler.hooks.done.tap('done-compiling', stats => {
        if (started === true) { return }

        // start dev server if there are no errors
        if (stats.hasErrors() === true) {
          return
        }

        started = true
        resolve()
      })

      // start building & launch server
      this.#server = new WebpackDevServer(quasarConf.devServer, compiler)
      this.#server.start()
    })
  }

  async #runCapacitor (quasarConf) {
    this.#stopCapacitor()
    await this.#capacitorConfigFile.prepare(quasarConf, this.#target)

    const { appPaths, cacheProxy } = this.ctx
    const { capBin } = await cacheProxy.getModule('capCli')

    await this.#runCapacitorCommand(
      quasarConf.capacitor.capacitorCliPreparationParams,
      appPaths.capacitorDir,
      capBin
    )

    await openIDE({
      mode: 'capacitor',
      bin: quasarConf.bin,
      target: this.#target,
      dev: true,
      appPaths
    })
  }

  #stopCapacitor () {
    if (this.#pid) {
      log('Shutting down Capacitor process...')
      process.kill(this.#pid)
      this.#cleanup()
    }
  }

  async #runCapacitorCommand (args, cwd, capBin) {
    return new Promise(resolve => {
      this.#pid = spawn(
        capBin,
        args,
        { cwd },
        code => {
          this.#cleanup()

          if (code) {
            fatal('Capacitor CLI has failed', 'FAIL')
          }

          resolve && resolve()
        }
      )
    })
  }

  #cleanup () {
    this.#pid = 0
    this.#capacitorConfigFile.reset()
  }
}
