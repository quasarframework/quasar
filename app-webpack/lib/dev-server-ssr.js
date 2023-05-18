const fs = require('node:fs')
const { join } = require('node:path')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const chokidar = require('chokidar')
const { green } = require('kolorist')

const createRenderer = require('@quasar/ssr-helpers/create-renderer.js')
const { getClientManifest } = require('./webpack/ssr/plugin.client-side.js')
const { getServerManifest } = require('./webpack/ssr/plugin.server-side.js')
const { doneExternalWork } = require('./webpack/plugin.progress.js')
const { webpackNames } = require('./webpack/symbols.js')

const appPaths = require('./app-paths.js')
const { log, warn, fatal, info, dot } = require('./utils/logger.js')

const { getPackage } = require('./utils/get-package.js')
const { renderToString } = getPackage('vue/server-renderer')
const { openBrowser } = require('./utils/open-browser.js')

const serverFile = appPaths.resolve.app('.quasar/ssr/compiled-dev-webserver.js')

function logServerMessage (title, msg, additional) {
  log()
  info(`${ msg }${ additional !== void 0 ? ` ${ green(dot) } ${ additional }` : '' }`, title)
}

let renderSSRError
const renderError = ({ err, req, res }) => {
  log()
  console.error(err.stack)
  warn(req.url, 'Render failed')

  renderSSRError({ err, req, res })
}

const doubleSlashRE = /\/\//g

let appUrl
let openedBrowser = false

function getClientHMRScriptQuery (devServerCfg) {
  const { overlay } = devServerCfg.client
  const acc = []

  if (!overlay) {
    acc.push('overlay=false')
  }
  else if (overlay !== true) {
    if (overlay.warnings === false) {
      acc.push('warn=false')
    }
    if (overlay.timeout) {
      acc.push(`timeout=${ overlay.timeout }`)
    }
  }

  return acc.length === 0
    ? ''
    : '&' + acc.join('&')
}

function injectHMREntryPoints (webpackConf, devServerCfg) {
  const entryPoint = 'webpack-hot-middleware/client?reload=true' + getClientHMRScriptQuery(devServerCfg)

  for (const key in webpackConf.entry) {
    webpackConf.entry[ key ].unshift(entryPoint)
  }

  return webpackConf
}

function promisify (fn) {
  return () => new Promise(resolve => fn(resolve))
}

