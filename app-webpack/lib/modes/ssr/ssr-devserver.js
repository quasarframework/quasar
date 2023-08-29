const { join } = require('node:path')
const { readFileSync } = require('node:fs')
const chokidar = require('chokidar')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const { createDevRenderer } = require('@quasar/ssr-helpers/create-renderer.js')

const { getSsrHtmlTemplateFn } = require('../../utils/html-template.js')
const { getClientManifest } = require('./plugin.webpack.client-side.js')
const { getServerDevManifest } = require('./plugin.webpack.server-side.js')

const { AppDevserver } = require('../../app-devserver.js')
const { getPackage } = require('../../utils/get-package.js')
const { openBrowser } = require('../../utils/open-browser.js')
const { log, warn, info, dot, progress } = require('../../utils/logger.js')

const { quasarSsrConfig } = require('./ssr-config.js')

const doubleSlashRE = /\/\//g

function logServerMessage (title, msg, additional) {
  log()
  info(`${ msg }${ additional !== void 0 ? ` ${ dot } ${ additional }` : '' }`, title)
}

let renderSSRError
function renderError ({ err, req, res }) {
  log()
  warn(req.url, 'Render failed')

  renderSSRError({ err, req, res })
}

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

module.exports.QuasarModeDevserver = class QuasarModeDevserver extends AppDevserver {
  #esbuildWebserverWatcher
  #closeWebserver
  #webpackWatcherList = []
  #pwaServiceWorkerWatcher
  /**
   * @type {{
   *  port: number;
   *  publicPath: string;
   *  resolveUrlPath: import('../../../types').SsrMiddlewareResolve['urlPath'];
   *  render: (ssrContext: import('../../../types').QSsrContext) => Promise<string>;
   * }}
   */
  #appOptions = {}

  #pathMap = {}
  #vueRenderToString = null

  constructor (opts) {
    super(opts)

    const { appPaths } = this.ctx

    const publicFolder = appPaths.resolve.app('public')
    this.#pathMap = {
      rootFolder: appPaths.appDir,
      publicFolder,
      serverFile: appPaths.resolve.entry('compiled-dev-webserver.js'),
      serverEntryFile: appPaths.resolve.entry('server-entry.js'),
      resolvePublicFolder () {
        return join(publicFolder, ...arguments)
      }
    }

    this.registerDiff('webserver', (quasarConf, diffMap) => [
      quasarConf.ssr.extendSSRWebserverConf,

      // extends 'esbuild' diff
      ...diffMap.esbuild(quasarConf)
    ])

    // also adapt pwa-devserver.js when changing here
    this.registerDiff('webpackPWA', (quasarConf, diffMap) => [
      quasarConf.ssr.pwa,
      quasarConf.ssr.pwa === true
        ? [
            quasarConf.pwa.workboxMode,
            quasarConf.pwa.swFilename,
            quasarConf.pwa.manifestFilename,
            quasarConf.pwa.extendManifestJson,
            quasarConf.pwa.useCredentialsForManifestTag,
            quasarConf.pwa.injectPwaMetaTags,
            quasarConf.ssr.pwaOfflineHtmlFilename, // ssr only
            quasarConf.pwa[
              quasarConf.pwa.workboxMode === 'GenerateSW'
                ? 'extendGenerateSWOptions'
                : 'extendInjectManifestOptions'
            ]
          ]
        : '',

      // extends 'webpack' diff
      ...diffMap.webpack(quasarConf)
    ])

    // also update pwa-devserver.js when changing here
    this.registerDiff('customServiceWorker', (quasarConf, diffMap) => [
      quasarConf.pwa.workboxMode,
      quasarConf.pwa.workboxMode === 'InjectManifest'
        ? [
            quasarConf.build,
            quasarConf.pwa.extendInjectManifestOptions,
            quasarConf.pwa.swFilename,
            quasarConf.pwa.extendPWACustomSWConf,
            quasarConf.sourceFiles.pwaServiceWorker,

            // extends 'esbuild' diff
            ...diffMap.esbuild(quasarConf)
          ]
        : ''
    ])
  }

  run (quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    // also update ssr-devserver.js when changing here
    if (diff('customServiceWorker', quasarConf) === true) {
      return queue(() => this.#compileCustomServiceWorker(quasarConf, queue))
    }

    // also update pwa-devserver.js when changing here
    if (diff('webserver', quasarConf) === true) {
      return queue(() => this.#compileWebserver(quasarConf, queue))
    }

    // also update pwa-devserver.js when changing here
    if (diff('webpackPWA', quasarConf) === true) {
      return queue(() => this.#runWebpack(quasarConf, diff('webpackUrl', quasarConf)))
    }
  }

  async #compileWebserver (quasarConf, queue) {
    if (this.#esbuildWebserverWatcher) {
      await this.#esbuildWebserverWatcher.close()
    }

    const esbuildConfig = await quasarSsrConfig.webserver(quasarConf)
    await this.watchWithEsbuild('SSR Webserver', esbuildConfig, () => {
      if (this.#closeWebserver !== void 0) {
        queue(async () => {
          await this.#closeWebserver()
          return this.#bootWebserver(quasarConf)
        })
      }
    }).then(esbuildCtx => {
      this.#esbuildWebserverWatcher = { close: esbuildCtx.dispose }
    })
  }

  async #runWebpack (quasarConf, urlDiffers) {
    if (this.#closeWebserver !== void 0) {
      for (const fn of this.#webpackWatcherList) {
        await fn()
      }

      this.#webpackWatcherList = []
      await this.#closeWebserver()
    }

    const { appPaths } = quasarConf.ctx

    this.#appOptions.port = quasarConf.devServer.port
    const clientHMR = this.#appOptions.clientHMR = !!quasarConf.devServer.hot

    const publicPath = this.#appOptions.publicPath = quasarConf.build.publicPath
    this.#appOptions.resolveUrlPath = publicPath === '/'
      ? url => url || '/'
      : url => (url ? (publicPath + url).replace(doubleSlashRE, '/') : publicPath)

    if (this.#vueRenderToString === null) {
      const { renderToString } = getPackage('vue/server-renderer', quasarConf.ctx.appPaths.appDir)
      this.#vueRenderToString = renderToString
    }

    if (renderSSRError === void 0) {
      const { default: render } = await import('@quasar/render-ssr-error')
      renderSSRError = render
    }

    const renderer = createDevRenderer({
      vueRenderToString: this.#vueRenderToString,
      basedir: appPaths.appDir,
      manualStoreSerialization: quasarConf.ssr.manualStoreSerialization === true,
      onReadyForTemplate () {
        // we need to call it here for first time
        // to leave room for injectWebpackHtml() to have all data (from client webpack)
        updateTemplate()
      }
    })

    this.#appOptions.renderer = renderer

    const clientWebpackConf = await quasarSsrConfig.webpackClient(quasarConf)
    const serverWebpackConf = await quasarSsrConfig.webpackServer(quasarConf)

    if (clientHMR === true) {
      injectHMREntryPoints(clientWebpackConf, quasarConf.devServer)
    }

    const webpackClientCompiler = webpack(clientWebpackConf)
    const webpackServerCompiler = webpack(serverWebpackConf)

    webpackClientCompiler.hooks.thisCompilation.tap('quasar-ssr-server-plugin', compilation => {
      compilation.hooks.processAssets.tapAsync(
        { name: 'quasar-ssr-server-plugin', state: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL },
        (_, callback) => {
          if (compilation.errors.length === 0) {
            renderer.updateClientManifest(
              getClientManifest(compilation)
            )
          }

          callback()
        }
      )
    })

    webpackClientCompiler.hooks.done.tap('done-compiling', stats => {
      if (stats.hasErrors() === false) {
        this.printBanner(quasarConf)
      }
    })

    if (clientHMR === true) {
      const webpackClientHMRMiddleware = webpackHotMiddleware(webpackClientCompiler, { log: () => {} })
      this.#appOptions.webpackClientHMRMiddleware = webpackClientHMRMiddleware
      this.#webpackWatcherList.push(() => webpackClientHMRMiddleware.close())
    }

    const webpackClientMiddleware = webpackDevMiddleware(webpackClientCompiler, quasarConf.devServer.devMiddleware)
    this.#appOptions.webpackClientMiddleware = webpackClientMiddleware
    this.#webpackWatcherList.push(
      promisify(callback => webpackClientMiddleware.close(callback))
    )

    const templatePath = appPaths.resolve.app(quasarConf.sourceFiles.indexHtmlTemplate)

    function updateTemplate () {
      renderer.updateRenderTemplate(
        getSsrHtmlTemplateFn(readFileSync(templatePath, 'utf-8'), quasarConf)
      )
    }

    const htmlWatcher = chokidar.watch(templatePath).on('change', () => {
      updateTemplate()
      logServerMessage('Updated', 'index.template.html')
    })

    this.#webpackWatcherList.push(() => htmlWatcher.close())

    this.#appOptions.render = ssrContext => {
      const startTime = Date.now()

      return renderer.renderToString(ssrContext)
        .then(html => {
          logServerMessage('Rendered', ssrContext.req.url, `${ Date.now() - startTime }ms`)
          return html
        })
    }

    webpackServerCompiler.hooks.thisCompilation.tap('quasar-ssr-server-plugin', compilation => {
      compilation.hooks.processAssets.tapAsync(
        { name: 'quasar-ssr-server-plugin', state: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL },
        (_, callback) => {
          if (compilation.errors.length === 0) {
            renderer.updateServerManifest(
              getServerDevManifest(compilation)
            )
          }

          callback()
        }
      )
    })

    webpackServerCompiler.hooks.done.tap('done-compiling', stats => {
      if (stats.hasErrors() === false) {
        this.printBanner(quasarConf)
      }
    })

    // start webpack server compilation
    const serverWatcher = webpackServerCompiler.watch({}, () => {})
    this.#webpackWatcherList.push(
      promisify(callback => serverWatcher.close(callback))
    )

    await this.#bootWebserver(quasarConf)

    if (urlDiffers === true && quasarConf.metaConf.openBrowser) {
      const { metaConf } = quasarConf
      openBrowser({
        url: metaConf.APP_URL,
        opts: metaConf.openBrowser !== true ? metaConf.openBrowser : false
      })
    }
  }

  async #bootWebserver (quasarConf) {
    const done = progress(`${ this.#closeWebserver !== void 0 ? 'Restarting' : 'Starting' } webserver...`)

    delete require.cache[ this.#pathMap.serverFile ]
    const { create, listen, close, injectMiddlewares, serveStaticContent, renderPreloadTag } = require(this.#pathMap.serverFile)

    this.#appOptions.renderer.updateRenderPreloadTag(renderPreloadTag)

    const { resolvePublicFolder } = this.#pathMap
    const {
      publicPath, resolveUrlPath,
      clientHMR, webpackClientHMRMiddleware,
      webpackClientMiddleware
    } = this.#appOptions

    const middlewareParams = {
      port: this.#appOptions.port,
      resolve: {
        urlPath: resolveUrlPath,
        root () { return join(this.#pathMap.rootFolder, ...arguments) },
        public: resolvePublicFolder
      },
      publicPath,
      folders: {
        root: this.#pathMap.rootFolder,
        public: this.#pathMap.publicFolder
      },
      render: this.#appOptions.render,
      serve: {
        static: (pathToServe, opts = {}) => serveStaticContent(resolvePublicFolder(pathToServe), opts),
        error: renderError
      }
    }

    const app = middlewareParams.app = create(middlewareParams)

    clientHMR === true && app.use(webpackClientHMRMiddleware)
    app.use(webpackClientMiddleware)

    if (quasarConf.build.ignorePublicFolder !== true) {
      app.use(resolveUrlPath('/'), middlewareParams.serve.static('.'))
    }

    const { proxy: proxyConf } = quasarConf.devServer

    if (Object(proxyConf) === proxyConf) {
      const { createProxyMiddleware } = require('http-proxy-middleware')

      Object.keys(proxyConf).forEach(path => {
        const cfg = quasarConf.devServer.proxy[ path ]
        app.use(path, createProxyMiddleware(cfg))
      })
    }

    await injectMiddlewares(middlewareParams)

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

    if (quasarConf.devServer.https) {
      const https = await import('node:https')
      middlewareParams.devHttpsApp = https.createServer(quasarConf.devServer.https, app)
    }

    const listenResult = await listen({
      isReady,
      ssrHandler: (req, res, next) => {
        return isReady().then(() => app(req, res, next))
      },
      ...middlewareParams
    })

    this.#closeWebserver = () => close({
      ...middlewareParams,
      listenResult
    })

    done('Webserver is ready')

    this.printBanner(quasarConf)
  }

  // also update ssr-devserver.js when changing here
  async #compileCustomServiceWorker (quasarConf) {
    if (this.#pwaServiceWorkerWatcher) {
      await this.#pwaServiceWorkerWatcher.close()
    }

    if (quasarConf.pwa.workboxMode === 'InjectManifest') {
      const esbuildConfig = await quasarSsrConfig.customSw(quasarConf)
      await this.watchWithEsbuild('InjectManifest Custom SW', esbuildConfig, () => {})
        .then(esbuildCtx => {
          this.#pwaServiceWorkerWatcher = { close: esbuildCtx.dispose }
        })
    }
  }
}
