/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 **/

import { join, basename } from 'path'
import express from 'express'
import { renderToString } from 'vue/server-renderer'
import serialize from 'serialize-javascript'

import renderTemplate from './render-template.js'
import clientManifest from './quasar.manifest.json'
import injectMiddlewares from './ssr-middlewares.js'
import serverEntry from './server/server-entry.js'

import productionExport from '<%= metaConf.ssrProductionExportScript %>'

const app = express()
const port = process.env.PORT || <%= ssr.prodPort %>

const doubleSlashRE = /\/\//g
const publicPath = `<%= build.publicPath %>`
const resolveUrlPath = publicPath === '/'
  ? url => url || '/'
  : url => url ? (publicPath + url).replace(doubleSlashRE, '/') : publicPath

const rootFolder = __dirname
const publicFolder = join(__dirname, 'client')

function resolvePublicFolder () {
  return join(publicFolder, ...arguments)
}

function serveStatic (path, opts = {}) {
  return express.static(resolvePublicFolder(path), {
    ...opts,
    maxAge: opts.maxAge === void 0
      ? <%= ssr.maxAge %>
      : opts.maxAge
  })
}

function renderPreloadLinks (modules) {
  let links = ''
  const seen = new Set()

  modules.forEach(id => {
    const files = clientManifest[id]
    if (files === void 0) {
      return
    }

    files.forEach(file => {
      if (seen.has(file) === true) {
        return
      }

      seen.add(file)
      const filename = basename(file)

      if (clientManifest[filename] !== void 0) {
        for (const depFile of clientManifest[filename]) {
          links += renderPreloadLink(depFile)
          seen.add(depFile)
        }
      }

      links += renderPreloadLink(file)
    })
  })

  return links
}

const jsRE = /\.js$/
const cssRE = /\.css$/
const woffRE = /\.woff$/
const woff2RE = /\.woff2$/
const gifRE = /\.gif$/
const jpgRE = /\.jpe?g$/
const pngRE = /\.png$/

function renderPreloadLink (file) {
  if (jsRE.test(file) === true) {
    return '<link rel="modulepreload" href="' + file + '" crossorigin>'
  }

  if (cssRE.test(file) === true) {
    return '<link rel="stylesheet" href="' + file + '">'
  }

  if (woffRE.test(file) === true) {
    return '<link rel="preload" href="' + file + '" as="font" type="font/woff" crossorigin>'
  }

  if (woff2RE.test(file) === true) {
    return '<link rel="preload" href="' + file + '" as="font" type="font/woff2" crossorigin>'
  }

  if (gifRE.test(file) === true) {
    return '<link rel="preload" href="' + file + '" as="image" type="image/gif">'
  }

  if (jpgRE.test(file) === true) {
    return '<link rel="preload" href="' + file + '" as="image" type="image/jpeg">'
  }

  if (pngRE.test(file) === true) {
    return '<link rel="preload" href="' + file + '" as="image" type="image/png">'
  }

  return ''
}

const autoRemove = 'var currentScript=document.currentScript;currentScript.parentNode.removeChild(currentScript)'

function renderVuexState (ssrContext) {
  if (ssrContext.state === void 0) {
    return ''
  }

  const nonce = ssrContext.nonce !== void 0
    ? ' nonce="' + ssrContext.nonce + '" '
    : ''

  const state = serialize(ssrContext.state, { isJSON: true })
  return '<script' + nonce + '>window.__INITIAL_STATE__=' + state + ';' + autoRemove + '</script>'
}

async function render (ssrContext) {
  const onRenderedList = []

  Object.assign(ssrContext, {
    _meta: {},
    onRendered: fn => { onRenderedList.push(fn) }
  })

  try {
    const app = await serverEntry(ssrContext)
    const runtimeApp = await renderToString(app, ssrContext)

    onRenderedList.forEach(fn => { fn() })

    // maintain compatibility with some well-known Vue plugins
    // like @vue/apollo-ssr:
    typeof ssrContext.rendered === 'function' && ssrContext.rendered()

    ssrContext._meta.runtimeApp = runtimeApp
    ssrContext._meta.runtimeScripts = renderVuexState(ssrContext)

    // @vitejs/plugin-vue injects code into a component's setup() that registers
    // itself on ctx.modules. After the render, ctx.modules would contain all the
    // components that have been instantiated during this render call.
    ssrContext._meta.endingHeadTags += renderPreloadLinks(ssrContext.modules)

    return renderTemplate(ssrContext)
  }
  catch (err) {
    throw err
  }
}

<% if (ssr.pwa) { %>
// serve this with no cache, if built with PWA:
app.use(resolveUrlPath('/service-worker.js'), serveStatic('service-worker.js', { maxAge: 0 }))
<% } %>

// serve "client" folder (includes the "public" folder)
app.use(resolveUrlPath('/'), serveStatic('.'))

const middlewareParams = {
  app,
  resolve: {
    urlPath: resolveUrlPath,
    root () { return join(rootFolder, ...arguments) },
    public: resolvePublicFolder
  },
  publicPath,
  folders: {
    root: rootFolder,
    public: publicFolder
  },
  render: ssrContext => render(ssrContext),
  serve: {
    static: serveStatic
  }
}

// inject custom middleware
const appPromise = injectMiddlewares(middlewareParams)

const isReady = () => appPromise

const ssrHandler = (req, res, next) => {
  return isReady().then(() => app(req, res, next))
}

export default productionExport({
  port,
  isReady,
  ssrHandler,
  ...middlewareParams
})
