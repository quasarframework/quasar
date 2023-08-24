import { join } from 'node:path'
import fse from 'fs-extra'

import { AppBuilder } from '../../app-builder.js'
import { quasarCapacitorConfig } from './capacitor-config.js'

import { log, warn, fatal } from '../../utils/logger.js'
import { CapacitorConfigFile } from './config-file.js'
import { spawn, spawnSync } from '../../utils/spawn.js'
import { openIDE } from '../../utils/open-ide.js'
import { onShutdown } from '../../utils/on-shutdown.js'
import { fixAndroidCleartext } from '../../utils/fix-android-cleartext.js'

export class QuasarModeBuilder extends AppBuilder {
  #capacitorConfigFile = new CapacitorConfigFile()
  #packagedDir

  async build () {
    this.#packagedDir = join(this.quasarConf.build.distDir, this.ctx.targetName)

    await this.#buildFiles()
    await this.#packageFiles()
  }

  async #buildFiles () {
    const viteConfig = await quasarCapacitorConfig.vite(this.quasarConf)
    await this.buildWithVite('Capacitor UI', viteConfig)
    this.printSummary(viteConfig.build.outDir)
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

    const { capBin } = await cacheProxy.getModule('capCli')

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
    const buildType = this.ctx.debug ? 'debug' : 'release'
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
      [ `assemble${ this.ctx.debug ? 'Debug' : 'Release' }` ].concat(this.argv._),
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
