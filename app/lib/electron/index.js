const webpack = require('webpack')

const { log, warn, fatal, success } = require('../helpers/logger')
const { spawn } = require('../helpers/spawn')
const appPaths = require('../app-paths')
const nodePackager = require('../helpers/node-packager')
const getPackageJson = require('../helpers/get-package-json')
const getPackage = require('../helpers/get-package')

class ElectronRunner {
  constructor () {
    this.pid = 0
    this.mainWatcher = null
    this.preloadWatcher = null
  }

  init () {}

  async run (quasarConfFile, argv) {
    const url = quasarConfFile.quasarConf.build.APP_URL

    if (this.pid) {
      if (this.url !== url) {
        await this.stop()
      }
      else {
        return
      }
    }

    this.url = url

    const mainCompiler = webpack(quasarConfFile.webpackConf.main)
    const preloadCompiler = webpack(quasarConfFile.webpackConf.preload)

    let mainReady = false
    let preloadReady = false

    const resolveMain = new Promise(resolve => {
      this.mainWatcher = mainCompiler.watch({}, async (err, stats) => {
        if (err) {
          console.log(err)
          return
        }

        if (stats.hasErrors()) {
          return
        }

        mainReady = true

        if (preloadReady === true) {
          await this.__stopElectron()
          this.__startElectron(argv._)
        }

        resolve()
      })
    })

    const resolvePreload = new Promise(resolve => {
      this.preloadWatcher = preloadCompiler.watch({}, async (err, stats) => {
        if (err) {
          console.log(err)
          return
        }

        if (stats.hasErrors()) {
          return
        }

        preloadReady = true

        if (mainReady === true) {
          await this.__stopElectron()
          this.__startElectron(argv._)
        }

        resolve()
      })
    })

    return Promise.all([ resolveMain, resolvePreload ])
  }

  build (quasarConfFile) {
    const cfg = quasarConfFile.quasarConf

    return new Promise(resolve => {
      spawn(
        nodePackager,
        [ 'install', '--production' ].concat(cfg.electron.unPackagedInstallParams),
        { cwd: cfg.build.distDir },
        code => {
          if (code) {
            fatal(`${nodePackager} failed installing dependencies`, 'FAIL')
          }
          resolve()
        }
      )
    }).then(() => {
      return new Promise(async resolve => {
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
        resolve()
      })
    }).then(() => {
      const bundlerName = cfg.electron.bundler
      const bundlerConfig = cfg.electron[bundlerName]
      const bundler = require('./bundler').getBundler(bundlerName)
      const pkgName = `electron-${bundlerName}`

      return new Promise((resolve, reject) => {
        log(`Bundling app with electron-${bundlerName}...`)
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
            success(`${pkgName} built the app`, 'SUCCESS')
            log()
            resolve()
          })
          .catch(err => {
            log()
            warn(`${pkgName} could not build`, 'FAIL')
            log()
            console.error(err + '\n')
            reject()
          })
      })
    })
  }

  stop () {
    return new Promise(resolve => {
      let counter = 0
      const maxCounter = (this.mainWatcher ? 1 : 0) + (this.preloadWatcher ? 1 : 0)

      const finalize = () => {
        counter++
        if (maxCounter <= counter) {
          this.__stopElectron().then(resolve)
        }
      }

      if (this.mainWatcher) {
        this.mainWatcher.close(finalize)
        this.mainWatcher = null
      }

      if (this.preloadWatcher) {
        this.preloadWatcher.close(finalize)
        this.preloadWatcher = null
      }

      if (maxCounter === 0) {
        finalize()
      }
    })
  }

  __startElectron (extraParams) {
    this.pid = spawn(
      getPackage('electron'),
      [
        '--inspect=5858',
        appPaths.resolve.app('.quasar/electron/electron-main.js')
      ].concat(extraParams),
      { cwd: appPaths.appDir },
      code => {
        if (this.killPromise) {
          this.killPromise()
          this.killPromise = null
        }
        else if (code) {
          warn()
          fatal(`Electron process ended with error code: ${code}`)
        }
        else { // else it wasn't killed by us
          warn()
          fatal('Electron process was killed. Exiting...')
        }
      }
    )
  }

  __stopElectron () {
    const pid = this.pid

    if (!pid) {
      return Promise.resolve()
    }

    log('Shutting down Electron process...')
    this.pid = 0
    return new Promise(resolve => {
      this.killPromise = resolve
      process.kill(pid)
    })
  }
}

module.exports = new ElectronRunner()
