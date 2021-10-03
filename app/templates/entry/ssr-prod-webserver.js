/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 **/

import { join } from 'path'
<% if (ssr.fastify) { %>
// ssr fastify experimental
import fastify from 'fastify'
import { fastifyStaticInit, fastifyStaticRegister } from './ssr-fastify-helpers.js'
<% } else { %>
import express from 'express'
<% } %>
import { renderToString } from '@vue/server-renderer'
import createRenderer from '@quasar/ssr-helpers/create-renderer'

import renderTemplate from './render-template.js'
import serverManifest from './quasar.server-manifest.json'
import clientManifest from './quasar.client-manifest.json'
import injectMiddlewares from './ssr-middlewares.js'

<% if (ssr.fastify) { %>
// ssr fastify experimental
const app = fastify()
<% } else { %>
const app = express()
<% } %>

const doubleSlashRE = /\/\//g
const publicPath = `<%= build.publicPath %>`
const resolveUrlPath = publicPath === '/'
  ? url => url || '/'
  : url => url ? (publicPath + url).replace(doubleSlashRE, '/') : publicPath

const rootFolder = __dirname
const publicFolder = join(__dirname, 'www')

function resolvePublicFolder () {
  return join(publicFolder, ...arguments)
}

const serveStatic = (path, opts = {}) => {
  <% if (ssr.fastify) { %>
  // ssr fastify experimental
  return (req, res) => res.sendFile(path)
  <% } else { %>
  return express.static(resolvePublicFolder(path), {
    ...opts,
    maxAge: opts.maxAge === void 0
      ? <%= ssr.maxAge %>
      : opts.maxAge
  })
  <% } %>
}

// create the renderer
const render = createRenderer({
  vueRenderToString: renderToString,
  basedir: __dirname,
  serverManifest,
  clientManifest
})

<% if (ssr.pwa && !ssr.fastify) { %>
// serve this with no cache, if built with PWA:
app.use(resolveUrlPath('/service-worker.js'), serveStatic('service-worker.js', { maxAge: 0 }))
<% } %>

// serve "www" folder (includes the "public" folder)
<% if (ssr.fastify) { %>
// ssr fastify experimental: registering fastify-static plugin
fastifyStaticRegister(app, publicFolder, resolveUrlPath('/'), <%= ssr.maxAge %>)
fastifyStaticInit(app, resolveUrlPath, publicFolder, serveStatic).then(() => {
<% } else { %>
app.use(resolveUrlPath('/'), serveStatic('.'))
<% } %>
// inject custom middleware
  injectMiddlewares({
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
    render: ssrContext => render(ssrContext, renderTemplate),
    serve: {
      static: serveStatic
    }
  }).then(() => {
    // finally start listening to clients
    const port = process.env.PORT || <%= ssr.prodPort %>
    app.listen(port, (err) => {
      if (err) throw err
      console.log('Server listening at port ' + port)
    })
  })
<% if (ssr.fastify) { %>
})
<% } %>
