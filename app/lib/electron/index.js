const
  spawn = require('../helpers/spawn'),
  webpack = require('webpack'),
  logger = require('../helpers/logger'),
  log = logger('app:electron'),
  warn = logger('app:electron', 'red'),
  path = require('path'),
  fse = require('fs-extra'),
  appPaths = require('../app-paths'),
  nodePackager = require('../helpers/node-packager')

class ElectronRunner {
  constructor () {
    this.pid = 0
    this.watcher = null
  }

  async run (quasarConfig) {
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

    return new Promise((resolve, reject) => {
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
          warn(`Electron main build failed with errors`)
          return
        }

        await this.__stopElectron()
        this.__startElectron()

        resolve()
      })
    })
  }

  build (quasarConfig) {
    const cfg = quasarConfig.getBuildConfig()

    return new Promise((resolve, reject) => {
      spawn(
        nodePackager,
        [ 'install', '--production' ],
        cfg.build.distDir,
        code => {
          if (code) {
            warn(`⚠️  [FAIL] ${nodePackager} failed installing dependencies`)
            process.exit(1)
          }
          resolve()
        }
      )
    }).then(() => {
      return new Promise(async (resolve, reject) => {
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
      const
        bundlerName = cfg.electron.bundler,
        bundlerConfig = cfg.electron[bundlerName],
        bundler = require('./bundler').getBundler(bundlerName),
        pkgName = `electron-${bundlerName}`

      return new Promise((resolve, reject) => {
        log(`Bundling app with electron-${bundlerName}...`)
        log()

        const bundlePromise = bundlerName === 'packager'
          ? bundler(bundlerConfig)
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
    return new Promise((resolve, reject) => {
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

  __startElectron () {
    log(`Booting up Electron process...`)
    this.pid = spawn(
      require(appPaths.resolve.app('node_modules/electron')),
      [
        '--inspect=5858',
        appPaths.resolve.app('.quasar/electron/electron-main.js')
      ],
      appPaths.appDir,
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
    return new Promise((resolve, reject) => {
      this.killPromise = resolve
      process.kill(pid)
    })
  }
}

module.exports = new ElectronRunner()
