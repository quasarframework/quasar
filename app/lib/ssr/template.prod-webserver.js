/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 **/

const { join } = require('path')
const { renderToString } = require('@vue/server-renderer')
const createRenderer = require('@quasar/ssr-helpers/create-renderer')

const renderTemplate = require('./render-template.js')
const serverManifest = require('./quasar.server-manifest.json')
const clientManifest = require('./quasar.client-manifest.json')

const resolve = file => join(__dirname, file)

const settings = <%= opts %>
<% if (opts.publicPath !== '/') { %>
const doubleSlashRE = /\/\//g
const { publicPath } = settings
<% } %>

if (process.env.DEBUG) {
  settings.debug = true
}

const resolveUrl = url => <% if (opts.publicPath === '/') { %>url || '/'<% } else { %>url ? (publicPath + url).replace(doubleSlashRE, '/') : publicPath<% } %>

const renderSSR = createRenderer({
  vueRenderToString: renderToString,
  basedir: __dirname,
  serverManifest,
  clientManifest,
  publicPath<% if (opts.publicPath === '/') { %>: settings.publicPath<% } %>
})

module.exports.resolveUrl = resolveUrl

module.exports.renderToString = function (opts, cb) {
  const ssrContext = {
    ...opts,
    url: opts.req.url
  }

  renderSSR(ssrContext, renderTemplate)
    .then(html => { cb(void 0, html) })
    .catch(cb)
}

module.exports.resolveWWW = function (file) {
  return resolve('www/' + file)
}

module.exports.settings = settings
