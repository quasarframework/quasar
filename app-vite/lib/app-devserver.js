import { AppTool } from './app-tool.js'
import { printDevRunningBanner } from './utils/banner.js'
import { encodeForDiff } from './utils/encode-for-diff.js'
import { EntryFilesGenerator } from './entry-files-generator.js'
import { generateTypes } from './types-generator.js'

function getConfSnapshot(extractFn, quasarConf, diffExtractFnMap) {
  return extractFn(quasarConf, diffExtractFnMap).map(item =>
    item ? encodeForDiff(item) : ''
  )
}

export class AppDevserver extends AppTool {
  #diffList = {}
  #diffExtractFnMap = {}
  #entryFiles
  #runQueue = Promise.resolve()
  #runId = 0

  clientNeedsReload = false
  clientServer = null

  constructor(opts) {
    super(opts)

    this.#entryFiles = new EntryFilesGenerator(this.ctx)

    this.registerDiff('entryFiles', quasarConf => [
      quasarConf.boot,
      quasarConf.css,
      quasarConf.extras,
      quasarConf.animations,
      quasarConf.framework,
      quasarConf.sourceFiles,
      quasarConf.preFetch,
      quasarConf.build.publicPath,
      quasarConf.build.vueRouterMode,
      ...(quasarConf.ctx.ssr
        ? [
            quasarConf.ssr.pwa,
            quasarConf.ssr.middlewares,
            quasarConf.ssr.manualStoreSsrContextInjection,
            quasarConf.ssr.manualStoreSerialization,
            quasarConf.ssr.manualStoreHydration,
            quasarConf.ssr.manualPostHydrationTrigger
          ]
        : quasarConf.ctx.ssg
          ? [
              quasarConf.ssg.pwa,
              quasarConf.ssg.manualStoreSsrContextInjection,
              quasarConf.ssg.manualStoreSerialization,
              quasarConf.ssg.manualStoreHydration,
              quasarConf.ssg.manualPostHydrationTrigger
            ]
          : [])
    ])

    this.registerDiff('types', quasarConf => [
      quasarConf.build.typescript,
      quasarConf.build.alias,
      quasarConf.build.define,
      quasarConf.build.filenameBasedRouting,
      quasarConf.metaConf.clientEnvDefineList,
      quasarConf.metaConf.backendEnvDefineList
    ])

    this.registerDiff('viteUrl', quasarConf => [quasarConf.metaConf.APP_URL])

    /**
     * To call this.updateHtmlVariables() if it matches.
     * Run diff BEFORE the 'vite' one!
     */
    this.registerDiff('htmlTemplate', quasarConf => [
      quasarConf.htmlVariables,
      quasarConf.build.define,
      quasarConf.metaConf.clientEnvDefineList,
      quasarConf.metaConf.backendEnvDefineList
    ])

    this.registerDiff('vite', quasarConf => [
      quasarConf.devServer,
      quasarConf.build,
      quasarConf.framework.autoImportComponentCase,
      quasarConf.framework.autoImportVueExtensions,
      quasarConf.framework.devTreeshaking,
      quasarConf.sourceFiles,
      quasarConf.metaConf.clientEnvDefineList
      /**
       * Warning!
       *
       * Remember to also extend and add quasarConf.metaConf.backendEnvDefineList
       * if it becomes relevant to the respective use-case
       */
    ])

    /**
     * To be extended only, depending on if it's shipped
     * to client or backend.
     */
    this.registerDiff('rolldown', quasarConf => [
      quasarConf.build.define,
      quasarConf.build.alias,
      quasarConf.build.minify,
      quasarConf.build.target
      /**
       * Warning!
       *
       * Remember to also extend and add
       * quasarConf.metaConf.clientEnvDefineList and quasarConf.metaConf.backendEnvDefineList
       * if they become relevant to the respective use-case
       */
    ])

    /**
     * Warning! Used by PWA, SSR and SSG,
     * so be careful when changing.
     */
    this.registerDiff('pwaManifest', quasarConf => [
      quasarConf.build.publicPath,
      quasarConf.pwa.manifestFilename,
      quasarConf.pwa.extendPWAManifestJson,
      quasarConf.pwa.useCredentialsForManifestTag,
      quasarConf.pwa.injectPWAMetaTags
    ])

    /**
     * Warning! Used by PWA, SSR and SSG,
     * so be careful when changing.
     */
    this.registerDiff('pwaServiceWorker', quasarConf => [
      quasarConf.pwa.workboxMode,
      quasarConf.pwa.swFilename,
      quasarConf.build,
      quasarConf.ctx.ssr && quasarConf.ssr.pwaOfflineHtmlFilename,
      quasarConf.ctx.ssg && quasarConf.ssg.pwaOfflineHtmlFilename,
      quasarConf.pwa.workboxMode === 'GenerateSW'
        ? [
            quasarConf.pwa.extendPWAGenerateSWOptions,
            quasarConf.ctx.ssr && quasarConf.ssr.extendSSRGenerateSWOptions,
            quasarConf.ctx.ssg && quasarConf.ssg.extendSSGGenerateSWOptions
          ]
        : [
            quasarConf.pwa.extendPWAInjectManifestOptions,
            quasarConf.pwa.extendPWACustomSWConf,
            quasarConf.sourceFiles.pwaServiceWorker,
            quasarConf.metaConf.clientEnvDefineList,
            quasarConf.ctx.ssr && quasarConf.ssr.extendSSRInjectManifestOptions,
            quasarConf.ctx.ssg && quasarConf.ssg.extendSSGInjectManifestOptions
          ]
    ])
  }

