const
  chokidar = require('chokidar'),
  debounce = require('lodash.debounce')

const
  log = require('../helpers/logger')('app:tauri'),
  { spawn } = require('../helpers/spawn'),
  onShutdown = require('../helpers/on-shutdown'),
  appPaths = require('../app-paths'),
  fse = require('fs-extra')

class TauriRunner {
  constructor() {
    this.pid = 0
    this.tauriWatcher = null

    onShutdown(() => {
      this.stop()
    })
  }

  async run(quasarConfig) {
    const
      cfg = quasarConfig.getBuildConfig(),
      url = cfg.build.APP_URL

    if (this.pid) {
      if (this.url !== url) {
        await this.stop()
      }
      else {
        return
      }
    }

    this.__manipulateToml(toml => {
      this.__whitelistApi(cfg, toml)
    })

    this.url = url

    const args = ['--url', url]

    const startDevTauri = () => {
      return this.__runCargoCommand({
        cargoArgs: ['run', '--features', 'dev', '--bin', 'app'],
        extraArgs: args
      })
    }

    // Start watching for tauri app changes
    this.tauriWatcher = chokidar
      .watch([
        appPaths.resolve.tauri('src'),
        appPaths.resolve.tauri('Cargo.toml'),
        appPaths.resolve.tauri('build.rs')
      ], {
        watchers: {
          chokidar: {
            ignoreInitial: true
          }
        }
      })
      .on('change', debounce(async () => {
        await this.__stopCargo()
        startDevTauri()
      }, 1000))

    return startDevTauri()
  }

  async build(quasarConfig) {
    const cfg = quasarConfig.getBuildConfig()

    this.__manipulateToml(toml => {
      this.__whitelistApi(cfg, toml)
    })

    const features = []
    if (cfg.tauri.serverless) {
      features.push('serverless')
    }

    const buildFn = target => this.__runCargoCommand({
      cargoArgs: [cfg.tauri.bundle ? 'tauri-bundle' : 'build']
        .concat(features.length ? ['--features', ...features] : [])
        .concat(cfg.ctx.debug ? [] : ['--release'])
        .concat(target ? ['--target', target] : [])
    })

    if (cfg.ctx.debug || !cfg.ctx.targetName) {
      // on debug mode or if not arget specified,
      // build only for the current platform
      return buildFn()
    }

    const targets = cfg.ctx.target.split(',')

    for (const target of targets) {
      await buildFn(target)
    }
  }

  stop() {
    return new Promise((resolve, reject) => {
      this.tauriWatcher && this.tauriWatcher.close()
      this.__stopCargo().then(resolve)
    })
  }

  __runCargoCommand({ cargoArgs, extraArgs }) {
    return new Promise(resolve => {
      this.pid = spawn(
        'cargo',

        extraArgs
          ? cargoArgs.concat(['--']).concat(extraArgs)
          : cargoArgs,

        appPaths.tauriDir,

        code => {
          if (code) {
            warn()
            warn(`⚠️  [FAIL] Cargo CLI has failed`)
            warn()
            process.exit(1)
          }

          if (this.killPromise) {
            this.killPromise()
            this.killPromise = null
          }
          else { // else it wasn't killed by us
            warn()
            warn('Cargo process was killed. Exiting...')
            warn()
            process.exit(0)
          }
        }
      )

      resolve()
    })
  }

  __stopCargo () {
    const pid = this.pid

    if (!pid) {
      return Promise.resolve()
    }

    log('Shutting down tauri process...')
    this.pid = 0

    return new Promise((resolve, reject) => {
      this.killPromise = resolve
      process.kill(pid)
    })
  }

   __manipulateToml(callback) {
     const toml = require('@iarna/toml'),
       tomlPath = appPaths.resolve.tauri('Cargo.toml'),
       tomlFile = fse.readFileSync(tomlPath),
       tomlContents = toml.parse(tomlFile)

     callback(tomlContents)

     const output = toml.stringify(tomlContents)
     fse.writeFileSync(tomlPath, output)
   }

   __whitelistApi(cfg, tomlContents) {
     if (!tomlContents.dependencies.tauri.features) {
       tomlContents.dependencies.tauri.features = []
     }

     if (cfg.tauri.whitelist.all) {
       if (!tomlContents.dependencies.tauri.features.includes('all-api')) {
         tomlContents.dependencies.tauri.features.push('all-api')
       }
     } else {
       const whitelist = Object.keys(cfg.tauri.whitelist).filter(w => cfg.tauri.whitelist[w] === true)
       tomlContents.dependencies.tauri.features = whitelist.concat(tomlContents.dependencies.tauri.features.filter(f => f !== 'api' && cfg.tauri.whitelist[f] !== true))
     }
   }
}

module.exports = new TauriRunner()
