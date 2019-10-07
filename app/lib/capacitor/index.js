const
  log = require('../helpers/logger')('app:capacitor'),
  warn = require('../helpers/logger')('app:capacitor', 'red'),
  CapacitorConfig = require('./capacitor-config'),
  { spawn } = require('../helpers/spawn'),
  onShutdown = require('../helpers/on-shutdown'),
  appPaths = require('../app-paths')

const capacitorCliPath = require('./capacitor-cli-path')

class CapacitorRunner {
  constructor () {
    this.pid = 0
    this.config = new CapacitorConfig()

    onShutdown(() => {
      this.stop()
    })
  }

  async run (quasarConfig) {
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

    this.config.prepare(cfg)

    await this.__runCapacitorCommand(['sync', cfg.ctx.targetName])

    console.log()
    console.log(`⚠️  `)
    console.log(`⚠️  Opening ${cfg.ctx.targetName === 'ios' ? 'XCode' : 'Android Studio'} IDE...`)
    console.log(`⚠️  From there, use the IDE to run the app.`)
    console.log(`⚠️  `)
    console.log()
    await this.__runCapacitorCommand(['open', cfg.ctx.targetName])
  }

  async build (quasarConfig, skipPkg) {
    const cfg = quasarConfig.getBuildConfig()

    this.config.prepare(cfg)

    await this.__runCapacitorCommand(['sync', cfg.ctx.targetName])

    if (skipPkg !== true) {
      console.log()
      console.log(`⚠️  `)
      console.log(`⚠️  Opening ${cfg.ctx.targetName === 'ios' ? 'XCode' : 'Android Studio'}`)
      console.log(`⚠️  From there, use the IDE to build the final package.`)
      console.log(`⚠️  `)
      console.log()
      return this.__runCapacitorCommand(['open', cfg.ctx.targetName])
    }
  }

  stop () {
    if (!this.pid) { return }

    log('Shutting down Capacitor process...')
    process.kill(this.pid)
    this.__cleanup()
  }

  __runCapacitorCommand (args) {
    return new Promise(resolve => {
      this.pid = spawn(
        capacitorCliPath,
        args,
        appPaths.capacitorDir,
        code => {
          this.__cleanup()
          if (code) {
            warn(`⚠️  [FAIL] Capacitor CLI has failed`)
            process.exit(1)
          }
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

module.exports = new CapacitorRunner()
