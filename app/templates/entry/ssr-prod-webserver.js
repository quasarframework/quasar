/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 **/

import { join } from 'path'
import express from 'express'
import { renderToString } from '@vue/server-renderer'
import createRenderer from '@quasar/ssr-helpers/create-renderer'

import renderTemplate from './render-template.js'
import serverManifest from './quasar.server-manifest.json'
import clientManifest from './quasar.client-manifest.json'
import injectMiddlewares from './ssr-middlewares.js'

const app = express()
const resolve = file => join(__dirname, file)

const doubleSlashRE = /\/\//g
const publicPath = `<%= build.publicPath %>`
const resolveUrl = url => <% if (build.publicPath === '/') { %>url || '/'<% } else { %>url ? (publicPath + url).replace(doubleSlashRE, '/') : publicPath<% } %>

// create the renderer
const renderer = createRenderer({
  vueRenderToString: renderToString,
  basedir: __dirname,
  serverManifest,
  clientManifest,
  publicPath
})

// util to serve files
const serve = (path, cache) => express.static(resolve('www/' + path), {
  maxAge: cache ? 1000 * 60 * 60 * 24 * 30 : 0
})

// serve this with no cache, if built with PWA:
<% if (ssr.pwa) { %>
app.use(resolveUrl('/service-worker.js'), serve('service-worker.js'))
<% } %>

// serve "www" folder
app.use(resolveUrl('/'), serve('.', true))

// inject custom middleware
injectMiddlewares({
  app,
  resolveUrl,
  render: {
    vue: ssrContext => renderer(ssrContext, renderTemplate)
  }
})

// finally start listening to clients
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log('Server listening at port ' + port)
})
