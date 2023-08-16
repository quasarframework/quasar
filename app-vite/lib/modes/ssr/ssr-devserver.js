const { readFileSync } = require('fs')
const { join } = require('path')
const { createServer } = require('vite')
const chokidar = require('chokidar')
const debounce = require('lodash/debounce')
const serialize = require('serialize-javascript')

const AppDevserver = require('../../app-devserver')
const appPaths = require('../../app-paths')
const getPackage = require('../../helpers/get-package')
const openBrowser = require('../../helpers/open-browser')
const config = require('./ssr-config')
const { log, warn, info, dot, progress } = require('../../helpers/logger')
const { entryPointMarkup, getDevSsrTemplateFn } = require('../../helpers/html-template')

const { renderToString } = getPackage('vue/server-renderer')

const rootFolder = appPaths.appDir
const publicFolder = appPaths.resolve.app('public')
const templatePath = appPaths.resolve.app('index.html')
const serverFile = appPaths.resolve.app('.quasar/ssr/compiled-dev-webserver.js')
const serverEntryFile = appPaths.resolve.app('.quasar/server-entry.js')

const { injectPwaManifest, buildPwaServiceWorker } = require('../pwa/utils')

function resolvePublicFolder () {
  return join(publicFolder, ...arguments)
}

const doubleSlashRE = /\/\//g
const autoRemove = 'document.currentScript.remove()'

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

async function warmupServer (viteClient, viteServer) {
  const done = progress('Warming up...')

  if (renderSSRError === void 0) {
    const { default: render } = await import('@quasar/render-ssr-error')
    renderSSRError = render
  }

  try {
    await viteServer.ssrLoadModule(serverEntryFile)
    await viteClient.transformRequest('.quasar/client-entry.js')
  }
  catch (err) {
    warn('Warmup failed!', 'FAIL')
    console.error(err)
    return
  }

  done('Warmed up')
}

function renderStoreState (ssrContext) {
  const nonce = ssrContext.nonce !== void 0
    ? ` nonce="${ ssrContext.nonce }"`
    : ''

  const state = serialize(ssrContext.state, { isJSON: true })
  return `<script${ nonce }>window.__INITIAL_STATE__=${ state };${ autoRemove }</script>`
}

class SsrDevServer extends AppDevserver {
  #closeWebserver
  #viteClient
  #viteServer
  #htmlWatcher
  #webserverWatcher
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

