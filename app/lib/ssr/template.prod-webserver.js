/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 **/

const fs = require('fs')
const path = require('path')
const { renderToString } = require('@vue/server-renderer')

const renderApp = require('./server/render-app.js')

const resolve = file => path.join(__dirname, file)
const template = fs.readFileSync(resolve('template.html'), 'utf-8')

const settings = <%= opts %>
<% if (opts.publicPath !== '/') { %>
const doubleSlashRE = /\/\//
const { publicPath } = settings
<% } %>

if (process.env.DEBUG) {
  settings.debug = true
}

const resolveUrl = url => <% if (opts.publicPath === '/') { %>url || '/'<% } else { %>url ? (publicPath + url).replace(doubleSlashRE, '/') : publicPath<% } %>

module.exports.resolveUrl = resolveUrl

module.exports.renderToString = function (opts, cb) {
  const ctx = {
    ...opts,
    url: opts.req.url
  }

  renderApp.default(ctx)
    .then(renderToString)
    .then(html => {
      cb(void 0, template.replace('<div id="q-app"></div>', html))
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

module.exports.settings = settings
