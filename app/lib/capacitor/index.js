const log = require('../helpers/logger')('app:capacitor'),
  warn = require('../helpers/logger')('app:capacitor', 'red'),
  fse = require('fs-extra'),
  path = require('path'),
  { spawn, spawnSync } = require('../helpers/spawn'),
  getCapacitorBinaryBath = require('../capacitor/getCapacitorBinaryPath'),
  appPaths = require('../app-paths'),
  nodePackager = require('../helpers/node-packager')

class CapacitorRunner {
  run(quasarConfig) {
    return new Promise(async resolve => {
      const cfg = quasarConfig.getBuildConfig(),
        url = cfg.build.APP_URL,
        targetPlatform = cfg.ctx.targetName
      await this.__installPlatformIfMissing(targetPlatform)
      // Make sure there is an index.html, otherwise Capacitor will crash
      fse.ensureFileSync(appPaths.resolve.app('./dist/capacitor/index.html'))
      // Copy package.json
      this.__copyPackageJson()
      // Copy app data
      await this.__runCapacitorCommand(['sync', cfg.ctx.targetName])
      this.__setCapacitorConfig(targetPlatform, url)
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
          targetPlatform === 'android' ? 'Android Studio' : 'XCode'
        }. Run your app here, and it will automatically connect to the dev server.\n`
      )
      resolve()
    })
  }

  build(quasarConfig) {
    return new Promise(async resolve => {
      const cfg = quasarConfig.getBuildConfig(),
        targetPlatform = cfg.ctx.targetName

      await this.__installPlatformIfMissing(targetPlatform)

      this.__copyPackageJson()
      await this.__runCapacitorCommand(['sync', targetPlatform])

      if (process.argv.includes('--openIde') || targetPlatform !== 'android') {
        return this.__runCapacitorCommand(['open', targetPlatform])
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
    fse.copySync(
      appPaths.resolve.app('package.json'),
      appPaths.resolve.capacitor('package.json')
    )
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

  async __installPlatformIfMissing(targetPlatform) {
    if (!fse.existsSync(appPaths.resolve.capacitor(targetPlatform))) {
      // Platform not installed, install deps and add it
      const cmdParam =
        nodePackager === 'npm' ? ['install', '--save-dev'] : ['add', '--dev']

      log(`Installing Capacitor dependencies...`)
      spawnSync(
        nodePackager,
        cmdParam.concat([`@capacitor/${targetPlatform}`]),
        appPaths.appDir,
        () => warn('Failed to install Capacitor dependencies')
      )
      this.__copyPackageJson()
      await this.__runCapacitorCommand(['add', targetPlatform])
      if (targetPlatform === 'android') {
        // Enable cleartext support in manifest
        const androidManifestPath = appPaths.resolve.capacitor(
          'android/app/src/main/AndroidManifest.xml'
        )
        let androidManifest = fse.readFileSync(androidManifestPath, 'utf8')
        androidManifest = androidManifest.replace(
          '<application',
          '<application\n        android:usesCleartextTraffic="true"'
        )
        fse.writeFileSync(androidManifestPath, androidManifest)
      }
    }
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
