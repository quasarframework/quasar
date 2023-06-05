/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 **/

import { join } from 'node:path'
import { renderToString } from 'vue/server-renderer'
import createRenderer from '@quasar/ssr-helpers/create-renderer'

import renderTemplate from './render-template.js'
import serverManifest from './quasar.server-manifest.json'
import clientManifest from './quasar.client-manifest.json'

import { create, listen, serveStaticContent } from '../src-ssr/server.js'
import injectMiddlewares from './ssr-middlewares.js'

const port = process.env.PORT || <%= ssr.prodPort %>

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

const serveStatic = (pathToServe, opts = {}) => serveStaticContent(resolvePublicFolder(pathToServe), opts)

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
  render: ssrContext => render(ssrContext, renderTemplate),
  serve: {
    static: serveStatic
  }
}

const app = create(middlewareParams)

// fill in "app" for next calls
middlewareParams.app = app

// create the renderer
const render = createRenderer({
  vueRenderToString: renderToString,
  basedir: __dirname,
  serverManifest,
  clientManifest,
  manualStoreSerialization: <%= ssr.manualStoreSerialization === true %>
})

<% if (ssr.pwa) { %>
// serve this with no cache, if built with PWA:
app.use(resolveUrlPath('/service-worker.js'), serveStatic('service-worker.js', { maxAge: 0 }))
<% } %>

// serve "www" folder (includes the "public" folder)
app.use(resolveUrlPath('/'), serveStatic('.'))


const isReady = () => injectMiddlewares(middlewareParams)

const ssrHandler = (req, res, next) => {
  return isReady().then(() => app(req, res, next))
}

export default listen({
  isReady,
  ssrHandler,
  ...middlewareParams
})
