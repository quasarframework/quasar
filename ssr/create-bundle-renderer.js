/*
 * Forked from vue-bundle-runner v0.0.3 NPM package
 */

const path = require('path')
const createBundle = require('./helpers/bundle-runner')

/**
 * Creates a mapper that maps components used during a server-side render
 * to async chunk files in the client-side build, so that we can inline them
 * directly in the rendered HTML to avoid waterfall requests.
*/
function createMapper (clientManifest) {
  const map = createMap(clientManifest)

  // map server-side moduleIds to client-side files
  return function mapper(moduleIds) {
    const res = new Set()
    for (let i = 0; i < moduleIds.length; i++) {
      const mapped = map.get(moduleIds[i])
      if (mapped) {
        for (let j = 0; j < mapped.length; j++) {
          res.add(mapped[j])
        }
      }
    }
    return Array.from(res)
  }
}

function createMap (clientManifest) {
  const map = new Map()
  Object.keys(clientManifest.modules).forEach(id => {
    map.set(id, mapIdToFile(id, clientManifest))
  })
  return map
}

function mapIdToFile (id, clientManifest) {
  const files = []
  const fileIndices = clientManifest.modules[id]

  if (fileIndices) {
    fileIndices.forEach(index => {
      const file = clientManifest.all[index]

      // only include async files or non-js, non-css assets
      if (clientManifest.async.includes(file) || !(/\.(js|css)($|\?)/.test(file))) {
        files.push(file)
      }
    })
  }

  return files
}

function isJS (file) {
  return /\.js(\?[^.]+)?$/.test(file);
}

function isCSS (file) {
  return /\.css(\?[^.]+)?$/.test(file);
}

function normalizeFile (file) {
  const fileWithoutQuery = file.replace(/\?.*/, '')
  const extension = path.extname(fileWithoutQuery).slice(1)

  return {
    file,
    extension,
    fileWithoutQuery,
    asType: getPreloadType(extension)
  }
}

function ensureTrailingSlash (path) {
  return path === ''
    ? path
    : path.replace(/([^/])$/, '$1/')
}

function getPreloadType(ext) {
  if (ext === 'js') {
    return 'script'
  }
  else if (ext === 'css') {
    return 'style'
  }
  else if (/jpe?g|png|svg|gif|webp|ico/.test(ext)) {
    return 'image'
  }
  else if (/woff2?|ttf|otf|eot/.test(ext)) {
    return 'font'
  }
  else {
    // not exhausting all possibilities here, but above covers common cases
    return ''
  }
}

function createRenderContext ({ clientManifest, publicPath }) {
  const renderContext = { clientManifest, publicPath }

  if (renderContext.clientManifest) {
    renderContext.publicPath = renderContext.publicPath || renderContext.clientManifest.publicPath
    // preload/prefetch directives
    renderContext.preloadFiles = (renderContext.clientManifest.initial || []).map(normalizeFile)
    renderContext.prefetchFiles = (renderContext.clientManifest.async || []).map(normalizeFile)
    // Initial async chunk mapping
    renderContext.mapFiles = createMapper(renderContext.clientManifest);
  }

  renderContext.publicPath = ensureTrailingSlash(renderContext.publicPath || '/')

  return renderContext
}

function renderStyles (ssrContext, renderContext) {
  const initial = renderContext.preloadFiles || []
  const async = getUsedAsyncFiles(ssrContext, renderContext) || []
  const cssFiles = initial.concat(async).filter(({ file }) => isCSS(file))

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

function renderResourceHints (ssrContext, renderContext) {
  return renderPreloadLinks(ssrContext, renderContext) +
    renderPrefetchLinks(ssrContext, renderContext)
}

function renderPreloadLinks (ssrContext, renderContext) {
  const files = getPreloadFiles(ssrContext, renderContext)
  const shouldPreload = renderContext.shouldPreload

  if (files.length) {
    return files.map(({ file, extension, fileWithoutQuery, asType }) => {
      // by default, we only preload scripts or css
      if (!shouldPreload && asType !== 'script' && asType !== 'style') {
        return ''
      }

      // user wants to explicitly control what to preload
      if (shouldPreload && !shouldPreload(fileWithoutQuery, asType)) {
        return ''
      }

      const href = `${renderContext.publicPath}${file}`
      const as = asType !== '' ? ` as="${asType}"` : ''
      const extra = asType === 'font'
        ? ` type="font/${extension}" crossorigin`
        : ''

      return `<link rel="preload" href="${href}"${as}${extra}>`
    }).join('')
  }

  return ''
}

function renderPrefetchLinks (ssrContext, renderContext) {
  const shouldPrefetch = renderContext.shouldPrefetch

  if (renderContext.prefetchFiles) {
    const usedAsyncFiles = getUsedAsyncFiles(ssrContext, renderContext)
    const alreadyRendered = (file) => usedAsyncFiles && usedAsyncFiles.some(f => f.file === file)

    return renderContext.prefetchFiles.map(({ file, fileWithoutQuery, asType }) => {
      if (shouldPrefetch && !shouldPrefetch(fileWithoutQuery, asType)) {
        return ''
      }

      if (alreadyRendered(file)) {
        return ''
      }

      return `<link rel="prefetch" href="${renderContext.publicPath}${file}">`
    }).join('')
  }

  return ''
}

function renderScripts(ssrContext, renderContext) {
  if (renderContext.clientManifest && renderContext.preloadFiles) {
    const initial = renderContext.preloadFiles.filter(({ file }) => isJS(file))
    const async = (getUsedAsyncFiles(ssrContext, renderContext) || []).filter(({ file }) => isJS(file))

    return [ initial[0] ].concat(async, initial.slice(1))
      .map(({ file }) => `<script src="${renderContext.publicPath}${file}" defer></script>`)
      .join('')
  }

  return ''
}

function getPreloadFiles (ssrContext, renderContext) {
  const usedAsyncFiles = getUsedAsyncFiles(ssrContext, renderContext);

  return renderContext.preloadFiles || usedAsyncFiles
    ? (renderContext.preloadFiles || []).concat(usedAsyncFiles || [])
    : []
}

function getUsedAsyncFiles (ssrContext, renderContext) {
  if (!ssrContext._mappedFiles && ssrContext._registeredComponents && renderContext.mapFiles) {
    const registered = Array.from(ssrContext._registeredComponents)
    ssrContext._mappedFiles = renderContext.mapFiles(registered).map(normalizeFile)
  }

  return ssrContext._mappedFiles || []
}

module.exports = function createBundleRenderer (_bundle, renderOptions) {
  const renderContext = createRenderContext(renderOptions)
  const { evaluateEntry, rewriteErrorTrace } = createBundle(_bundle, renderOptions)

  async function runApp(ssrContext, evalContext) {
    try {
      const entry = await evaluateEntry(evalContext)
      const app = await entry(ssrContext)
      return app
    }
    catch (err) {
      rewriteErrorTrace(err)
      throw err
    }
  }

  return {
    async renderToString(ssrContext, evalContext) {
      try {
        ssrContext._registeredComponents = []

        const app = await runApp(ssrContext, evalContext)
        const html = await renderOptions.vueServerRenderer.renderToString(app, ssrContext)

        ssrContext.renderResourceHints = () => renderResourceHints(ssrContext, renderContext)
        ssrContext.renderStyles = () => renderStyles(ssrContext, renderContext)
        ssrContext.renderScripts = () => renderScripts(ssrContext, renderContext)

        return html
      }
      catch (err) {
        await rewriteErrorTrace(err)
        throw err
      }
    }
  }
}
