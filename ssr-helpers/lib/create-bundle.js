/*
 * Forked from bundle-runner v0.0.1 NPM package
 */

const path = require('path')
const vm = require('vm')
const NativeModule = require('module')
const { SourceMapConsumer } = require('source-map')

const filenameRE = /\(([^)]+\.js):(\d+):(\d+)\)$/
const webpackRE = /^webpack:\/\/\//

function createCompile () {
  const _compileCache = {}

  return function compile (filename, code) {
    if (_compileCache[filename]) {
      return _compileCache[filename]
    }

    const wrapper = NativeModule.wrap(code)
    const script = new vm.Script(wrapper, {
      filename,
      displayErrors: true
    })

    _compileCache[filename] = script

    return script
  }
}

function createRequire (basedir, files, evaluateModule) {
  const nativeRequire = NativeModule.createRequire
    ? NativeModule.createRequire(basedir)
    : require

  function resolveFromFiles (id) {
    const _id = id.replace(/^\.\//, '')

    if (files[_id]) {
      return _id
    }
  }

  function _resolve (id) {
    return resolveFromFiles(id) || nativeRequire.resolve(id, { paths: [basedir] })
  }

  _resolve.paths = nativeRequire.resolve.paths.bind(nativeRequire.resolve)

  const _require = function (id) {
    const _resolvedFile = resolveFromFiles(id)
    return _resolvedFile
      ? evaluateModule(_resolvedFile)
      : nativeRequire(_resolve(id))
  }

  _require.resolve = _resolve
  _require.cache = {}
  _require.main = undefined

  return _require
}

function createModule (options) {
  return {
    require: options.require || require,
    id: options.id || 'default',
    filename: options.filename || 'default',
    parent: options.parent || null,
    paths: options.paths || [],
    exports: options.exports || {},
    loaded: options.loaded !== undefined ? options.loaded : false,
    children: options.children || []
  }
}

function createEvaluateModule (files, { basedir, runningScriptOptions }) {
  const _evalCache = {}
  const compile = createCompile()
  const require = createRequire(basedir || process.cwd(), files, evaluateModule)

  function evaluateModule (filename) {
    if (_evalCache[filename]) {
      return _evalCache[filename]
    }

    const code = files[filename]
    const script = compile(filename, code)

    const compiledWrapper = script.runInThisContext(runningScriptOptions)

    const module = createModule({ filename, id: filename, require })

    compiledWrapper.call(module, module.exports, require, module, filename, path.dirname(filename))

    const res = Object.prototype.hasOwnProperty.call(module.exports, 'default')
      ? module.exports.default
      : module.exports

    _evalCache[filename] = res

    return res
  }

  return evaluateModule
}

function getRewriteErrorTrace (rawMaps) {
  const _consumersCache = {}

  function getConsumer (source) {
    const rawMap = rawMaps[source]

    if (!rawMap) {
      return
    }

    if (!_consumersCache[source]) {
      _consumersCache[source] = Promise.resolve(new SourceMapConsumer(rawMap))
    }

    return _consumersCache[source]
  }

  async function rewriteTraceLine (_trace) {
    const m = _trace.match(filenameRE)

    if (!m) {
      return _trace
    }

    const consumer = await getConsumer(m[1])

    if (!consumer) {
      return _trace
    }

    const originalPosition = consumer.originalPositionFor({
      line: Number(m[2]),
      column: Number(m[3])
    })

    if (!originalPosition.source) {
      return _trace
    }

    const { source, line, column } = originalPosition
    const mappedPosition = `(${source.replace(webpackRE, '')}:${line}:${column})`
    const trace = _trace.replace(filenameRE, mappedPosition)

    return trace
  }

  return async function (err) {
    if (err && typeof err.stack === 'string') {
      const stack = err.stack.split('\n')
      const newStack = await Promise.all(stack.map(rewriteTraceLine))
      err.stack = newStack.join('\n')
    }

    return err
  }
}

function loadBundle(bundle, basedir) {
  if (!bundle) {
    throw new Error('Cannot load bundle!')
  }

  if (!bundle.entry) {
    throw new Error('Invalid bundle! Entry missing')
  }

  return {
    maps: {},
    files: {},
    ...bundle,
    basedir
  }
}

module.exports = function createBundle (opts) {
  const bundle = loadBundle(opts.serverManifest, opts.basedir)
  const evaluateModule = createEvaluateModule(bundle.files, opts)

  return {
    evaluateEntry () { return evaluateModule(bundle.entry) },
    rewriteErrorTrace: getRewriteErrorTrace(bundle.maps)
  }
}