  // to be called from inheriting class
  run(quasarConf, __isRetry) {
    if (this.#diff('entryFiles', quasarConf)) {
      this.#entryFiles.generate(quasarConf)
    }

    if (this.#diff('types', quasarConf)) {
      generateTypes(quasarConf)
    }

    if (__isRetry !== true) {
      this.#runId++
    }

    // we return wrappers because we want these methods private
    // -- they shouldn't be called in all scenarios, which is why we
    // artificially restrict them to run() only
    return {
      diff: (name, diffQuasarConf) => this.#diff(name, diffQuasarConf),
      queue: fn => this.#queue(this.#runId, quasarConf, fn)
    }
  }

  #queue(runId, quasarConf, fn) {
    this.#runQueue = this.#runQueue
      .then(() => fn())
      .then(() => {
        if (this.#runId === runId) {
          this.run(quasarConf, true)
        }
      })

    return this.#runQueue
  }

  registerDiff(name, extractFn) {
    this.#diffList[name] = {
      snapshot: null,
      extractFn
    }

    this.#diffExtractFnMap[name] = extractFn
  }

  #diff(name, quasarConf) {
    const target = this.#diffList[name]
    const { snapshot, extractFn } = target

    const newSnapshot = getConfSnapshot(
      extractFn,
      quasarConf,
      this.#diffExtractFnMap
    )
    target.snapshot = newSnapshot

    if (snapshot === null) {
      return true
    }

    const len = newSnapshot.length
    for (let i = 0; i < len; i++) {
      if (newSnapshot[i] !== snapshot[i]) {
        // Leave here for debugging when needed
        // console.log(name, 'at index', i)
        // console.log('NEW >>>', newSnapshot[i])
        // console.log('OLD >>>', snapshot[i])
        // console.log('---')

        return true
      }
    }

    return false
  }

  reloadClient() {
    this.clientNeedsReload = false
    this.clientServer?.ws.send({ type: 'full-reload' })
  }

  async rebootClient(newServer) {
    this.clientNeedsReload = false

    if (this.clientServer !== null) {
      const watcher = this.clientServer
      this.clientServer = null
      await watcher.close()
    }

    this.clientServer = newServer
    await this.clientServer.listen()
  }

  clearWatcherList([...watcherList], clearFn) {
    clearFn()
    return Promise.all(watcherList.map(watcher => watcher.close()))
  }

  printBanner(quasarConf) {
    printDevRunningBanner(quasarConf)
  }
}
