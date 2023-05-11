const { createServer } = require('vite')

const AppDevserver = require('../../app-devserver.js')
const appPaths = require('../../app-paths.js')
const CapacitorConfigFile = require('./config-file.js')
const { log, fatal } = require('../../helpers/logger.js')
const { spawn } = require('../../helpers/spawn.js')
const onShutdown = require('../../helpers/on-shutdown.js')
const openIde = require('../../helpers/open-ide.js')
const config = require('./capacitor-config.js')

const { capBin } = require('./cap-cli.js')

class CapacitorDevServer extends AppDevserver {
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
      require('../../helpers/fix-android-cleartext.js')('capacitor')
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

    const viteConfig = await config.vite(quasarConf)

    this.#server = await createServer(viteConfig)
    await this.#server.listen()
  }

  async #runCapacitor (quasarConf) {
    this.#stopCapacitor()
    this.#capacitorConfig.prepare(quasarConf, this.#target)

    await this.#runCapacitorCommand(quasarConf.capacitor.capacitorCliPreparationParams)

    await openIde('capacitor', quasarConf.bin, this.#target, true)
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

module.exports = CapacitorDevServer
