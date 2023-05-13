const { createServer } = require('vite')

const appPaths = require('../../app-paths.js')
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
  #ctx
  #target
  #cordovaConfigFile = new CordovaConfigFile()

  constructor (opts) {
    super(opts)

    this.registerDiff('cordova', quasarConf => [
      quasarConf.metaConf.APP_URL,
      quasarConf.cordova
    ])

    this.#ctx = opts.quasarConf.ctx
    this.#target = opts.quasarConf.ctx.targetName

    if (this.#target === 'android') {
      fixAndroidCleartext('cordova')
    }

    onShutdown(() => {
      this.#stopCordova()
    })
  }

  run (quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    if (diff('vite', quasarConf)) {
      return queue(() => this.#runVite(quasarConf))
    }

    if (diff('cordova', quasarConf)) {
      return queue(() => this.#runCordova(quasarConf))
    }
  }

  async #runVite (quasarConf) {
    if (this.#server) {
      this.#server.close()
    }

    const viteConfig = await quasarCordovaConfig.vite(quasarConf)

    this.#server = await createServer(viteConfig)
    await this.#server.listen()
  }

  async #runCordova (quasarConf) {
    this.#stopCordova()

    if (this.argv.ide) {
      await this.#runCordovaCommand(
        quasarConf,
        [ 'prepare', this.#target ].concat(this.argv._)
      )

      await openIDE('cordova', quasarConf.bin, this.#target, true)
      return
    }

    const args = [ 'run', this.#target ]

    if (this.#ctx.emulator) {
      args.push(`--target=${ this.#ctx.emulator }`)
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
        { cwd: appPaths.cordovaDir },
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
