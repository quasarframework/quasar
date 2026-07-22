import { readFileSync } from 'node:fs'
import { createServer, createServerModuleRunner, normalizePath } from 'vite'
import { watch as chokidarWatch } from 'chokidar'

import { AppDevserver } from '../../app-devserver.js'
import { getPackage } from '../../utils/get-package.js'
import { getRouteMatcher } from '../../utils/get-route-matcher.js'
import { openBrowser } from '../../utils/open-browser.js'
import { log, warn } from '../../utils/logger.js'
import { debounce } from '../../utils/rate-limit.js'
import {
  attachMarkup,
  entryPointMarkup,
  fastExtractPath,
  getDevSsrTemplateFn,
  updateHtmlVariables
} from '../../plugins/vite.html.js'

import {
  injectCriticalCssPath,
  logServerMessage,
  renderStoreState
} from '../ssr/ssr-utils.js'
import { buildPwaServiceWorker, injectPwaManifest } from '../pwa/pwa-utils.js'
import { quasarSsgConfig } from './ssg-config.js'

/** @type {import('@quasar/render-ssr-error').default} */
let renderSSRError = null
let vueRenderToString = null

export class QuasarModeDevserver extends AppDevserver {
  /** @type {import('vite').ViteDevServer|null} */
  #viteWatcherList = []
  #isCsrRoute = null
  #csrTemplate = null
  #renderTemplate = null

  // also update pwa-devserver.js & ssr-devserver.js when changing here
  #pwaManifestWatcher = null
  #pwaServiceWorkerWatcher = null

  #pathMap = {}

  constructor(opts) {
    super(opts)

    const { appPaths } = this.ctx

    this.#pathMap = {
      rootFolder: appPaths.appDir,
      templatePath: appPaths.resolve.app('index.html'),
      serverEntryFile: appPaths.resolve.entry('server-entry.js')
    }

    this.registerDiff('csrRouteList', quasarConf => [
      quasarConf.build.publicPath,
      quasarConf.ssg.clientSideRenderingRoutes
    ])

