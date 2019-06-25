const log = require('../helpers/logger')('app:capacitor'),
  warn = require('../helpers/logger')('app:capacitor', 'red'),
  fse = require('fs-extra'),
  path = require('path'),
  { spawn } = require('../helpers/spawn'),
  onShutdown = require('../helpers/on-shutdown'),
  appPaths = require('../app-paths')

class CapacitorRunner {
  constructor() {
    this.pid = 0

    onShutdown(() => {
      this.stop()
    })
  }

  run(quasarConfig) {
    // TODO: add support for development
  }

  build(quasarConfig) {
    return new Promise(async (resolve, reject) => {
      const cfg = quasarConfig.getBuildConfig()

      await this.__runCapacitorCommand(cfg, ['sync', cfg.ctx.targetName])

      if (
        process.argv.includes('--openIde') ||
        cfg.ctx.targetName !== 'android'
      ) {
        return this.__runCapacitorCommand(cfg, ['open', cfg.ctx.targetName])
      } else {
        const basePath = appPaths.resolve.capacitorAndroid(
          'app/build/outputs/apk/release'
        )
        // Remove old build output
        fse.removeSync(basePath)
        log('Building android app')
        spawn(
          `./gradlew${process.platform === 'win32' ? '.bat' : ''}`,
          ['assembleRelease'],
          appPaths.capacitorAndroidDir,
          () => {
            // Copy built apk to dist folder
            const unsignedPath = path.join(basePath, 'app-release-unsigned.apk')
            const signedPath = path.join(basePath, 'app-release.apk')
            if (fse.existsSync(signedPath)) {
              fse.copySync(
                signedPath,
                appPaths.resolve.app('dist/capacitor/app-release.apk')
              )
            } else if (fse.existsSync(unsignedPath)) {
              fse.copySync(
                unsignedPath,
                appPaths.resolve.app('dist/capacitor/app-release.apk')
              )
            } else {
              warn(
                'Could not find outputted apk. Please resolve any errors with Capacitor. To run the build in Android Studio, pass the "--openIde" argument to this command.'
              )
              reject()
            }
            resolve()
          }
        )
      }
    })
  }

  stop() {
    if (!this.pid) {
      return
    }

    log('Shutting down Capacitor process...')
    process.kill(this.pid)
    this.__cleanup()
  }

  __runCapacitorCommand(cfg, args) {
    return new Promise(resolve => {
      this.pid = spawn(
        'node_modules/.bin/capacitor',
        args,
        appPaths.appDir,
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

  __cleanup() {
    this.pid = 0
  }
}

module.exports = new CapacitorRunner()
