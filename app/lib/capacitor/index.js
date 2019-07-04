const log = require('../helpers/logger')('app:capacitor'),
  warn = require('../helpers/logger')('app:capacitor', 'red'),
  fse = require('fs-extra'),
  path = require('path'),
  { spawn } = require('../helpers/spawn'),
  getCapacitorBinaryBath = require('../capacitor/getCapacitorBinaryPath'),
  appPaths = require('../app-paths')

class CapacitorRunner {
  run(quasarConfig) {
    return new Promise(async resolve => {
      const cfg = quasarConfig.getBuildConfig(),
        url = cfg.build.APP_URL,
        platform = cfg.ctx.targetName
      // Make sure there is an index.html, otherwise Capacitor will crash
      fse.ensureFileSync(appPaths.resolve.app('./dist/capacitor/index.html'))
      // Copy package.json
      this.__copyPackageJson()
      // Copy app data
      await this.__runCapacitorCommand(['sync', cfg.ctx.targetName])
      this.__setCapacitorConfig(platform, url)
      // Make sure cleartext is enabled
      if (cfg.ctx.targetName === 'android') {
        const androidManifest = fse.readFileSync(
          appPaths.resolve.capacitor(
            'android/app/src/main/AndroidManifest.xml'
          ),
          'utf8'
        )
        if (!androidManifest.match('android:usesCleartextTraffic="true"')) {
          warn(
            'Cleartext must be enabled to connect to the dev server on Android!'
          )
          warn(
            'Add `android:usesCleartextTraffic="true"` to src-capacitor/android/app/src/main/AndroidManifest.xml in the `application` tag'
          )
          // TODO: actual url with instructions
          warn('See [need url] for more instructions')
          process.exit(1)
        }
      }
      await this.__runCapacitorCommand(['open', cfg.ctx.targetName])
      // TODO: Properly determine if dev server is hosted on local network
      if (!/^https?:\/\/192/.test(url)) {
        warn(
          'It appears your dev server is not hosted on your local network. You will only be able to run your app on an emulator.'
        )
      }
      log(
        `Launching ${
          platform === 'android' ? 'Android Studio' : 'XCode'
        }. Run your app here, and it will automatically connect to the dev server.\n`
      )
      resolve()
    })
  }

  build(quasarConfig) {
    return new Promise(async resolve => {
      const cfg = quasarConfig.getBuildConfig()

      this.__copyPackageJson()
      await this.__runCapacitorCommand(['sync', cfg.ctx.targetName])

      if (
        process.argv.includes('--openIde') ||
        cfg.ctx.targetName !== 'android'
      ) {
        return this.__runCapacitorCommand(['open', cfg.ctx.targetName])
      } else {
        const basePath = appPaths.resolve.capacitor(
          'android/app/build/outputs/apk/release'
        )
        // Remove old build output
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
            } else if (fse.existsSync(unsignedPath)) {
              fse.copySync(
                unsignedPath,
                appPaths.resolve.app('dist/capacitor/app-release.apk')
              )
            } else {
              warn(
                'Could not find outputted apk. Please resolve any errors with Capacitor. To run the build in Android Studio, pass the "--openIde" argument to this command.'
              )
              process.exit(1)
            }
            resolve()
          }
        )
      }
    })
  }

  __copyPackageJson() {
    fse.copySync(appPaths.resolve.app('package.json'), appPaths.resolve.capacitor('package.json'))
  }

  __runCapacitorCommand(args) {
    return new Promise(resolve => {
      spawn(getCapacitorBinaryBath(), args, appPaths.capacitorDir, code => {
        if (code) {
          warn(`⚠️  [FAIL] Capacitor CLI has failed`)
          process.exit(1)
        }
        resolve(code)
      })
    })
  }

  __setCapacitorConfig(platform, serverUrl, webDir) {
    let configPath
    // Read existing config
    if (platform === 'android') {
      configPath = './android/app/src/main/assets/capacitor.config.json'
    } else if (platform === 'ios') {
      configPath = './ios/App/App/capacitor.config.json'
    } else {
      configPath = './capacitor.config.json'
    }
    const capacitorConfig = JSON.parse(
      fse.readFileSync(appPaths.resolve.capacitor(configPath), 'utf8')
    )
    if (serverUrl) {
      capacitorConfig.server = capacitorConfig.server || {}
      capacitorConfig.server.url = serverUrl
    }
    if (webDir) {
      capacitorConfig.webDir = webDir
    }
    // Write updated config
    fse.writeFileSync(
      appPaths.resolve.capacitor(configPath),
      JSON.stringify(capacitorConfig)
    )
  }
}

module.exports = new CapacitorRunner()
