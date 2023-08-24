import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createServer } from 'vite'
import chokidar from 'chokidar'
import debounce from 'lodash/debounce.js'
import serialize from 'serialize-javascript'

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
  info(`${ msg }${ additional !== void 0 ? ` ${ dot } ${ additional }` : '' }`, title)
}

let renderSSRError
function renderError ({ err, req, res }) {
  log()
  warn(req.url, 'Render failed')

  renderSSRError({ err, req, res })
}

async function warmupServer ({ viteClient, viteServer, clientEntry, serverEntry }) {
  const done = progress('Warming up...')

  if (renderSSRError === void 0) {
    const { default: render } = await import('@quasar/render-ssr-error')
    renderSSRError = render
  }

  try {
    await viteServer.ssrLoadModule(serverEntry)
    await viteClient.transformRequest(clientEntry)
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

export class QuasarModeDevserver extends AppDevserver {
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

  #pathMap = {}
  #vueRenderToString = null

  constructor (opts) {
    super(opts)

    const { appPaths } = this.ctx

    const publicFolder = appPaths.resolve.app('public')
    this.#pathMap = {
      rootFolder: appPaths.appDir,
      publicFolder,
      templatePath: appPaths.resolve.app('index.html'),
      serverFile: appPaths.resolve.entry('compiled-dev-webserver.mjs'),
      serverEntryFile: appPaths.resolve.entry('server-entry.mjs'),
      resolvePublicFolder () {
        return join(publicFolder, ...arguments)
      }
    }

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
        quasarConf.pwa.workboxMode === 'GenerateSW'
          ? 'extendGenerateSWOptions'
          : 'extendInjectManifestOptions'
      ],
      quasarConf.pwa.workboxMode === 'InjectManifest'
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

    const esbuildConfig = await quasarSsrConfig.webserver(quasarConf)
    await this.watchWithEsbuild('SSR Webserver', esbuildConfig, () => {
      if (this.#closeWebserver !== void 0) {
        queue(async () => {
          await this.#closeWebserver()
          return this.#bootWebserver(quasarConf)
        })
      }
    }).then(esbuildCtx => {
      this.#webserverWatcher = { close: esbuildCtx.dispose }
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

    const viteClient = this.#viteClient = await createServer(await quasarSsrConfig.viteClient(quasarConf))
    const viteServer = this.#viteServer = await createServer(await quasarSsrConfig.viteServer(quasarConf))

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

    this.#htmlWatcher = chokidar.watch(this.#pathMap.templatePath).on('change', updateTemplate)

    if (this.#vueRenderToString === null) {
      const { renderToString } = await getPackage('vue/server-renderer', quasarConf.ctx.appPaths.appDir)
      this.#vueRenderToString = renderToString
    }

    this.#appOptions.render = async (ssrContext) => {
      const startTime = Date.now()
      const onRenderedList = []

      Object.assign(ssrContext, {
        _meta: {},
        onRendered: fn => { onRenderedList.push(fn) }
      })

      try {
        const renderApp = await viteServer.ssrLoadModule(this.#pathMap.serverEntryFile)

        const app = await renderApp.default(ssrContext)
        const runtimePageContent = await this.#vueRenderToString(app, ssrContext)

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

    await warmupServer({
      viteClient,
      viteServer,
      clientEntry: quasarConf.metaConf.entryScriptWebPath,
      serverEntry: this.#pathMap.serverEntryFile
    })

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

    const { create, listen, close, injectMiddlewares, serveStaticContent } = await import(
      pathToFileURL(this.#pathMap.serverFile) + '?t=' + Date.now()
    )
    const { publicPath } = this.#appOptions
    const { resolvePublicFolder } = this.#pathMap

    const middlewareParams = {
      port: this.#appOptions.port,
      resolve: {
        urlPath: this.#appOptions.resolveUrlPath,
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
    const { proxy: proxyConf } = quasarConf.devServer

    if (Object(proxyConf) === proxyConf) {
      const { createProxyMiddleware } = await import('http-proxy-middleware')

      Object.keys(proxyConf).forEach(path => {
        const cfg = quasarConf.devServer.proxy[ path ]
        app.use(path, createProxyMiddleware(cfg))
      })
    }

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
