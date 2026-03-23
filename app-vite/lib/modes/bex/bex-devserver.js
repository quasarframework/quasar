import { join } from 'node:path'
import fse from 'fs-extra'
import debounce from 'lodash/debounce.js'
import { watch as chokidarWatch } from 'chokidar'
import { createServer } from 'vite'

import { AppDevserver } from '../../app-devserver.js'
import { quasarBexConfig } from './bex-config.js'
import { createManifest, copyBexAssets } from './bex-utils.js'

export class QuasarModeDevserver extends AppDevserver {
  #viteWatcherList = []
  #manifestWatcher = null
  #scriptWatcherList = []

  #viteServer = null
  #scriptList = []

  #reloadExtension = () => {}

  constructor(opts) {
    super(opts)

    this.#reloadExtension = debounce(() => {
      this.#viteServer?.ws.send({ type: 'custom', event: 'qbex:hmr:reload' })
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

    if (diff('vite', quasarConf)) {
      return queue(() => this.#runVite(quasarConf, queue))
    }
  }

  async #onDistDir(quasarConf) {
    if (this.#manifestWatcher !== null) {
      this.#manifestWatcher.close()
      this.#manifestWatcher = null
    }

    await this.clearWatcherList(this.#viteWatcherList, () => {
      this.#viteWatcherList = []
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

    const { err: manifestErr, scriptList: manifestScriptList } =
      createManifest(quasarConf)
    if (manifestErr !== void 0) process.exit(1)

    const setScripts = jsList => {
      this.#scriptList = jsList
      return JSON.stringify(jsList)
    }

    let scriptSnapshot = setScripts(manifestScriptList)
    const updateClient = () => {
      this.printBanner(quasarConf)
      this.#reloadExtension()
    }

    this.#manifestWatcher = chokidarWatch(quasarConf.metaConf.bexManifestFile, {
      ignoreInitial: true
    })
    this.#manifestWatcher.on(
      'change',
      debounce(() => {
        const { err, scriptList } = createManifest(quasarConf)
        if (err !== void 0) return

        const newSnapshot = setScripts(scriptList)

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

  async #runVite(quasarConf, queue) {
    await this.clearWatcherList(this.#viteWatcherList, () => {
      this.#viteWatcherList = []
    })

    const viteConfig = await quasarBexConfig.vite(quasarConf)

    if (this.ctx.target.firefox) {
      await this.buildWithVite('BEX UI', viteConfig)

      this.#viteWatcherList.push(
        this.#getAppSourceWatcher(quasarConf, viteConfig, queue),
        this.#getPublicDirWatcher(quasarConf)
      )
    } else {
      this.#viteServer = await createServer(viteConfig)

      await this.#viteServer.listen()

      this.#viteWatcherList.push({
        close: () => {
          const server = this.#viteServer
          this.#viteServer = null
          return server.close()
        }
      })
    }

    this.#viteWatcherList.push(this.#getBexAssetsDirWatcher(quasarConf))

    this.printBanner(quasarConf)
  }

  // chrome & firefox
  #getBexAssetsDirWatcher(quasarConf) {
    const folders = copyBexAssets(quasarConf)
    const watcher = chokidarWatch(folders, { ignoreInitial: true })

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
  #getAppSourceWatcher(quasarConf, viteConfig, queue) {
    const watcher = chokidarWatch(
      [this.ctx.appPaths.srcDir, this.ctx.appPaths.resolve.app('index.html')],
      {
        ignoreInitial: true
      }
    )

    const rebuild = debounce(() => {
      queue(() =>
        this.buildWithVite('BEX UI', viteConfig).then(() => {
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
    const watcher = chokidarWatch(this.ctx.appPaths.publicDir, {
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
