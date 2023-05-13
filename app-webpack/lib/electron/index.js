const webpack = require('webpack')
const debounce = require('lodash/debounce.js')

const { log, warn, fatal, success } = require('../utils/logger.js')
const { spawn } = require('../utils/spawn.js')
const appPaths = require('../app-paths.js')
const { nodePackager } = require('../utils/node-packager.js')
const { getPackageJson } = require('../utils/get-package-json.js')
const { getPackage } = require('../utils/get-package.js')

class ElectronRunner {
  #pid
  #mainWatcher
  #preloadWatcher
  #url
  #inspectPort
  #justKilledIt
  #restartElectron

  constructor () {
    this.#pid = 0
    this.#mainWatcher = null
    this.#preloadWatcher = null

    this.#restartElectron = debounce(params => {
      this.#stopElectron()
      this.#startElectron(params)
    }, 1000)
  }

  init () {}

  async run (quasarConfFile, argv) {
    const { APP_URL: url } = quasarConfFile.quasarConf.build
    const { inspectPort } = quasarConfFile.quasarConf.electron

    if (this.#url === url && this.#inspectPort === inspectPort) {
      return
    }

    if (this.#pid) {
      this.stop()
    }

    this.#url = url
    this.#inspectPort = inspectPort

    const mainCompiler = webpack(quasarConfFile.webpackConf.main)
    const preloadCompiler = webpack(quasarConfFile.webpackConf.preload)

    let mainReady = false
    let preloadReady = false

    const resolveMain = new Promise(resolve => {
      this.#mainWatcher = mainCompiler.watch({}, async (err, stats) => {
        if (err) {
          console.log(err)
          return
        }

        if (stats.hasErrors()) {
          return
        }

        mainReady = true

        if (preloadReady === true) {
          this.#restartElectron(argv._)
        }

        resolve()
      })
    })

    const resolvePreload = new Promise(resolve => {
      this.#preloadWatcher = preloadCompiler.watch({}, async (err, stats) => {
        if (err) {
          console.log(err)
          return
        }

        if (stats.hasErrors()) {
          return
        }

        preloadReady = true

        if (mainReady === true) {
          this.#restartElectron(argv._)
        }

        resolve()
      })
    })

    return Promise.all([ resolveMain, resolvePreload ])
  }

  async build (quasarConfFile) {
    const cfg = quasarConfFile.quasarConf

    nodePackager.install({
      cwd: cfg.build.distDir,
      params: cfg.electron.unPackagedInstallParams,
      displayName: 'UnPackaged folder production',
      env: 'production'
    })

    if (typeof cfg.electron.beforePackaging === 'function') {
      log('Running beforePackaging()')
      log()

      const result = cfg.electron.beforePackaging({
        appPaths,
        unpackagedDir: cfg.build.distDir
      })

      if (result && result.then) {
        await result
      }

      log()
      log('[SUCCESS] Done running beforePackaging()')
    }

    const bundlerName = cfg.electron.bundler
    const bundlerConfig = cfg.electron[ bundlerName ]
    const bundler = require('./bundler.js').getBundler(bundlerName)
    const pkgName = `electron-${ bundlerName }`

    return new Promise((resolve, reject) => {
      log(`Bundling app with electron-${ bundlerName }...`)
      log()

      const bundlePromise = bundlerName === 'packager'
        ? bundler({
          ...bundlerConfig,
          electronVersion: getPackageJson('electron').version
        })
        : bundler.build(bundlerConfig)

      bundlePromise
        .then(() => {
          log()
          success(`${ pkgName } built the app`, 'SUCCESS')
          log()
          resolve()
        })
        .catch(err => {
          log()
          warn(`${ pkgName } could not build`, 'FAIL')
          log()
          console.error(err + '\n')
          reject()
        })
    })
  }

  stop () {
    this.#restartElectron.cancel()

    this.#stopElectron()

    ;[ this.#mainWatcher, this.#preloadWatcher ]
      .forEach(w => {
        if (w) {
          w.close()
        }
      })

    this.#mainWatcher = null
    this.#preloadWatcher = null
  }

  #stopElectron () {
    if (!this.#pid) { return }

    log('Shutting down Electron process...')
    process.kill(this.#pid)

    this.#pid = 0
    this.#justKilledIt = true
  }

  #startElectron (extraParams) {
    this.#pid = spawn(
      getPackage('electron'),
      [
        '--inspect=' + this.#inspectPort,
        appPaths.resolve.app('.quasar/electron/electron-main.js')
      ].concat(extraParams),
      { cwd: appPaths.appDir },
      code => {
        if (this.#justKilledIt === true) {
          this.#justKilledIt = false
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

module.exports = new ElectronRunner()
