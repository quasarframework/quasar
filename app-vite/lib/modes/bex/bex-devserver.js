import { join, relative } from 'node:path'
import fse from 'fs-extra'
import { watch as chokidarWatch } from 'chokidar'
import { createServer } from 'vite'

import { AppDevserver } from '../../app-devserver.js'
import { copyBexAssets, createManifest } from './bex-utils.js'
import { debounce } from '../../utils/rate-limit.js'
import { updateHtmlVariables } from '../../plugins/vite.html.js'
import { quasarBexConfig } from './bex-config.js'

export class QuasarModeDevserver extends AppDevserver {
  #viteWatcherList = []
  #manifestWatcher = null
  #scriptWatcherList = []
  #scriptList = []
  #reloadExtension = () => {}

  constructor(opts) {
    super(opts)

    this.#reloadExtension = debounce(() => {
      this.clientServer?.ws.send({ type: 'custom', event: 'qbex:hmr:reload' })
    }, 200)

    this.registerDiff('distDir', quasarConf => [
      quasarConf.build.distDir,
      quasarConf.build.allowOutsideProjectDistDir
    ])

    this.registerDiff('bexManifest', quasarConf => [
      quasarConf.sourceFiles.bexManifestFile,
      quasarConf.bex.extendBexManifestJson,
      quasarConf.build.distDir
    ])

    this.registerDiff('bexScripts', (quasarConf, diffMap) => [
      quasarConf.build.distDir,
      quasarConf.devServer.port,
      quasarConf.metaConf.clientEnvDefineList,

      quasarConf.bex.extraScripts,
      quasarConf.bex.extendBexScriptsConf,

      // extends 'rolldown' diff
      ...diffMap.rolldown(quasarConf)
    ])
  }

  run(quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    if (diff('vueDevtools', quasarConf)) {
      return queue(() => this.installVueDevtools(quasarConf))
    }

    if (diff('distDir', quasarConf)) {
      return queue(() => this.#onDistDir(quasarConf))
    }

    if (diff('bexManifest', quasarConf)) {
      return queue(() => this.#compileBexManifest(quasarConf, queue))
    }

    if (diff('bexScripts', quasarConf)) {
      return queue(() => this.#compileBexScripts(quasarConf))
    }

    if (diff('htmlTemplate', quasarConf)) {
      this.clientNeedsReload = true
      updateHtmlVariables(quasarConf)
    }

    if (diff('vite', quasarConf)) {
      this.clientNeedsReload = false
      return queue(() => this.#runVite(quasarConf, queue))
    }

    if (this.clientNeedsReload) this.reloadClient()
  }

  async #onDistDir(quasarConf) {
    if (this.#manifestWatcher !== null) {
      const watcher = this.#manifestWatcher
      this.#manifestWatcher = null
      await watcher.close()
    }

    await this.clearWatcherList(this.#viteWatcherList, () => {
      this.#viteWatcherList.length = 0
    })
    await this.clearWatcherList(this.#scriptWatcherList, () => {
      this.#scriptWatcherList.length = 0
    })

    this.cleanArtifacts(
      quasarConf.build.distDir,
      quasarConf.build.allowOutsideProjectDistDir
    )

    // ensure we have a stub www/index.html file otherwise the browser
    // will complain about it not being found
    const indexHtmlDir = join(quasarConf.build.distDir, 'www')
    fse.ensureDirSync(indexHtmlDir)
    fse.writeFileSync(join(indexHtmlDir, 'index.html'), '', 'utf8')
  }

  async #compileBexManifest(quasarConf, queue) {
    if (this.#manifestWatcher !== null) {
      const watcher = this.#manifestWatcher
      this.#manifestWatcher = null
      await watcher.close()
    }

    const { err: manifestErr, scriptList: manifestScriptList } =
      await createManifest(quasarConf)
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
    }).on(
      'change',
      debounce(async () => {
        const { err, scriptList } = await createManifest(quasarConf)
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
      this.#scriptWatcherList.length = 0
    })

    const onRebuild = () => {
      this.printBanner(quasarConf)
      this.#reloadExtension()
    }

    for (const entry of this.#scriptList) {
      const contentConfig = await quasarBexConfig.bexScript(quasarConf, entry)

      await this.watchWithRolldown(
        `Bex Script (${entry.name})`,
        contentConfig,
        onRebuild
      ).then(watcher => {
        this.#scriptWatcherList.push(watcher)
      })
    }
  }

  async #runVite(quasarConf, queue) {
    await this.clearWatcherList(this.#viteWatcherList, () => {
      this.#viteWatcherList.length = 0
    })

    const viteConfig = await quasarBexConfig.vite(quasarConf)

    if (this.ctx.target.firefox) {
      await this.buildWithVite('BEX UI', viteConfig)

      this.#viteWatcherList.push(
        this.#getAppSourceWatcher(quasarConf, viteConfig, queue),
        this.#getPublicDirWatcher(quasarConf)
      )
    } else {
      this.clientServer = await createServer(viteConfig)
      await this.clientServer.listen()

      this.#viteWatcherList.push({
        close: () => {
          const server = this.clientServer
          this.clientServer = null
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
      copyBexAssets(quasarConf, true)
      this.printBanner(quasarConf)

      if (this.ctx.target.chrome) {
        this.#reloadExtension()
      }
    }, 500)

    watcher.on('add', copy)
    watcher.on('change', copy)
    watcher.on('unlink', copy)
    watcher.on('addDir', copy)
    watcher.on('unlinkDir', copy)

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
    const { publicDir } = this.ctx.appPaths
    const watcher = chokidarWatch(publicDir, {
      ignoreInitial: true
    })

    const sync = source => {
      const target = join(
        quasarConf.build.distDir,
        'www',
        relative(publicDir, source)
      )

      if (fse.existsSync(source)) {
        fse.copySync(source, target)
      } else {
        fse.removeSync(target)
      }

      this.printBanner(quasarConf)
    }

    watcher.on('add', sync)
    watcher.on('change', sync)
    watcher.on('unlink', sync)
    watcher.on('addDir', sync)
    watcher.on('unlinkDir', sync)

    return watcher
  }
}
