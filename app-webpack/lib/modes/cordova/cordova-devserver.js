const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const { AppDevserver } = require('../../app-devserver.js')
const { CordovaConfigFile } = require('./config-file.js')
const { log, fatal } = require('../../utils/logger.js')
const { spawn } = require('../../utils/spawn.js')
const { onShutdown } = require('../../utils/on-shutdown.js')
const { openIDE } = require('../../utils/open-ide.js')
const { quasarCordovaConfig } = require('./cordova-config.js')
const { fixAndroidCleartext } = require('../../utils/fix-android-cleartext.js')

module.exports.QuasarModeDevserver = class QuasarModeDevserver extends AppDevserver {
  #pid = 0
  #server
  #target
  #cordovaConfigFile = new CordovaConfigFile()

  constructor (opts) {
    super(opts)

    this.registerDiff('cordova', quasarConf => [
      quasarConf.metaConf.APP_URL,
      quasarConf.cordova
    ])

    this.#target = this.ctx.targetName

    if (this.#target === 'android') {
      fixAndroidCleartext(this.ctx.appPaths, 'cordova')
    }

    onShutdown(() => {
      this.#stopCordova()
    })
  }

  run (quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    if (diff('webpack', quasarConf)) {
      return queue(() => this.#runWebpack(quasarConf))
    }

    if (diff('cordova', quasarConf)) {
      return queue(() => this.#runCordova(quasarConf))
    }
  }

  async #runWebpack (quasarConf) {
    if (this.#server) {
      await this.#server.stop()
      this.#server = null
    }

    const webpackConf = await quasarCordovaConfig.webpack(quasarConf)

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

  async #runCordova (quasarConf) {
    this.#stopCordova()

    if (this.argv.ide) {
      await this.#runCordovaCommand(
        quasarConf,
        [ 'prepare', this.#target ].concat(this.argv._)
      )

      await openIDE({
        mode: 'cordova',
        bin: quasarConf.bin,
        target: this.#target,
        dev: true,
        appPaths: this.ctx.appPaths
      })

      return
    }

    const args = [ 'run', this.#target ]

    if (this.ctx.emulator) {
      args.push(`--target=${ this.ctx.emulator }`)
    }

    await this.#runCordovaCommand(
      quasarConf,
      args.concat(this.argv._)
    )
  }

  #stopCordova () {
    if (this.#pid) {
      log('Shutting down Cordova process...')
      process.kill(this.#pid)
      this.#cleanup()
    }
  }

  #runCordovaCommand (quasarConf, args) {
    this.#cordovaConfigFile.prepare(quasarConf)

    if (this.#target === 'ios' && quasarConf.cordova.noIosLegacyBuildFlag !== true) {
      args.push('--buildFlag=-UseModernBuildSystem=0')
    }

    return new Promise(resolve => {
      this.#pid = spawn(
        'cordova',
        args,
        { cwd: this.ctx.appPaths.cordovaDir },
        code => {
          this.#cleanup()
          if (code) {
            fatal('Cordova CLI has failed', 'FAIL')
          }
          resolve()
        }
      )
    })
  }

  #cleanup () {
    this.#pid = 0
    this.#cordovaConfigFile.reset()
  }
}
