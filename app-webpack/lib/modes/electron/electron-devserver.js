const { readFileSync } = require('node:fs')
const { join, dirname } = require('node:path')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const { AppDevserver } = require('../../app-devserver.js')
const { log, warn, fatal } = require('../../utils/logger.js')
const { spawn } = require('../../utils/spawn.js')
const { getPackagePath } = require('../../utils/get-package-path.js')
const { quasarElectronConfig } = require('./electron-config.js')

function wait (time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

module.exports.QuasarModeDevserver = class QuasarModeDevserver extends AppDevserver {
  #pid = 0
  #server
  #watcherList = []
  #killedPid = false
  #electronExecutable

  constructor (opts) {
    super(opts)

    const electronPkgPath = getPackagePath('electron/package.json', this.ctx.appPaths.appDir)
    const electronPkg = JSON.parse(
      readFileSync(electronPkgPath, 'utf-8')
    )

    this.#electronExecutable = join(dirname(electronPkgPath), electronPkg.bin.electron)

    this.registerDiff('electron', (quasarConf, diffMap) => [
      quasarConf.devServer,
      quasarConf.electron.extendElectronMainConf,
      quasarConf.electron.extendElectronPreloadConf,
      quasarConf.electron.inspectPort,
      quasarConf.electron.preloadScripts,
      quasarConf.sourceFiles.electronMain,

      // extends 'esbuild' diff
      ...diffMap.esbuild(quasarConf)
    ])
  }

  run (quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    if (diff('webpack', quasarConf)) {
      return queue(() => this.#runWebpack(quasarConf))
    }

    if (diff('electron', quasarConf)) {
      return queue(() => this.#runElectronFiles(quasarConf))
    }
  }

  async #runWebpack (quasarConf) {
    if (this.#server) {
      await this.#server.stop()
      this.#server = null
    }

    const webpackConf = await quasarElectronConfig.webpack(quasarConf)

    let started = false

    return new Promise(resolve => {
      const compiler = webpack(webpackConf)

      compiler.hooks.done.tap('done-compiling', stats => {
        if (started === true) { return }

        // start dev server if there are no errors
        if (stats.hasErrors() === true) {
          return
        }

        started = true
        resolve()
      })

      // start building & launch server
      this.#server = new WebpackDevServer(quasarConf.devServer, compiler)
      this.#server.start()
    })
  }

  async #runElectronFiles (quasarConf) {
    this.#watcherList.forEach(watcher => { watcher.close() })
    this.#watcherList = []

    let isReady = false

    const cfgMain = await quasarElectronConfig.main(quasarConf)
    const cfgPreloadList = await quasarElectronConfig.preloadScriptList(quasarConf)

    const cfgList = [
      { banner: 'Electron Main', cfg: cfgMain },
      ...cfgPreloadList.map(preloadScript => {
        return { banner: `Electron Preload (${ preloadScript.scriptName })`, cfg: preloadScript.esbuildConfig }
      })
    ].map(({ banner, cfg }) => {
      return this.watchWithEsbuild(banner, cfg, () => {
        if (isReady === true) {
          this.#runElectron(quasarConf)
        }
      }).then(esbuildCtx => {
        this.#watcherList.push({ close: esbuildCtx.dispose })
      })
    })

    return Promise.all(cfgList).then(() => {
      isReady = true
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
      this.#electronExecutable,
      [
        '--inspect=' + quasarConf.electron.inspectPort,
        this.ctx.appPaths.resolve.entry('electron-main.mjs')
      ].concat(this.argv._),
      { cwd: this.ctx.appPaths.appDir },
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
