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

    // TODO cfg.ctx.emulator
    await this.__runCapacitorCommand(['open', cfg.ctx.targetName])
  }

  async build (quasarConfig, skipPkg) {
    const cfg = quasarConfig.getBuildConfig()

    this.config.prepare(cfg)

    await this.__runCapacitorCommand(['sync', cfg.ctx.targetName])

    if (skipPkg) {
      return
    }

    if (cfg.ctx.targetName === 'ios') {
      return this.__runCapacitorCommand(['open', 'ios'])
    }

    const basePath = appPaths.resolve.capacitor(
      'android/app/build/outputs/apk/release'
    )

    // Remove old build output
    // TODO needed?
    fse.removeSync(basePath)

    log('Building android app')
    spawn(
      `./gradlew${process.platform === 'win32' ? '.bat' : ''}`,
      ['assembleRelease'],
      appPaths.resolve.capacitor('android'),
      () => {
        // Copy built apk to dist folder
        const unsignedPath = path.join(basePath, 'app-release-unsigned.apk')
        const signedPath = path.join(basePath, 'app-release.apk')

        if (fse.existsSync(signedPath)) {
          fse.copySync(
            signedPath,
            appPaths.resolve.app('dist/capacitor/app-release.apk')
          )
        }
        else if (fse.existsSync(unsignedPath)) {
          fse.copySync(
            unsignedPath,
            appPaths.resolve.app('dist/capacitor/app-release.apk')
          )
        }
        else {
          warn(
            'Could not find outputted apk. Please resolve any errors with Capacitor. ' +
            'To run the build in Android Studio, pass the "--openIde" argument to this command.'
          )
          process.exit(1)
        }
        resolve()
      }
    )
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
