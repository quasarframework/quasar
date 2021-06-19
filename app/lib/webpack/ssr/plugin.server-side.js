/*
 * Forked from vue-server-renderer/server-plugin.js v2.6.12 NPM package
 */

const { sources, Compilation } = require('webpack')

const jsRE = /\.js(\?[^.]+)?$/
const jsMapRE = /\.js\.map$/
const mapRE = /\.map$/

const banner = '@quasar/ssr/webpack-server-plugin'

function warn (msg) {
  console.warn(msg ? ` [warn] ${banner} ⚠️  ${msg}` : '')
}

function error (msg) {
  console.error(msg ? ` [error] ${banner} ⚠️  ${msg}` : '')
}

function getServerManifest (compilation) {
  const stats = compilation.getStats().toJson()
  const entryName = Object.keys(stats.entrypoints)[0]
  const entryInfo = stats.entrypoints[entryName]
  const entryAssets = entryInfo.assets.filter(file => jsRE.test(file.name))

  if (entryAssets.length > 1) {
    throw new Error(
      "Server-side bundle should have one single entry file. " +
      "Avoid using CommonsChunkPlugin in the server config."
    )
  }

  const entry = entryAssets[0]
  if (!entry || typeof entry.name !== 'string') {
    throw new Error(
      ("Entry \"" + entryName + "\" not found. Did you specify the correct entry option?")
    )
  }

  const serverManifest = {
    entry: entry.name,
    files: {},
    maps: {}
  }

  stats.assets.forEach(asset => {
    if (jsRE.test(asset.name)) {
      serverManifest.files[asset.name] = compilation.getAsset(asset.name).source.source()
    }
    else if (asset.name.match(jsMapRE)) {
      serverManifest.maps[asset.name.replace(mapRE, '')] = JSON.parse(
        compilation.getAsset(asset.name).source.source()
      )
    }

    // do not emit anything else for server
    compilation.deleteAsset(asset.name)
  })

  return serverManifest
}

module.exports.getServerManifest = getServerManifest

module.exports.QuasarSSRServerPlugin = class QuasarSSRServerPlugin {
  constructor (cfg = {}) {
    this.cfg = cfg
  }

  apply (compiler) {
    if (compiler.options.target !== 'node') {
      error('webpack config `target` should be "node".')
    }

    if (compiler.options.output && compiler.options.output.library && compiler.options.output.library.type !== 'commonjs2') {
      error('webpack config `output.libraryTarget` should be "commonjs2".')
    }

    if (!compiler.options.externals) {
      warn(
        'It is recommended to externalize dependencies in the server build for ' +
        'better build performance.'
      )
    }

    compiler.hooks.thisCompilation.tap('quasar-ssr-server-plugin', compilation => {
      compilation.hooks.processAssets.tapAsync(
        { name: 'quasar-ssr-server-plugin', state: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL },
        (_, callback) => {
          const serverManifest = getServerManifest(compilation)
          const json = JSON.stringify(serverManifest, null, 2)
          const content = new sources.RawSource(json)

          if (compilation.getAsset(this.cfg.filename) !== void 0) {
            compilation.updateAsset(this.cfg.filename, content)
          }
          else {
            compilation.emitAsset(this.cfg.filename, content)
          }

          callback()
        }
      )
    })
  }
}
