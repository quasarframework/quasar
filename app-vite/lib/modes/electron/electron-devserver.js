const { createServer } = require('vite')

const AppDevserver = require('../../app-devserver')
const appPaths = require('../../app-paths')
const { log, warn, fatal } = require('../../helpers/logger')
const { spawn } = require('../../helpers/spawn')
const getPackage = require('../../helpers/get-package')
const config = require('./electron-config')

function wait (time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

class ElectronDevServer extends AppDevserver {
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

    const viteConfig = await config.vite(quasarConf)

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

    const cfgMain = await config.main(quasarConf)
    const cfgPreload = await config.preload(quasarConf)

    return Promise.all([
      this.buildWithEsbuild('Electron Main', cfgMain, () => {
        if (preloadReady === true) {
          this.#runElectron(quasarConf)
        }
      }).then(result => {
        mainReady = true
        this.#stopMain = result.stop
      }),

      this.buildWithEsbuild('Electron Preload', cfgPreload, () => {
        if (mainReady === true) {
          this.#runElectron(quasarConf)
        }
      }).then(result => {
        preloadReady = true
        this.#stopPreload = result.stop
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

module.exports = ElectronDevServer
