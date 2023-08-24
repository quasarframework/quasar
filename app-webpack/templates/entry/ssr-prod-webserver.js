/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 **/

import { join } from 'node:path'
import { renderToString } from 'vue/server-renderer'
import { getProdRenderFunction } from '@quasar/ssr-helpers/create-renderer'

import renderTemplate from './render-template.cjs'
import clientManifest from './quasar.manifest.json'
import serverEntry from './server/entry.js'

import { create, listen, serveStaticContent, renderPreloadTag } from '../src-ssr/server.js'
import injectMiddlewares from './ssr-middlewares.js'

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

const serveStatic = (pathToServe, opts = {}) => serveStaticContent(resolvePublicFolder(pathToServe), opts)

// create the production render fn
const render = getProdRenderFunction({
  vueRenderToString: renderToString,
  basedir: __dirname,
  clientManifest,
  serverEntry,
  renderTemplate,
  renderPreloadTag,
  manualStoreSerialization: <%= ssr.manualStoreSerialization === true %>
})

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
  render,
  serve: {
    static: serveStatic
  }
}

const app = create(middlewareParams)

// fill in "app" for next calls
middlewareParams.app = app

<% if (ssr.pwa) { %>
// serve this with no cache, if built with PWA:
app.use(resolveUrlPath('/<%= pwa.swFilename %>'), serveStatic('<%= pwa.swFilename %>', { maxAge: 0 }))
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
