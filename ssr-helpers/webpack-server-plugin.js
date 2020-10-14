/*
 * Forked from vue-server-renderer/server-plugin.js v2.6.12 NPM package
 */

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

module.exports = class QuasarSSRServerPlugin {
  constructor (cfg = {}) {
    this.cfg = cfg
  }

  apply (compiler) {
    if (compiler.options.target !== 'node') {
      error('webpack config `target` should be "node".')
    }

    if (compiler.options.output && compiler.options.output.libraryTarget !== 'commonjs2') {
      error('webpack config `output.libraryTarget` should be "commonjs2".')
    }

    if (!compiler.options.externals) {
      warn(
        'It is recommended to externalize dependencies in the server build for ' +
        'better build performance.'
      )
    }

    compiler.hooks.emit.tapAsync('quasar-ssr-server-plugin', (compilation, cb) => {
      const stats = compilation.getStats().toJson()
      const entryName = Object.keys(stats.entrypoints)[0]
      const entryInfo = stats.entrypoints[entryName]

      if (!entryInfo) {
        return cb()
      }

      const entryAssets = entryInfo.assets.filter(file => jsRE.test(file))

      if (entryAssets.length > 1) {
        throw new Error(
          "Server-side bundle should have one single entry file. " +
          "Avoid using CommonsChunkPlugin in the server config."
        )
      }

      const entry = entryAssets[0]
      if (!entry || typeof entry !== 'string') {
        throw new Error(
          ("Entry \"" + entryName + "\" not found. Did you specify the correct entry option?")
        )
      }

      const serverManifest = {
        entry,
        files: {},
        maps: {}
      }

      stats.assets.forEach(asset => {
        if (jsRE.test(asset.name)) {
          serverManifest.files[asset.name] = compilation.assets[asset.name].source()
        }
        else if (asset.name.match(jsMapRE)) {
          serverManifest.maps[asset.name.replace(mapRE, '')] = JSON.parse(
            compilation.assets[asset.name].source()
          )
        }

        // do not emit anything else for server
        delete compilation.assets[asset.name]
      })

      const json = JSON.stringify(serverManifest, null, 2)

      compilation.assets[this.cfg.filename] = {
        source: () => json,
        size: () => json.length
      }

      cb()
    })
  }
}
