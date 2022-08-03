const fse = require('fs-extra')

const { log, fatal } = require('../helpers/logger')
const CordovaConfig = require('./cordova-config')
const { spawn } = require('../helpers/spawn')
const onShutdown = require('../helpers/on-shutdown')
const appPaths = require('../app-paths')
const openIde = require('../helpers/open-ide')

class CordovaRunner {
  constructor () {
    this.pid = 0
    this.cordovaConfig = new CordovaConfig()

    onShutdown(() => {
      this.stop()
    })
  }

  init (ctx) {
    this.ctx = ctx
    this.target = ctx.targetName

    if (this.target === 'android') {
      require('../helpers/fix-android-cleartext')('cordova')
    }
  }

  async run (quasarConfFile, argv) {
    const cfg = quasarConfFile.quasarConf
    const url = cfg.build.APP_URL

    if (this.url === url) {
      return
    }

    if (this.pid) {
      this.stop()
    }

    this.url = url

    if (argv.ide) {
      await this.__runCordovaCommand(
        cfg,
        ['prepare', this.target].concat(argv._)
      )

      await openIde('cordova', cfg.bin, this.target, true)
      return
    }

    const args = ['run', this.target]

    if (this.ctx.emulator) {
      args.push(`--target=${this.ctx.emulator}`)
    }

    await this.__runCordovaCommand(
      cfg,
      args.concat(argv._)
    )
  }

  async build (quasarConfFile, argv) {
    const cfg = quasarConfFile.quasarConf
    const buildPath = appPaths.resolve.cordova(
      this.target === 'android'
        ? 'platforms/android/app/build/outputs'
        : 'platforms/ios/build/emulator'
    )

    // Remove old build output
    fse.removeSync(buildPath)

    const args = argv['skip-pkg'] || argv.ide
      ? ['prepare', this.target]
      : ['build', this.ctx.debug ? '--debug' : '--release', this.target]

    await this.__runCordovaCommand(
      cfg,
      args.concat(argv._)
    )

    if (argv['skip-pkg'] === true) {
      return
    }

    if (argv.ide) {
      await openIde('cordova', cfg.bin, this.target)
      process.exit(0)
    }

    fse.copySync(buildPath, cfg.build.packagedDistDir)
  }

  stop () {
    if (!this.pid) { return }

    log('Shutting down Cordova process...')
    process.kill(this.pid)
    this.__cleanup()
  }

  __runCordovaCommand (cfg, args) {
    this.cordovaConfig.prepare(cfg)

    if (this.target === 'ios' && cfg.cordova.noIosLegacyBuildFlag !== true) {
      args.push(`--buildFlag=-UseModernBuildSystem=0`)
    }

    return new Promise(resolve => {
      this.pid = spawn(
        'cordova',
        args,
        { cwd: appPaths.cordovaDir },
        code => {
          this.__cleanup()
          if (code) {
            fatal('Cordova CLI has failed', 'FAIL')
          }
          resolve()
        }
      )
    })
  }

  __cleanup () {
    this.pid = 0
    this.cordovaConfig.reset()
  }
}

module.exports = new CordovaRunner()
