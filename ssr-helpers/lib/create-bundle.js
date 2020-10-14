/*
 * Forked from bundle-runner v0.0.1 NPM package
 */

const path = require('path')
const fs = require('fs')
const vm = require('vm')
const NativeModule = require('module')
const { SourceMapConsumer } = require('source-map')

const { isAbsolute, dirname } = path
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

function createSourceMap(rawMaps = {}) {
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

  async function rewriteErrorTrace (err) {
    if (err && typeof err.stack === 'string') {
      const stack = err.stack.split('\n')
      const newStack = await Promise.all(stack.map(rewriteTraceLine))
      err.stack = newStack.join('\n')
    }

    return err
  }

  return { rewriteErrorTrace }
}

function loadBundle(bundle, basedir) {
  let bundleFile = 'bundle.js'

  // Load bundle if given filepath
  if (typeof bundle === 'string' && /\.js(on)?$/.test(bundle) && isAbsolute(bundle)) {
    bundleFile = bundle

    if (!fs.existsSync(bundleFile)) {
      throw new Error(`Cannot locate bundle file: ${bundleFile}`);
    }

    bundle = fs.readFileSync(bundleFile, 'utf-8')

    if (/\.json$/.test(bundleFile)) {
      try {
        bundle = JSON.parse(bundle)
      }
      catch (e) {
        throw new Error(`Invalid JSON bundle file: ${bundleFile}`)
      }
    }
  }

  if (typeof bundle === 'string') {
    bundle = {
      basedir: basedir || dirname(bundleFile),
      maps: {},
      entry: bundleFile,
      files: {
        [ bundleFile ]: bundle
      }
    }
  }

  if (!bundle) {
    throw new Error('Cannot load bundle!')
  }

  if (!bundle.entry) {
    throw new Error('Invalid bundle! Entry missing')
  }

  if (!bundle.maps) {
    bundle.maps = {}
  }

  if (!bundle.files) {
    bundle.files = {}
  }

  bundle.basedir = basedir || bundle.basedir || dirname(bundleFile)
  return bundle
}

module.exports = function createBundle (opts) {
  const bundle = loadBundle(opts.serverManifest, opts.basedir)
  const evaluateModule = createEvaluateModule(bundle.files, opts)

  return {
    evaluateEntry () { return evaluateModule(bundle.entry) },
    rewriteErrorTrace: createSourceMap(bundle.maps)
  }
}
