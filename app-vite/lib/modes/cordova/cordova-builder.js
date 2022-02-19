
const fse = require('fs-extra')

const AppBuilder = require('../../builder')
const config = require('./cordova-config')

const { fatal } = require('../../helpers/logger')
const appPaths = require('../../app-paths')
const CordovaConfigFile = require('./config-file')
const { spawn } = require('../../helpers/spawn')
const openIde = require('../../helpers/open-ide')
const onShutdown = require('../../helpers/on-shutdown')

class CapacitorBuilder extends AppBuilder {
  #cordovaConfigFile = new CordovaConfigFile()

  async build () {
    await this.#buildFiles()
    await this.#packageFiles()
  }

  async #buildFiles () {
    const viteConfig = config.vite(this.quasarConf)
    await this.buildWithVite('Cordova UI', viteConfig)
  }

  async #packageFiles () {
    const target = this.ctx.targetName

    if (target === 'android') {
      require('../../helpers/fix-android-cleartext')('cordova')
    }

    const buildPath = appPaths.resolve.cordova(
      target === 'android'
        ? 'platforms/android/app/build/outputs'
        : 'platforms/ios/build/emulator'
    )

    // Remove old build output
    fse.removeSync(buildPath)

    onShutdown(() => {
      this.#cleanup()
    })

    this.#cordovaConfigFile.prepare(this.quasarConf)

    const args = this.argv['skip-pkg'] || this.argv.ide
      ? ['prepare', target]
      : ['build', this.ctx.debug ? '--debug' : '--release', target]

    await this.#runCordovaCommand(
      args.concat(this.argv._),
      target
    )

    if (this.argv['skip-pkg'] !== true) {
      if (this.argv.ide) {
        await openIde('cordova', this.quasarConf.bin, target)
        process.exit(0)
      }

      fse.copySync(buildPath, this.quasarConf.metaConf.packagedDistDir)
    }
  }

  #cleanup () {
    this.#cordovaConfigFile.reset()
  }

  #runCordovaCommand (args, target) {
    if (target === 'ios' && this.quasarConf.cordova.noIosLegacyBuildFlag !== true) {
      args.push(`--buildFlag=-UseModernBuildSystem=0`)
    }

    return new Promise(resolve => {
      spawn(
        'cordova',
        args,
        { cwd: appPaths.cordovaDir },
        code => {
          this.#cleanup()

          if (code) {
            fatal('Cordova CLI has failed', 'FAIL')
          }

          resolve()
        }
      )
    })
  }
}

module.exports = CapacitorBuilder
