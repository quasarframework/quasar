import { readFileSync } from 'node:fs'
import { join, isAbsolute } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createServer, createServerModuleRunner } from 'vite'
import chokidar from 'chokidar'
import debounce from 'lodash/debounce.js'
import serialize from 'serialize-javascript'
import { green } from 'kolorist'

import { AppDevserver } from '../../app-devserver.js'
import { getPackage } from '../../utils/get-package.js'
import { openBrowser } from '../../utils/open-browser.js'
import { log, warn, info, dot, progress } from '../../utils/logger.js'
import { entryPointMarkup, getDevSsrTemplateFn } from '../../utils/html-template.js'

import { quasarSsrConfig } from './ssr-config.js'
import { injectPwaManifest, buildPwaServiceWorker } from '../pwa/utils.js'

const doubleSlashRE = /\/\//g
const autoRemove = 'document.currentScript.remove()'

function logServerMessage (title, msg, additional) {
  log()
  info(`${ msg }${ additional !== void 0 ? ` ${ green(dot) } ${ additional }` : '' }`, title)
}

/** @type {import('@quasar/render-ssr-error').default} */
let renderSSRError = null
let vueRenderToString = null

function renderStoreState (ssrContext) {
  const nonce = ssrContext.nonce !== void 0
    ? ` nonce="${ ssrContext.nonce }"`
    : ''

  const state = serialize(ssrContext.state, { isJSON: true })
  return `<script${ nonce }>window.__INITIAL_STATE__=${ state };${ autoRemove }</script>`
}

export class QuasarModeDevserver extends AppDevserver {
  #webserver = null
  /** @type {import('vite').ViteDevServer|null} */
  #viteClient = null
  #viteWatcherList = []
  #webserverWatcher = null

  /**
   * @type {{
   *  port: number;
   *  publicPath: string;
   *  resolveUrlPath: import('../../../types').SsrMiddlewareResolve['urlPath'];
   *  render: (ssrContext: import('../../../types').QSsrContext) => Promise<string>;
   * }}
   */
  #appOptions = {}

  // also update pwa-devserver.js when changing here
  #pwaManifestWatcher
  #pwaServiceWorkerWatcher

  #pathMap = {}

  constructor (opts) {
    super(opts)

    const { appPaths } = this.ctx

    const publicFolder = appPaths.resolve.app('public')
    this.#pathMap = {
      rootFolder: appPaths.appDir,
      publicFolder,
      templatePath: appPaths.resolve.app('index.html'),
      serverFile: appPaths.resolve.entry('compiled-dev-webserver.js'),
      serverEntryFile: appPaths.resolve.entry('server-entry.js'),
      resolvePublicFolder () {
        const dir = join(...arguments)
        return isAbsolute(dir) === true
          ? dir
          : join(publicFolder, dir)
      }
    }

    this.registerDiff('webserver', (quasarConf, diffMap) => [
      quasarConf.ssr.extendSSRWebserverConf,

      // extends 'esbuild' diff
      ...diffMap.esbuild(quasarConf)
    ])

    this.registerDiff('viteSSR', (quasarConf, diffMap) => [
      quasarConf.ssr.pwa,
      quasarConf.ssr.pwa === true ? quasarConf.pwa.swFilename : '',

      // extends 'vite' diff
      ...diffMap.vite(quasarConf)
    ])

    // also update pwa-devserver.js when changing here
    this.registerDiff('pwaManifest', quasarConf => [
      quasarConf.pwa.injectPwaMetaTags,
      quasarConf.pwa.manifestFilename,
      quasarConf.pwa.extendManifestJson,
      quasarConf.pwa.useCredentialsForManifestTag
    ])

