const fs = require('fs')
const { join } = require('path')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const chokidar = require('chokidar')

const express = require('express')
const { renderToString } = require('@vue/server-renderer')
const createRenderer = require('@quasar/ssr-helpers/create-renderer')
const { getClientManifest } = require('./webpack/ssr/plugin.client-side')
const { getServerManifest } = require('./webpack/ssr/plugin.server-side')
const { doneExternalWork } = require('./webpack/plugin.progress')
const { webpackNames } = require('./webpack/symbols')

const appPaths = require('./app-paths')
const openBrowser = require('./helpers/open-browser')
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

let openedBrowser = false

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

  listen () {
    const cfg = this.quasarConfFile.quasarConf
    const webpackConf = this.quasarConfFile.webpackConf

    const webserverCompiler = webpack(webpackConf.webserver)
    const serverCompiler = webpack(webpackConf.serverSide)
    const clientCompiler = webpack(webpackConf.clientSide)

    let serverManifest, clientManifest, renderTemplate, renderWithVue, webpackServerListening = false

    let tryToFinalize = () => {
      if (serverManifest && clientManifest && webpackServerListening === true) {
        tryToFinalize = () => {}

        if (openedBrowser === false) {
          openedBrowser = true

          if (cfg.__devServer.open) {
            openBrowser({ url: cfg.build.APP_URL, opts: cfg.__devServer.openOptions })
          }
        }
      }
    }

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

    webserverCompiler.hooks.done.tap('done-compiling', stats => {
      if (stats.hasErrors() === false) {
        delete require.cache[compiledMiddlewareFile]
        const injectMiddleware = require(compiledMiddlewareFile).default

        startWebpackServer()
          .then(app => {
            if (this.destroyed === true) { return }

            return injectMiddleware({
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
          })
          .then(() => {
            if (this.destroyed === true) { return }

            webpackServerListening = true
            tryToFinalize()
            doneExternalWork(webpackNames.ssr.webserver)
          })
      }
    })

    this.handlers.push(
      webserverCompiler.watch({}, () => {})
    )

    serverCompiler.hooks.thisCompilation.tap('quasar-ssr-server-plugin', compilation => {
      compilation.hooks.processAssets.tapAsync(
        { name: 'quasar-ssr-server-plugin', state: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL },
        (_, callback) => {
          if (compilation.errors.length === 0) {
            serverManifest = getServerManifest(compilation)
            update()
          }

          callback()
        }
      )
    })

    clientCompiler.hooks.thisCompilation.tap('quasar-ssr-server-plugin', compilation => {
      compilation.hooks.processAssets.tapAsync(
        { name: 'quasar-ssr-server-plugin', state: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL },
        (_, callback) => {
          if (compilation.errors.length === 0) {
            clientManifest = getClientManifest(compilation)
            update()
          }

          callback()
        }
      )
    })

    this.handlers.push(
      serverCompiler.watch({}, () => {})
    )

    const originalAfter = cfg.devServer.onAfterSetupMiddleware

    const startWebpackServer = async () => {
      if (this.destroyed === true) { return }

      if (this.webpackServer !== null) {
        const server = this.webpackServer
        this.webpackServer = null
        webpackServerListening = false

        await server.stop()
      }

      if (this.destroyed === true) { return }

      return new Promise(resolve => {
        this.webpackServer = new WebpackDevServer({
          ...cfg.devServer,

          onAfterSetupMiddleware: opts => {
            const { app } = opts

            // obsolete hot updates & js maps should be discarded immediately
            app.get(/(\.hot-update\.json|\.js\.map)$/, (_, res) => {
              res.status(404).send('404')
            })

            if (cfg.build.ignorePublicFolder !== true) {
              app.use(resolveUrlPath('/'), serveStatic('.', { maxAge: 0 }))
            }

            originalAfter && originalAfter(opts)

            if (this.destroyed !== true) {
              resolve(app)
            }
          }
        }, clientCompiler)

        this.webpackServer.start()
      })
    }
  }

  stop () {
    this.destroyed = true

    if (this.htmlWatcher !== null) {
      this.htmlWatcher.close()
    }

    if (this.webpackServer !== null) {
      this.handlers.push({
        // normalize to syntax of the other handlers
        close: doneFn => {
          this.webpackServer.stop().finally(() => { doneFn() })
        }
      })
    }

    return Promise.all(
      this.handlers.map(handler => new Promise(resolve => { handler.close(resolve) }))
    ).finally(() => {
      this.setInitialState()
    })
  }
}
