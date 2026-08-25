import { readFileSync } from 'node:fs'
import { createServer, createServerModuleRunner } from 'vite'
import { watch as chokidarWatch } from 'chokidar'

import { AppDevserver } from '../../app-devserver.js'
import { getPackage } from '../../utils/get-package.js'
import { getRouteMatcher } from '../../utils/get-route-matcher.js'
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
  injectNonceAttr,
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

    this.registerDiff('ssgPwaManifest', (quasarConf, diffMap) => [
      quasarConf.ssg.pwa,
      ...diffMap.pwaManifest(quasarConf, diffMap)
    ])
    this.registerDiff('ssgPwaServiceWorker', (quasarConf, diffMap) => [
      quasarConf.ssg.pwa,
      ...diffMap.pwaServiceWorker(quasarConf, diffMap)
    ])

    this.registerDiff('csrRouteList', quasarConf => [
      quasarConf.build.publicPath,
      quasarConf.ssg.clientSideRenderingRoutes
    ])

    this.registerDiff('viteSSG', (quasarConf, diffMap) => [
      quasarConf.ssg.pwa,
      quasarConf.metaConf.backendEnvDefineList,

      // extends 'vite' diff
      ...diffMap.vite(quasarConf, diffMap)
    ])

    this.registerRunSteps([
      {
        diff: 'ssgPwaManifest',
        fn: this.#compilePwaManifest.bind(this)
      },

      {
        diff: 'ssgPwaServiceWorker',
        fn: this.#compilePwaServiceWorker.bind(this)
      },

      {
        diff: 'csrRouteList',
        fn: this.#registerCSRMatch.bind(this)
      },

      {
        diff: 'htmlTemplate',
        fn: this.#updateTemplate.bind(this)
      },

      {
        diff: 'viteSSG',
        fn: this.#runVite.bind(this)
      },

      {
        diff: 'viteUrl',
        fn: this.openBrowser.bind(this)
      }
    ])
  }

  #registerCSRMatch(quasarConf) {
    this.clientNeedsReload = true

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

  #updateTemplate(quasarConf) {
    this.clientNeedsReload = true

    const htmlStore = updateHtmlVariables(quasarConf)
    const template = readFileSync(this.#pathMap.templatePath, 'utf8')

    this.#csrTemplate = template
    this.#renderTemplate = getDevSsrTemplateFn(
      template,
      htmlStore.htmlVariables
    )
  }

  async #runVite(quasarConf) {
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
        this.#updateTemplate(quasarConf)
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

        injectNonceAttr(ssrContext)
        injectCriticalCssPath({
          viteServer,
          serverEntryFile,
          rootFolder,
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
          quasarConf.ssg.manualStoreSerialization !== true
        ) {
          ssrContext._meta.headTags =
            renderStoreState(ssrContext) + ssrContext._meta.headTags
        }

        let html = this.#renderTemplate(ssrContext)

        html = await viteClient.transformIndexHtml(url, html, originalUrl)
        // use a function replacement so that special patterns ($$, $&, ...)
        // in the rendered page content are not interpreted by String.replace()
        html = html.replace(
          entryPointMarkup,
          () => `<div id="q-app">${runtimePageContent}</div>`
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

    this.printBanner(quasarConf)
  }

  // also update pwa-devserver.js & ssr-devserver.js when changing here
  async #compilePwaManifest(quasarConf, diffName) {
    if (this.#pwaManifestWatcher !== null) {
      const watcher = this.#pwaManifestWatcher
      this.#pwaManifestWatcher = null
      await watcher.close()
    }

    if (!quasarConf.ssg.pwa) return
    this.clientNeedsReload = false

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
      debounce(() => {
        this.queue(diffName, async latestQuasarConf => {
          await inject()
          this.#updateTemplate(latestQuasarConf)
          this.reloadClient()
        })
      }, 550)
    )

    await inject()
  }

  // also update pwa-devserver.js & ssr-devserver.js when changing here
  async #compilePwaServiceWorker(quasarConf, diffName) {
    if (this.#pwaServiceWorkerWatcher !== null) {
      const watcher = this.#pwaServiceWorkerWatcher
      this.#pwaServiceWorkerWatcher = null
      await watcher.close()
    }

    if (!quasarConf.ssg.pwa) return
    this.clientNeedsReload = false

    const workboxConfig = await quasarSsgConfig.workbox(quasarConf)

    if (quasarConf.pwa.workboxMode === 'InjectManifest') {
      const rolldownConfig = await quasarSsgConfig.customSw(quasarConf)
      await this.watchWithRolldown(
        'InjectManifest Custom SW',
        rolldownConfig,
        () => {
          this.queue(diffName, latestQuasarConf =>
            buildPwaServiceWorker(latestQuasarConf, workboxConfig).then(() =>
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
