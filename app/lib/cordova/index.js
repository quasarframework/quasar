const fse = require('fs-extra')

const
  log = require('../helpers/logger')('app:cordova'),
  CordovaConfig = require('./cordova-config'),
  { spawn } = require('../helpers/spawn'),
  onShutdown = require('../helpers/on-shutdown'),
  appPaths = require('../app-paths'),
  openIde = require('../helpers/open-ide')

class CordovaRunner {
  constructor () {
    this.pid = 0
    this.config = new CordovaConfig()

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

  async run (quasarConfig, argv) {
    const
      cfg = quasarConfig.getBuildConfig(),
      url = cfg.build.APP_URL

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

      openIde('cordova', cfg.bin, this.target, true)
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

  async build (quasarConfig, argv) {
    const cfg = quasarConfig.getBuildConfig()
    const buildPath = appPaths.resolve.cordova(
      this.target === 'android'
        ? 'platforms/android/app/build/outputs/apk/' + (this.ctx.debug ? 'debug' : 'release')
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
      openIde('cordova', cfg.bin, this.target)
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
    this.config.prepare(cfg)

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
            warn(`⚠️  [FAIL] Cordova CLI has failed`)
            process.exit(1)
          }
          resolve()
        }
      )
    })
  }

  __cleanup () {
    this.pid = 0
    this.config.reset()
  }
}

module.exports = new CordovaRunner()
