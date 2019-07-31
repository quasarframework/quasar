const
  chokidar = require('chokidar'),
  debounce = require('lodash.debounce')

const
  log = require('../helpers/logger')('app:proton'),
  { spawn } = require('../helpers/spawn'),
  onShutdown = require('../helpers/on-shutdown'),
  appPaths = require('../app-paths'),
  fse = require('fs-extra')

class ProtonRunner {
  constructor() {
    this.pid = 0
    this.protonWatcher = null

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

    const startDevProton = () => {
      return this.__runCargoCommand({
        cargoArgs: ['run', '--features', 'dev', '--bin', 'app'],
        extraArgs: args
      })
    }

    // Start watching for proton app changes
    this.protonWatcher = chokidar
      .watch([
        appPaths.resolve.proton('src'),
        appPaths.resolve.proton('Cargo.toml'),
        appPaths.resolve.proton('build.rs')
      ], {
        watchers: {
          chokidar: {
            ignoreInitial: true
          }
        }
      })
      .on('change', debounce(async () => {
        await this.__stopCargo()
        startDevProton()
      }, 1000))

    return startDevProton()
  }

  async build(quasarConfig) {
    const cfg = quasarConfig.getBuildConfig()

    this.__manipulateToml(toml => {
      this.__whitelistApi(cfg, toml)
    })

    const features = []
    if (cfg.proton.embeddedServer.active) {
      features.push('embedded-server')
    }

    const buildFn = target => this.__runCargoCommand({
      cargoArgs: [cfg.proton.bundle.active ? 'proton-bundle' : 'build']
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
      this.protonWatcher && this.protonWatcher.close()
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

        appPaths.protonDir,

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

    log('Shutting down proton process...')
    this.pid = 0

    return new Promise((resolve, reject) => {
      this.killPromise = resolve
      process.kill(pid)
    })
  }

   __manipulateToml(callback) {
     const toml = require('@iarna/toml'),
       tomlPath = appPaths.resolve.proton('Cargo.toml'),
       tomlFile = fse.readFileSync(tomlPath),
       tomlContents = toml.parse(tomlFile)

     callback(tomlContents)

     const output = toml.stringify(tomlContents)
     fse.writeFileSync(tomlPath, output)
   }

   __whitelistApi(cfg, tomlContents) {
     if (!tomlContents.dependencies.proton.features) {
       tomlContents.dependencies.proton.features = []
     }

     if (cfg.proton.whitelist.all) {
       if (!tomlContents.dependencies.proton.features.includes('all-api')) {
         tomlContents.dependencies.proton.features.push('all-api')
       }
     } else {
       const whitelist = Object.keys(cfg.proton.whitelist).filter(w => cfg.proton.whitelist[w] === true)
       tomlContents.dependencies.proton.features = whitelist.concat(tomlContents.dependencies.proton.features.filter(f => f !== 'api' && cfg.proton.whitelist[f] !== true))
     }
   }
}

module.exports = new ProtonRunner()
