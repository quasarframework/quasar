import { createServer } from 'vite'

import { AppDevserver } from '../../app-devserver.js'
import { CordovaConfigFile } from './config-file.js'
import { log, fatal } from '../../utils/logger.js'
import { spawn } from '../../utils/spawn.js'
import { onShutdown } from '../../utils/on-shutdown.js'
import { openIDE } from '../../utils/open-ide.js'
import { quasarCordovaConfig } from './cordova-config.js'
import { fixAndroidCleartext } from './android-cleartext.js'

export class QuasarModeDevserver extends AppDevserver {
  #pid = 0
  #server = null
  #target
  #cordovaConfigFile = new CordovaConfigFile()

  constructor (opts) {
    super(opts)

    this.registerDiff('cordova', quasarConf => [
      quasarConf.metaConf.APP_URL,
      quasarConf.cordova
    ])

    this.#target = this.ctx.targetName

    if (this.#target === 'android') {
      fixAndroidCleartext(this.ctx.appPaths, 'add')
    }

    onShutdown(() => {
      this.#stopCordova()
    })
  }

  run (quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    if (diff('vite', quasarConf)) {
      return queue(() => this.#runVite(quasarConf))
    }

    if (diff('cordova', quasarConf)) {
      return queue(() => this.#runCordova(quasarConf))
    }
  }

  async #runVite (quasarConf) {
    if (this.#server !== null) {
      await this.#server.close()
      this.#server = null
    }

    const viteConfig = await quasarCordovaConfig.vite(quasarConf)

    this.#server = await createServer(viteConfig)
    await this.#server.listen()
  }

  async #runCordova (quasarConf) {
    this.#stopCordova()

    if (this.argv.ide) {
      await this.#runCordovaCommand(
        quasarConf,
        [ 'prepare', this.#target ].concat(this.argv._)
      )

      await openIDE({
        mode: 'cordova',
        bin: quasarConf.bin,
        target: this.#target,
        dev: true,
        appPaths: this.ctx.appPaths
      })

      return
    }

    const args = [ 'run', this.#target ]

    if (this.ctx.emulator) {
      args.push(`--target=${ this.ctx.emulator }`)
    }

    await this.#runCordovaCommand(
      quasarConf,
      args.concat(this.argv._)
    )
  }

  #stopCordova () {
    if (this.#pid) {
      log('Shutting down Cordova process...')
      process.kill(this.#pid)
      this.#cleanup()
    }
  }

  #runCordovaCommand (quasarConf, args) {
    this.#cordovaConfigFile.prepare(quasarConf)

    if (this.#target === 'ios' && quasarConf.cordova.noIosLegacyBuildFlag !== true) {
      args.push('--buildFlag=-UseModernBuildSystem=0')
    }

    return new Promise(resolve => {
      this.#pid = spawn(
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

  #cleanup () {
    this.#pid = 0
    this.#cordovaConfigFile.reset()
  }
}
