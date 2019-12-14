const webpack = require('webpack')

const logger = require('../helpers/logger')
const log = logger('app:electron')
const warn = logger('app:electron', 'red')
const { spawn } = require('../helpers/spawn')
const appPaths = require('../app-paths')
const nodePackager = require('../helpers/node-packager')
const getPackageJson = require('../helpers/get-package-json')
const getPackage = require('../helpers/get-package')

class ElectronRunner {
  constructor () {
    this.pid = 0
    this.watcher = null
  }

  init () {}

  async run (quasarConfig, argv) {
    const url = quasarConfig.getBuildConfig().build.APP_URL

    if (this.pid) {
      if (this.url !== url) {
        await this.stop()
      }
      else {
        return
      }
    }

    this.url = url

    const compiler = webpack(quasarConfig.getWebpackConfig().main)

    return new Promise(resolve => {
      log(`Building main Electron process...`)
      this.watcher = compiler.watch({}, async (err, stats) => {
        if (err) {
          console.log(err)
          return
        }

        log(`Webpack built Electron main process`)
        log()
        process.stdout.write(stats.toString({
          colors: true,
          modules: false,
          children: false,
          chunks: false,
          chunkModules: false
        }) + '\n')
        log()

        if (stats.hasErrors()) {
          warn(`⚠️  Electron main build failed with errors`)
          return
        }

        await this.__stopElectron()
        this.__startElectron(argv._)

        resolve()
      })
    })
  }

  build (quasarConfig) {
    const cfg = quasarConfig.getBuildConfig()

    return new Promise(resolve => {
      spawn(
        nodePackager,
        [ 'install', '--production' ],
        { cwd: cfg.build.distDir },
        code => {
          if (code) {
            warn(`⚠️  [FAIL] ${nodePackager} failed installing dependencies`)
            process.exit(1)
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
            log(`[SUCCESS] ${pkgName} built the app`)
            log()
            resolve()
          })
          .catch(err => {
            log()
            warn(`⚠️  [FAIL] ${pkgName} could not build`)
            log()
            console.error(err + '\n')
            reject()
          })
      })
    })
  }

  stop () {
    return new Promise(resolve => {
      const finalize = () => {
        this.__stopElectron().then(resolve)
      }

      if (this.watcher) {
        this.watcher.close(finalize)
        this.watcher = null
        return
      }

      finalize()
    })
  }

  __startElectron (extraParams) {
    log(`Booting up Electron process...`)
    this.pid = spawn(
      getPackage('electron'),
      [
        '--inspect=5858',
        appPaths.resolve.app('.quasar/electron/electron-main.js')
      ].concat(extraParams),
      { cwd: appPaths.appDir },
      code => {
        if (code) {
          warn()
          warn(`⚠️  Electron process ended with error code: ${code}`)
          warn()
          process.exit(1)
        }

        if (this.killPromise) {
          this.killPromise()
          this.killPromise = null
        }
        else { // else it wasn't killed by us
          warn()
          warn('Electron process was killed. Exiting...')
          warn()
          process.exit(0)
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
