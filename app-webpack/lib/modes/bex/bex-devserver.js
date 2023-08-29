const debounce = require('lodash/debounce.js')
const chokidar = require('chokidar')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const { AppDevserver } = require('../../app-devserver.js')
const { quasarBexConfig } = require('./bex-config.js')
const { createManifest, copyBexAssets } = require('./utils.js')

module.exports.QuasarModeDevserver = class QuasarModeDevserver extends AppDevserver {
  #assetWatchers = []
  #scriptWatchers = []
  #server

  constructor (opts) {
    super(opts)

    this.registerDiff('bexScripts', (quasarConf, diffMap) => [
      quasarConf.bex.contentScripts,
      quasarConf.bex.extendBexScriptsConf,
      quasarConf.build.distDir,

      // extends 'esbuild' diff
      ...diffMap.esbuild(quasarConf)
    ])

    this.registerDiff('bexAssets', quasarConf => [
      quasarConf.sourceFiles.bexManifestFile,
      quasarConf.bex.extendBexManifestJson,
      quasarConf.build.distDir
    ])

    this.registerDiff('distDir', quasarConf => [
      quasarConf.build.distDir
    ])
  }

  run (quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    if (diff('distDir', quasarConf)) {
      this.#assetWatchers.forEach(watcher => { watcher.close() })
      this.#assetWatchers = []

      this.#scriptWatchers.forEach(watcher => { watcher.close() })
      this.#scriptWatchers = []

      this.cleanArtifacts(quasarConf.build.distDir)
    }

    if (diff('bexAssets', quasarConf)) {
      return queue(() => this.#compileBexAssets(quasarConf))
    }

    if (diff('bexScripts', quasarConf)) {
      return queue(() => this.#compileBexScripts(quasarConf))
    }

    if (diff('webpack', quasarConf)) {
      return queue(() => this.#runWebpack(quasarConf))
    }
  }

  async #compileBexScripts (quasarConf) {
    this.#scriptWatchers.forEach(watcher => { watcher.close() })
    this.#scriptWatchers = []

    const rebuilt = () => {
      this.printBanner(quasarConf)
    }

    const backgroundConfig = await quasarBexConfig.backgroundScript(quasarConf)
    await this.watchWithEsbuild('Background Script', backgroundConfig, rebuilt)
      .then(esbuildCtx => { this.#scriptWatchers.push({ close: esbuildCtx.dispose }) })

    for (const name of quasarConf.bex.contentScripts) {
      const contentConfig = await quasarBexConfig.contentScript(quasarConf, name)

      await this.watchWithEsbuild(`Content Script (${ name })`, contentConfig, rebuilt)
        .then(esbuildCtx => { this.#scriptWatchers.push({ close: esbuildCtx.dispose }) })
    }

    const domConfig = await quasarBexConfig.domScript(quasarConf)
    await this.watchWithEsbuild('Dom Script', domConfig, rebuilt)
      .then(esbuildCtx => { this.#scriptWatchers.push({ close: esbuildCtx.dispose }) })
  }

  async #runWebpack (quasarConf) {
    if (this.#server) {
      await this.#server.stop()
      this.#server = null
    }

    const webpackConf = await quasarBexConfig.webpack(quasarConf)

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

        this.printBanner(quasarConf)
      })

      // start building & launch server
      this.#server = new WebpackDevServer(quasarConf.devServer, compiler)
      this.#server.start()
    })
  }

  async #compileBexAssets (quasarConf) {
    this.#assetWatchers.forEach(watcher => { watcher.close() })

    this.#assetWatchers = [
      this.#getBexAssetsDirWatcher(quasarConf),
      this.#getBexManifestWatcher(quasarConf)
    ]

    this.printBanner(quasarConf)
  }

  #getBexAssetsDirWatcher (quasarConf) {
    const folders = copyBexAssets(quasarConf)
    const watcher = chokidar.watch(folders, { ignoreInitial: true })

    const copy = debounce(() => {
      copyBexAssets(quasarConf)
      this.printBanner(quasarConf)
    }, 1000)

    watcher.on('add', copy)
    watcher.on('change', copy)

    return watcher
  }

  #getBexManifestWatcher (quasarConf) {
    const { err, filename } = createManifest(quasarConf)

    if (err !== void 0) { process.exit(1) }

    const watcher = chokidar.watch(filename, { ignoreInitial: true })

    watcher.on('change', debounce(() => {
      createManifest(quasarConf)
      this.printBanner(quasarConf)
    }, 1000))

    return watcher
  }
}
