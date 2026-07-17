import { join } from 'node:path'
import { merge } from 'webpack-merge'
import picomatch from 'picomatch'

import { AppBuilder } from '../../app-builder.js'
import { quasarSsgConfig } from './ssg-config.js'
import {
  getProdSsrRenderTemplateFileContent,
  transformProdHtmlShell
} from '../../plugins/vite.html.js'

import { error, fatal, progress, warn } from '../../utils/logger.js'
import { buildPwaServiceWorker, injectPwaManifest } from '../pwa/pwa-utils.js'

const multiSlashRE = /\/{2,}/g
const ssrManifestIdQueryRE = /vue\?vue/
const ssrManifestIdQueryReplaceRE = /vue\?vue.*$/

function getSsgPageIdentifier(ssgPage) {
  return (
    `route "${ssgPage.route}"` + `${ssgPage.label ? ` [${ssgPage.label}]` : ''}`
  )
}

function getParseVueRouterRoutesFn(quasarConf) {
  const { clientSideRenderingRoutes } = quasarConf.ssg
  const isCSRMatch =
    clientSideRenderingRoutes.length !== 0
      ? picomatch(clientSideRenderingRoutes)
      : () => false

  const parseVueRouterRoutes = ({ routes, parentPath, opts }) => {
    for (const route of routes) {
      const routePath = route.path
      const fullPath = `${parentPath}/${routePath}`.replaceAll(
        multiSlashRE,
        '/'
      )

      if (opts.isCrawlIgnoreMatch?.(fullPath)) {
        opts.acc.crawlIgnoredRoutes.push(route)

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

      if (isCSRMatch(fullPath)) {
        opts.acc.ignoredCsrRoutes.push(route)

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
        opts.acc.ignoredDynamicRoutes.push(route)

        if (opts.verbose) {
          warn(
            `Ignored route (dynamic param): ${fullPath}`,
            'parseVueRouterRoutes()'
          )
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
        opts.acc.ignoredRedirectingRoutes.push(route)

        if (opts.verbose) {
          warn(
            `Ignored route (redirects): ${fullPath}`,
            'parseVueRouterRoutes()'
          )
        }

        continue
      }

      opts.acc.ssgPages.push({ route: fullPath, vueRouterRoute: route })
    }
  }

  return ({
    routes,
    parentPath = '/',
    crawlIgnoreRoutes = [],
    verbose = false
  }) => {
    const acc = {
      ssgPages: [],
      hasIgnoredRoutes: false,
      crawlIgnoredRoutes: [],
      ignoredRedirectingRoutes: [],
      ignoredDynamicRoutes: [],
      ignoredCsrRoutes: []
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
        isCrawlIgnoreMatch:
          crawlIgnoreRoutes.length !== 0 ? picomatch(crawlIgnoreRoutes) : null
      }
    })

    acc.hasIgnoredRoutes =
      acc.crawlIgnoredRoutes.length !== 0 ||
      acc.ignoredRedirectingRoutes.length !== 0 ||
      acc.ignoredDynamicRoutes.length !== 0 ||
      acc.ignoredCsrRoutes.length !== 0

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
    const html = this.readFile('index.html')
    this.removeFile('index.html')

    await Promise.all([
      getProdSsrRenderTemplateFileContent(html, this.quasarConf).then(
        content => {
          this.writeFile('__ssg__/render-template.js', content)
        }
      ),

      this.quasarConf.ssg.pwa ||
      this.quasarConf.ssg.clientSideRenderingHtmlFilename
        ? transformProdHtmlShell(html, this.quasarConf).then(content => {
            if (this.quasarConf.ssg.pwa) {
              this.writeFile(
                `${this.quasarConf.ssg.pwaOfflineHtmlFilename}`,
                content,
                () => {
                  console.log()
                  fatal(
                    `Tried to write the ssg.pwaOfflineHtmlFilename file` +
                      ` (${this.quasarConf.ssg.pwaOfflineHtmlFilename})` +
                      ' but the file already exists.' +
                      ' Check your SSG configuration for duplicate routes' +
                      ' or filenames or quasar.config html filenames settings.',
                    'ERROR'
                  )
                }
              )
            }

            if (this.quasarConf.ssg.clientSideRenderingHtmlFilename) {
              this.writeFile(
                `${this.quasarConf.ssg.clientSideRenderingHtmlFilename}`,
                content,
                () => {
                  console.log()
                  fatal(
                    `Tried to write the ssg.clientSideRenderingHtmlFilename file` +
                      ` (${this.quasarConf.ssg.clientSideRenderingHtmlFilename})` +
                      ' but the file already exists.' +
                      ' Check your SSG configuration for duplicate routes' +
                      ' or filenames or quasar.config html filenames settings.',
                    'ERROR'
                  )
                }
              )
            }
          })
        : null
    ])
  }

  async #writeSsrManifest() {
    const viteManifest = JSON.parse(this.readFile('.vite/ssr-manifest.json'))
    this.removeFile('.vite')

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

    this.writeFile(
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

    const ssgPages = await getSsgPages({
      ctx: this.quasarConf.ctx,
      quasarConfSsg: this.quasarConf.ssg,
      parseVueRouterRoutes: getParseVueRouterRoutesFn(this.quasarConf),
      getFilenameBasedRoutes: () => this.#getFilenameBasedRoutes()
    })

    if (ssgPages.length === 0) {
      fatal(
        'No SSG pages returned by getSsgPages() (see /src-ssg/ssg-renderer). Nothing to render.',
        'FAIL'
      )
    }

    if (this.quasarConf.ssg.error404HtmlFilename) {
      ssgPages.push({
        route: '/______get-a-quasar-404-page______',
        label: '404 page',
        dir: '',
        filename: this.quasarConf.ssg.error404HtmlFilename
      })
    }

    const done = progress({
      tool: 'SSG',
      waitAction: 'Rendering',
      doneAction: 'Rendered',
      target: `${ssgPages.length} SSG page${ssgPages.length > 1 ? 's' : ''}`
    })

    for (const page of ssgPages) {
      const ssrContext = page.ssrContext ?? {}
      const url =
        'http://localhost' +
        (this.quasarConf.build.publicPath + page.route).replace(
          multiSlashRE,
          '/'
        )

      let html
      try {
        html = await renderSsgPage({
          ...ssrContext,
          url,
          req: {
            headers: {},
            ...ssrContext.req,
            url
          }
        })

        if (typeof page.rewriteHtml === 'function') {
          const result = await page.rewriteHtml(html)
          if (result) html = result
        }
      } catch (err) {
        console.log()
        console.error('Offending SSG page:')
        console.error(page)

        const pageIdentifier = getSsgPageIdentifier(page)

        if (err?.routeNotFound) {
          fatal(
            `Failed to render SSG page for ${pageIdentifier}:` +
              ' Vue Router did not match the route.',
            'FAIL'
          )
        }

        if (err?.redirectUrl) {
          fatal(
            `Failed to render SSG page for ${pageIdentifier}:` +
              ` the route redirects to "${err.redirectUrl}".` +
              ' Generate the destination route instead.',
            'FAIL'
          )
        }

        console.error('\nRender error:')
        console.error(err)

        fatal(
          `Failed to render SSG page for ${pageIdentifier}.` +
            ' Check details above.',
          'FAIL'
        )
      }

      this.writeFile(
        join(
          this.quasarConf.build.distDir,
          page.dir ?? page.route.slice(1),
          page.filename ?? 'index.html'
        ),
        html,
        () => {
          const pageIdentifier = getSsgPageIdentifier(page)

          console.log()
          error(
            `Rendered SSG page for ${pageIdentifier}, but` +
              ' the target file already exists.' +
              ' Check your SSG configuration for duplicate routes or filenames or' +
              ' quasar.config html filenames settings.'
          )
          console.log()
          console.error('Offending SSG page:')
          console.error(page)
          console.log()
          process.exit(1)
        }
      )
    }

    this.removeFile('__ssg__')
    done()
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