    // also update pwa-devserver.js when changing here
    this.registerDiff('pwaServiceWorker', quasarConf => [
      quasarConf.pwa.workboxMode,
      quasarConf.pwa.swFilename,
      quasarConf.build,
      quasarConf.pwa.workboxMode === 'GenerateSW'
        ? quasarConf.pwa.extendGenerateSWOptions
        : [
            quasarConf.pwa.extendInjectManifestOptions,
            quasarConf.pwa.extendPWACustomSWConf,
            quasarConf.sourceFiles.pwaServiceWorker,
            quasarConf.ssr.pwaOfflineHtmlFilename
          ]
    ])
  }

  run (quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    if (quasarConf.ssr.pwa === true) {
      // also update pwa-devserver.js when changing here
      if (diff('pwaManifest', quasarConf) === true) {
        return queue(() => this.#compilePwaManifest(quasarConf))
      }

      // also update pwa-devserver.js when changing here
      if (diff('pwaServiceWorker', quasarConf) === true) {
        return queue(() => this.#compilePwaServiceWorker(quasarConf, queue))
      }
    }

    // also update pwa-devserver.js when changing here
    if (diff('webserver', quasarConf) === true) {
      return queue(() => this.#compileWebserver(quasarConf, queue))
    }

    // also update pwa-devserver.js when changing here
    if (diff('viteSSR', quasarConf) === true) {
      return queue(() => this.#runVite(quasarConf, diff('viteUrl', quasarConf)))
    }
  }

  async #compileWebserver (quasarConf, queue) {
    if (this.#webserverWatcher !== null) {
      await this.#webserverWatcher.close()
    }

    const esbuildConfig = await quasarSsrConfig.webserver(quasarConf)
    await this.watchWithEsbuild('SSR Webserver', esbuildConfig, () => {
      queue(() => this.#bootWebserver(quasarConf))
    }).then(esbuildCtx => {
      this.#webserverWatcher = {
        close: () => {
          this.#webserverWatcher = null
          return esbuildCtx.dispose()
        }
      }
    })
  }

  async #runVite (quasarConf, urlDiffers) {
    await this.clearWatcherList(this.#viteWatcherList, () => { this.#viteWatcherList = [] })

    if (renderSSRError === null) {
      const { default: render } = await import('@quasar/render-ssr-error')
      renderSSRError = render
    }

    if (vueRenderToString === null) {
      const { renderToString } = await getPackage('vue/server-renderer', quasarConf.ctx.appPaths.appDir)
      vueRenderToString = renderToString
    }

    this.#appOptions.port = quasarConf.devServer.port

    const publicPath = this.#appOptions.publicPath = quasarConf.build.publicPath
    this.#appOptions.resolveUrlPath = publicPath === '/'
      ? url => url || '/'
      : url => (url ? (publicPath + url).replace(doubleSlashRE, '/') : publicPath)

    const viteClient = this.#viteClient = await createServer(await quasarSsrConfig.viteClient(quasarConf))
    this.#viteWatcherList.push({
      close: () => {
        this.#viteClient = null
        return viteClient.close()
      }
    })

    const viteServer = await createServer(await quasarSsrConfig.viteServer(quasarConf))
    this.#viteWatcherList.push(viteServer)

    if (quasarConf.ssr.pwa === true) {
      injectPwaManifest(quasarConf, true)
    }

    let renderTemplate

    const updateTemplate = () => {
      renderTemplate = getDevSsrTemplateFn(
        readFileSync(this.#pathMap.templatePath, 'utf-8'),
        quasarConf
      )
    }

    updateTemplate()

    this.#viteWatcherList.push(
      chokidar.watch(this.#pathMap.templatePath)
        .on('change', updateTemplate)
    )

    const viteModuleRunner = createServerModuleRunner(viteServer.environments.ssr)
    this.#viteWatcherList.push(viteModuleRunner)

    this.#appOptions.render = async ssrContext => {
      const startTime = Date.now()
      const onRenderedList = []

      Object.assign(ssrContext, {
        _meta: {},
        onRendered: fn => { onRenderedList.push(fn) }
      })

      try {
        const renderApp = await viteModuleRunner.import(this.#pathMap.serverEntryFile)

        const app = await renderApp.default(ssrContext)
        const runtimePageContent = await vueRenderToString(app, ssrContext)

        onRenderedList.forEach(fn => { fn() })

        // maintain compatibility with some well-known Vue plugins
        // like @vue/apollo-ssr:
        typeof ssrContext.rendered === 'function' && ssrContext.rendered()

        if (ssrContext.state !== void 0 && quasarConf.ssr.manualStoreSerialization !== true) {
          ssrContext._meta.headTags = renderStoreState(ssrContext) + ssrContext._meta.headTags
        }

        let html = renderTemplate(ssrContext)

        const url = ssrContext.url || ssrContext.req.url
        const originalUrl = ssrContext.originalUrl || ssrContext.req.originalUrl
        html = await viteClient.transformIndexHtml(url, html, originalUrl)
        html = html.replace(
          entryPointMarkup,
          `<div id="q-app">${ runtimePageContent }</div>`
        )

        logServerMessage('Rendered', url, `${ Date.now() - startTime }ms`)

        return html
      }
      catch (err) {
        viteServer.ssrFixStacktrace(err)
        throw err
      }
    }

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
    const done = progress('Booting Webserver...')

    if (this.#webserver !== null) {
      await this.#webserver.close()
    }

    const {
      create,
      injectDevMiddleware = ({ app }) => (middleware) => app.use(middleware),
      listen,
      close,
      injectMiddlewares,
      serveStaticContent
    } = await import(
      pathToFileURL(this.#pathMap.serverFile) + '?t=' + Date.now()
    )
    const { publicPath } = this.#appOptions
    const { resolvePublicFolder } = this.#pathMap

    const middlewareParams = {
      port: this.#appOptions.port,
      devHttpsOptions: quasarConf.devServer.https,
      resolve: {
        urlPath: this.#appOptions.resolveUrlPath,
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

    await registerDevMiddleware((req, res, next) => {
      if (this.#viteClient === null) {
        next()
        return
      }

      // Vite dev middleware modifies req.url to account for publicPath
      // but we'll break usage in the webserver if we do so
      const { url } = req
      this.#viteClient.middlewares.handle(req, res, err => {
        req.url = url
        next(err)
      })
    })

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

    if (quasarConf.devServer.https) {
      middlewareParams.devHttpsApp = await this.#createLazyDevHttpsServer(
        quasarConf.devServer.https,
        app
      )
    }

    middlewareParams.listenResult = await listen(middlewareParams)

    this.#webserver = {
      close: () => {
        this.#webserver = null
        return close(middlewareParams)
      }
    }

    done('Webserver is ready')

    this.printBanner(quasarConf)
    this.#viteClient?.ws.send({ type: 'full-reload' })
  }

  /**
   * Lazily create the devHttpsApp proxy when it's first accessed.
   * This allows the user to handle the devHttpsApp manually if they need to.
   * This is useful when they are using an custom SSR webserver such as Fastify and h3
   */
  async #createLazyDevHttpsServer (httpsOptions, app) {
    const { createServer } = await import('node:https')
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

  // also update pwa-devserver.js when changing here
  #compilePwaManifest (quasarConf) {
    if (this.#pwaManifestWatcher !== void 0) {
      this.#pwaManifestWatcher.close()
    }

    function inject () {
      injectPwaManifest(quasarConf)
      log(`Generated the PWA manifest file (${ quasarConf.pwa.manifestFilename })`)
    }

    this.#pwaManifestWatcher = chokidar.watch(
      quasarConf.metaConf.pwaManifestFile,
      { ignoreInitial: true }
    ).on('change', debounce(() => {
      inject()
      this.#viteClient?.ws.send({ type: 'full-reload' })
    }, 550))

    inject()
  }

  // also update pwa-devserver.js when changing here
  async #compilePwaServiceWorker (quasarConf, queue) {
    if (this.#pwaServiceWorkerWatcher) {
      await this.#pwaServiceWorkerWatcher.close()
    }

    const workboxConfig = await quasarSsrConfig.workbox(quasarConf)

    if (quasarConf.pwa.workboxMode === 'InjectManifest') {
      const esbuildConfig = await quasarSsrConfig.customSw(quasarConf)
      await this.watchWithEsbuild('InjectManifest Custom SW', esbuildConfig, () => {
        queue(() => buildPwaServiceWorker(quasarConf, workboxConfig))
      }).then(esbuildCtx => {
        this.#pwaServiceWorkerWatcher = { close: esbuildCtx.dispose }
      })
    }

    await buildPwaServiceWorker(quasarConf, workboxConfig)
  }
}
