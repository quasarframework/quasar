const fse = require('fs-extra')

const { log, warn, fatal } = require('../utils/logger.js')
const appPaths = require('../app-paths.js')
const { CapacitorConfig } = require('./capacitor-config.js')
const { spawn, spawnSync } = require('../utils/spawn.js')
const { onShutdown } = require('../utils/on-shutdown.js')
const { openIDE } = require('../utils/open-ide.js')
const { fixAndroidCleartext } = require('../utils/fix-android-cleartext.js')

const { capBin } = require('./cap-cli.js')

class CapacitorRunner {
  #pid
  #capacitorConfig
  #url
  #ctx
  #target

  constructor () {
    this.#pid = 0
    this.#capacitorConfig = new CapacitorConfig()

    onShutdown(() => {
      this.stop()
    })
  }

  init (ctx) {
    this.#ctx = ctx
    this.#target = ctx.targetName

    if (this.#target === 'android') {
      fixAndroidCleartext('capacitor')
    }
  }

  async run (quasarConfFile) {
    const cfg = quasarConfFile.quasarConf
    const url = cfg.build.APP_URL

    if (this.#url === url) {
      return
    }

    if (this.#pid) {
      this.stop()
    }

    this.#url = url
    this.#capacitorConfig.prepare(cfg, this.#target)

    await this.#runCapacitorCommand(cfg.capacitor.capacitorCliPreparationParams)

    await openIDE('capacitor', cfg.bin, this.#target, true)
  }

  async build (quasarConfFile, argv) {
    const cfg = quasarConfFile.quasarConf

    this.#capacitorConfig.prepare(cfg, this.#target)

    await this.#runCapacitorCommand(cfg.capacitor.capacitorCliPreparationParams)

    if (argv[ 'skip-pkg' ] === true) {
      return
    }

    if (argv.ide === true) {
      await openIDE('capacitor', cfg.bin, this.#target)
      process.exit(0)
    }

    if (this.#target === 'ios') {
      await this.#buildIos(argv, cfg)
    }
    else {
      await this.#buildAndroid(argv, cfg)
    }
  }

  async #buildIos (argv, cfg) {
    const buildType = this.#ctx.debug ? 'debug' : 'release'
    const args = `xcodebuild -workspace App.xcworkspace -scheme App -configuration ${ buildType } -derivedDataPath`

    log('Building iOS app...')

    await spawnSync(
      'xcrun',
      args.split(' ').concat([ cfg.build.packagedDistDir ]).concat(argv._),
      { cwd: appPaths.resolve.capacitor('ios/App') },
      () => {
        console.log()
        console.log(' ⚠️  xcodebuild command failed!')
        console.log(' ⚠️  As an alternative, you can use the "--ide" param and build from the IDE.')
        console.log()

        // cleanup build folder
        fse.removeSync(
          cfg.build.packagedDistDir
        )
      }
    )
  }

  async #buildAndroid (argv, cfg) {
    const buildPath = appPaths.resolve.capacitor(
      'android/app/build/outputs'
    )

    // Remove old build output
    fse.removeSync(buildPath)

    log('Building Android app...')

    await spawnSync(
      `./gradlew${ process.platform === 'win32' ? '.bat' : '' }`,
      [ `assemble${ this.#ctx.debug ? 'Debug' : 'Release' }` ].concat(argv._),
      { cwd: appPaths.resolve.capacitor('android') },
      () => {
        warn()
        warn('Gradle build failed!')
        warn('As an alternative, you can use the "--ide" param and build from the IDE.')
        warn()
      }
    )

    fse.copySync(buildPath, cfg.build.packagedDistDir)
  }

  stop () {
    if (!this.#pid) { return }

    log('Shutting down Capacitor process...')
    process.kill(this.#pid)
    this.#cleanup()
  }

  #runCapacitorCommand (args) {
    return new Promise(resolve => {
      this.#pid = spawn(
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

  #cleanup () {
    this.#pid = 0
    this.#capacitorConfig.reset()
  }
}

module.exports = new CapacitorRunner()