  constructor (opts) {
    super(opts)

    this.registerDiff('webserver', quasarConf => [
      quasarConf.eslint,
      quasarConf.build.env,
      quasarConf.build.rawDefine,
      quasarConf.ssr.extendSSRWebserverConf
    ])

    this.registerDiff('pwaSsr', quasarConf => [
      quasarConf.ssr.pwa,
      quasarConf.ssr.pwa === true ? quasarConf.pwa.swFilename : ''
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
      quasarConf.pwa.precacheFromPublicFolder,
      quasarConf.pwa.swFilename,
      quasarConf.pwa[
        quasarConf.pwa.workboxMode === 'generateSW'
          ? 'extendGenerateSWOptions'
          : 'extendInjectManifestOptions'
      ],
      quasarConf.pwa.workboxMode === 'injectManifest'
        ? [ quasarConf.build.env, quasarConf.build.rawDefine ]
        : ''
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
    if (diff([ 'vite', 'pwaSsr' ], quasarConf) === true) {
      return queue(() => this.#runVite(quasarConf, diff('viteUrl', quasarConf)))
    }
  }

  async #compileWebserver (quasarConf, queue) {
    if (this.#webserverWatcher) {
      await this.#webserverWatcher.close()
    }

    const esbuildConfig = await config.webserver(quasarConf)
    await this.buildWithEsbuild('SSR Webserver', esbuildConfig, () => {
      if (this.#closeWebserver !== void 0) {
        queue(async () => {
          await this.#closeWebserver()
          return this.#bootWebserver(quasarConf)
        })
      }
    }).then(result => {
      this.#webserverWatcher = { close: result.stop }
    })
  }

  async #runVite (quasarConf, urlDiffers) {
    if (this.#closeWebserver !== void 0) {
      this.#htmlWatcher.close()
      this.#viteClient.close()
      this.#viteServer.close()
      await this.#closeWebserver()
    }

    this.#appOptions.port = quasarConf.devServer.port

    const publicPath = this.#appOptions.publicPath = quasarConf.build.publicPath
    this.#appOptions.resolveUrlPath = publicPath === '/'
      ? url => url || '/'
      : url => (url ? (publicPath + url).replace(doubleSlashRE, '/') : publicPath)

    const viteClient = this.#viteClient = await createServer(await config.viteClient(quasarConf))
    const viteServer = this.#viteServer = await createServer(await config.viteServer(quasarConf))

    if (quasarConf.ssr.pwa === true) {
      injectPwaManifest(quasarConf, true)
    }

    let renderTemplate

    function updateTemplate () {
      renderTemplate = getDevSsrTemplateFn(
        readFileSync(templatePath, 'utf-8'),
        quasarConf
      )
    }

    updateTemplate()

    this.#htmlWatcher = chokidar.watch(templatePath).on('change', updateTemplate)

    this.#appOptions.render = async (ssrContext) => {
      const startTime = Date.now()
      const onRenderedList = []

      Object.assign(ssrContext, {
        _meta: {},
        onRendered: fn => { onRenderedList.push(fn) }
      })

      try {
        const renderApp = await viteServer.ssrLoadModule(serverEntryFile)

        const app = await renderApp.default(ssrContext)
        const runtimePageContent = await renderToString(app, ssrContext)

        onRenderedList.forEach(fn => { fn() })

        // maintain compatibility with some well-known Vue plugins
        // like @vue/apollo-ssr:
        typeof ssrContext.rendered === 'function' && ssrContext.rendered()

        if (ssrContext.state !== void 0 && quasarConf.ssr.manualStoreSerialization !== true) {
          ssrContext._meta.headTags = renderStoreState(ssrContext) + ssrContext._meta.headTags
        }

        let html = renderTemplate(ssrContext)
        html = await viteClient.transformIndexHtml(ssrContext.req.url, html, ssrContext.req.url)
        html = html.replace(
          entryPointMarkup,
          `<div id="q-app">${ runtimePageContent }</div>`
        )

        logServerMessage('Rendered', ssrContext.req.url, `${ Date.now() - startTime }ms`)

        return html
      }
      catch (err) {
        viteServer.ssrFixStacktrace(err)
        throw err
      }
    }

    await warmupServer(viteClient, viteServer)

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

    delete require.cache[ serverFile ]
    const { create, listen, close, injectMiddlewares, serveStaticContent } = require(serverFile)

    const { publicPath } = this.#appOptions

    const middlewareParams = {
      port: this.#appOptions.port,
      resolve: {
        urlPath: this.#appOptions.resolveUrlPath,
        root () { return join(rootFolder, ...arguments) },
        public: resolvePublicFolder
      },
      publicPath,
      folders: {
        root: rootFolder,
        public: publicFolder
      },
      render: this.#appOptions.render,
      serve: {
        static: (path, opts = {}) => serveStaticContent(resolvePublicFolder(path), opts),
        error: renderError
      }
    }

    const app = middlewareParams.app = create(middlewareParams)

    // vite devmiddleware modifies req.url to account for publicPath
    // but we'll break usage in the webserver if we do so
    app.use((req, res, next) => {
      const { url } = req
      this.#viteClient.middlewares.handle(req, res, err => {
        req.url = url
        next(err)
      })
    })

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

      if (this.#viteClient !== void 0) {
        this.#viteClient.ws.send({
          type: 'full-reload',
          path: '*'
        })
      }
    }, 550))

    inject()
  }

  // also update pwa-devserver.js when changing here
  async #compilePwaServiceWorker (quasarConf, queue) {
    if (this.#pwaServiceWorkerWatcher) {
      await this.#pwaServiceWorkerWatcher.close()
    }

    const workboxConfig = await config.workbox(quasarConf)

    if (quasarConf.pwa.workboxMode === 'injectManifest') {
      const esbuildConfig = await config.customSw(quasarConf)
      await this.buildWithEsbuild('injectManifest Custom SW', esbuildConfig, () => {
        queue(() => buildPwaServiceWorker(quasarConf.pwa.workboxMode, workboxConfig))
      }).then(result => {
        this.#pwaServiceWorkerWatcher = { close: result.stop }
      })
    }

    await buildPwaServiceWorker(quasarConf.pwa.workboxMode, workboxConfig)
  }
}

module.exports = SsrDevServer
