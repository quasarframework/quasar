import { join } from 'node:path'
import { merge } from 'webpack-merge'

import { AppBuilder } from '../../app-builder.js'
import { getRouteMatcher } from '../../utils/get-route-matcher.js'
import { quasarSsgConfig } from './ssg-config.js'
import {
  getProdSsrRenderTemplateFileContent,
  transformProdHtmlShell
} from '../../plugins/vite.html.js'

import { error, fatal, progress, warn } from '../../utils/logger.js'
import { buildPwaServiceWorker, injectPwaManifest } from '../pwa/pwa-utils.js'

const multiSlashRE = /\/{2,}/g
const trailingSlashRE = /\/+$/
const ssrManifestIdQueryRE = /vue\?vue/
const ssrManifestIdQueryReplaceRE = /vue\?vue.*$/
const synthetic404Route = '/______get-a-quasar-404-page______'

function getSsgPageIdentifier(ssgPage) {
  return (
    `route "${ssgPage.route}"` + `${ssgPage.label ? ` [${ssgPage.label}]` : ''}`
  )
}

function getSsgRendererErrorHandler(onSsgRendererError) {
  if (typeof onSsgRendererError === 'function') {
    return onSsgRendererError
  }

  if (onSsgRendererError === 'abort') {
    return ({ err, reason, ssgPage }) => {
      console.log()
      error('SSG build failed to render SSG page:')
      console.error(ssgPage)
      error('Render error for the above SSG page:')
      console.error(err)
      fatal(
        `Failed to render SSG page for ${getSsgPageIdentifier(ssgPage)}.` +
          (reason ? ` ${reason}.` : '') +
          ' Check details above.',
        'FAIL'
      )
    }
  }

  if (onSsgRendererError === 'error') {
    return ({ err, reason, ssgPage }) => {
      console.log()
      error('SSG build failed to render SSG page:')
      console.error(ssgPage)
      error('Render error for the above SSG page:')
      console.error(err)
      error(
        `Failed to render SSG page for ${getSsgPageIdentifier(ssgPage)}.` +
          (reason ? ` ${reason}.` : '') +
          ' Check details above.'
      )
    }
  }

  if (onSsgRendererError === 'warn') {
    return ({ err, reason, ssgPage }) => {
      console.log()
      warn('SSG build failed to render SSG page:')
      console.warn(ssgPage)
      warn('Render error for the above SSG page:')
      console.warn(err)
      warn(
        `Failed to render SSG page for ${getSsgPageIdentifier(ssgPage)}.` +
          (reason ? ` ${reason}.` : '') +
          ' Check details above.'
      )
    }
  }

  if (onSsgRendererError === 'ignore') {
    return () => {}
  }

  fatal(
    'Invalid value for quasar.config.ssg.onSsgRendererError:' +
      `"${onSsgRendererError}". Must be one of: "abort", "error",` +
      ' "warn", "ignore" or a function.',
    'FAIL'
  )
}

