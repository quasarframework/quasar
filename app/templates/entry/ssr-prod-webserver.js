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
const resolveUrlPath = publicPath === '/'
  ? url => url || '/'
  : url => url ? (publicPath + url).replace(doubleSlashRE, '/') : publicPath

// create the renderer
const renderer = createRenderer({
  vueRenderToString: renderToString,
  basedir: __dirname,
  serverManifest,
  clientManifest,
  publicPath
})

// util to serve files
const prodCacheDuration = <%= ssr.prodCacheDuration %>
const serve = (path, cache = prodCacheDuration) => express.static(resolve('www/' + path), {
  maxAge: cache
})

<% if (ssr.pwa) { %>
// serve this with no cache, if built with PWA:
app.use(resolveUrlPath('/service-worker.js'), serve('service-worker.js', 0))
<% } %>

// serve "www" folder
app.use(resolveUrlPath('/'), serve('.'))

// inject custom middleware
injectMiddlewares({
  app,
  resolveUrlPath,
  publicPath,
  folders: {
    root: __dirname,
    public: join(__dirname, 'www')
  },
  render: {
    vue: ssrContext => renderer(ssrContext, renderTemplate)
  }
}).then(() => {
  // finally start listening to clients
  const port = process.env.PORT || <%= ssr.prodPort %>

  app.listen(port, () => {
    console.log('Server listening at port ' + port)
  })
})
