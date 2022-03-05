
const debounce = require('lodash.debounce')
const chokidar = require('chokidar')
const { copySync } = require('fs-extra')

const AppDevserver = require('../../app-devserver')
const appPaths = require('../../app-paths')
const config = require('./bex-config')

class BexDevServer extends AppDevserver {
  #uiWatcher
  #backgroundWatcher
  #contentWatcher
  #domWatcher

  constructor (opts) {
    super(opts)

    this.registerDiff('bex', quasarConf => [
      quasarConf.eslint,
      quasarConf.build.env,
      quasarConf.build.rawDefine,
      quasarConf.bex.extendScriptsConf
    ])
  }

  run (quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    if (diff('bex', quasarConf)) {
      return queue(() => this.#compileScripts(quasarConf))
    }

    if (diff('vite', quasarConf)) {
      return queue(() => this.#runVite(quasarConf, queue))
    }
  }

  async #runVite (quasarConf, queue) {
    const viteConfig = await config.vite(quasarConf)
    await this.buildWithVite('BEX UI', viteConfig)

    this.printBanner(quasarConf)

    if (this.#uiWatcher === void 0) {
      this.#uiWatcher = true

      const srcWatcher = chokidar.watch(appPaths.srcDir, {
        ignoreInitial: true
      })

      const rebuild = debounce(() => {
        queue(() => {
          return this.buildWithVite('BEX UI', viteConfig)
            .then(() => { this.printBanner(quasarConf) })
        })
      }, 1000)

      srcWatcher.on('add', rebuild)
      srcWatcher.on('change', rebuild)
      srcWatcher.on('unlink', rebuild)

      const publicWatcher = chokidar.watch(appPaths.publicDir, {
        ignoreInitial: true
      })

      const copyPublicDir = debounce(() => {
        queue(() => {
          copySync(appPaths.publicDir, viteConfig.build.outDir)
        })
      }, 1000)

      publicWatcher.on('add', copyPublicDir)
      publicWatcher.on('change', copyPublicDir)
    }
  }

  async #compileScripts (quasarConf) {
    this.#backgroundWatcher && this.#backgroundWatcher.close()
    this.#contentWatcher && this.#contentWatcher.close()
    this.#domWatcher && this.#domWatcher.close()

    const backgroundConfig = await config.backgroundScript(quasarConf)
    await this.buildWithEsbuild('Background Script', backgroundConfig, () => {})
      .then(result => { this.#backgroundWatcher = result })

    const contentConfig = await config.contentScript(quasarConf)
    await this.buildWithEsbuild('Content Script', contentConfig, () => {})
      .then(result => { this.#contentWatcher = result })

    const domConfig = await config.domScript(quasarConf)
    await this.buildWithEsbuild('Dom Script', domConfig, () => {})
      .then(result => { this.#domWatcher = result })
  }
}

module.exports = BexDevServer
