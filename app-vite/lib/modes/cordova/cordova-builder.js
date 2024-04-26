import fse from 'fs-extra'
import { join } from 'node:path'

import { AppBuilder } from '../../app-builder.js'
import { quasarCordovaConfig } from './cordova-config.js'

import { log, warn, fatal } from '../../utils/logger.js'
import { CordovaConfigFile } from './config-file.js'
import { spawn } from '../../utils/spawn.js'
import { openIDE } from '../../utils/open-ide.js'
import { onShutdown } from '../../utils/on-shutdown.js'
import { fixAndroidCleartext } from '../../utils/fix-android-cleartext.js'

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

export class QuasarModeBuilder extends AppBuilder {
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
    const { appPaths } = this.ctx

    if (target === 'android') {
      fixAndroidCleartext(appPaths, 'cordova')
    }

    const cordovaContext = {
      debug: this.quasarConf.metaConf.debugging === true,
      target
    }

    const outputTargetList = (
      ensureArray(this.quasarConf.cordova.getCordovaBuildOutputFolder?.(cordovaContext))
      || cordovaOutputFolders[ target ]
    )

    // Remove old build output
    outputTargetList.forEach(outputFile => {
      fse.removeSync(
        appPaths.resolve.cordova(outputFile)
      )
    })

    onShutdown(() => {
      this.#cleanup()
    })

    this.#cordovaConfigFile.prepare(this.quasarConf)

    const args = this.argv[ 'skip-pkg' ] || this.argv.ide
      ? [ 'prepare', target ]
      : (
          this.quasarConf.cordova.getCordovaBuildParams?.(cordovaContext)
          || [ 'build', this.quasarConf.metaConf.debugging ? '--debug' : '--release', '--device', target ]
        )

    await this.#runCordovaCommand(
      args.concat(this.argv._),
      target
    )

    if (this.argv[ 'skip-pkg' ] !== true) {
      if (this.argv.ide) {
        await openIDE({
          mode: 'cordova',
          bin: this.quasarConf.bin,
          target,
          appPaths
        })
        process.exit(0)
      }

      const targetFolder = join(this.quasarConf.build.distDir, this.quasarConf.ctx.targetName)

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
        `No output folder found for target "${ target }".`
        + ' Files have not been copied to /dist. You will need'
        + ' to manually extract the Cordova distributables.'
      )
      log()
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
        { cwd: this.ctx.appPaths.cordovaDir },
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
