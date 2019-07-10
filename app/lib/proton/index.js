const
  chokidar = require('chokidar'),
  debounce = require('lodash.debounce')

const
  log = require('../helpers/logger')('app:proton'),
  { spawn } = require('../helpers/spawn'),
  onShutdown = require('../helpers/on-shutdown'),
  appPaths = require('../app-paths')

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
        appPaths.resolve.proton('lib'), // TODO remove this when the lib is isolated from template
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

    const buildFn = target => this.__runCargoCommand({
      cargoArgs: ['bundle']
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
}

module.exports = new ProtonRunner()
