const { join } = require('node:path')
const { readFileSync } = require('node:fs')
const chokidar = require('chokidar')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const { createDevRenderer } = require('@quasar/ssr-helpers/create-renderer.js')
const { green } = require('kolorist')

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
  info(`${ msg }${ additional !== void 0 ? ` ${ green(dot) } ${ additional }` : '' }`, title)
}

/** @type {import('@quasar/render-ssr-error').default} */
let renderSSRError = null
let vueRenderToString = null

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

  constructor (opts) {
    super(opts)

    const { appPaths } = this.ctx

    const publicFolder = appPaths.resolve.app('public')
    this.#pathMap = {
      rootFolder: appPaths.appDir,
      publicFolder,
      serverFile: appPaths.resolve.entry('compiled-dev-webserver.cjs'),
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
      await this.clearWatcherList(this.#webpackWatcherList, () => { this.#webpackWatcherList = [] })
      await this.#closeWebserver()
    }

    if (renderSSRError === null) {
      const { default: render } = await import('@quasar/render-ssr-error')
      renderSSRError = render
    }

    if (vueRenderToString === null) {
      const { renderToString } = await getPackage('vue/server-renderer', quasarConf.ctx.appPaths.appDir)
      vueRenderToString = renderToString
    }

    const { appPaths } = quasarConf.ctx

    this.#appOptions.port = quasarConf.devServer.port
    const clientHMR = this.#appOptions.clientHMR = !!quasarConf.devServer.hot

    const publicPath = this.#appOptions.publicPath = quasarConf.build.publicPath
    this.#appOptions.resolveUrlPath = publicPath === '/'
      ? url => url || '/'
      : url => (url ? (publicPath + url).replace(doubleSlashRE, '/') : publicPath)

    const renderer = createDevRenderer({
      vueRenderToString,
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

    async function updateTemplate () {
      renderer.updateRenderTemplate(
        await getSsrHtmlTemplateFn(readFileSync(templatePath, 'utf-8'), quasarConf)
      )
    }

    const htmlWatcher = chokidar.watch(templatePath).on('change', () => {
      updateTemplate().then(() => {
        logServerMessage('Updated', 'index.html')
      })
    })

    this.#webpackWatcherList.push(() => htmlWatcher.close())

    this.#appOptions.render = ssrContext => {
      const startTime = Date.now()

      return renderer.renderToString(ssrContext)
        .then(html => {
          logServerMessage('Rendered', ssrContext.url || ssrContext.req.url, `${ Date.now() - startTime }ms`)
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
    const {
      create,
      injectDevMiddleware = ({ app }) => (middleware) => app.use(middleware),
      listen,
      close,
      injectMiddlewares,
      serveStaticContent,
      renderPreloadTag
    } = require(this.#pathMap.serverFile)

    this.#appOptions.renderer.updateRenderPreloadTag(renderPreloadTag)

    const { resolvePublicFolder } = this.#pathMap
    const {
      publicPath, resolveUrlPath,
      clientHMR, webpackClientHMRMiddleware,
      webpackClientMiddleware
    } = this.#appOptions

    const middlewareParams = {
      port: this.#appOptions.port,
      devHttpsOptions: quasarConf.devServer.server.type === 'https'
        ? quasarConf.devServer.server.options
        : void 0,
      resolve: {
        urlPath: resolveUrlPath,
        root: (...args) => join(this.#pathMap.rootFolder, ...args),
        public: resolvePublicFolder
      },
      publicPath,
      folders: {
        root: this.#pathMap.rootFolder,
        public: this.#pathMap.publicFolder
      },
      render: this.#appOptions.render
    }

    const app = middlewareParams.app = await create(middlewareParams)

    const serveStatic = await serveStaticContent(middlewareParams)
    middlewareParams.serve = {
      static: serveStatic,
      error: ({ err, req, res }) => {
        log()
        warn(req.url, 'Render failed')

        renderSSRError({ err, req, res, projectRootFolder: quasarConf.ctx.appPaths.appDir })
      }
    }

    /** @type {import('../../../types').SsrInjectDevMiddlewareFn} */
    const registerDevMiddleware = await injectDevMiddleware(middlewareParams)

    clientHMR === true && await registerDevMiddleware(webpackClientHMRMiddleware)
    await registerDevMiddleware(webpackClientMiddleware)

    if (quasarConf.build.ignorePublicFolder !== true) {
      await serveStatic({ urlPath: '/', pathToServe: '.' })
    }

    await injectMiddlewares(middlewareParams)

    publicPath !== '/' && await registerDevMiddleware((req, res, next) => {
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

      if (req.headers.accept && req.headers.accept.includes('text/html')) {
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

    if (quasarConf.devServer.server.type === 'https') {
      middlewareParams.devHttpsApp = this.#createLazyDevHttpsServer(
        quasarConf.devServer.server.options,
        app
      )
    }

    middlewareParams.listenResult = await listen(middlewareParams)

    this.#closeWebserver = () => close(middlewareParams)

    done('Webserver is ready')

    this.printBanner(quasarConf)
  }

  /**
   * Lazily create the devHttpsApp proxy when it's first accessed.
   * This allows the user to handle the devHttpsApp manually if they need to.
   * This is useful when they are using an custom SSR webserver such as Fastify and h3
   */
  #createLazyDevHttpsServer (httpsOptions, app) {
    const { createServer } = require('node:https')
    const createInstance = () => {
      try {
        return createServer(httpsOptions, app)
      }
      catch (error) {
        if (error.code === 'ERR_INVALID_ARG_TYPE') {
          warn(
            'The SSR app instance is not compatible with automatic HTTPS support. '
            + 'Please use `devHttpsOptions` property from callback scope in `create` or `listen` to set up HTTPS manually.'
          )
        }
        else {
          warn(
            `An error occurred while setting up HTTPS for the SSR app instance, devHttpsApp won't be available. Error: ${ error.message }`
          )
        }
      }
    }

    return new Proxy({}, {
      get: (target, prop) => {
        // If handling the result of this function as a Promise, we don't want to do anything
        if (prop === 'then' || prop === 'catch' || prop === 'finally') {
          return
        }

        if (!target.instance) {
          target.instance = createInstance()
        }

        return target.instance?.[ prop ]
      },
      set: (target, prop, value) => {
        if (!target.instance) {
          target.instance = createInstance()
        }

        target.instance[ prop ] = value
        return true
      }
    })
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
