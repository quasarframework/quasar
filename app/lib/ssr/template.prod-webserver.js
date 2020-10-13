/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 **/

const fs = require('fs')
const path = require('path')
const vueServerRenderer = require('@vue/server-renderer')
const createBundleRenderer = require('@quasar/ssr/create-bundle-renderer')

const resolve = file => path.join(__dirname, file)
const template = fs.readFileSync(resolve('template.html'), 'utf-8')
const serverManifest = require('./quasar.server-manifest.json')
const clientManifest = require('./quasar.client-manifest.json')

const settings = <%= opts %>
<% if (opts.publicPath !== '/') { %>
const doubleSlashRE = /\/\//g
const { publicPath } = settings
<% } %>

if (process.env.DEBUG) {
  settings.debug = true
}

const resolveUrl = url => <% if (opts.publicPath === '/') { %>url || '/'<% } else { %>url ? (publicPath + url).replace(doubleSlashRE, '/') : publicPath<% } %>

const rendererOptions = {
  vueServerRenderer,
  basedir: __dirname,
  clientManifest,
  publicPath,
  runInNewContext: false
}

let renderer = createBundleRenderer(serverManifest, rendererOptions)

module.exports.resolveUrl = resolveUrl

module.exports.renderToString = function (opts, cb) {
  const ssrContext = {
    ...opts,
    url: opts.req.url
  }

  // TODO vue3 - handle error
  renderer.renderToString(ssrContext)
    .then(appHtml => {
      cb(void 0, template.replace('<div id="q-app"></div>', appHtml))
      console.log('\n\nSTYLE>>>>>>')
      console.log(ssrContext.renderStyles())
      console.log('\nSCRIPTS>>>>>')
      console.log(ssrContext.renderScripts())
      console.log()
    })
    .catch(cb)

// TODO vue3
// <% if (flags.meta) { %>
//   renderer.renderToString(ctx, (err, html) => {
//     cb(err, err ? html : ctx.$getMetaHTML(html, ctx))
//   })
// <% } else { %>
//   renderer.renderToString(ctx, cb)
// <% } %>
}

module.exports.resolveWWW = function (file) {
  return resolve('www/' + file)
}

module.exports.mergeRendererOptions = function (opts) {
  renderer = createBundleRenderer(
    serverManifest,
    Object.assign(rendererOptions, opts)
  )
}

module.exports.settings = settings
