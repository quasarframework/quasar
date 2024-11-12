import { createServer } from 'vite'

import { AppDevserver } from '../../app-devserver.js'
import { CapacitorConfigFile } from './config-file.js'
import { log, fatal } from '../../utils/logger.js'
import { spawn } from '../../utils/spawn.js'
import { onShutdown } from '../../utils/on-shutdown.js'
import { openIDE } from '../../utils/open-ide.js'
import { quasarCapacitorConfig } from './capacitor-config.js'

export class QuasarModeDevserver extends AppDevserver {
  #pid = 0
  #server = null
  #target
  #capacitorConfigFile = new CapacitorConfigFile()

  constructor (opts) {
    super(opts)

    this.#target = this.ctx.targetName

    onShutdown(() => {
      this.#stopCapacitor()
    })

    this.registerDiff('capacitor', quasarConf => [
      quasarConf.metaConf.APP_URL,
      quasarConf.capacitor
    ])
  }

  run (quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    if (diff('vite', quasarConf)) {
      return queue(() => this.#runVite(quasarConf))
    }

    if (diff('capacitor', quasarConf)) {
      return queue(() => this.#runCapacitor(quasarConf))
    }
  }

  async #runVite (quasarConf) {
    if (this.#server !== null) {
      await this.#server.close()
      this.#server = null
    }

    const viteConfig = await quasarCapacitorConfig.vite(quasarConf)

    this.#server = await createServer(viteConfig)
    await this.#server.listen()
  }

  async #runCapacitor (quasarConf) {
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

  #stopCapacitor () {
    if (this.#pid) {
      log('Shutting down Capacitor process...')
      process.kill(this.#pid)
      this.#cleanup()
    }
  }

  async #runCapacitorCommand (args, cwd, capBin) {
    return new Promise(resolve => {
      this.#pid = spawn(
        capBin,
        args,
        { cwd },
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
    this.#capacitorConfigFile.reset()
  }
}