    this.registerDiff('viteSSG', (quasarConf, diffMap) => [
      quasarConf.ssg.pwa,
      quasarConf.metaConf.backendEnvDefineList,

      // extends 'vite' diff
      ...diffMap.vite(quasarConf)
    ])
  }

  run(quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    if (quasarConf.ssg.pwa) {
      // also update pwa-devserver.js & ssr-devserver.js when changing here
      if (diff('pwaManifest', quasarConf)) {
        this.clientNeedsReload = false
        return queue(() => this.#compilePwaManifest(quasarConf))
      }

      // also update pwa-devserver.js & ssr-devserver.js when changing here
      if (diff('pwaServiceWorker', quasarConf)) {
        this.clientNeedsReload = false
        return queue(() => this.#compilePwaServiceWorker(quasarConf, queue))
      }
    }

    if (diff('csrRouteList', quasarConf)) {
      this.clientNeedsReload = true
      this.#registerCSRMatch(quasarConf)
    }

    if (diff('htmlTemplate', quasarConf)) {
      this.clientNeedsReload = true
      const htmlStore = updateHtmlVariables(quasarConf)
      this.#updateTemplate(htmlStore, quasarConf)
    }

    // also update pwa-devserver.js & ssr-devserver.js when changing here
    if (diff('viteSSG', quasarConf)) {
      this.clientNeedsReload = false
      return queue(() => this.#runVite(quasarConf, diff('viteUrl', quasarConf)))
    }

    if (this.clientNeedsReload) this.reloadClient()
  }

  #registerCSRMatch(quasarConf) {
    const { clientSideRenderingRoutes } = quasarConf.ssg
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

    const viteServer = await createServer(
      await quasarSsgConfig.viteServer(quasarConf)
    )

    const viteModuleRunner = createServerModuleRunner(
      viteServer.environments.ssr
    )

    const { rootFolder, templatePath, serverEntryFile } = this.#pathMap

    this.#viteWatcherList.push(
      viteServer,
      viteModuleRunner,
      chokidarWatch(templatePath, {
        ignoreInitial: true
      }).on('change', () => {
        const htmlStore = updateHtmlVariables(quasarConf)
        this.#updateTemplate(htmlStore, quasarConf)
        this.reloadClient()
      })
    )

    const renderSsrContext = async ssrContext => {
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
        const renderApp = await viteModuleRunner.import(serverEntryFile)

        const app = await renderApp.default(ssrContext)
        const runtimePageContent = await vueRenderToString(app, ssrContext)

        const entryModules = viteServer.moduleGraph.getModulesByFile(
          normalizePath(serverEntryFile)
        )

        if (entryModules) {
          const criticalCSS = {
            seenNodes: new Set(),
            ssrContext,
            nonce:
              ssrContext.nonce !== void 0 ? ` nonce="${ssrContext.nonce}"` : ''
          }

          injectCriticalCssPath(entryModules, criticalCSS)
        }

        onRenderedList.forEach(fn => {
          fn()
        })

        // maintain compatibility with some well-known Vue plugins
        // like @vue/apollo-ssr:
        if (typeof ssrContext.rendered === 'function') ssrContext.rendered()

        if (
          ssrContext.state !== void 0 &&
          quasarConf.ssg.manualStoreSerialization !== true
        ) {
          ssrContext._meta.headTags =
            renderStoreState(ssrContext) + ssrContext._meta.headTags
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

    const viteClientConfig = await quasarSsgConfig.viteClient(quasarConf)

    viteClientConfig.plugins.push({
      name: 'quasar:ssg',
      configureServer(server) {
        // return a post hook that is called after internal middlewares are installed
        return () => {
          server.middlewares.use(async (req, res) => {
            try {
              const renderedHtml = await renderSsrContext(
                /* the ssrContext: */ { req, res }
              )
              res.end(renderedHtml)
            } catch (err) {
              if (err?.routeNotFound) {
                /**
                 * Hmm, Vue Router could not find the requested route
                 * and it does not have a "catch-all" route
                 */
                res.writeHead(404)
                res.end('404 | Page Not Found')
                return
              }

              if (err?.redirectUrl) {
                /**
                 * We were told to redirect to another URL,
                 * but we're in SSG mode, so we cannot!
                 */
                res.writeHead(500)
                res.end(
                  '500 | Internal Server Error due to redirect in SSG mode'
                )
                return
              }

              log()
              warn(req.url, 'Render failed')

              const { errorHeaders, errorHtml } = renderSSRError({
                err:
                  err instanceof Error
                    ? err
                    : new Error(String(err) || 'Unknown error'),
                req,
                rootFolder
              })

              res.writeHead(500, errorHeaders)
              res.end(errorHtml)
            }
          })
        }
      }
    })

    const viteClient = await createServer(viteClientConfig)
    await this.rebootClient(viteClient)

    if (urlDiffers && quasarConf.metaConf.openBrowser) {
      const { metaConf } = quasarConf
      openBrowser({
        url: metaConf.APP_URL,
        opts: metaConf.openBrowser !== true ? metaConf.openBrowser : false
      })
    }

    this.printBanner(quasarConf)
  }

  // also update pwa-devserver.js & ssr-devserver.js when changing here
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

  // also update pwa-devserver.js & ssr-devserver.js when changing here
  async #compilePwaServiceWorker(quasarConf, queue) {
    if (this.#pwaServiceWorkerWatcher !== null) {
      const watcher = this.#pwaServiceWorkerWatcher
      this.#pwaServiceWorkerWatcher = null
      await watcher.close()
    }

    const workboxConfig = await quasarSsgConfig.workbox(quasarConf)

    if (quasarConf.pwa.workboxMode === 'InjectManifest') {
      const rolldownConfig = await quasarSsgConfig.customSw(quasarConf)
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