function getParseVueRouterRoutesFn(quasarConf) {
  const { clientSideRenderingRoutes } = quasarConf.ssg
  const isCSRMatch =
    clientSideRenderingRoutes.length !== 0
      ? getRouteMatcher(clientSideRenderingRoutes)
      : null

  const parseVueRouterRoutes = ({ routes, parentPath, opts }) => {
    for (const route of routes) {
      const routePath = route.path
      const fullPath = (
        routePath === '' ? parentPath : `${parentPath}/${routePath}`
      ).replaceAll(multiSlashRE, '/')

      const ssgPage = {
        route: fullPath,
        vueRouterRoute: route
      }

      if (opts.isCrawlIgnoreMatch?.(fullPath)) {
        opts.acc.crawlIgnoredSsgPages.push(ssgPage)

        if (opts.verbose) {
          warn(
            `Ignored route (crawl-ignored): ${fullPath}`,
            'parseVueRouterRoutes()'
          )
        }

        if (route.children) {
          parseVueRouterRoutes({
            routes: route.children,
            parentPath: fullPath,
            opts
          })
        }

        continue
      }

      if (isCSRMatch?.(fullPath)) {
        opts.acc.ignoredCsrSsgPages.push(ssgPage)

        if (opts.verbose) {
          warn(`Ignored route (CSR): ${fullPath}`, 'parseVueRouterRoutes()')
        }

        if (route.children) {
          parseVueRouterRoutes({
            routes: route.children,
            parentPath: fullPath,
            opts
          })
        }

        continue
      }

      if (routePath.includes(':')) {
        const dynamicMap = opts.routesDynamicParamsMap[fullPath]
        if (dynamicMap === void 0) {
          opts.acc.ignoredDynamicParamSsgPages.push(ssgPage)

          if (opts.verbose) {
            warn(
              `Ignored route (dynamic param): ${fullPath}`,
              'parseVueRouterRoutes()'
            )
          }
        } else {
          opts.dynamicRoutesMatched.push(fullPath)

          for (const dynamicEntry of dynamicMap) {
            let dynamicFullPath = fullPath
            for (const [key, value] of Object.entries(dynamicEntry)) {
              if (dynamicFullPath.includes(`:${key}`) === false) {
                fatal(
                  `Dynamic param ":${key}" not found in route: ${dynamicFullPath}`,
                  'parseVueRouterRoutes() FAILED'
                )
              }

              dynamicFullPath =
                value === ''
                  ? dynamicFullPath.replaceAll(`/:${key}?`, '')
                  : dynamicFullPath
                      .replaceAll(`:${key}?`, value)
                      .replaceAll(`:${key}`, value)
            }

            const dynamicSsgPage = {
              ...ssgPage,
              route: dynamicFullPath
            }

            if (dynamicFullPath.includes(':')) {
              opts.acc.ignoredDynamicParamSsgPages.push(dynamicSsgPage)
              const routeBanner =
                dynamicFullPath !== fullPath ? ` (${fullPath})` : ''

              fatal(
                `Not all dynamic params defined for route: ${dynamicFullPath}${routeBanner}`,
                'parseVueRouterRoutes() FAILED'
              )
            } else if (route.children) {
              parseVueRouterRoutes({
                routes: route.children,
                parentPath: dynamicFullPath,
                opts
              })
            } else {
              opts.acc.ssgPages.push(dynamicSsgPage)
            }
          }
        }

        continue
      }

      if (route.children) {
        parseVueRouterRoutes({
          routes: route.children,
          parentPath: fullPath,
          opts
        })

        continue
      }

      if (route.redirect) {
        opts.acc.ignoredRedirectSsgPages.push(ssgPage)

        if (opts.verbose) {
          warn(
            `Ignored route (redirects): ${fullPath}`,
            'parseVueRouterRoutes()'
          )
        }

        continue
      }

      opts.acc.ssgPages.push(ssgPage)
    }
  }

  return ({
    routes,
    parentPath = '/',
    crawlIgnoreRoutes = [],
    routesDynamicParamsMap = {},
    verbose = false
  }) => {
    const dynamicRoutesMatched = []
    const acc = {
      ssgPages: [],
      hasIgnoredRoutes: false,
      crawlIgnoredSsgPages: [],
      ignoredRedirectSsgPages: [],
      ignoredDynamicParamSsgPages: [],
      ignoredCsrSsgPages: []
    }

    parseVueRouterRoutes({
      routes,
      parentPath,
      /**
       * Static options for the recursive fn.
       * Avoids redeclaring them so it's less error prone.
       */
      opts: {
        acc,
        verbose,
        routesDynamicParamsMap,
        dynamicRoutesMatched,
        isCrawlIgnoreMatch:
          crawlIgnoreRoutes.length !== 0
            ? getRouteMatcher(crawlIgnoreRoutes)
            : null
      }
    })

    for (const fullPath in routesDynamicParamsMap) {
      if (!dynamicRoutesMatched.includes(fullPath)) {
        fatal(
          `Dynamic route "${fullPath}" in routesDynamicParamsMap was not matched by any of the routes.`,
          'parseVueRouterRoutes() FAILED'
        )
      }
    }

    acc.hasIgnoredRoutes =
      acc.crawlIgnoredSsgPages.length !== 0 ||
      acc.ignoredRedirectSsgPages.length !== 0 ||
      acc.ignoredDynamicParamSsgPages.length !== 0 ||
      acc.ignoredCsrSsgPages.length !== 0

    return acc
  }
}

async function loadFilenameBasedRoutes(viteServerConfig, createServer) {
  const vite = await createServer(viteServerConfig)

  try {
    const { routes } = await vite.ssrLoadModule('vue-router/auto-routes')
    return routes
  } finally {
    await vite.close()
  }
}

export class QuasarModeBuilder extends AppBuilder {
  #viteServerConfig

