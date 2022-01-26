/*
 * Forked from vue-bundle-runner v0.0.3 NPM package
 */

const { extname } = require('path')
const serialize = require('serialize-javascript')

const createBundle = require('./lib/create-bundle')

const jsRE = /\.js(\?[^.]+)?$/
const cssRE = /\.css(\?[^.]+)?$/
const jsCssRE = /\.(js|css)($|\?)/
const queryRE = /\?.*/
const trailingSlashRE = /([^/])$/

/**
 * Creates a mapper that maps components used during a server-side render
 * to async chunk files in the client-side build, so that we can inline them
 * directly in the rendered HTML to avoid waterfall requests.
*/
function createMapper (clientManifest) {
  const map = new Map()

  Object.keys(clientManifest.modules).forEach(id => {
    map.set(id, mapIdToFile(id, clientManifest))
  })

  // map server-side moduleIds to client-side files
  return function mapper (moduleIds) {
    const res = new Set()
    for (let i = 0; i < moduleIds.length; i++) {
      const mapped = map.get(moduleIds[i])
      if (mapped) {
        for (let j = 0; j < mapped.length; j++) {
          const entry = mapped[j]
          if (entry !== void 0) {
            res.add(mapped[j])
          }
        }
      }
    }
    return Array.from(res)
  }
}

function mapIdToFile (id, clientManifest) {
  const files = []
  const fileIndices = clientManifest.modules[id]

  if (fileIndices !== void 0) {
    fileIndices.forEach(index => {
      const file = clientManifest.all[index]

      // only include async files or non-js, non-css assets
      if (
        clientManifest.async.includes(file) ||
        (jsCssRE.test(file) === false)
      ) {
        files.push(file)
      }
    })
  }

  return files
}

function normalizeFile (file) {
  const fileWithoutQuery = file.replace(queryRE, '')
  const extension = extname(fileWithoutQuery).slice(1)

  return {
    file,
    extension,
    fileWithoutQuery
  }
}

function ensureTrailingSlash (path) {
  return path === ''
    ? path
    : path.replace(trailingSlashRE, '$1/')
}

function createRenderContext (clientManifest) {
  return {
    clientManifest,
    publicPath: ensureTrailingSlash(clientManifest.publicPath || '/'),
    preloadFiles: (clientManifest.initial || []).map(normalizeFile),
    mapFiles: createMapper(clientManifest)
  }
}

function renderStyles (renderContext, usedAsyncFiles, ssrContext) {
  const initial = renderContext.preloadFiles
  const cssFiles = initial.concat(usedAsyncFiles).filter(({ file }) => cssRE.test(file))

  return (
    // render links for css files
    (
      cssFiles.length
        ? cssFiles.map(({ file }) => `<link rel="stylesheet" href="${renderContext.publicPath}${file}">`).join('')
        : ''
    ) +
    // ssrContext.styles is a getter exposed by vue-style-loader which contains
    // the inline component styles collected during SSR
    (ssrContext.styles || '')
  )
}

const autoRemove = 'var currentScript=document.currentScript;currentScript.parentNode.removeChild(currentScript)'

function renderVuexState (ssrContext, nonce) {
  if (ssrContext.state !== void 0) {
    const state = serialize(ssrContext.state, { isJSON: true })
    return `<script${nonce}>window.__INITIAL_STATE__=${state};${autoRemove}</script>`
  }

  return ''
}

function renderScripts(renderContext, usedAsyncFiles, nonce) {
  if (renderContext.preloadFiles.length > 0) {
    const initial = renderContext.preloadFiles.filter(({ file }) => jsRE.test(file))
    const async = usedAsyncFiles.filter(({ file }) => jsRE.test(file))

    return [ initial[0] ].concat(async, initial.slice(1))
      .map(({ file }) => `<script${nonce} src="${renderContext.publicPath}${file}" defer></script>`)
      .join('')
  }

  return ''
}

module.exports = function createRenderer (opts) {
  const renderContext = createRenderContext(opts.clientManifest)
  const { evaluateEntry, rewriteErrorTrace } = createBundle(opts)

  async function runApp(ssrContext) {
    try {
      const entry = await evaluateEntry()
      const app = await entry(ssrContext)
      return app
    }
    catch (err) {
      rewriteErrorTrace(err)
      throw err
    }
  }

  return async function renderToString (ssrContext, renderTemplate) {
    try {
      const onRenderedList = []

      Object.assign(ssrContext, {
        _modules: new Set(),
        _meta: {},
        onRendered: fn => { onRenderedList.push(fn) }
      })

      const app = await runApp(ssrContext)
      const resourceApp = await opts.vueRenderToString(app, ssrContext)
      const usedAsyncFiles = renderContext
        .mapFiles(Array.from(ssrContext._modules))
        .map(normalizeFile)

      onRenderedList.forEach(fn => { fn() })

      // maintain compatibility with some well-known Vue plugins
      // like @vue/apollo-ssr:
      typeof ssrContext.rendered === 'function' && ssrContext.rendered()

      const nonce = ssrContext.nonce !== void 0
        ? ` nonce="${ ssrContext.nonce }" `
        : ''

      Object.assign(ssrContext._meta, {
        resourceApp,
        resourceStyles: renderStyles(renderContext, usedAsyncFiles, ssrContext),
        resourceScripts: (
          renderVuexState(ssrContext, nonce)
          + renderScripts(renderContext, usedAsyncFiles, nonce)
        )
      })

      return renderTemplate(ssrContext)
    }
    catch (err) {
      await rewriteErrorTrace(err)
      throw err
    }
  }
}
