const { createServer } = require('vite')

const appPaths = require('../../app-paths.js')
const { AppDevserver } = require('../../app-devserver.js')
const { CapacitorConfigFile } = require('./config-file.js')
const { log, fatal } = require('../../utils/logger.js')
const { spawn } = require('../../utils/spawn.js')
const { onShutdown } = require('../../utils/on-shutdown.js')
const { openIDE } = require('../../utils/open-ide.js')
const { quasarCapacitorConfig } = require('./capacitor-config.js')
const { fixAndroidCleartext } = require('../../utils/fix-android-cleartext.js')
const { capBin } = require('./cap-cli.js')

module.exports.QuasarModeDevserver = class QuasarModeDevserver extends AppDevserver {
  #pid = 0
  #server
  #target
  #capacitorConfig = new CapacitorConfigFile()

  constructor (opts) {
    super(opts)

    this.registerDiff('capacitor', quasarConf => [
      quasarConf.metaConf.APP_URL,
      quasarConf.capacitor
    ])

    this.#target = opts.quasarConf.ctx.targetName

    if (this.#target === 'android') {
      fixAndroidCleartext('capacitor')
    }

    onShutdown(() => {
      this.#stopCapacitor()
    })
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
    if (this.#server) {
      this.#server.close()
    }

    const viteConfig = await quasarCapacitorConfig.vite(quasarConf)

    this.#server = await createServer(viteConfig)
    await this.#server.listen()
  }

  async #runCapacitor (quasarConf) {
    this.#stopCapacitor()
    this.#capacitorConfig.prepare(quasarConf, this.#target)

    await this.#runCapacitorCommand(quasarConf.capacitor.capacitorCliPreparationParams)

    await openIDE('capacitor', quasarConf.bin, this.#target, true)
  }

  #stopCapacitor () {
    if (this.#pid) {
      log('Shutting down Capacitor process...')
      process.kill(this.#pid)
      this.#cleanup()
    }
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