  async build() {
    this.cleanArtifacts()

    if (this.quasarConf.ssg.pwa) {
      // also update pwa-builder.js when changing here
      await injectPwaManifest(
        this.quasarConf,
        join(
          this.quasarConf.build.distDir,
          this.quasarConf.pwa.manifestFilename
        )
      )
    }

    await Promise.all([
      this.#buildSSGRenderer(),
      this.#buildSSRServer(),
      this.#buildSSRClient()
    ])

    await this.#renderSsgPages()

    this.printSummary(this.quasarConf.build.distDir, true)
  }

  async #buildSSGRenderer() {
    const rolldownConfig = await quasarSsgConfig.ssgRenderer(this.quasarConf)
    await this.buildWithRolldown('SSG Renderer', rolldownConfig)
  }

  async #buildSSRServer() {
    const viteServerConfig = await quasarSsgConfig.viteServer(this.quasarConf)
    if (this.quasarConf.build.filenameBasedRouting) {
      this.#viteServerConfig = viteServerConfig
    }

    await this.buildWithVite('SSR Server', viteServerConfig)
  }

  async #buildSSRClient() {
    const viteClientConfig = await quasarSsgConfig.viteClient(this.quasarConf)
    await this.buildWithVite('SSR Client', viteClientConfig)

    await Promise.all([this.#writeSsrManifest(), this.#writeRenderTemplate()])

    if (this.quasarConf.ssg.pwa) {
      await this.#buildPWA()
    }
  }

  async #writeRenderTemplate() {
    const html = await this.readFile('index.html')
    await this.removeFile('index.html')

    await Promise.all([
      getProdSsrRenderTemplateFileContent(html, this.quasarConf).then(content =>
        this.writeFile('__ssg__/render-template.js', content)
      ),

      this.quasarConf.ssg.pwa ||
      this.quasarConf.ssg.clientSideRenderingHtmlFilename
        ? transformProdHtmlShell(html, this.quasarConf).then(async content => {
            if (this.quasarConf.ssg.pwa) {
              const hasFile = await this.writeFile(
                `${this.quasarConf.ssg.pwaOfflineHtmlFilename}`,
                content,
                true /* noOverwrite */
              )

              if (hasFile) {
                console.log()
                fatal(
                  `Tried to write the ssg.pwaOfflineHtmlFilename file` +
                    ` (${this.quasarConf.ssg.pwaOfflineHtmlFilename})` +
                    ' but the file already exists.' +
                    ' Check your SSG configuration for duplicate routes' +
                    ' or filenames or quasar.config html filenames settings.',
                  'FAIL'
                )
              }
            }

            if (
              this.quasarConf.ssg.clientSideRenderingHtmlFilename &&
              (this.quasarConf.ssg.pwa !== true ||
                this.quasarConf.ssg.clientSideRenderingHtmlFilename !==
                  this.quasarConf.ssg.pwaOfflineHtmlFilename)
            ) {
              const hasFile = await this.writeFile(
                `${this.quasarConf.ssg.clientSideRenderingHtmlFilename}`,
                content,
                true /* noOverwrite */
              )

              if (hasFile) {
                console.log()
                fatal(
                  `Tried to write the ssg.clientSideRenderingHtmlFilename file` +
                    ` (${this.quasarConf.ssg.clientSideRenderingHtmlFilename})` +
                    ' but the file already exists.' +
                    ' Check your SSG configuration for duplicate routes' +
                    ' or filenames or quasar.config html filenames settings.',
                  'FAIL'
                )
              }
            }
          })
        : null
    ])
  }

  async #writeSsrManifest() {
    const viteManifest = JSON.parse(
      await this.readFile('.vite/ssr-manifest.json')
    )

    await this.removeFile('.vite')

    /**
     * See https://github.com/quasarframework/quasar/issues/17864
     * Need to strip out the query part of the IDs introduced by @vitejs/plugin-vue,
     *   eg: `?vue&type=script&setup=true&lang.ts`
     *   eg: `?vue&type=style&index=0&lang.scss`
     *
     * Otherwise we will have multiple entries for the same file,
     * but NONE will match the actual production ID of the file.
     *
     * Example with original viteManifest:
     *  "src/components/UsedOnTwoPlaces.vue?vue&type=script&setup=true&lang.ts": [
     *    "/assets/UsedOnTwoPlaces.vue_vue_type_style_index_0_lang-CCF7vrwS.js",
     *    "/assets/UsedOnTwoPlaces-CLKnUPw2.css"
     *  ],
     *  "src/components/UsedOnTwoPlaces.vue?vue&type=style&index=0&lang.scss": [
     *    "/assets/UsedOnTwoPlaces.vue_vue_type_style_index_0_lang-CCF7vrwS.js",
     *    "/assets/UsedOnTwoPlaces-CLKnUPw2.css"
     *  ],
     */
    let ssrManifest = {}
    for (let key in viteManifest) {
      const value = viteManifest[key]
      if (ssrManifestIdQueryRE.test(key)) {
        key = key.replace(ssrManifestIdQueryReplaceRE, 'vue')
        if (ssrManifest[key] !== void 0) continue
      }

      ssrManifest[key] = value
    }

    if (typeof this.quasarConf.ssg.extendSSGManifestJson === 'function') {
      const overrides =
        await this.quasarConf.ssg.extendSSGManifestJson(ssrManifest)
      if (Object(overrides) === overrides) {
        ssrManifest = merge({}, ssrManifest, overrides)
      }
    }

    await this.ctx.appExt.runAppExtensionHook(
      'extendSSGManifestJson',
      async hook => {
        hook.api.logger.log(`Running "extendSSGManifestJson(ssrManifest)"`)
        const overrides = await hook.fn(ssrManifest, hook.api)
        if (Object(overrides) === overrides) {
          ssrManifest = merge({}, ssrManifest, overrides)
        }
      }
    )

    await this.writeFile(
      '__ssg__/quasar.manifest.json',
      JSON.stringify(
        ssrManifest,
        null,
        this.quasarConf.build.minify !== false ? void 0 : 2
      )
    )
  }

  async #buildPWA() {
    const distDir = this.quasarConf.build.distDir
    const pwaQuasarConf = {
      ...this.quasarConf,
      build: {
        ...this.quasarConf.build,
        distDir
      }
    }

    // also update pwa-builder.js & ssr-builder.js when changing here
    if (this.quasarConf.pwa.workboxMode === 'InjectManifest') {
      const rolldownConfig = await quasarSsgConfig.customSw(pwaQuasarConf)
      await this.buildWithRolldown('InjectManifest Custom SW', rolldownConfig)
    }

    // also update pwa-builder.js & ssr-builder.js when changing here
    const workboxConfig = await quasarSsgConfig.workbox(pwaQuasarConf)
    await buildPwaServiceWorker(this.quasarConf, workboxConfig)
  }

  async #renderSsgPages() {
    const { renderSsgPage, getSsgPages } = await import(
      join(this.quasarConf.build.distDir, '__ssg__/ssg-script.js')
    )

    const ssgPageList = await getSsgPages({
      ctx: this.quasarConf.ctx,
      quasarConfSsg: this.quasarConf.ssg,
      parseVueRouterRoutes: getParseVueRouterRoutesFn(this.quasarConf),
      getFilenameBasedRoutes: () => this.#getFilenameBasedRoutes()
    })

    if (ssgPageList.length === 0) {
      fatal(
        'No SSG pages returned by getSsgPages() (see /src-ssg/ssg-renderer). Nothing to render.',
        'FAIL'
      )
    }

    if (this.quasarConf.ssg.error404HtmlFilename) {
      ssgPageList.push({
        route: synthetic404Route,
        label: '404 page',
        dir: '',
        filename: this.quasarConf.ssg.error404HtmlFilename
      })
    }

    const {
      ssgRendererConcurrency,
      noPreloadTagRoutes,
      ssgRendererRetryCount,
      ssgRendererRetryDelay,
      autoSubfolderIndex
    } = this.quasarConf.ssg

    const isNoPreloadMatcher =
      noPreloadTagRoutes.length !== 0
        ? getRouteMatcher(noPreloadTagRoutes)
        : null

    const concurrencyBanner =
      ssgRendererConcurrency > 1
        ? ` (concurrency: ${ssgRendererConcurrency})`
        : ''

    const done = progress({
      tool: 'SSG',
      waitAction: 'Rendering',
      doneAction: 'Rendered',
      target: `${ssgPageList.length} SSG page${ssgPageList.length > 1 ? 's' : ''}${concurrencyBanner}`
    })

    const { onSsgRendererError } = this.quasarConf.ssg
    const handleError = getSsgRendererErrorHandler(onSsgRendererError)
    let errorsEncountered = 0

    const getSsgPageFilename = ssgPage => {
      if (
        autoSubfolderIndex === false &&
        ssgPage.dir === void 0 &&
        ssgPage.filename === void 0
      ) {
        const routePath = ssgPage.route.slice(1).replace(trailingSlashRE, '')
        return join(
          this.quasarConf.build.distDir,
          routePath === '' ? 'index.html' : `${routePath}.html`
        )
      }

      return join(
        this.quasarConf.build.distDir,
        ssgPage.dir ?? ssgPage.route.slice(1),
        ssgPage.filename ?? 'index.html'
      )
    }

    const renderPage = async ssgPage => {
      const ssrContext = ssgPage.ssrContext ?? {}
      const url =
        'http://localhost' +
        (this.quasarConf.build.publicPath + ssgPage.route).replace(
          multiSlashRE,
          '/'
        )

      let html
      let retryCount = 0

      while (true) {
        try {
          html = await renderSsgPage(
            {
              ...ssrContext,
              url,
              req: {
                headers: {},
                ...ssrContext.req,
                url
              }
            },
            !isNoPreloadMatcher?.(ssgPage.route)
          )

          if (typeof ssgPage.transformHtml === 'function') {
            const result = await ssgPage.transformHtml(html)
            if (typeof result === 'string') html = result
          }

          break
        } catch (err) {
          if (
            err?.routeNotFound !== true &&
            err?.redirectUrl === void 0 &&
            retryCount < ssgRendererRetryCount
          ) {
            retryCount++

            if (onSsgRendererError !== 'ignore') {
              warn(
                `Failed to render SSG page for ${getSsgPageIdentifier(ssgPage)}.` +
                  ` Retrying in ${ssgRendererRetryDelay}ms...` +
                  ` (${retryCount}/${ssgRendererRetryCount})`
              )
            }

            await new Promise(resolve => {
              setTimeout(resolve, ssgRendererRetryDelay)
            })

            continue
          }

          if (err?.routeNotFound) {
            await handleError({
              err,
              reason:
                ssgPage.route === synthetic404Route
                  ? 'Vue Router did not match the synthetic 404 route. Add a catch-all route or set quasar.config.ssg.error404HtmlFilename to false'
                  : 'Vue Router did not match the route',
              ssgPage
            })
          } else if (err?.redirectUrl) {
            await handleError({
              err,
              reason: `The route redirects to "${err.redirectUrl}". Generate the destination route instead.`,
              ssgPage
            })
          } else {
            await handleError({
              err,
              ssgPage
            })
          }

          errorsEncountered++
          return
        }
      }

      const filename = getSsgPageFilename(ssgPage)

      const hasFile = await this.writeFile(
        filename,
        html,
        true /* noOverwrite */
      )

      if (hasFile) {
        errorsEncountered++
        const msg = `Tried to write SSG file but the target file already exists: ${filename}`
        await handleError({
          err: new Error(msg),
          reason:
            `${msg}. Check your SSG configuration for duplicate routes or filenames or` +
            ' quasar.config html filenames settings.',
          ssgPage
        })
      }
    }

    if (ssgRendererConcurrency > 1) {
      const { runSequentialPromises } =
        await import('../../utils/run-sequential-promises.js')

      await runSequentialPromises(
        ssgPageList.map(ssgPage => () => renderPage(ssgPage)),
        {
          threadsNumber: ssgRendererConcurrency
        }
      )
    } else {
      for (const ssgPage of ssgPageList) {
        await renderPage(ssgPage)
      }
    }

    if (errorsEncountered) {
      if (!['warn', 'ignore'].includes(onSsgRendererError)) {
        fatal(
          `Failed to render ${errorsEncountered} SSG page${errorsEncountered > 1 ? 's' : ''}. Check details above.`,
          'FAIL'
        )
      }

      console.log()
      warn(
        `Failed to render ${errorsEncountered} SSG page${errorsEncountered > 1 ? 's' : ''}.`,
        'WARNING!'
      )
      console.log()
    }

    await this.removeFile('__ssg__')

    if (errorsEncountered) {
      const renderedCount = ssgPageList.length - errorsEncountered
      done({
        target:
          ` ${renderedCount}/${ssgPageList.length} SSG page` +
          `${renderedCount > 1 ? 's' : ''}${concurrencyBanner}`
      })
    } else {
      done()
    }
  }

  async #getFilenameBasedRoutes() {
    if (!this.quasarConf.build.filenameBasedRouting) {
      fatal(
        'Called getFilenameBasedRoutes() but filename-based routing is not enabled in the quasar.config file',
        'SSG FAIL'
      )
    }

    const { createServer } = await import('vite')
    try {
      return await loadFilenameBasedRoutes(this.#viteServerConfig, createServer)
    } catch (err) {
      console.log()
      console.error(err)

      fatal(
        'Called getFilenameBasedRoutes() but could not generate the routes with vue-router/auto-routes',
        'SSG FAIL'
      )
    }
  }
}
