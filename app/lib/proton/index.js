const
  fs = require('fs'),
  fse = require('fs-extra'),
  readline = require('readline'),
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
      return this.__runCargoCommand(
        ['run', '--features', 'dev'],
        args
      )
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

  build(quasarConfig) {
    const
      cfg = quasarConfig.getBuildConfig(),
      targets = [],
      buildRsFile = appPaths.resolve.proton('build.rs'),
      now = Date.now()

    fs.utimes(buildRsFile, now, now, function (err) { if (err) throw err })

    const buildFn = target => this.__runCargoCommand(
      ['build']
        .concat(cfg.ctx.debug ? [] : ['--release'])
        .concat(['--features', 'prod'])
        .concat(target ? ['--target', target] : [])
    )

    if (cfg.ctx.debug) {
      // on debug mode, build only for the current platform
      return buildFn()
    }

    // TODO
    const cargoConfig = fse.createReadStream(
      appPaths.resolve.proton('.cargo/config')
    )
    const rl = readline.createInterface({
      input: cargoConfig,
      output: () => {}
    })

    rl.on('line', line => {
      let matches = line.match(/\[target\.(\S+)\]/i)
      if (matches) {
        targets.push(matches[1])
      }
    })

    return new Promise(resolve => {
      // if the .cargo/config file is not found, build for the current platform
      cargoConfig.on('error', async () => {
        await buildFn()
        resolve()
      })

      // build for all targets AND current platform,
      // since it doesn't need to be configured on .cargo/config file
      rl.on('close', async () => {
        await buildFn()
        for (const target of targets) {
          await buildFn(target)
        }
        resolve()
      })
    })
  }

  stop() {
    return new Promise((resolve, reject) => {
      this.protonWatcher && this.protonWatcher.close()
      this.__stopCargo().then(resolve)
    })
  }

  __runCargoCommand(buildArgs, extraArgs) {
    return new Promise(resolve => {
      this.pid = spawn(
        'cargo',
        buildArgs.concat(['--']).concat(extraArgs || []),
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
