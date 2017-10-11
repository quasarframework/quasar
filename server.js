/**
 * Concepts and snippets taken from
 * vue-hackernews-2.0
 * https://github.com/vuejs/vue-hackernews-2.0
 * License MIT
 */
const isProd = process.env.NODE_ENV === 'production'
const path = require('path')
const fs = require('fs')
const express = require('express')
const expressApp = express()

const rootPath = path.resolve(__dirname)

// Prevent the dev server from generating it's own html file, we want to use our SSR generated one
process.env.dismissHTML = true
const { createBundleRenderer } = require('vue-server-renderer')

function createRenderer (bundle, options) {
  // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
  return createBundleRenderer(bundle, Object.assign(options, {
    // for component caching
    cache: isProd ? require('lru-cache')({
      max: 1000,
      maxAge: 1000 * 60 * 15
    }) : undefined,
    // recommended for performance
    runInNewContext: false
  }))
}

function ssr(expressApp) {
  const app = expressApp || this

  let renderer, readyPromise, templatePath

  if (isProd) {

    const folders = {
      public: path.resolve(rootPath, 'dist')
    }

    templatePath = path.join(folders.public, 'index.template.html')

    const template = fs.readFileSync(templatePath, 'utf-8')

    const serverBundle = require(path.join( 
      folders.public,
      'vue-ssr-server-bundle.json' 
    ))

    const clientManifest = require(path.join( 
      folders.public,
      'vue-ssr-client-manifest.json' 
    ))

    renderer = createRenderer(serverBundle, {
      template: template.replace(
        '<div id="q-app"></div>', 
        '<!--vue-ssr-outlet-->'
      ),
      clientManifest
    })

    // Serve static assets

    ['js', 'statics', 'fonts', 'img']
      .forEach(itemPath => {
        app.use(`/${itemPath}`, express.static(path.join(
          folders.public, itemPath
        )))
      })

    app.use('/app(.*).css', (req, res, next) => 
      express.static(
        path.join(
          folders.public, req.originalUrl
        )
      )(req, res, next)
    )

  } else {

    const folders = {
      dev: path.resolve(rootPath, 'dev'),
      build: path.resolve(rootPath, 'build'),
    }

    templatePath = path.join(folders.dev, 'index.html')


    // In development: setup the dev server with watch and hot-reload,
    // and create a new renderer on bundle / index template update.
    readyPromise = require(
      path.join(folders.build, 'setup-dev-server')
    )(
      app,
      templatePath,
      (bundle, options) => {
        renderer = createRenderer(bundle, options)
      }
    )
  }

  function renderHtml(req, res) {
    
    var context = { url: req.url }

    renderer.renderToString(context, (err, html) => {
      if (err) {
        console.warn('Error with SSR:', err)
        return res.status(500).send('Sorry, but there was a problem on the server and this page could not be rendered.')
      }

      return res.status(200).send(html)
    })
  }

  app.get('/*', isProd ? renderHtml : (req, res) => {
    readyPromise.then(() => renderHtml(req, res))
  })
}

ssr(expressApp)

const port = process.env.PORT || 8081

expressApp.listen(port, () => {
  console.log(`SSR Server started at localhost:${port}`)
})

module.exports = ssr