import { createServer } from 'vite'

import { AppDevserver } from '../../app-devserver.js'
import { CapacitorConfigFile } from './config-file.js'
import { fatal, log } from '../../utils/logger.js'
import { spawn } from '../../utils/spawn.js'
import { onShutdown } from '../../utils/on-shutdown.js'
import { openIDE } from '../../utils/open-ide.js'
import { updateHtmlVariables } from '../../plugins/vite.html.js'
import { quasarCapacitorConfig } from './capacitor-config.js'

export class QuasarModeDevserver extends AppDevserver {
  #pid = 0
  #target
  #capacitorConfigFile = new CapacitorConfigFile()

  constructor(opts) {
    super(opts)

    this.#target = this.ctx.targetName

    onShutdown(() => {
      this.#stopCapacitor()
    })

    this.registerDiff('capacitor', quasarConf => [
      quasarConf.metaConf.APP_URL,
      quasarConf.capacitor
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
        diff: 'capacitor',
        fn: this.#runCapacitor.bind(this)
      }
    ])
  }

  async #runVite(quasarConf) {
    this.clientNeedsReload = false

    const viteConfig = await quasarCapacitorConfig.vite(quasarConf)
    const server = await createServer(viteConfig)

    await this.rebootClient(server)
  }

  async #runCapacitor(quasarConf) {
    this.clientNeedsReload = false
    this.#stopCapacitor()

    await this.#capacitorConfigFile.prepare(quasarConf, this.#target)

    const { appPaths, cacheProxy } = this.ctx
    const { capBin } = await cacheProxy.getModule('capCli')

    await this.#runCapacitorCommand(
      quasarConf.capacitor.capacitorCliPreparationParams,
      appPaths.capacitorDir,
      capBin
    )

    await openIDE({
      mode: 'capacitor',
      bin: quasarConf.bin,
      target: this.#target,
      dev: true,
      appPaths
    })
  }

  #stopCapacitor() {
    if (this.#pid) {
      log('Shutting down Capacitor process...')
      process.kill(this.#pid)
      this.#cleanup()
    }
  }

  #runCapacitorCommand(args, cwd, capBin) {
    const { promise, resolve } = Promise.withResolvers()
    this.#pid = spawn(
      capBin,
      args,
      { cwd, env: this.#capacitorConfigFile.runtimeEnv },
      code => {
        this.#cleanup()

        if (code) {
          fatal('Capacitor CLI has failed', 'FAIL')
        }

        resolve()
      }
    )

    return promise
  }

  #cleanup() {
    this.#pid = 0
  }
}
