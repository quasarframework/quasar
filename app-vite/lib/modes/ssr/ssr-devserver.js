import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createServer, createServerModuleRunner } from 'vite'
import { watch as chokidarWatch } from 'chokidar'

import { AppDevserver } from '../../app-devserver.js'
import { getPackage } from '../../utils/get-package.js'
import { getRouteMatcher } from '../../utils/get-route-matcher.js'
import { openBrowser } from '../../utils/open-browser.js'
import { log, progress, warn } from '../../utils/logger.js'
import { debounce } from '../../utils/rate-limit.js'
import {
  attachMarkup,
  entryPointMarkup,
  fastExtractPath,
  getDevSsrTemplateFn,
  updateHtmlVariables
} from '../../plugins/vite.html.js'

import {
  getNonceAttr,
  injectCriticalCssPath,
  logServerMessage,
  renderStoreState
} from './ssr-utils.js'
import { buildPwaServiceWorker, injectPwaManifest } from '../pwa/pwa-utils.js'
import { quasarSsrConfig } from './ssr-config.js'

const multiSlashRE = /\/{2,}/g

/** @type {import('@quasar/render-ssr-error').default} */
let renderSSRError = null
let vueRenderToString = null

export class QuasarModeDevserver extends AppDevserver {
  #webserver = null
  /** @type {import('vite').ViteDevServer|null} */
  #viteWatcherList = []
  #isCsrRoute = null
  #csrTemplate = null
  #renderTemplate = null
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

  // also update pwa-devserver.js & ssg-devserver.js when changing here
  #pwaManifestWatcher = null
  #pwaServiceWorkerWatcher = null

  #pathMap = {}

  constructor(opts) {
    super(opts)

    const { appPaths } = this.ctx

    const rootFolder = appPaths.appDir
    const publicFolder = appPaths.resolve.app('public')
    const serverAssetsFolder = appPaths.resolve.ssr('server-assets')

    this.#pathMap = {
      rootFolder,
      publicFolder,
      serverAssetsFolder,
      templatePath: appPaths.resolve.app('index.html'),
      serverFile: appPaths.resolve.entry('compiled-dev-webserver.js'),
      serverEntryFile: appPaths.resolve.entry('server-entry.js'),
      resolveRootFolder: (...args) => join(rootFolder, ...args),
      resolveServerAssetsFolder: (...args) => join(serverAssetsFolder, ...args),
      resolvePublicFolder: (...args) => join(publicFolder, ...args)
    }

    this.registerDiff('webserver', (quasarConf, diffMap) => [
      quasarConf.ssr.extendSSRWebserverConf,
      quasarConf.metaConf.backendEnvDefineList,

      // extends 'rolldown' diff
      ...diffMap.rolldown(quasarConf)
    ])

    // also update the diff for ssg-devserver.js when changing here
    this.registerDiff('csrRouteList', quasarConf => [
      quasarConf.build.publicPath,
      quasarConf.ssr.clientSideRenderingRoutes
    ])

