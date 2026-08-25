import { createServer } from 'vite'

import { AppDevserver } from '../../app-devserver.js'
import { CordovaConfigFile } from './config-file.js'
import { fatal, log } from '../../utils/logger.js'
import { spawn } from '../../utils/spawn.js'
import { onShutdown } from '../../utils/on-shutdown.js'
import { openIDE } from '../../utils/open-ide.js'
import { updateHtmlVariables } from '../../plugins/vite.html.js'
import { fixAndroidCleartext } from './android-cleartext.js'
import { quasarCordovaConfig } from './cordova-config.js'

export class QuasarModeDevserver extends AppDevserver {
  #pid = 0
  #target
  #cordovaConfigFile = new CordovaConfigFile()

  constructor(opts) {
    super(opts)

    this.#target = this.ctx.targetName

    if (this.#target === 'android') {
      fixAndroidCleartext(this.ctx.appPaths, 'add')
    }

    onShutdown(() => {
      this.#stopCordova()
    })

    this.registerDiff('cordova', quasarConf => [
      quasarConf.metaConf.APP_URL,
      quasarConf.cordova
    ])

    this.registerRunSteps([
      {
        diff: 'htmlTemplate',
        fn: quasarConf => {
          this.clientNeedsReload = true
          updateHtmlVariables(quasarConf)
        }
      },

      {
        diff: 'vite',
        fn: this.#runVite.bind(this)
      },

      {
        diff: 'cordova',
        fn: this.#runCordova.bind(this)
      }
    ])
  }

  async #runVite(quasarConf) {
    this.clientNeedsReload = false

    const viteConfig = await quasarCordovaConfig.vite(quasarConf)
    const server = await createServer(viteConfig)

    await this.rebootClient(server)
  }

  async #runCordova(quasarConf) {
    this.clientNeedsReload = false
    this.#stopCordova()

    await this.#runCordovaCommand(quasarConf, [
      'prepare',
      this.#target,
      ...this.argv._
    ])

    await openIDE({
      mode: 'cordova',
      bin: quasarConf.bin,
      target: this.#target,
      dev: true,
      appPaths: this.ctx.appPaths
    })
  }

  #stopCordova() {
    if (this.#pid) {
      log('Shutting down Cordova process...')
      process.kill(this.#pid)
      this.#cleanup()
    }
  }

  #runCordovaCommand(quasarConf, args) {
    this.#cordovaConfigFile.prepare(quasarConf)

    const { promise, resolve } = Promise.withResolvers()
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

    return promise
  }

  #cleanup() {
    this.#pid = 0
    this.#cordovaConfigFile.reset()
  }
}
