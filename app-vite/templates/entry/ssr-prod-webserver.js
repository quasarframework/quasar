/* oxlint-disable */
/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 **/

import { join, basename, isAbsolute } from 'node:path'
import { readFileSync } from 'node:fs'
import { renderToString } from 'vue/server-renderer'
<% if (quasarConf.metaConf.hasStore && quasarConf.ssr.manualStoreSerialization !== true) { %>
import serialize from '#q-serialize-javascript'
<% } %>

import renderTemplate from './render-template.js'
import serverEntry from './server/server-entry.js'
import clientManifest from './quasar.manifest.json' with { type: 'json' }

import { create, listen, renderPreloadTag, serveStaticContent } from '@/../src-ssr/server'
import injectMiddlewares from './ssr-middlewares'

const port = process.env.PORT || <%= quasarConf.ssr.prodPort %>

const multiSlashRE = /\/{2,}/g
const publicPath = `<%= quasarConf.build.publicPath %>`
const resolveUrlPath = publicPath === '/'
  ? url => url || '/'
  : url => url ? (publicPath + url).replace(multiSlashRE, '/') : publicPath

const rootFolder = import.meta.dirname
const publicFolder = join(rootFolder, 'client')
const serverAssetsFolder = join(rootFolder, 'server-assets')

<% if (quasarConf.ssr.clientSideRenderingRoutes.length !== 0) { %>
import picomatch from '#q-picomatch'
const csrHtml = readFileSync(
  join(
    import.meta.dirname,
    '<%= quasarConf.ssr.pwa ? `./client/${quasarConf.ssr.pwaOfflineHtmlFilename}` : './server/csr.html' %>'
  ),
  'utf8'
)
const isCsrRoute = picomatch(<%= JSON.stringify(quasarConf.ssr.clientSideRenderingRoutes) %>)
const trailingSlashRE = /\/+$/

function isCsrRouteMatch(route) {
  return isCsrRoute(route) || (
    route.length > 1
    && route.endsWith('/')
    && isCsrRoute(route.replace(trailingSlashRE, ''))
  )
}

function fastExtractPath(url) {
  let endIdx = url.length

  const hashIdx = url.indexOf('#')
  if (hashIdx !== -1) endIdx = hashIdx
  const queryIdx = url.indexOf('?')
  if (queryIdx !== -1 && queryIdx < endIdx) endIdx = queryIdx

  const cleanInput = url.slice(0, endIdx)

  if (cleanInput.startsWith('http://') || cleanInput.startsWith('https://')) {
    const protocolEnd = cleanInput.indexOf('://') + 3
    const pathStart = cleanInput.indexOf('/', protocolEnd)
    return pathStart === -1 ? '/' : cleanInput.slice(pathStart)
  }

  if (cleanInput.startsWith('//')) {
    const pathStart = cleanInput.indexOf('/', 2)
    return pathStart === -1 ? '/' : cleanInput.slice(pathStart)
  }

  return cleanInput.startsWith('/') ? cleanInput : '/' + cleanInput
}
<% } %>

function renderModulesPreload (modules, opts) {
  let links = ''
  const seen = new Set()

  modules.forEach(id => {
    const files = clientManifest[id]
    if (files === void 0) return

    files.forEach(file => {
      if (seen.has(file)) return

      seen.add(file)
      const filename = basename(file)

      if (clientManifest[filename] !== void 0) {
        for (const depFile of clientManifest[filename]) {
          if (!seen.has(depFile)) {
            links += renderPreloadTag(depFile, opts)
            seen.add(depFile)
          }
        }
      }

      links += renderPreloadTag(file, opts)
    })
  })

  return links
}

<% if (quasarConf.metaConf.hasStore && quasarConf.ssr.manualStoreSerialization !== true) { %>
const autoRemove = 'document.currentScript.remove()'

function renderStoreState (ssrContext) {
  const nonce = ssrContext.nonce !== void 0
    ? ' nonce="' + ssrContext.nonce + '"'
    : ''

  const state = serialize(ssrContext.state, { isJSON: true })
  return '<script' + nonce + '>window.__INITIAL_STATE__=' + state + ';' + autoRemove + '</script>'
}
<% } %>

async function render (ssrContext) {
  <% if (quasarConf.ssr.clientSideRenderingRoutes.length !== 0) { %>
  if (
    isCsrRouteMatch(
      fastExtractPath(ssrContext.url || ssrContext.req.url)<% if (quasarConf.build.publicPath !== '/') { %>.replace(publicPath, '/')<% } %>
    )
  ) return csrHtml
  <% } %>

  const onRenderedList = []

  Object.assign(ssrContext, {
    _meta: {},
    onRendered: fn => { onRenderedList.push(fn) }
  })

  const renderFn = await serverEntry(ssrContext)
  const runtimePageContent = await renderToString(renderFn, ssrContext)

  onRenderedList.forEach(fn => { fn() })

  // maintain compatibility with some well-known Vue plugins
  // like @vue/apollo-ssr:
  typeof ssrContext.rendered === 'function' && ssrContext.rendered()

  ssrContext._meta.runtimePageContent = runtimePageContent

  <% if (quasarConf.metaConf.hasStore && quasarConf.ssr.manualStoreSerialization !== true) { %>
  if (ssrContext.state !== void 0) {
    ssrContext._meta.headTags = renderStoreState(ssrContext) + ssrContext._meta.headTags
  }
  <% } %>

  // @vitejs/plugin-vue injects code into a component's setup() that registers
  // itself on ctx.modules. After the render, ctx.modules would contain all the
  // components that have been instantiated during this render call.
  ssrContext._meta.endingHeadTags += renderModulesPreload(ssrContext.modules, { ssrContext })

  return renderTemplate(ssrContext)
}

const middlewareParams = {
  port,
  resolve: {
    urlPath: resolveUrlPath,
    root: (...args) => join(rootFolder, ...args),
    public: (...args) => join(publicFolder, ...args),
    serverAssets: (...args) => join(serverAssetsFolder, ...args)
  },
  publicPath,
  folders: {
    root: rootFolder,
    public: publicFolder,
    serverAssets: serverAssetsFolder
  },
  render
}

const app = await create(middlewareParams)

// fill in "app" for next calls
middlewareParams.app = app

const serveStatic = await serveStaticContent(middlewareParams)
middlewareParams.serve = { static: serveStatic }

<% if (quasarConf.ssr.pwa) { %>
// serve the service worker with no cache
<% /* Keep SsrServeStaticFnParams["opts"] in sync */ %>
await serveStatic({
  urlPath: '/<%= quasarConf.pwa.swFilename %>',
  pathToServe: '<%= quasarConf.pwa.swFilename %>',
  opts: { maxAge: 0 }
})
<% } %>

// serve "client" folder (includes the "public" folder)
await serveStatic({ urlPath: '/', pathToServe: '.' })

await injectMiddlewares(middlewareParams)

const listenResult = await listen(middlewareParams)

<%
quasarConf.ssr.prodScriptNamedExport.forEach(exportName => {
if (exportName === 'renderSsrContext') { %>
const __renderSsrContext = render

<% } else { %>
const __<%= exportName %> = listenResult?.<%= exportName %>

<% } %>
<% }) %>

<%
const prodScriptNamedExportLen = quasarConf.ssr.prodScriptNamedExport.length
if (prodScriptNamedExportLen !== 0) { %>
export {
<% quasarConf.ssr.prodScriptNamedExport.forEach((exportName, idx) => { %>
  __<%= exportName %> as <%= exportName %><%= idx < prodScriptNamedExportLen - 1 ? ',\n' : '' %>
<% }) %>

}
<% } %>
