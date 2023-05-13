const fse = require('fs-extra')

const appPaths = require('../app-paths.js')
const { log, fatal } = require('../utils/logger.js')
const { CordovaConfig } = require('./cordova-config.js')
const { spawn } = require('../utils/spawn.js')
const { onShutdown } = require('../utils/on-shutdown.js')
const { openIDE } = require('../utils/open-ide.js')
const { fixAndroidCleartext } = require('../utils/fix-android-cleartext.js')

class CordovaRunner {
  #pid
  #cordovaConfig
  #url
  #ctx
  #target

  constructor () {
    this.#pid = 0
    this.#cordovaConfig = new CordovaConfig()

    onShutdown(() => {
      this.stop()
    })
  }

  init (ctx) {
    this.#ctx = ctx
    this.#target = ctx.targetName

    if (this.#target === 'android') {
      fixAndroidCleartext('cordova')
    }
  }

  async run (quasarConfFile, argv) {
    const cfg = quasarConfFile.quasarConf
    const url = cfg.build.APP_URL

    if (this.#url === url) {
      return
    }

    if (this.#pid) {
      this.stop()
    }

    this.#url = url

    if (argv.ide) {
      await this.#runCordovaCommand(
        cfg,
        [ 'prepare', this.#target ].concat(argv._)
      )

      await openIDE('cordova', cfg.bin, this.#target, true)
      return
    }

    const args = [ 'run', this.#target ]

    if (this.#ctx.emulator) {
      args.push(`--target=${ this.#ctx.emulator }`)
    }

    await this.#runCordovaCommand(
      cfg,
      args.concat(argv._)
    )
  }

  async build (quasarConfFile, argv) {
    const cfg = quasarConfFile.quasarConf
    const buildPath = appPaths.resolve.cordova(
      this.#target === 'android'
        ? 'platforms/android/app/build/outputs'
        : 'platforms/ios/build/emulator'
    )

    // Remove old build output
    fse.removeSync(buildPath)

    const args = argv[ 'skip-pkg' ] || argv.ide
      ? [ 'prepare', this.#target ]
      : [ 'build', this.#ctx.debug ? '--debug' : '--release', this.#target ]

    await this.#runCordovaCommand(
      cfg,
      args.concat(argv._)
    )

    if (argv[ 'skip-pkg' ] === true) {
      return
    }

    if (argv.ide) {
      await openIDE('cordova', cfg.bin, this.#target)
      process.exit(0)
    }

    fse.copySync(buildPath, cfg.build.packagedDistDir)
  }

  stop () {
    if (!this.#pid) { return }

    log('Shutting down Cordova process...')
    process.kill(this.#pid)
    this.#cleanup()
  }

  #runCordovaCommand (cfg, args) {
    this.#cordovaConfig.prepare(cfg)

    if (this.#target === 'ios' && cfg.cordova.noIosLegacyBuildFlag !== true) {
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
    this.#cordovaConfig.reset()
  }
}

module.exports = new CordovaRunner()
