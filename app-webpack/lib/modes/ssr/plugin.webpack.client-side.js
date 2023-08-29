/*
 * Forked from vue-server-renderer/client-plugin.js v2.6.12 NPM package
 */

const hash = require('hash-sum')
const { sources, Compilation } = require('webpack')

const jsRE = /\.js(\?[^.]+)?$/
const jsCssRE = /\.(js|css)($|\?)/
const swRE = /\s\w+$/
const hotUpdateRE = /\.hot-update\.js$/
const trailingSlashRE = /([^/])$/

const clientManifestFilename = '../quasar.manifest.json'
const uniq = arr => [ ...new Set(arr) ]

function ensureTrailingSlash (path) {
  return path === ''
    ? path
    : path.replace(trailingSlashRE, '$1/')
}

function groupFiles (fileList) {
  const head = []
  const body = []

  for (const file of fileList) {
    const target = jsRE.test(file) ? body : head
    target.push(file)
  }

  return { h: head, b: body }
}

function getClientManifest (compilation) {
  const stats = compilation.getStats().toJson()
  const publicPath = ensureTrailingSlash(stats.publicPath)

  const allFiles = uniq(
    stats.assets
      .map(a => a.name)
      .filter(file => hotUpdateRE.test(file) === false)
  )

  const assetModules = stats.modules.filter(m => m.assets.length)

  const initialFiles = uniq(
    Object.keys(stats.entrypoints)
      .map(name => stats.entrypoints[ name ].assets.map(entry => entry.name))
      .reduce((assets, all) => all.concat(assets), [])
      .filter(file => hotUpdateRE.test(file) === false)
  )

  const asyncFiles = allFiles.filter(file => initialFiles.includes(file) === false)

  const manifest = {
    publicPath,
    initial: groupFiles(initialFiles),
    modules: {}
  }

  stats.modules.forEach(m => {
    // ignore modules duplicated in multiple chunks
    if (m.chunks.length === 1) {
      const cid = m.chunks[ 0 ]
      const chunk = stats.chunks.find(c => c.id === cid)

      if (!chunk || !chunk.files) return

      const id = m.identifier.replace(swRE, '') // remove appended hash
      const files = manifest.modules[ hash(id) ] = chunk.files

      // find all asset modules associated with the same chunk
      assetModules.forEach(m => {
        if (m.chunks.some(id => id === cid)) {
          files.push.apply(files, m.assets)
        }
      })
    }
  })

  const filterModuleFiles = file => asyncFiles.includes(file) || jsCssRE.test(file) === false

  for (const moduleId in manifest.modules) {
    const acc = {}
    const { h, b } = groupFiles(
      manifest.modules[ moduleId ]
        .filter(filterModuleFiles)
    )

    if (h.length !== 0) acc.h = h
    if (b.length !== 0) acc.b = b

    if (h.length || b.length) {
      manifest.modules[ moduleId ] = acc
    }
    else {
      delete manifest.modules[ moduleId ]
    }
  }

  return manifest
}

module.exports.getClientManifest = getClientManifest

module.exports.QuasarSSRClientPlugin = class QuasarSSRClientPlugin {
  apply (compiler) {
    compiler.hooks.thisCompilation.tap('quasar-ssr-client-plugin', compilation => {
      compilation.hooks.processAssets.tapAsync(
        { name: 'quasar-ssr-client-plugin', state: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL },
        (_, callback) => {
          const manifest = getClientManifest(compilation)
          const json = JSON.stringify(manifest, null, 2)
          const content = new sources.RawSource(json)

          if (compilation.getAsset(clientManifestFilename) !== void 0) {
            compilation.updateAsset(clientManifestFilename, content)
          }
          else {
            compilation.emitAsset(clientManifestFilename, content)
          }

          callback()
        }
      )
    })
  }
}