module.exports.DevServer = class DevServer {
  #quasarConfFile
  #stopWatcherList
  #htmlWatcher
  #stopWebserver
  #isDestroyed = false

  constructor (quasarConfFile) {
    this.#quasarConfFile = quasarConfFile
    this.#setInitialState()
  }

  #setInitialState () {
    this.#stopWatcherList = []
    this.#htmlWatcher = null
    this.#stopWebserver = null
  }

  async listen () {
    const cfg = this.#quasarConfFile.quasarConf
    const webpackConf = this.#quasarConfFile.webpackConf

    const clientHMR = !!cfg.devServer.hot

    if (clientHMR === true) {
      injectHMREntryPoints(webpackConf.clientSide, cfg.devServer)
    }

    const webserverCompiler = webpack(webpackConf.webserver)
    const serverCompiler = webpack(webpackConf.serverSide)
    const clientCompiler = webpack(webpackConf.clientSide)

    let serverManifest, clientManifest
    let renderTemplate, renderWithVue
    let webserverListening = false
    let webpackClientHMRMiddleware

    if (renderSSRError === void 0) {
      const { default: render } = await import('@quasar/render-ssr-error')
      renderSSRError = render
    }

    const publicPath = cfg.build.publicPath
    const resolveUrlPath = publicPath === '/'
      ? url => url || '/'
      : url => (url ? (publicPath + url).replace(doubleSlashRE, '/') : publicPath)

    const rootFolder = appPaths.appDir
    const publicFolder = appPaths.resolve.app('public')

    function resolvePublicFolder () {
      return join(publicFolder, ...arguments)
    }

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

    if (clientHMR === true) {
      webpackClientHMRMiddleware = webpackHotMiddleware(clientCompiler, { log: () => {} })
      this.#stopWatcherList.push(() => webpackClientHMRMiddleware.close())
    }

    const webpackClientMiddleware = webpackDevMiddleware(clientCompiler, cfg.devServer.devMiddleware)
    this.#stopWatcherList.push(
      promisify(callback => webpackClientMiddleware.close(callback))
    )

    let tryToFinalize = () => {
      if (serverManifest && clientManifest && webserverListening === true) {
        tryToFinalize = () => {}

        if (openedBrowser === false || appUrl !== cfg.build.APP_URL) {
          appUrl = cfg.build.APP_URL
          openedBrowser = true

          if (cfg.__devServer.open) {
            openBrowser({ url: appUrl, opts: cfg.__devServer.openOptions })
          }
        }
      }
    }

    const { getIndexHtml } = require('./ssr/html-template.js')
    const templatePath = appPaths.resolve.app(cfg.sourceFiles.indexHtmlTemplate)

    function updateTemplate () {
      renderTemplate = getIndexHtml(fs.readFileSync(templatePath, 'utf-8'), cfg)
    }

    this.#htmlWatcher = chokidar.watch(templatePath).on('change', () => {
      updateTemplate()
      logServerMessage('Updated', 'index.template.html')
    })

    updateTemplate()

    const renderOptions = {
      vueRenderToString: renderToString,
      basedir: appPaths.appDir,
      manualStoreSerialization: cfg.ssr.manualStoreSerialization === true
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
              logServerMessage('Rendered', ssrContext.req.url, `${ Date.now() - startTime }ms`)
              return html
            })
        }

        tryToFinalize()
      }
    }

    webserverCompiler.hooks.done.tap('done-compiling', stats => {
      if (stats.hasErrors() === false) {
        startWebserver()
      }
    })

    const webserverWatcher = webserverCompiler.watch({}, () => {})
    this.#stopWatcherList.push(
      promisify(callback => webserverWatcher.close(callback))
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

    const serverWatcher = serverCompiler.watch({}, () => {})
    this.#stopWatcherList.push(
      promisify(callback => serverWatcher.close(callback))
    )

    const startWebserver = async () => {
      if (this.#isDestroyed === true) { return }

      const { create, listen, close, injectMiddlewares, serveStaticContent } = require(serverFile)
      delete require.cache[ serverFile ]

      const middlewareParams = {
        port: cfg.devServer.port,
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
          static: (pathToServe, opts = {}) => serveStaticContent(resolvePublicFolder(pathToServe), opts),
          error: renderError
        }
      }

      const app = middlewareParams.app = create(middlewareParams)

      clientHMR === true && app.use(webpackClientHMRMiddleware)
      app.use(webpackClientMiddleware)

      if (cfg.build.ignorePublicFolder !== true) {
        app.use(resolveUrlPath('/'), middlewareParams.serve.static('.'))
      }

      await injectMiddlewares(middlewareParams)

      if (this.#stopWebserver !== null) {
        const stop = this.#stopWebserver
        this.#stopWebserver = null

        await stop()

        if (this.#isDestroyed === true) { return }

        webserverListening = false
      }

      if (this.#isDestroyed === true) { return }

      publicPath !== '/' && app.use((req, res, next) => {
        const pathname = new URL(req.url, `http://${ req.headers.host }`).pathname || '/'

        if (pathname.startsWith(publicPath) === true) {
          next()
          return
        }

        if (req.url === '/' || req.url === '/index.html') {
          res.writeHead(302, { Location: publicPath })
          res.end()
          return
        }
        else if (req.headers.accept && req.headers.accept.includes('text/html')) {
          const parsedPath = pathname.slice(1)
          const redirectPaths = [ publicPath + parsedPath ]
          const splitted = parsedPath.split('/')

          if (splitted.length > 1) {
            redirectPaths.push(publicPath + splitted.slice(1).join('/'))
          }

          if (redirectPaths[ redirectPaths.length - 1 ] !== publicPath) {
            redirectPaths.push(publicPath)
          }

          const linkList = redirectPaths
            .map(link => `<a href="${ link }">${ link }</a>`)
            .join(' or ')

          res.writeHead(404, { 'Content-Type': 'text/html' })
          res.end(
            `<div>The Quasar CLI devserver is configured with a publicPath of "${ publicPath }"</div>`
            + `<div> - Did you mean to visit ${ linkList } instead?</div>`
          )
          return
        }

        next()
      })

      const isReady = () => Promise.resolve()

      if (cfg.devServer.server.type === 'https') {
        const https = await import('node:https')
        middlewareParams.devHttpsApp = https.createServer(cfg.devServer.server.options, app)
      }

      const server = middlewareParams.devHttpsApp || app
      const listenResult = await listen({
        isReady,
        ssrHandler: (req, res, next) => {
          return isReady().then(() => server(req, res, next))
        },
        ...middlewareParams
      })

      if (this.#isDestroyed === true) { return }

      this.#stopWebserver = () => close({
        ...middlewareParams,
        listenResult
      })

      webserverListening = true
      tryToFinalize()
      doneExternalWork(webpackNames.ssr.webserver)
    }
  }

  stop () {
    this.#isDestroyed = true

    if (this.#htmlWatcher !== null) {
      this.#htmlWatcher.close()
    }

    if (this.#stopWebserver !== null) {
      this.#stopWatcherList.push(this.#stopWebserver)
    }

    return Promise.all(
      this.#stopWatcherList.map(handler => handler())
    ).finally(() => {
      this.#setInitialState()
    })
  }
}
