/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 *
 * All content of this folder will be copied as is to the output folder. So only import:
 *  1. node_modules (and yarn/npm install dependencies -- NOT to devDependecies though)
 *  2. create files in this folder and import only those with the relative path
 *
 * Note: This file is used only for PRODUCTION. It is not picked up while in dev mode.
 *   If you are looking to add common DEV & PROD logic to the express app, then use
 *   "src-ssr/extension.js"
 */

const
  express = require('express'),
  compression = require('compression')

const
  ssr = require('quasar-ssr'),
  extension = require('./extension'),
  app = express(),
  port = process.env.PORT || 3000

const serve = (path, cache) => express.static(ssr.resolveWWW(path), {
  maxAge: cache ? 1000 * 60 * 60 * 24 * 30 : 0
})

// gzip
app.use(compression({ threshold: 0 }))

// serve this with no cache, if built with PWA:
if (ssr.settings.pwa) {
  app.use('/service-worker.js', serve('service-worker.js'))
}

// serve "www" folder
app.use('/', serve('.', true))

// we extend the custom common dev & prod parts here
extension.extendApp({ app })

const redirects = [
  { from: '/quasar-cli/supporting-ie', to: '/quasar-cli/browser-compatibility' },
  { from: '/quasar-cli/modern-build', to: '/quasar-cli/browser-compatibility' },
  { from: '/layout/floating-action-button', to: '/vue-components/floating-action-button' },
  { from: '/quasar-cli/app-icons', to: '/icongenie/introduction' },
  { from: '/quasar-cli/cli-documentation/supporting-ie', to: '/quasar-cli/supporting-ie' },
  { from: '/quasar-cli/cli-documentation/supporting-ts', to: '/quasar-cli/supporting-ts' },
  { from: '/quasar-cli/cli-documentation/directory-structure', to: '/quasar-cli/directory-structure' },
  { from: '/quasar-cli/cli-documentation/commands-list', to: '/quasar-cli/commands-list' },
  { from: '/quasar-cli/cli-documentation/css-preprocessors', to: '/quasar-cli/css-preprocessors' },
  { from: '/quasar-cli/cli-documentation/routing', to: '/quasar-cli/routing' },
  { from: '/quasar-cli/cli-documentation/lazy-loading', to: '/quasar-cli/lazy-loading' },
  { from: '/quasar-cli/cli-documentation/handling-assets', to: '/quasar-cli/handling-assets' },
  { from: '/quasar-cli/cli-documentation/boot-files', to: '/quasar-cli/boot-files' },
  { from: '/quasar-cli/cli-documentation/prefetch-feature', to: '/quasar-cli/prefetch-feature' },
  { from: '/quasar-cli/cli-documentation/api-proxying', to: '/quasar-cli/api-proxying' },
  { from: '/quasar-cli/cli-documentation/boot-files', to: '/quasar-cli/boot-files' },
  { from: '/quasar-cli/cli-documentation/handling-webpack', to: '/quasar-cli/handling-webpack' },
  { from: '/quasar-cli/cli-documentation/handling-process-env', to: '/quasar-cli/handling-process-env' },
  { from: '/quasar-cli/cli-documentation/vuex-store', to: '/quasar-cli/vuex-store' },
  { from: '/quasar-cli/cli-documentation/linter', to: '/quasar-cli/linter' }
]

redirects.forEach(entry => {
  app.get(entry.from, (_, res) => {
    res.redirect(entry.to)
  })
})

// this should be last get(), rendering with SSR
app.get('*', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  // https://developer.mozilla.org/en-us/docs/Web/HTTP/Headers/X-Frame-Options
  res.setHeader('X-frame-options', 'SAMEORIGIN')

  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection
  res.setHeader('X-XSS-Protection', 1)

  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  res.setHeader('X-Content-Type-Options', 'nosniff')

  ssr.renderToString({ req, res }, (err, html) => {
    if (err) {
      if (err.url) {
        res.redirect(err.url)
      }
      else if (err.code === 404) {
        // Should reach here only if no "catch-all" route
        // is defined in /src/routes
        res.status(404).send('404 | Page Not Found')
      }
      else {
        // Render Error Page or Redirect
        res.status(500).send('500 | Internal Server Error')
        if (ssr.settings.debug) {
          console.error(`500 on ${req.url}`)
          console.error(err)
          console.error(err.stack)
        }
      }
    }
    else {
      res.send(html)
    }
  })
})

app.listen(port, () => {
  console.log(`Server listening at port ${port}`)
})