    this.registerDiff('viteSSR', (quasarConf, diffMap) => [
      quasarConf.ssr.pwa,
      quasarConf.metaConf.backendEnvDefineList,

      // extends 'vite' diff
      ...diffMap.vite(quasarConf)
    ])
  }

  run(quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    if (quasarConf.ssr.pwa) {
      // also update pwa-devserver.js & ssg-devserver.js when changing here
      if (diff('pwaManifest', quasarConf)) {
        this.clientNeedsReload = false
        return queue(() => this.#compilePwaManifest(quasarConf))
      }

      // also update pwa-devserver.js & ssg-devserver.js when changing here
      if (diff('pwaServiceWorker', quasarConf)) {
        this.clientNeedsReload = false
        return queue(() => this.#compilePwaServiceWorker(quasarConf, queue))
      }
    }

    // also update ssg-devserver.js when changing here
    if (diff('csrRouteList', quasarConf)) {
      this.clientNeedsReload = true
      this.#registerCSRMatch(quasarConf)
    }

    if (diff('htmlTemplate', quasarConf)) {
      this.clientNeedsReload = true
      const htmlStore = updateHtmlVariables(quasarConf)
      this.#updateTemplate(htmlStore, quasarConf)
    }

    if (diff('webserver', quasarConf)) {
      this.clientNeedsReload = false
      return queue(() => this.#compileWebserver(quasarConf, queue))
    }

    // also update pwa-devserver.js & ssg-devserver.js when changing here
    if (diff('viteSSR', quasarConf)) {
      this.clientNeedsReload = false
      return queue(() => this.#runVite(quasarConf, diff('viteUrl', quasarConf)))
    }

    if (this.clientNeedsReload) this.reloadClient()
  }

  #registerCSRMatch(quasarConf) {
    const { clientSideRenderingRoutes } = quasarConf.ssr
    if (clientSideRenderingRoutes.length === 0) {
      this.#isCsrRoute = null
      return
    }

    const isMatch = getRouteMatcher(clientSideRenderingRoutes)
    const { publicPath } = quasarConf.build

    this.#isCsrRoute =
      publicPath === '/'
        ? url => {
            const route = fastExtractPath(url)
            return isMatch(route)
          }
        : url => {
            const route = fastExtractPath(url).replace(publicPath, '/')
            return isMatch(route)
          }
  }

  #updateTemplate(htmlStore, quasarConf) {
    const template = readFileSync(this.#pathMap.templatePath, 'utf8')

    this.#csrTemplate = template
    this.#renderTemplate = getDevSsrTemplateFn(
      template,
      htmlStore.htmlVariables,
      quasarConf
    )
  }

  async #compileWebserver(quasarConf, queue) {
    this.clientNeedsReload = false

    if (this.#webserverWatcher !== null) {
      const watcher = this.#webserverWatcher
      this.#webserverWatcher = null
      await watcher.close()
    }

    const rolldownConfig = await quasarSsrConfig.webserver(quasarConf)

    await this.watchWithRolldown('SSR Webserver', rolldownConfig, () => {
      this.clientNeedsReload = false
      queue(() => this.#bootWebserver(quasarConf))
    }).then(watcher => {
      this.#webserverWatcher = watcher
    })
  }

  async #runVite(quasarConf, urlDiffers) {
    this.clientNeedsReload = false

    await this.clearWatcherList(this.#viteWatcherList, () => {
      this.#viteWatcherList.length = 0
    })

    if (renderSSRError === null) {
      const { default: render } = await import('@quasar/render-ssr-error')
      renderSSRError = render
    }

    if (vueRenderToString === null) {
      const { renderToString } = await getPackage(
        'vue/server-renderer',
        quasarConf.ctx.appPaths.appDir
      )
      vueRenderToString = renderToString
    }

    this.#appOptions.port = quasarConf.devServer.port

    const publicPath = (this.#appOptions.publicPath =
      quasarConf.build.publicPath)

    this.#appOptions.resolveUrlPath =
      publicPath === '/'
        ? url => url || '/'
        : url =>
            url ? (publicPath + url).replace(multiSlashRE, '/') : publicPath

    const viteClient = (this.clientServer = await createServer(
      await quasarSsrConfig.viteClient(quasarConf)
    ))
    this.#viteWatcherList.push({
      close: () => {
        this.clientServer = null
        return viteClient.close()
      }
    })

    const viteServer = await createServer(
      await quasarSsrConfig.viteServer(quasarConf)
    )

    const viteModuleRunner = createServerModuleRunner(
      viteServer.environments.ssr
    )

    this.#viteWatcherList.push(
      viteServer,
      viteModuleRunner,
      chokidarWatch(this.#pathMap.templatePath, {
        ignoreInitial: true
      }).on('change', () => {
        const htmlStore = updateHtmlVariables(quasarConf)
        this.#updateTemplate(htmlStore, quasarConf)
        this.reloadClient()
      })
    )

    this.#appOptions.render = async ssrContext => {
      const url = ssrContext.url || ssrContext.req.url
      const originalUrl = ssrContext.originalUrl || ssrContext.req.originalUrl

      if (this.#isCsrRoute?.(url)) {
        let html = this.#csrTemplate
        html = await viteClient.transformIndexHtml(url, html, originalUrl)
        return html.replace(entryPointMarkup, attachMarkup)
      }

      const startTime = Date.now()
      const onRenderedList = []

      Object.assign(ssrContext, {
        _meta: {},
        onRendered: fn => {
          onRenderedList.push(fn)
        }
      })

      try {
        const renderApp = await viteModuleRunner.import(
          this.#pathMap.serverEntryFile
        )

        const app = await renderApp.default(ssrContext)
        const runtimePageContent = await vueRenderToString(app, ssrContext)
        const nonce = getNonceAttr(ssrContext)

        injectCriticalCssPath({
          viteServer,
          serverEntryFile: this.#pathMap.serverEntryFile,
          rootFolder: this.#pathMap.rootFolder,
          nonce,
          ssrContext
        })

        onRenderedList.forEach(fn => {
          fn()
        })

        // maintain compatibility with some well-known Vue plugins
        // like @vue/apollo-ssr:
        if (typeof ssrContext.rendered === 'function') ssrContext.rendered()

        if (
          ssrContext.state !== void 0 &&
          quasarConf.ssr.manualStoreSerialization !== true
        ) {
          ssrContext._meta.headTags =
            renderStoreState(ssrContext, nonce) + ssrContext._meta.headTags
        }

        let html = this.#renderTemplate(ssrContext)

        html = await viteClient.transformIndexHtml(url, html, originalUrl)
        html = html.replace(
          entryPointMarkup,
          `<div id="q-app">${runtimePageContent}</div>`
        )

        logServerMessage('Rendered', url, `${Date.now() - startTime}ms`)

        return html
      } catch (err) {
        viteServer.ssrFixStacktrace(err)
        throw err
      }
    }

    await this.#bootWebserver(quasarConf)

    if (urlDiffers && quasarConf.metaConf.openBrowser) {
      const { metaConf } = quasarConf
      openBrowser({
        url: metaConf.APP_URL,
        opts: metaConf.openBrowser !== true ? metaConf.openBrowser : false
      })
    }
  }

  async #bootWebserver(quasarConf) {
    this.clientNeedsReload = false

    const done = progress({
      tool: 'Webserver',
      waitAction: 'Starting',
      doneAction: 'Started'
    })

    const {
      create,
      injectDevMiddleware,
      listen,
      close,
      injectMiddlewares,
      serveStaticContent
    } = await import(
      pathToFileURL(this.#pathMap.serverFile).href + '?t=' + Date.now()
    )
    const { publicPath } = this.#appOptions

    const middlewareParams = {
      port: this.#appOptions.port,
      devHttpsOptions: quasarConf.devServer.https,
      resolve: {
        urlPath: this.#appOptions.resolveUrlPath,
        root: this.#pathMap.resolveRootFolder,
        public: this.#pathMap.resolvePublicFolder,
        serverAssets: this.#pathMap.resolveServerAssetsFolder
      },
      publicPath,
      folders: {
        root: this.#pathMap.rootFolder,
        public: this.#pathMap.publicFolder,
        serverAssets: this.#pathMap.serverAssetsFolder
      },
      render: this.#appOptions.render
    }

    middlewareParams.app = await create(middlewareParams)

    const serveStatic = await serveStaticContent(middlewareParams)
    middlewareParams.serve = {
      static: serveStatic,
      devError: ({ err, req }) => {
        log()
        warn(req.url, 'Render failed')

        return renderSSRError({
          err:
            err instanceof Error
              ? err
              : new Error(String(err) || 'Unknown error'),
          req,
          rootFolder: this.#pathMap.rootFolder
        })
      }
    }

    /** @type {import('../../../types').SsrInjectDevMiddlewareFn} */
    const registerDevMiddleware = await injectDevMiddleware(middlewareParams)

    await registerDevMiddleware((req, res, next) => {
      if (this.clientServer === null) {
        next()
        return
      }

      // Vite dev middleware modifies req.url to account for publicPath
      // but we'll break usage in the webserver if we do so
      const { url } = req
      this.clientServer.middlewares.handle(req, res, err => {
        req.url = url
        next(err)
      })
    })

    await injectMiddlewares(middlewareParams)

    this.clientNeedsReload = false
    if (this.#webserver !== null) {
      await this.#webserver.close()
    }

    middlewareParams.listenResult = await listen(middlewareParams)

    this.#webserver = {
      close: () => {
        this.#webserver = null
        return close(middlewareParams)
      }
    }

    done()

    this.printBanner(quasarConf)
  }

  // also update pwa-devserver.js & ssg-devserver.js when changing here
  async #compilePwaManifest(quasarConf) {
    if (this.#pwaManifestWatcher !== null) {
      const watcher = this.#pwaManifestWatcher
      this.#pwaManifestWatcher = null
      await watcher.close()
    }

    async function inject() {
      await injectPwaManifest(
        quasarConf,
        quasarConf.ctx.appPaths.resolve.entry(
          `service-worker/${quasarConf.pwa.manifestFilename}`
        )
      )

      log(
        `Generated the PWA manifest file (${quasarConf.pwa.manifestFilename})`
      )
    }

    this.#pwaManifestWatcher = chokidarWatch(
      quasarConf.metaConf.pwaManifestFile,
      {
        ignoreInitial: true
      }
    ).on(
      'change',
      debounce(async () => {
        await inject()
        const htmlStore = updateHtmlVariables(quasarConf)
        this.#updateTemplate(htmlStore, quasarConf)
        this.reloadClient()
      }, 550)
    )

    await inject()
  }

  // also update pwa-devserver.js & ssg-devserver.js when changing here
  async #compilePwaServiceWorker(quasarConf, queue) {
    if (this.#pwaServiceWorkerWatcher !== null) {
      const watcher = this.#pwaServiceWorkerWatcher
      this.#pwaServiceWorkerWatcher = null
      await watcher.close()
    }

    const workboxConfig = await quasarSsrConfig.workbox(quasarConf)

    if (quasarConf.pwa.workboxMode === 'InjectManifest') {
      const rolldownConfig = await quasarSsrConfig.customSw(quasarConf)
      await this.watchWithRolldown(
        'InjectManifest Custom SW',
        rolldownConfig,
        () => {
          queue(() =>
            buildPwaServiceWorker(quasarConf, workboxConfig).then(() =>
              this.reloadClient()
            )
          )
        }
      ).then(watcher => {
        this.#pwaServiceWorkerWatcher = watcher
      })
    }

    await buildPwaServiceWorker(quasarConf, workboxConfig)
  }
}
