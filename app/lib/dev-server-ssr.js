const fs = require('fs')
const { join } = require('path')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const chokidar = require('chokidar')

const express = require('express')
const { renderToString } = require('@vue/server-renderer')
const createRenderer = require('@quasar/ssr-helpers/create-renderer')

const appPaths = require('./app-paths')
const openBrowser = require('./helpers/open-browser')
const { log } = require('./helpers/logger')
const ouchInstance = require('./helpers/cli-error-handling').getOuchInstance()

const banner = '[Quasar Dev Webserver]'
const compiledMiddlewareFile = appPaths.resolve.app('.quasar/ssr/compiled-middlewares.js')
const renderError = ({ err, req, res }) => {
  ouchInstance.handleException(err, req, res, () => {
    console.error(`${banner} ${req.url} -> error during render`)
    console.error(err.stack)
  })
}

const doubleSlashRE = /\/\//g

module.exports = class DevServer {
  constructor (quasarConfFile) {
    this.quasarConfFile = quasarConfFile
    this.setInitialState()
  }

  setInitialState () {
    this.handlers = []

    this.htmlWatcher = null
    this.webpackServer = null
  }

  async listen () {
    const cfg = this.quasarConfFile.quasarConf
    const webpackConf = this.quasarConfFile.webpackConf

    log(`Booting up...`)

    return new Promise(resolve => {
      this.start(webpackConf, cfg, resolve)
    })
  }

  start (webpackConf, cfg, callback) {
    const webserverCompiler = webpack(webpackConf.webserver)
    const serverCompiler = webpack(webpackConf.server)
    const clientCompiler = webpack(webpackConf.client)

    let tryToFinalize = () => {
      if (serverManifest && clientManifest && this.webpackServer) {
        tryToFinalize = () => {}
        callback()

        log(`The devserver is ready to be used`)

        if (cfg.__devServer.open) {
          openBrowser({ url: cfg.build.APP_URL, opts: cfg.__devServer.openOptions })
        }
      }
    }

    let serverManifest, clientManifest, pwa, renderTemplate, renderWithVue

    const publicPath = cfg.build.publicPath
    const resolveUrlPath = publicPath === '/'
      ? url => url || '/'
      : url => url ? (publicPath + url).replace(doubleSlashRE, '/') : publicPath

    const rootFolder = appPaths.appDir
    const publicFolder = appPaths.resolve.app('public')

    function resolvePublicFolder () {
      return join(publicFolder, ...arguments)
    }

    const serveStatic = (path, opts = {}) => {
      return express.static(resolvePublicFolder(path), {
        ...opts,
        maxAge: opts.maxAge === void 0
          ? cfg.ssr.maxAge
          : opts.maxAge
      })
    }

    const { getIndexHtml } = require('./ssr/html-template')
    const templatePath = appPaths.resolve.app(cfg.sourceFiles.indexHtmlTemplate)

    function updateTemplate () {
      renderTemplate = getIndexHtml(fs.readFileSync(templatePath, 'utf-8'), cfg)
    }

    this.htmlWatcher = chokidar.watch(templatePath).on('change', () => {
      updateTemplate()
      console.log(`${banner} index.template.html template updated.`)
    })

    updateTemplate()

    const renderOptions = {
      vueRenderToString: renderToString,
      basedir: appPaths.resolve.app('.')
    }

    const update = () => {
      if (serverManifest && clientManifest) {
        Object.assign(renderOptions, {
          serverManifest,
          clientManifest
        })

        const renderer = createRenderer(renderOptions)

        renderWithVue = ssrContext => {
          const startTime = Date.now()

          return renderer(ssrContext, renderTemplate)
            .then(html => {
              console.log(`${banner} ${ssrContext.req.url} -> request took: ${Date.now() - startTime}ms`)
              return html
            })
        }

        tryToFinalize()
      }
    }

    webserverCompiler.hooks.done.tapAsync('done-compiling', ({ compilation: { errors, warnings }}, cb) => {
      errors.forEach(err => console.error('[Webserver]', err))
      warnings.forEach(err => console.warn('[Webserver]', err))

      if (errors.length === 0) {
        delete require.cache[compiledMiddlewareFile]
        const injectMiddleware = require(compiledMiddlewareFile).default

        startWebpackServer(app => {
          injectMiddleware({
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
            render: ssrContext => renderWithVue(ssrContext),
            serve: {
              static: serveStatic,
              error: renderError
            }
          })

          this.webpackServer.listen(cfg.devServer.port, cfg.devServer.host, tryToFinalize)
        })
      }

      cb()
    })

    this.handlers.push(
      webserverCompiler.watch({}, () => {})
    )

    serverCompiler.hooks.done.tapAsync('done-compiling', ({ compilation: { errors, warnings, assets }}, cb) => {
      errors.forEach(err => console.error('[Server]', err))
      warnings.forEach(err => console.warn('[Server]', err))

      if (errors.length === 0) {
        serverManifest = JSON.parse(assets['../quasar.server-manifest.json'].source())
        update()
      }

      cb()
    })

    clientCompiler.hooks.done.tapAsync('done-compiling', ({ compilation: { errors, warnings, assets }}, cb) => {
      errors.forEach(err => console.error('[Client]', err))
      warnings.forEach(err => console.warn('[Client]', err))

      if (errors.length === 0) {
        if (cfg.ctx.mode.pwa) {
          pwa = {
            manifest: assets['manifest.json'].source(),
            serviceWorker: assets['service-worker.js'].source()
          }
        }

        clientManifest = JSON.parse(assets['../quasar.client-manifest.json'].source())
        update()
      }

      cb()
    })

    this.handlers.push(
      serverCompiler.watch({}, () => {})
    )

    const originalAfter = cfg.devServer.after

    // start building & launch server
    const startWebpackServer = cb => {
      if (this.destroyed === true) {
        return
      }

      if (this.webpackServer !== null) {
        const server = this.webpackServer
        this.webpackServer = null

        server.close(() => {
          this.destroyed !== true && startWebpackServer(cb)
        })
        return
      }

      this.webpackServer = new WebpackDevServer(clientCompiler, {
        ...cfg.devServer,

        after: app => {
          // obsolete hot updates & js maps should be discarded immediately
          app.get(/(\.hot-update\.json|\.js\.map)$/, (_, res) => {
            res.status(404).send('404')
          })

          if (cfg.ctx.mode.pwa) {
            app.use(resolveUrlPath('/manifest.json'), (_, res) => {
              res.setHeader('Content-Type', 'application/json')
              res.send(pwa.manifest)
            })
            app.use(resolveUrlPath('/service-worker.js'), (_, res) => {
              res.setHeader('Content-Type', 'text/javascript')
              res.send(pwa.serviceWorker)
            })
          }

          if (cfg.build.ignorePublicFolder !== true) {
            app.use(resolveUrlPath('/'), serveStatic('.', { maxAge: 0 }))
          }

          originalAfter && originalAfter(app)

          // allow this.webpackServer to be set
          // as after hook is called immediately
          setTimeout(() => {
            if (this.destroyed !== true) {
              cb(app)
            }
          })
        }
      })
    }
  }

  stop () {
    log(`Shutting down`)
    this.destroyed = true

    if (this.htmlWatcher !== null) {
      this.htmlWatcher.close()
    }

    if (this.webpackServer !== null) {
      this.handlers.push(this.webpackServer)
    }

    return Promise.all(
      this.handlers.map(handler => new Promise(resolve => handler.close(resolve)))
    ).finally(() => {
      this.setInitialState()
    })
  }
}
