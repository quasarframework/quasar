/*
 * Forked from vue-server-renderer/client-plugin.js v2.6.12 NPM package
 */

// TODO vue3 - add as deps
const hash = require('hash-sum')

const jsCssRE = /\.(js|css)(\?[^.]+)?$/
const swRE = /\s\w+$/
const hotUpdateRE = /\.hot-update.js$/

const uniq = arr => [ ...new Set(arr) ]

module.exports = class QuasarSSRClientPlugin {
  constructor (cfg = {}) {
    this.cfg = cfg
  }

  apply (compiler) {
    compiler.hooks.emit.tapAsync('quasar-ssr-client-plugin', (compilation, cb) => {
      const stats = compilation.getStats().toJson()

      const allFiles = uniq(
        stats.assets.map(a => a.name).filter(file => hotUpdateRE.test(file) === false)
      )

      const initialFiles = uniq(
        Object.keys(stats.entrypoints)
          .map(name => stats.entrypoints[name].assets)
          .reduce((assets, all) => all.concat(assets), [])
          .filter(file => jsCssRE.test(file) === true && hotUpdateRE.test(file) === false)
      )

      const asyncFiles = allFiles
        .filter(file => jsCssRE.test(file))
        .filter(file => initialFiles.indexOf(file) < 0)

      const manifest = {
        publicPath: stats.publicPath,
        all: allFiles,
        initial: initialFiles,
        async: asyncFiles,
        modules: { /* [identifier: string]: Array<index: number> */ }
      }

      const assetModules = stats.modules.filter(m => m.assets.length)
      const fileToIndex = file => manifest.all.indexOf(file)

      stats.modules.forEach(m => {
        // ignore modules duplicated in multiple chunks
        if (m.chunks.length === 1) {
          const cid = m.chunks[0]
          const chunk = stats.chunks.find(c => c.id === cid)

          if (!chunk || !chunk.files) {
            return
          }

          const id = m.identifier.replace(swRE, '') // remove appended hash
          const files = manifest.modules[hash(id)] = chunk.files.map(fileToIndex)

          // find all asset modules associated with the same chunk
          assetModules.forEach(m => {
            if (m.chunks.some(id => id === cid)) {
              files.push.apply(files, m.assets.map(fileToIndex))
            }
          })
        }
      })

      const json = JSON.stringify(manifest, null, 2)

      compilation.assets[this.cfg.filename] = {
        source: () => json,
        size: () => json.length
      }

      cb()
    })
  }
}
