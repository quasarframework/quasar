const { createServer } = require('vite')

const appPaths = require('../../app-paths.js')
const { AppDevserver } = require('../../app-devserver.js')
const { log, warn, fatal } = require('../../utils/logger.js')
const { spawn } = require('../../utils/spawn.js')
const { getPackage } = require('../../utils/get-package.js')
const { quasarElectronConfig } = require('./electron-config.js')

function wait (time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

module.exports.QuasarModeDevserver = class QuasarModeDevserver extends AppDevserver {
  #pid = 0
  #server
  #stopMain
  #stopPreload
  #killedPid = false

  constructor (opts) {
    super(opts)

    this.registerDiff('electron', quasarConf => [
      quasarConf.eslint,
      quasarConf.devServer.host,
      quasarConf.devServer.port,
      quasarConf.devServer.https,
      quasarConf.build.env,
      quasarConf.build.rawDefine,
      quasarConf.electron.extendElectronMainConf,
      quasarConf.electron.extendElectronPreloadConf,
      quasarConf.electron.inspectPort,
      quasarConf.sourceFiles.electronMain,
      quasarConf.sourceFiles.electronPreload
    ])
  }

  run (quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    if (diff('vite', quasarConf)) {
      return queue(() => this.#runVite(quasarConf))
    }

    if (diff('electron', quasarConf)) {
      return queue(() => this.#runElectronFiles(quasarConf))
    }
  }

  async #runVite (quasarConf) {
    if (this.#server) {
      this.#server.close()
    }

    const viteConfig = await quasarElectronConfig.vite(quasarConf)

    this.#server = await createServer(viteConfig)
    await this.#server.listen()
  }

  async #runElectronFiles (quasarConf) {
    if (this.#stopMain) {
      this.#stopMain()
      this.#stopMain = null
    }

    if (this.#stopPreload) {
      this.#stopPreload()
      this.#stopPreload = null
    }

    let mainReady = false
    let preloadReady = false

    const cfgMain = await quasarElectronConfig.main(quasarConf)
    const cfgPreload = await quasarElectronConfig.preload(quasarConf)

    return Promise.all([
      this.watchWithEsbuild('Electron Main', cfgMain, () => {
        if (preloadReady === true) {
          this.#runElectron(quasarConf)
        }
      }).then(esbuildCtx => {
        mainReady = true
        this.#stopMain = esbuildCtx.dispose
      }),

      this.watchWithEsbuild('Electron Preload', cfgPreload, () => {
        if (mainReady === true) {
          this.#runElectron(quasarConf)
        }
      }).then(esbuildCtx => {
        preloadReady = true
        this.#stopPreload = esbuildCtx.dispose
      })
    ]).then(() => {
      return this.#runElectron(quasarConf)
    })
  }

  async #runElectron (quasarConf) {
    if (this.#pid) {
      log('Shutting down Electron process...')
      process.kill(this.#pid)

      this.#pid = 0
      this.#killedPid = true

      // on some OSes a small delay is needed
      // so that resources are freed on kill
      await wait(100)
    }

    this.#pid = spawn(
      getPackage('electron'),
      [
        '--inspect=' + quasarConf.electron.inspectPort,
        appPaths.resolve.app('.quasar/electron/electron-main.js')
      ].concat(this.argv._),
      { cwd: appPaths.appDir },
      code => {
        if (this.#killedPid === true) {
          this.#killedPid = false
        }
        else if (code) {
          warn()
          fatal(`Electron process ended with error code: ${ code }`)
        }
        else { // else it wasn't killed by us
          warn()
          fatal('Electron process was killed. Exiting...')
        }
      }
    )
  }
}
