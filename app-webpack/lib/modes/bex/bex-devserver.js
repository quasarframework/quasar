const { join } = require('node:path')
const fse = require('fs-extra')
const cloneDeep = require('lodash/cloneDeep.js')
const debounce = require('lodash/debounce.js')
const chokidar = require('chokidar')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const { AppDevserver } = require('../../app-devserver.js')
const { quasarBexConfig } = require('./bex-config.js')
const { createManifest, copyBexAssets } = require('./bex-utils.js')

const reloadPayload = JSON.stringify({
  type: 'custom',
  event: 'qbex:hmr:reload'
})

module.exports.QuasarModeDevserver = class QuasarModeDevserver extends (
  AppDevserver
) {
  #webpackWatcherList = []
  #manifestWatcher = null
  #scriptWatcherList = []

  #webpackServer = null
  #scriptList = []

  #reloadExtension = () => {}

  constructor(opts) {
    super(opts)

    this.#reloadExtension = debounce(() => {
      this.#webpackServer?.webSocketServer.clients.forEach(client => {
        client.send(reloadPayload)
      })
    }, 200)

    this.registerDiff('distDir', quasarConf => [quasarConf.build.distDir])

    this.registerDiff('bexManifest', quasarConf => [
      quasarConf.sourceFiles.bexManifestFile,
      quasarConf.bex.extendBexManifestJson,
      quasarConf.build.distDir
    ])

    this.registerDiff('bexScripts', (quasarConf, diffMap) => [
      quasarConf.build.distDir,
      quasarConf.devServer.port,

      quasarConf.bex.extraScripts,
      quasarConf.bex.extendBexScriptsConf,

      // extends 'esbuild' diff
      ...diffMap.esbuild(quasarConf)
    ])
  }

  run(quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    if (diff('distDir', quasarConf)) {
      return queue(() => this.#onDistDir(quasarConf))
    }

    if (diff('bexManifest', quasarConf)) {
      return queue(() => this.#compileBexManifest(quasarConf, queue))
    }

    if (diff('bexScripts', quasarConf)) {
      return queue(() => this.#compileBexScripts(quasarConf))
    }

    if (diff('webpack', quasarConf)) {
      return queue(() => this.#runWebpack(quasarConf))
    }
  }

  async #onDistDir(quasarConf) {
    if (this.#manifestWatcher !== null) {
      this.#manifestWatcher.close()
      this.#manifestWatcher = null
    }

    await this.clearWatcherList(this.#webpackWatcherList, () => {
      this.#webpackWatcherList = []
    })
    await this.clearWatcherList(this.#scriptWatcherList, () => {
      this.#scriptWatcherList = []
    })

    this.cleanArtifacts(quasarConf.build.distDir)

    // ensure we have a stub www/index.html file otherwise the browser
    // will complain about it not being found
    const indexHtmlDir = join(quasarConf.build.distDir, 'www')
    fse.ensureDirSync(indexHtmlDir)
    fse.writeFileSync(join(indexHtmlDir, 'index.html'), '', 'utf-8')
  }

  #compileBexManifest(quasarConf, queue) {
    if (this.#manifestWatcher !== null) {
      this.#manifestWatcher.close()
    }

    const { err, scriptList } = createManifest(quasarConf)
    if (err !== void 0) process.exit(1)

    const setScripts = jsList => {
      this.#scriptList = jsList
      return JSON.stringify(jsList)
    }

    let scriptSnapshot = setScripts(scriptList)
    const updateClient = () => {
      this.printBanner(quasarConf)
      this.#reloadExtension()
    }

    this.#manifestWatcher = chokidar.watch(
      quasarConf.metaConf.bexManifestFile,
      { ignoreInitial: true }
    )
    this.#manifestWatcher.on(
      'change',
      debounce(() => {
        const { err: manifestErr, scriptList: manifestScriptList } =
          createManifest(quasarConf)
        if (manifestErr !== void 0) return

        const newSnapshot = setScripts(manifestScriptList)

        if (newSnapshot === scriptSnapshot) {
          updateClient()
          return
        }

        scriptSnapshot = newSnapshot
        queue(() => this.#compileBexScripts(quasarConf).then(updateClient))
      }, 500)
    )
  }

  async #compileBexScripts(quasarConf) {
    await this.clearWatcherList(this.#scriptWatcherList, () => {
      this.#scriptWatcherList = []
    })

    const onRebuild = () => {
      this.printBanner(quasarConf)
      this.#reloadExtension()
    }

    for (const entry of this.#scriptList) {
      const contentConfig = await quasarBexConfig.bexScript(quasarConf, entry)

      await this.watchWithEsbuild(
        `Bex Script (${entry.name})`,
        contentConfig,
        onRebuild
      ).then(esbuildCtx => {
        this.#scriptWatcherList.push({ close: esbuildCtx.dispose })
      })
    }
  }

  async #runWebpack(quasarConf, queue) {
    await this.clearWatcherList(this.#webpackWatcherList, () => {
      this.#webpackWatcherList = []
    })

    const webpackConf = await quasarBexConfig.webpack(quasarConf)

    if (this.ctx.target.firefox) {
      await this.buildWithWebpack('BEX UI', webpackConf)

      this.#webpackWatcherList.push(
        this.#getAppSourceWatcher(quasarConf, webpackConf, queue),
        this.#getPublicDirWatcher(quasarConf)
      )
    } else {
      let started = false

      return new Promise(resolve => {
        const compiler = webpack(webpackConf)

        compiler.hooks.done.tap('done-compiling', stats => {
          if (started === true) return

          // start dev server if there are no errors
          if (stats.hasErrors() === true) return

          started = true
          resolve()

          this.printBanner(quasarConf)
        })

        // start building & launch server
        // deep clone to avoid webpack-dev-server mutating the original config which causes double compilation
        this.#webpackServer = new WebpackDevServer(
          cloneDeep(quasarConf.devServer),
          compiler
        )
        this.#webpackServer.start()

        this.#webpackWatcherList.push({
          close: () => {
            const server = this.#webpackServer
            this.#webpackServer = null
            return server.stop()
          }
        })
      })
    }

    this.#webpackWatcherList.push(this.#getBexAssetsDirWatcher(quasarConf))
  }

  // chrome & firefox
  #getBexAssetsDirWatcher(quasarConf) {
    const folders = copyBexAssets(quasarConf)
    const watcher = chokidar.watch(folders, { ignoreInitial: true })

    const copy = debounce(() => {
      copyBexAssets(quasarConf)
      this.printBanner(quasarConf)

      if (this.ctx.target.chrome) {
        this.#reloadExtension()
      }
    }, 500)

    watcher.on('add', copy)
    watcher.on('change', copy)

    return watcher
  }

  // firefox only
  #getAppSourceWatcher(quasarConf, webpackConf, queue) {
    const watcher = chokidar.watch(
      [
        this.ctx.appPaths.srcDir,
        this.ctx.appPaths.resolve.app(quasarConf.sourceFiles.indexHtmlTemplate)
      ],
      {
        ignoreInitial: true
      }
    )

    const rebuild = debounce(() => {
      queue(() =>
        this.buildWithWebpack('BEX UI', webpackConf).then(() => {
          this.printBanner(quasarConf)
        })
      )
    }, 500)

    watcher.on('add', rebuild)
    watcher.on('change', rebuild)
    watcher.on('unlink', rebuild)

    return watcher
  }

  // firefox only
  #getPublicDirWatcher(quasarConf) {
    const watcher = chokidar.watch(this.ctx.appPaths.publicDir, {
      ignoreInitial: true
    })

    const copy = debounce(() => {
      fse.copySync(this.ctx.appPaths.publicDir, quasarConf.build.distDir)
      this.printBanner(quasarConf)
    }, 500)

    watcher.on('add', copy)
    watcher.on('change', copy)

    return watcher
  }
}
