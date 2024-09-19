const fse = require('fs-extra')

const { log, warn, fatal } = require('../helpers/logger')
const CordovaConfig = require('./cordova-config')
const { spawn } = require('../helpers/spawn')
const onShutdown = require('../helpers/on-shutdown')
const appPaths = require('../app-paths')
const openIde = require('../helpers/open-ide')
const { SIGNAL__BUILD_SHOULD_EXIT } = require('../helpers/signals.js')

const cordovaOutputFolders = {
  ios: [
    'platforms/ios/build/Release-iphoneos', // ios-cordova 7+
    'platforms/ios/build/Debug-iphoneos', // ios-cordova 7+
    'platforms/ios/build/Release-iphonesimulator', // ios-cordova 7+
    'platforms/ios/build/Debug-iphonesimulator', // ios-cordova 7+
    'platforms/ios/build/device',
    'platforms/ios/build/emulator'
  ],

  android: [
    'platforms/android/app/build/outputs'
  ]
}

function ensureArray (val) {
  return (!val || Array.isArray(val)) ? val : [ val ]
}

class CordovaRunner {
  constructor () {
    this.pid = 0
    this.cordovaConfig = new CordovaConfig()

    onShutdown(() => {
      this.stop()
    })
  }

  init (ctx) {
    this.ctx = ctx
    this.target = ctx.targetName

    if (this.target === 'android') {
      require('./android-cleartext')(this.ctx.dev ? 'add' : 'remove')
    }
  }

  async run (quasarConfFile, argv) {
    const { quasarConf } = quasarConfFile
    const url = quasarConf.build.APP_URL

    if (this.url === url) {
      return
    }

    if (this.pid) {
      this.stop()
    }

    this.url = url

    if (argv.ide) {
      await this.__runCordovaCommand(
        quasarConf,
        [ 'prepare', this.target ].concat(argv._)
      )

      await openIde('cordova', quasarConf.bin, this.target, true)
      return
    }

    const args = [ 'run', this.target ]

    if (this.ctx.emulator) {
      args.push(`--target=${ this.ctx.emulator }`)
    }

    await this.__runCordovaCommand(
      quasarConf,
      args.concat(argv._)
    )
  }

  async build (quasarConfFile, argv) {
    const { quasarConf } = quasarConfFile

    const cordovaContext = {
      debug: this.ctx.debug === true,
      target: this.target
    }

    const outputTargetList = (
      ensureArray(quasarConf.cordova.getCordovaBuildOutputFolder?.(cordovaContext))
      || cordovaOutputFolders[ this.target ]
    )

    // Remove old build output
    outputTargetList.forEach(outputFile => {
      fse.removeSync(
        appPaths.resolve.cordova(outputFile)
      )
    })

    const args = argv[ 'skip-pkg' ] || argv.ide
      ? [ 'prepare', this.target ]
      : (
          quasarConf.cordova.getCordovaBuildParams?.(cordovaContext)
          || [ 'build', this.ctx.debug ? '--debug' : '--release', '--device', this.target ]
        )

    await this.__runCordovaCommand(
      quasarConf,
      args.concat(argv._)
    )

    if (argv[ 'skip-pkg' ] === true) {
      return
    }

    if (argv.ide) {
      await openIde('cordova', quasarConf.bin, this.target)
      return SIGNAL__BUILD_SHOULD_EXIT
    }

    const targetFolder = quasarConf.build.packagedDistDir

    for (const folder of outputTargetList) {
      const outputFolder = appPaths.resolve.cordova(folder)
      if (fse.existsSync(outputFolder)) {
        log(`Copying Cordova distributables from ${ outputFolder } to ${ targetFolder }`)
        log()
        fse.copySync(outputFolder, targetFolder)
        return
      }
    }

    warn(
      `No output folder found for target "${ this.target }".`
      + ' Files have not been copied to /dist. You will need'
      + ' to manually extract the Cordova distributables.'
    )
    log()
  }

  stop () {
    if (!this.pid) { return }

    log('Shutting down Cordova process...')
    process.kill(this.pid)
    this.__cleanup()
  }

  __runCordovaCommand (quasarConf, args) {
    this.cordovaConfig.prepare(quasarConf)

    if (this.target === 'ios' && quasarConf.cordova.noIosLegacyBuildFlag !== true) {
      args.push('--buildFlag=-UseModernBuildSystem=0')
    }

    return new Promise(resolve => {
      this.pid = spawn(
        'cordova',
        args,
        { cwd: appPaths.cordovaDir },
        code => {
          this.__cleanup()
          if (code) {
            fatal('Cordova CLI has failed', 'FAIL')
          }
          resolve()
        }
      )
    })
  }

  __cleanup () {
    this.pid = 0
    this.cordovaConfig.reset()
  }
}

module.exports = new CordovaRunner()
