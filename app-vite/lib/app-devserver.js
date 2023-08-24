
import { AppTool } from './app-tool.js'
import { printDevRunningBanner } from './utils/banner.js'
import { encodeForDiff } from './utils/encode-for-diff.js'
import { EntryFilesGenerator } from './entry-files-generator.js'

function getConfSnapshot (extractFn, quasarConf) {
  return extractFn(quasarConf).map(item => (item ? encodeForDiff(item) : ''))
}

export class AppDevserver extends AppTool {
  #diffList = {}
  #entryFiles
  #runQueue = Promise.resolve()
  #runId = 0

  constructor (opts) {
    super(opts)

    this.#entryFiles = new EntryFilesGenerator(this.ctx)

    this.registerDiff('entryFiles', quasarConf => ([
      quasarConf.boot,
      quasarConf.css,
      quasarConf.extras,
      quasarConf.animations,
      quasarConf.framework,
      quasarConf.sourceFiles,
      quasarConf.preFetch,
      quasarConf.build.publicPath,
      quasarConf.ssr.pwa,
      quasarConf.ssr.middlewares,
      quasarConf.ssr.manualStoreSsrContextInjection,
      quasarConf.ssr.manualStoreSerialization,
      quasarConf.ssr.manualStoreHydration,
      quasarConf.ssr.manualPostHydrationTrigger
    ]))

    this.registerDiff('viteUrl', quasarConf => ([
      quasarConf.devServer.host,
      quasarConf.devServer.port,
      quasarConf.devServer.https
    ]))

    this.registerDiff('vite', quasarConf => ([
      quasarConf.eslint,
      quasarConf.htmlVariables,
      quasarConf.devServer,
      quasarConf.build,
      quasarConf.sourceFiles
    ]))
  }

  // to be called from inheriting class
  run (quasarConf, __isRetry) {
    if (this.#diff('entryFiles', quasarConf)) {
      this.#entryFiles.generate(quasarConf)
    }

    if (__isRetry !== true) {
      this.#runId++
    }

    // we return wrappers because we want these methods private
    // -- they shouldn't be called in all scenarios, which is why we
    // artificially restrict them to run() only
    return {
      diff: (name, quasarConf) => this.#diff(name, quasarConf),
      queue: fn => {
        return this.#queue(this.#runId, quasarConf, fn)
      }
    }
  }

  #queue (runId, quasarConf, fn) {
    this.#runQueue = this.#runQueue.then(() => fn()).then(() => {
      if (this.#runId === runId) {
        this.run(quasarConf, true)
      }
    })

    return this.#runQueue
  }

  registerDiff (name, extractFn) {
    this.#diffList[ name ] = {
      snapshot: null,
      extractFn
    }
  }

  #diff (name, quasarConf) {
    if (Array.isArray(name) === true) {
      const list = name.map(entry => this.#diff(entry, quasarConf))
      return list.some(entry => entry === true)
    }

    const target = this.#diffList[ name ]
    const { snapshot, extractFn } = target

    const newSnapshot = getConfSnapshot(extractFn, quasarConf)
    target.snapshot = newSnapshot

    if (snapshot === null) {
      return true
    }

    const len = newSnapshot.length
    for (let i = 0; i < len; i++) {
      if (newSnapshot[ i ] !== snapshot[ i ]) {
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

  printBanner (quasarConf) {
    printDevRunningBanner(quasarConf)
  }
}
