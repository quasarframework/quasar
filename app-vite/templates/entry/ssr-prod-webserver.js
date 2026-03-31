/* eslint-disable */
/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 **/

import { join, basename, isAbsolute } from 'node:path'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { renderToString } from 'vue/server-renderer'
<% if (metaConf.hasStore && ssr.manualStoreSerialization !== true) { %>
import serialize from 'serialize-javascript'
<% } %>

import renderTemplate from './render-template.js'
import serverEntry from './server/server-entry.js'

import { create, listen, renderPreloadTag, serveStaticContent } from 'app/src-ssr/server'
import injectMiddlewares from './ssr-middlewares'

const port = process.env.PORT || <%= ssr.prodPort %>

const doubleSlashRE = /\/\//g
const publicPath = `<%= build.publicPath %>`
const resolveUrlPath = publicPath === '/'
  ? url => url || '/'
  : url => url ? (publicPath + url).replace(doubleSlashRE, '/') : publicPath

const rootFolder = fileURLToPath(new URL('.', import.meta.url))
const publicFolder = join(rootFolder, 'client')

const clientManifest = JSON.parse(
  readFileSync(join(rootFolder, './quasar.manifest.json'),
  'utf-8'
  )
)

function resolvePublicFolder () {
  const dir = join(...arguments)
  return isAbsolute(dir) === true
    ? dir
    : join(publicFolder, dir)
}

function renderModulesPreload (modules, opts) {
  let links = ''
  const seen = new Set()

  modules.forEach(id => {
    const files = clientManifest[id]
    if (files === void 0) return

    files.forEach(file => {
      if (seen.has(file) === true) return

      seen.add(file)
      const filename = basename(file)

      if (clientManifest[filename] !== void 0) {
        for (const depFile of clientManifest[filename]) {
          if (seen.has(depFile) === false) {
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

<% if (metaConf.hasStore && ssr.manualStoreSerialization !== true) { %>
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
  const onRenderedList = []

  Object.assign(ssrContext, {
    _meta: {},
    onRendered: fn => { onRenderedList.push(fn) }
  })

  try {
    const renderFn = await serverEntry(ssrContext)
    const runtimePageContent = await renderToString(renderFn, ssrContext)

    onRenderedList.forEach(fn => { fn() })

    // maintain compatibility with some well-known Vue plugins
    // like @vue/apollo-ssr:
    typeof ssrContext.rendered === 'function' && ssrContext.rendered()

    ssrContext._meta.runtimePageContent = runtimePageContent

    <% if (metaConf.hasStore && ssr.manualStoreSerialization !== true) { %>
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
  catch (err) {
    throw err
  }
}

const middlewareParams = {
  port,
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
  render
}

export const app = await create(middlewareParams)

// fill in "app" for next calls
middlewareParams.app = app

const serveStatic = await serveStaticContent(middlewareParams)
middlewareParams.serve = { static: serveStatic }

<% if (ssr.pwa) { %>
// serve the service worker with no cache
<% /* Keep SsrServeStaticFnParams["opts"] in sync */ %>
await serveStatic({ urlPath: '/<%= pwa.swFilename %>', pathToServe: '<%= pwa.swFilename %>', opts: { maxAge: 0 } })
<% } %>

// serve "client" folder (includes the "public" folder)
await serveStatic({ urlPath: '/', pathToServe: '.' })

await injectMiddlewares(middlewareParams)

export const listenResult = await listen(middlewareParams)
export const handler = listenResult?.handler
