import { join } from 'node:path'
import fse from 'fs-extra'
import debounce from 'lodash/debounce.js'
import chokidar from 'chokidar'
import { createServer } from 'vite'

import { AppDevserver } from '../../app-devserver.js'
import { quasarBexConfig } from './bex-config.js'
import { createManifest, copyBexAssets } from './bex-utils.js'

export class QuasarModeDevserver extends AppDevserver {
  #viteWatchers = []
  #manifestWatcher = null
  #scriptWatchers = []

  #viteServer = null
  #scriptList = []

  constructor (opts) {
    super(opts)

    this.registerDiff('distDir', quasarConf => [
      quasarConf.build.distDir
    ])

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

  run (quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    if (diff('distDir', quasarConf)) {
      return queue(() => this.#stopWatchers(quasarConf))
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

  async #stopWatchers (quasarConf) {
    while (this.#viteWatchers.length !== 0) {
      await this.#viteWatchers.pop().close()
    }

    if (this.#manifestWatcher !== null) {
      this.#manifestWatcher.close()
      this.#manifestWatcher = null
    }

    while (this.#scriptWatchers.length !== 0) {
      await this.#scriptWatchers.pop().close()
    }

    this.cleanArtifacts(quasarConf.build.distDir)
  }

  async #compileBexManifest (quasarConf, queue) {
    if (this.#manifestWatcher !== null) {
      this.#manifestWatcher.close()
    }

    const { err, scriptList } = createManifest(quasarConf)
    if (err !== void 0) process.exit(1)

    const setScripts = list => {
      this.#scriptList = list
      return JSON.stringify(list)
    }

    let scriptSnapshot = setScripts(scriptList)
    const updateClient = () => {
      this.printBanner(quasarConf)
      this.#viteServer?.ws.send({ type: 'custom', event: 'qbex:hmr:reload' })
    }

    this.#manifestWatcher = chokidar.watch(quasarConf.metaConf.bexManifestFile, { ignoreInitial: true })
    this.#manifestWatcher.on('change', debounce(() => {
      const { err, scriptList } = createManifest(quasarConf)
      if (err !== void 0) return

      const newSnapshot = setScripts(scriptList)

      if (newSnapshot === scriptSnapshot) {
        updateClient()
        return
      }

      scriptSnapshot = newSnapshot
      queue(() => this.#compileBexScripts(quasarConf).then(updateClient))
    }, 1000))
  }

  async #compileBexScripts (quasarConf) {
    while (this.#scriptWatchers.length !== 0) {
      await this.#scriptWatchers.pop().close()
    }

    const onRebuild = () => {
      this.printBanner(quasarConf)
      this.#viteServer?.ws.send({ type: 'custom', event: 'qbex:hmr:reload' })
    }

    for (const entry of this.#scriptList) {
      const contentConfig = await quasarBexConfig.bexScript(quasarConf, entry)

      await this.watchWithEsbuild(`Bex Script (${ entry.name })`, contentConfig, onRebuild)
        .then(esbuildCtx => { this.#scriptWatchers.push({ close: esbuildCtx.dispose }) })
    }
  }

  async #runVite (quasarConf, queue) {
    while (this.#viteWatchers.length !== 0) {
      await this.#viteWatchers.pop().close()
    }

    if (this.ctx.target.firefox) {
      const viteConfig = await quasarBexConfig.vite(quasarConf)
      await this.buildWithVite('BEX UI', viteConfig)

      this.#viteWatchers.push(
        this.#getAppSourceWatcher(quasarConf, viteConfig, queue),
        this.#getPublicDirWatcher(quasarConf)
      )
    }
    else {
      const viteConfig = await quasarBexConfig.vite(quasarConf)
      this.#viteServer = await createServer(viteConfig)

      await this.#viteServer.listen()

      this.#viteWatchers.push(
        {
          close: () => {
            const server = this.#viteServer
            this.#viteServer = null
            return server.close()
          }
        },

        this.#getIndexHtmlWatcher(quasarConf, this.#viteServer)
      )
    }

    this.#viteWatchers.push(
      this.#getBexAssetsDirWatcher(quasarConf)
    )

    this.printBanner(quasarConf)
  }

  // chrome only
  #getIndexHtmlWatcher (quasarConf, viteServer) {
    fse.ensureDirSync(join(quasarConf.build.distDir, 'www'))

    const templatePath = this.ctx.appPaths.resolve.app('index.html')
    const htmlPath = join(quasarConf.build.distDir, 'www/index.html')

    const updateTemplate = () => {
      const template = fse.readFileSync(templatePath, 'utf-8')
      viteServer.transformIndexHtml('/', template).then(html => {
        fse.writeFileSync(htmlPath, html, 'utf-8')
      })
    }

    const htmlWatcher = chokidar.watch(templatePath).on('change', updateTemplate)

    updateTemplate()
    return htmlWatcher
  }

  // chrome & firefox
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

  // firefox only
  #getAppSourceWatcher (quasarConf, viteConfig, queue) {
    const watcher = chokidar.watch([
      this.ctx.appPaths.srcDir,
      this.ctx.appPaths.resolve.app('index.html')
    ], {
      ignoreInitial: true
    })

    const rebuild = debounce(() => {
      queue(() => {
        return this.buildWithVite('BEX UI', viteConfig)
          .then(() => { this.printBanner(quasarConf) })
      })
    }, 1000)

    watcher.on('add', rebuild)
    watcher.on('change', rebuild)
    watcher.on('unlink', rebuild)

    return watcher
  }

  // firefox only
  #getPublicDirWatcher (quasarConf) {
    const watcher = chokidar.watch(this.ctx.appPaths.publicDir, { ignoreInitial: true })

    const copy = debounce(() => {
      fse.copySync(this.ctx.appPaths.publicDir, quasarConf.build.distDir)
      this.printBanner(quasarConf)
    }, 1000)

    watcher.on('add', copy)
    watcher.on('change', copy)

    return watcher
  }
}
