const
  log = require('../helpers/logger')('app:cordova'),
  CordovaConfig = require('./cordova-config'),
  spawn = require('../helpers/spawn'),
  onShutdown = require('../helpers/on-shutdown'),
  appPaths = require('../app-paths')

class CordovaRunner {
  constructor () {
    this.pid = 0
    this.config = new CordovaConfig()

    onShutdown(() => {
      this.stop()
    })
  }

  run (quasarConfig) {
    const url = quasarConfig.getBuildConfig().build.APP_URL

    if (this.url === url) {
      return
    }

    if (this.pid) {
      this.stop()
    }

    this.url = url

    const
      cfg = quasarConfig.getBuildConfig(),
      args = ['run', cfg.ctx.targetName]

    if (cfg.ctx.emulator) {
      args.push(`--target=${cfg.ctx.emulator}`)
    }

    return this.__runCordovaCommand(
      cfg,
      args
    )
  }

  build (quasarConfig) {
    const cfg = quasarConfig.getBuildConfig()

    return this.__runCordovaCommand(
      cfg,
      ['build', cfg.ctx.debug ? '--debug' : '--release', cfg.ctx.targetName]
    )
  }

  stop () {
    if (!this.pid) { return }

    log('Shutting down Cordova process...')
    process.kill(this.pid)
    this.__cleanup()
  }

  __runCordovaCommand (cfg, args) {
    this.config.prepare(cfg)

    return new Promise((resolve, reject) => {
      this.pid = spawn(
        'cordova',
        args,
        appPaths.cordovaDir,
        code => {
          this.__cleanup()
          resolve(code)
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
