
const { build: esBuild } = require('esbuild')
const { bold, underline, green } = require('chalk')

function encode (obj) {
  return JSON.stringify(obj, (_, value) => {
    return typeof value === 'function'
      ? `/fn(${value.toString()})`
      : value
  })
}

function getConfSnapshot (extractFn, quasarConf) {
  return extractFn(quasarConf).map(item => item ? encode(item) : '')
}

const { log, info, success } = require('./helpers/logger')

function coloredName (name) {
  return bold(underline(green(name)))
}

class DevServer {
  #diffList = {}
  #entryFiles
  #runQueue = Promise.resolve()
  #runId = 0

  argv

  constructor ({ argv, entryFiles }) {
    this.argv = argv
    this.#entryFiles = entryFiles

    this.registerDiff('entryFiles', quasarConf => ([
      quasarConf.boot,
      quasarConf.css,
      quasarConf.extras,
      quasarConf.animations,
      quasarConf.framework
    ]))

    this.registerDiff('viteUrl', quasarConf => ([
      quasarConf.devServer.host,
      quasarConf.devServer.port,
      quasarConf.devServer.https
    ]))

    this.registerDiff('vite', quasarConf => ([
      quasarConf.sourceFiles,
      quasarConf.htmlVariables,
      quasarConf.devServer,
      quasarConf.build
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
    this.#diffList[name] = {
      snapshot: null,
      extractFn
    }
  }

  #diff (name, quasarConf) {
    const target = this.#diffList[name]
    const { snapshot, extractFn } = target

    const newSnapshot = getConfSnapshot(extractFn, quasarConf)
    target.snapshot = newSnapshot

    if (snapshot === null) {
      return true
    }

    const len = newSnapshot.length
    for (let i = 0; i < len; i++) {
      if (newSnapshot[i] !== snapshot[i]) {
        return true
      }
    }

    return false
  }

  async buildWithEsbuild (name, esbuildConfig) {
    const thread = coloredName(name)
    const startTime = Date.now()

    info(`Compiling of "${thread}" with Vite in progress...`, 'WAIT')
    log()
    await esBuild(esbuildConfig)
    log()

    const diffTime = +new Date() - startTime
    success(`"${thread}" compiled with success • ${diffTime}ms`, 'DONE')
    log()
  }
}

module.exports = DevServer
