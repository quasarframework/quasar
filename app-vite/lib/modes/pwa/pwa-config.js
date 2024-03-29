import { join } from 'node:path'

import { escapeRegexString } from '../../utils/escape-regex-string.js'
import {
  createViteConfig, extendViteConfig,
  createBrowserEsbuildConfig, extendEsbuildConfig
} from '../../config-tools.js'

import { quasarVitePluginPwaResources } from './vite-plugin.pwa-resources.js'

export const quasarPwaConfig = {
  vite: async quasarConf => {
    const cfg = await createViteConfig(quasarConf, { compileId: 'vite-pwa' })

    // also update ssr-config.js when changing here
    cfg.plugins.push(
      quasarVitePluginPwaResources(quasarConf)
    )

    return extendViteConfig(cfg, quasarConf, { isClient: true })
  },

  // exported to ssr-config.js as well
  workbox: async quasarConf => {
    const { ctx, pwa: { workboxMode } } = quasarConf
    const { appPaths, pkg } = ctx
    const opts = {}

    if (ctx.dev === true) {
      // dev resources are not optimized (contain maps, unminified code)
      // so they might be larger than the default maximum size for caching
      opts.maximumFileSizeToCacheInBytes = Number.MAX_SAFE_INTEGER
    }

    if (workboxMode === 'GenerateSW') {
      const { appPkg } = pkg

      Object.assign(opts, {
        sourcemap: quasarConf.build.sourcemap !== false,
        mode: quasarConf.metaConf.debugging === true || quasarConf.build.minify === false ? 'development' : 'production',
        cacheId: appPkg.name || 'quasar-pwa-app',
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true
      })

      if (ctx.dev === true && quasarConf.build.ignorePublicFolder === true) {
        // we don't have a public folder, so we can't use the glob* props,
        // but then we need a runtime caching at least
        opts.runtimeCaching = [ {
          urlPattern: `${ quasarConf.build.publicPath || '/' }${ quasarConf.pwa.manifestFilename }`,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'static-manifest',
            expiration: {
              maxEntries: 4,
              maxAgeSeconds: 60 * 60
            }
          }
        } ]
      }
      else {
        Object.assign(opts, {
          globDirectory: ctx.dev === true
            ? appPaths.publicDir
            : quasarConf.build.distDir,
          globPatterns: [ '**/*' ],
          globIgnores: [ `**/${ quasarConf.pwa.swFilename }`, '**/workbox-*' ]
        })
      }

      if (ctx.prod === true) {
        opts.navigateFallback = ctx.mode.ssr === true
          ? quasarConf.ssr.pwaOfflineHtmlFilename
          : 'index.html'

        opts.navigateFallbackDenylist = [
          new RegExp(escapeRegexString(quasarConf.pwa.swFilename) + '$'),
          /workbox-(.)*\\.js$/
        ]
      }
      else {
        // no one to serve workbox files if they are externalized
        opts.inlineWorkboxRuntime = true
      }

      if (typeof quasarConf.pwa.extendGenerateSWOptions === 'function') {
        quasarConf.pwa.extendGenerateSWOptions(opts)
      }

      if (
        ctx.mode.ssr === true
        && typeof quasarConf.ssr.pwaExtendGenerateSWOptions === 'function'
      ) {
        quasarConf.ssr.pwaExtendGenerateSWOptions(opts)
      }

      opts.swDest = ctx.dev === true
        ? appPaths.resolve.entry(`service-worker/${ quasarConf.pwa.swFilename }`)
        : join(quasarConf.build.distDir, quasarConf.pwa.swFilename)
    }
    else { // else workboxMode is "InjectManifest"
      if (ctx.prod === true || quasarConf.build.ignorePublicFolder !== true) {
        Object.assign(opts, {
          globDirectory: ctx.dev === true
            ? appPaths.publicDir
            : quasarConf.build.distDir,
          globPatterns: [ '**/*' ],
          globIgnores: [ `**/${ quasarConf.pwa.swFilename }`, '**/workbox-*' ]
        })
      }

      if (typeof quasarConf.pwa.extendInjectManifestOptions === 'function') {
        quasarConf.pwa.extendInjectManifestOptions(opts)
      }

      if (
        ctx.mode.ssr === true
        && typeof quasarConf.ssr.pwaExtendInjectManifestOptions === 'function'
      ) {
        quasarConf.ssr.pwaExtendInjectManifestOptions(opts)
      }

      opts.swSrc = appPaths.resolve.entry('compiled-custom-sw.js')
      opts.swDest = ctx.dev === true
        ? appPaths.resolve.entry(`service-worker/${ quasarConf.pwa.swFilename }`)
        : join(quasarConf.build.distDir, quasarConf.pwa.swFilename)
    }

    return opts
  },

  // exported to ssr-config.js as well;
  // returns a Promise
  customSw: quasarConf => {
    const { ctx } = quasarConf
    const { appPaths } = ctx

    const cfg = createBrowserEsbuildConfig(quasarConf, { compileId: 'browser-custom-sw' })

    cfg.define[ 'process.env.PWA_FALLBACK_HTML' ] = JSON.stringify(
      ctx.mode.ssr === true && ctx.prod === true
        ? quasarConf.ssr.pwaOfflineHtmlFilename
        : 'index.html'
    )

    cfg.define[ 'process.env.PWA_SERVICE_WORKER_REGEX' ] = JSON.stringify(
      `${ escapeRegexString(quasarConf.pwa.swFilename) }$`
    )

    cfg.entryPoints = [ quasarConf.sourceFiles.pwaServiceWorker ]
    cfg.outfile = appPaths.resolve.entry('compiled-custom-sw.js')

    return extendEsbuildConfig(cfg, quasarConf.pwa, ctx, 'extendPWACustomSWConf')
  }
}

export const modeConfig = quasarPwaConfig
