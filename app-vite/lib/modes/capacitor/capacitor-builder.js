const { join } = require('path')
const fse = require('fs-extra')

const AppBuilder = require('../../app-builder')
const config = require('./capacitor-config')

const { log, warn, fatal } = require('../../helpers/logger')
const appPaths = require('../../app-paths')
const CapacitorConfigFile = require('./config-file')
const { spawn, spawnSync } = require('../../helpers/spawn')
const openIde = require('../../helpers/open-ide')
const onShutdown = require('../../helpers/on-shutdown')

const { capBin } = require('./cap-cli')

class CapacitorBuilder extends AppBuilder {
  #capacitorConfigFile = new CapacitorConfigFile()
  #packagedDir

  async build () {
    this.#packagedDir = join(this.quasarConf.build.distDir, this.quasarConf.ctx.targetName)

    await this.#buildFiles()
    await this.#packageFiles()
  }

  async #buildFiles () {
    const viteConfig = await config.vite(this.quasarConf)
    await this.buildWithVite('Capacitor UI', viteConfig)
    this.printSummary(viteConfig.build.outDir)
  }

  async #packageFiles () {
    const target = this.ctx.targetName

    if (target === 'android') {
      require('../../helpers/fix-android-cleartext')('capacitor')
    }

    onShutdown(() => {
      this.#cleanup()
    })

    this.#capacitorConfigFile.prepare(this.quasarConf, target)

    await this.#runCapacitorCommand(this.quasarConf.capacitor.capacitorCliPreparationParams)

    if (this.argv[ 'skip-pkg' ] !== true) {
      if (this.argv.ide === true) {
        await openIde('capacitor', this.quasarConf.bin, target)
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

  #runCapacitorCommand (args) {
    return new Promise(resolve => {
      spawn(
        capBin,
        args,
        { cwd: appPaths.capacitorDir },
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
    const buildType = this.ctx.debug ? 'debug' : 'release'
    const args = `xcodebuild -workspace App.xcworkspace -scheme App -configuration ${ buildType } -derivedDataPath`

    log('Building iOS app...')

    await spawnSync(
      'xcrun',
      args.split(' ').concat([ this.#packagedDir ]).concat(this.argv._),
      { cwd: appPaths.resolve.capacitor('ios/App') },
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
    const buildPath = appPaths.resolve.capacitor(
      'android/app/build/outputs'
    )

    // Remove old build output
    fse.removeSync(buildPath)

    log('Building Android app...')

    await spawnSync(
      `./gradlew${ process.platform === 'win32' ? '.bat' : '' }`,
      [ `assemble${ this.ctx.debug ? 'Debug' : 'Release' }` ].concat(this.argv._),
      { cwd: appPaths.resolve.capacitor('android') },
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

module.exports = CapacitorBuilder
