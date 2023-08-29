const { join } = require('node:path')
const fse = require('fs-extra')

const { AppBuilder } = require('../../app-builder.js')
const { quasarCapacitorConfig } = require('./capacitor-config.js')

const { log, warn, fatal } = require('../../utils/logger.js')
const { CapacitorConfigFile } = require('./config-file.js')
const { spawn, spawnSync } = require('../../utils/spawn.js')
const { openIDE } = require('../../utils/open-ide.js')
const { onShutdown } = require('../../utils/on-shutdown.js')
const { fixAndroidCleartext } = require('../../utils/fix-android-cleartext.js')

module.exports.QuasarModeBuilder = class QuasarModeBuilder extends AppBuilder {
  #capacitorConfigFile = new CapacitorConfigFile()
  #packagedDir

  async build () {
    this.#packagedDir = join(this.quasarConf.build.distDir, this.ctx.targetName)

    await this.#buildFiles()
    await this.#packageFiles()
  }

  async #buildFiles () {
    const webpackConf = await quasarCapacitorConfig.webpack(this.quasarConf)
    await this.buildWithWebpack('Capacitor UI', webpackConf)
    this.printSummary(webpackConf.output.path)
  }

  async #packageFiles () {
    const target = this.ctx.targetName
    const { appPaths, cacheProxy } = this.ctx

    if (target === 'android') {
      fixAndroidCleartext(appPaths, 'capacitor')
    }

    onShutdown(() => {
      this.#cleanup()
    })

    await this.#capacitorConfigFile.prepare(this.quasarConf, target)

    const { capBin } = cacheProxy.getModule('capCli')

    await this.#runCapacitorCommand(
      this.quasarConf.capacitor.capacitorCliPreparationParams,
      capBin
    )

    if (this.argv[ 'skip-pkg' ] !== true) {
      if (this.argv.ide === true) {
        await openIDE({
          mode: 'capacitor',
          bin: this.quasarConf.bin,
          target,
          appPaths
        })

        process.exit(0)
      }

      if (target === 'ios') {
        await this.#buildIos()
      }
      else {
        await this.#buildAndroid()
      }
    }
  }

  #cleanup () {
    this.#capacitorConfigFile.reset()
  }

  #runCapacitorCommand (args, capBin) {
    return new Promise(resolve => {
      spawn(
        capBin,
        args,
        { cwd: this.ctx.appPaths.capacitorDir },
        code => {
          this.#cleanup()

          if (code) {
            fatal('Capacitor CLI has failed', 'FAIL')
          }

          resolve && resolve()
        }
      )
    })
  }

  async #buildIos () {
    const buildType = this.quasarConf.metaConf.debugging ? 'debug' : 'release'
    const args = `xcodebuild -workspace App.xcworkspace -scheme App -configuration ${ buildType } -derivedDataPath`

    log('Building iOS app...')

    await spawnSync(
      'xcrun',
      args.split(' ').concat([ this.#packagedDir ]).concat(this.argv._),
      { cwd: this.ctx.appPaths.resolve.capacitor('ios/App') },
      () => {
        console.log()
        console.log(' ⚠️  xcodebuild command failed!')
        console.log(' ⚠️  As an alternative, you can use the "--ide" param and build from the IDE.')
        console.log()

        // cleanup build folder
        fse.removeSync(this.#packagedDir)
      }
    )
  }

  async #buildAndroid () {
    const buildPath = this.ctx.appPaths.resolve.capacitor(
      'android/app/build/outputs'
    )

    // Remove old build output
    fse.removeSync(buildPath)

    log('Building Android app...')

    await spawnSync(
      `./gradlew${ process.platform === 'win32' ? '.bat' : '' }`,
      [ `assemble${ this.quasarConf.metaConf.debugging ? 'Debug' : 'Release' }` ].concat(this.argv._),
      { cwd: this.ctx.appPaths.resolve.capacitor('android') },
      () => {
        warn()
        warn('Gradle build failed!')
        warn('As an alternative, you can use the "--ide" param and build from the IDE.')
        warn()
      }
    )

    fse.copySync(buildPath, this.#packagedDir)
  }
}
