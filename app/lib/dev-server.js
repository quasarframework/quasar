const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const appPaths = require('./app-paths')
const openBrowser = require('./helpers/open-browser')
const { log } = require('./helpers/logger')

let alreadyNotified = false
module.exports = class DevServer {
  constructor (quasarConfig) {
    this.quasarConfig = quasarConfig
  }

  async listen () {
    const webpackConfig = this.quasarConfig.getWebpackConfig()
    const cfg = this.quasarConfig.getBuildConfig()

    log(`Booting up...`)

    return new Promise(resolve => (
      cfg.ctx.mode.ssr
        ? this.listenSSR(webpackConfig, cfg, resolve)
        : this.listenCSR(webpackConfig, cfg, resolve)
    ))
  }

  listenCSR (webpackConfig, cfg, resolve) {
    const compiler = webpack(webpackConfig.renderer || webpackConfig)

    compiler.hooks.done.tap('done-compiling', compiler => {
      if (this.__started) { return }

      // start dev server if there are no errors
      if (compiler.compilation.errors && compiler.compilation.errors.length > 0) {
        return
      }

      this.__started = true

      server.listen(cfg.devServer.port, cfg.devServer.host, () => {
        resolve()

        if (alreadyNotified) { return }
        alreadyNotified = true

        if (cfg.__devServer.open && ['spa', 'pwa'].includes(cfg.ctx.modeName)) {
          openBrowser({ url: cfg.build.APP_URL, opts: cfg.__devServer.openOptions })
        }
      })
    })

    // start building & launch server
    const server = new WebpackDevServer(compiler, cfg.devServer)

    this.__cleanup = () => {
      this.__cleanup = null
      return new Promise(resolve => {
        server.close(resolve)
      })
    }
  }

  listenSSR (webpackConfig, cfg, resolve) {
    const fs = require('fs')
    const LRU = require('lru-cache')
    const express = require('express')
    const chokidar = require('chokidar')
    const { createBundleRenderer } = require('vue-server-renderer')
    const ouchInstance = require('./helpers/cli-error-handling').getOuchInstance()
    const SsrExtension = require('./ssr/ssr-extension')

    let renderer

    function createRenderer (bundle, options) {
      // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
      return createBundleRenderer(bundle, {
        ...options,
        shouldPreload: () => false,
        shouldPrefetch: () => false,

        // for component caching
        cache: new LRU({
          max: 1000,
          maxAge: 1000 * 60 * 15
        }),
        // recommended for performance
        runInNewContext: false
      })
    }

    function render (req, res) {
      const startTime = Date.now()

      res.setHeader('Content-Type', 'text/html')

      const handleError = err => {
        if (err.url) {
          res.redirect(err.url)
        }
        else if (err.code === 404) {
          res.status(404).send('404 | Page Not Found')
        }
        else {
          ouchInstance.handleException(err, req, res, () => {
            console.error(`${req.url} -> error during render`)
            console.error(err.stack)
          })
        }
      }

      const context = {
        url: req.url,
        req,
        res
      }

      renderer.renderToString(context, (err, html) => {
        if (err) {
          handleError(err)
          return
        }
        if (cfg.__meta) {
          html = context.$getMetaHTML(html, context)
        }
        console.log(`${req.url} -> request took: ${Date.now() - startTime}ms`)
        res.send(html)
      })
    }

    let bundle
    let template
    let clientManifest
    let pwa

    let ready
    const readyPromise = new Promise(r => { ready = r })
    function update () {
      if (bundle && clientManifest) {
        renderer = createRenderer(bundle, {
          template,
          clientManifest,
          basedir: appPaths.resolve.app('.')
        })
        ready()
      }
    }

    // read template from disk and watch
    const { getIndexHtml } = require('./ssr/html-template')
    const templatePath = appPaths.resolve.app(cfg.sourceFiles.indexHtmlTemplate)

    function getTemplate () {
      return getIndexHtml(fs.readFileSync(templatePath, 'utf-8'), cfg)
    }

    template = getTemplate()
    const htmlWatcher = chokidar.watch(templatePath).on('change', () => {
      template = getTemplate()
      console.log('index.template.html template updated.')
      update()
    })

    const serverCompiler = webpack(webpackConfig.server)
    const clientCompiler = webpack(webpackConfig.client)

    serverCompiler.hooks.done.tapAsync('done-compiling', ({ compilation: { errors, warnings, assets }}, cb) => {
      errors.forEach(err => console.error(err))
      warnings.forEach(err => console.warn(err))

      if (errors.length > 0) {
        cb()
        return
      }

      bundle = JSON.parse(assets['../quasar.server-manifest.json'].source())
      update()

      cb()
    })

    clientCompiler.hooks.done.tapAsync('done-compiling', ({ compilation: { errors, warnings, assets }}, cb) => {
      errors.forEach(err => console.error(err))
      warnings.forEach(err => console.warn(err))

      if (errors.length > 0) {
        cb()
        return
      }

      if (cfg.ctx.mode.pwa) {
        pwa = {
          manifest: assets['manifest.json'].source(),
          serviceWorker: assets['service-worker.js'].source()
        }
      }

      clientManifest = JSON.parse(assets['../quasar.client-manifest.json'].source())
      update()

      cb()
    })

    const serverCompilerWatcher = serverCompiler.watch({}, () => {})

    const originalAfter = cfg.devServer.after

    // start building & launch server
    const server = new WebpackDevServer(clientCompiler, {
      ...cfg.devServer,

      after: app => {
        if (cfg.ctx.mode.pwa) {
          app.use(cfg.build.publicPath + 'manifest.json', (_, res) => {
            res.setHeader('Content-Type', 'application/json')
            res.send(pwa.manifest)
          })
          app.use(cfg.build.publicPath + 'service-worker.js', (_, res) => {
            res.setHeader('Content-Type', 'text/javascript')
            res.send(pwa.serviceWorker)
          })
        }

        if (cfg.build.ignorePublicFolder !== true) {
          app.use(cfg.build.publicPath, express.static(appPaths.resolve.app('public'), {
            maxAge: 0
          }))
        }

        originalAfter && originalAfter(app)

        SsrExtension.getModule().extendApp({
          app,

          ssr: {
            renderToString ({ req, res }, fn) {
              const context = {
                url: req.url,
                req,
                res
              }

              renderer.renderToString(context, (err, html) => {
                if (err) {
                  handleError(err)
                  return
                }
                if (cfg.__meta) {
                  html = context.$getMetaHTML(html, context)
                }

                fn(err, html)
              })
            },

            settings: Object.assign(
              {},
              JSON.parse(cfg.ssr.__templateOpts),
              { debug: true }
            )
          }
        })

        app.get(cfg.build.publicPath + '*', render)
      }
    })

    readyPromise.then(() => {
      server.listen(cfg.devServer.port, cfg.devServer.host, () => {
        resolve()
        if (cfg.__devServer.open) {
          openBrowser({ url: cfg.build.APP_URL, opts: cfg.__devServer.openOptions })
        }
      })
    })

    this.__cleanup = () => {
      this.__cleanup = null
      htmlWatcher.close()
      return Promise.all([
        new Promise(resolve => { server.close(resolve) }),
        new Promise(resolve => { serverCompilerWatcher.close(resolve) })
      ])
    }
  }

  stop () {
    if (this.__cleanup) {
      log(`Shutting down`)
      return this.__cleanup()
    }
  }
}
