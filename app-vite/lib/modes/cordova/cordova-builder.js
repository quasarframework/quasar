
const fse = require('fs-extra')
const { join } = require('node:path')

const { AppBuilder } = require('../../app-builder.js')
const { quasarCordovaConfig } = require('./cordova-config.js')

const appPaths = require('../../app-paths.js')
const { fatal } = require('../../utils/logger.js')
const { CordovaConfigFile } = require('./config-file.js')
const { spawn } = require('../../utils/spawn.js')
const { openIDE } = require('../../utils/open-ide.js')
const { onShutdown } = require('../../utils/on-shutdown.js')
const { fixAndroidCleartext } = require('../../utils/fix-android-cleartext.js')

module.exports.QuasarModeBuilder = class QuasarModeBuilder extends AppBuilder {
  #cordovaConfigFile = new CordovaConfigFile()

  async build () {
    await this.#buildFiles()
    await this.#packageFiles()
  }

  async #buildFiles () {
    const viteConfig = await quasarCordovaConfig.vite(this.quasarConf)
    await this.buildWithVite('Cordova UI', viteConfig)

    /**
     * We inject the cordova.js external script after build
     * so Vite won't warn about not being able to bundle script tag
     * (it shouldn't bundle it anyway in this case)
     *
     * Vite's warning would be:
     * <script src="cordova.js"> in "/index.html" can't be bundled without type="module" attribute
     */
    if (this.quasarConf.ctx.prod === true) {
      const indexHtmlFile = join(viteConfig.build.outDir, 'index.html')
      let html = this.readFile(indexHtmlFile)
      html = html.replace(
        /(<head[^>]*)(>)/i,
        (_, start, end) => `${ start }${ end }<script src="cordova.js"></script>`
      )
      this.writeFile(indexHtmlFile, html)
    }

    this.printSummary(viteConfig.build.outDir)
  }

  async #packageFiles () {
    const target = this.ctx.targetName

    if (target === 'android') {
      fixAndroidCleartext('cordova')
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

    const args = this.argv[ 'skip-pkg' ] || this.argv.ide
      ? [ 'prepare', target ]
      : [ 'build', this.ctx.debug ? '--debug' : '--release', target ]

    await this.#runCordovaCommand(
      args.concat(this.argv._),
      target
    )

    if (this.argv[ 'skip-pkg' ] !== true) {
      if (this.argv.ide) {
        await openIDE('cordova', this.quasarConf.bin, target)
        process.exit(0)
      }

      fse.copySync(buildPath, join(this.quasarConf.build.distDir, this.quasarConf.ctx.targetName))
    }
  }

  #cleanup () {
    this.#cordovaConfigFile.reset()
  }

  #runCordovaCommand (args, target) {
    if (target === 'ios' && this.quasarConf.cordova.noIosLegacyBuildFlag !== true) {
      args.push('--buildFlag=-UseModernBuildSystem=0')
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
