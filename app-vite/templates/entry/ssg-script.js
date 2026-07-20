/* oxlint-disable */
/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 **/

import { join, basename } from 'node:path'
import { renderToString } from 'vue/server-renderer'
<% if (quasarConf.metaConf.hasStore && quasarConf.ssg.manualStoreSerialization !== true) { %>
import serialize from '#q-serialize-javascript'
<% } %>

import renderTemplate from './render-template.js'
import serverEntry from './server-entry.js'
import clientManifest from './quasar.manifest.json' with { type: 'json' }

import { renderPreloadTag } from '@/../src-ssg/ssg-renderer'

export { getSsgPages } from '@/../src-ssg/ssg-renderer'

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

<% if (quasarConf.metaConf.hasStore && quasarConf.ssg.manualStoreSerialization !== true) { %>
const autoRemove = 'document.currentScript.remove()'

function renderStoreState (ssrContext) {
  const nonce = ssrContext.nonce !== void 0
    ? ' nonce="' + ssrContext.nonce + '"'
    : ''

  const state = serialize(ssrContext.state, { isJSON: true })
  return '<script' + nonce + '>window.__INITIAL_STATE__=' + state + ';' + autoRemove + '</script>'
}
<% } %>

export async function renderSsgPage (ssrContext, usePreloadTags) {
  const onRenderedList = []

  Object.assign(ssrContext, {
    _meta: {},
    onRendered: fn => { onRenderedList.push(fn) }
  })

  const app = await serverEntry(ssrContext)

  const originalErrorHandler = app.config.errorHandler
  app.config.errorHandler = (err, instance, info) => {
    ssrContext.__quasarSsrError = err
    originalErrorHandler?.(err, instance, info)
  }

  const runtimePageContent = await renderToString(app, ssrContext)

  if (ssrContext.__quasarSsrError) {
    throw ssrContext.__quasarSsrError
  }

  onRenderedList.forEach(fn => { fn() })

  // maintain compatibility with some well-known Vue plugins
  // like @vue/apollo-ssr:
  typeof ssrContext.rendered === 'function' && ssrContext.rendered()

  ssrContext._meta.runtimePageContent = runtimePageContent

  <% if (quasarConf.metaConf.hasStore && quasarConf.ssg.manualStoreSerialization !== true) { %>
  if (ssrContext.state !== void 0) {
    ssrContext._meta.headTags = renderStoreState(ssrContext) + ssrContext._meta.headTags
  }
  <% } %>

  if (usePreloadTags) {
    // @vitejs/plugin-vue injects code into a component's setup() that registers
    // itself on ctx.modules. After the render, ctx.modules would contain all the
    // components that have been instantiated during this render call.
    ssrContext._meta.endingHeadTags += renderModulesPreload(ssrContext.modules, { ssrContext })
  }

  return renderTemplate(ssrContext)
}
