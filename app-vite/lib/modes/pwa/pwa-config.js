import { join } from 'node:path'
import { merge } from 'webpack-merge'

import { escapeRegexString } from '../../utils/escape-regex-string.js'
import {
  createBrowserRolldownConfig,
  createViteConfig,
  extendRolldownConfig,
  extendViteConfig
} from '../../config-tools.js'

import { quasarVitePluginPwaResources } from './pwa-utils.js'

// matched by Workbox against URLs (always forward-slash);
// same pattern as the custom-sw template files
export const workboxFileRE = /workbox-(.)*\.js$/

/**
 * Warning!
 *
 * Remember to update this.#registerDiff() calls when adding/removing quasarConf
 * properties needed for the build.
 */
export const quasarPwaConfig = {
  vite: async quasarConf => {
    const cfg = await createViteConfig(quasarConf, {
      compileId: 'vite-pwa',
      shippedToClient: true,
      /**
       * We specify modeDeps because the SW register file
       * is part of the /src build and it uses dependencies
       * from /src-pwa.
       */
      modeDeps: [
        { dir: 'src-pwa', deps: quasarConf.ctx.pkg.pwaPkg.dependencies }
      ]
    })

    // also update ssr-config.js when changing here
    cfg.plugins.push(quasarVitePluginPwaResources(quasarConf))

    return extendViteConfig(cfg, quasarConf, { isClient: true })
  },

  // exported to ssr-config.js & ssg-config.js as well
  workbox: async quasarConf => {
    const {
      ctx,
      pwa: { workboxMode }
    } = quasarConf

    const { appPaths, pkg } = ctx
    let opts = {}

    if (ctx.dev) {
      // dev resources are not optimized (contain maps, unminified code)
      // so they might be larger than the default maximum size for caching
      opts.maximumFileSizeToCacheInBytes = Number.MAX_SAFE_INTEGER
    }

    if (workboxMode === 'GenerateSW') {
      const { appPkg } = pkg

      Object.assign(opts, {
        sourcemap: quasarConf.build.sourcemap !== false,
        mode:
          quasarConf.metaConf.debugging || !quasarConf.build.minify
            ? 'development'
            : 'production',
        cacheId: appPkg.name || 'quasar-pwa-app',
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true
      })

      if (ctx.dev && quasarConf.build.ignorePublicFolder) {
        // we don't have a public folder, so we can't use the glob* props,
        // but then we need a runtime caching at least
        opts.runtimeCaching = [
          {
            urlPattern: `${quasarConf.build.publicPath || '/'}${quasarConf.pwa.manifestFilename}`,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'static-manifest',
              expiration: {
                maxEntries: 4,
                maxAgeSeconds: 60 * 60
              }
            }
          }
        ]
      } else {
        Object.assign(opts, {
          globDirectory: ctx.dev
            ? appPaths.publicDir
            : quasarConf.build.distDir,
          globPatterns: ['**/*'],
          globIgnores: [`**/${quasarConf.pwa.swFilename}`, '**/workbox-*']
        })
      }

      if (ctx.prod) {
        opts.navigateFallback = ctx.mode.ssr
          ? quasarConf.ssr.pwaOfflineHtmlFilename
          : ctx.mode.ssg
            ? quasarConf.ssg.pwaOfflineHtmlFilename
            : 'index.html'

        opts.navigateFallbackDenylist = [
          new RegExp(escapeRegexString(quasarConf.pwa.swFilename) + '$'),
          workboxFileRE
        ]

        if (ctx.mode.ssg) {
          opts.globIgnores ||= []
          opts.globIgnores.push('__ssg__/**/*')
        }
      } else {
        // no one to serve workbox files if they are externalized
        opts.inlineWorkboxRuntime = true
      }

      if (typeof quasarConf.pwa.extendPWAGenerateSWOptions === 'function') {
        const overrides = await quasarConf.pwa.extendPWAGenerateSWOptions(opts)
        if (Object(overrides) === overrides) {
          opts = merge({}, opts, overrides)
        }
      }

      await ctx.appExt.runAppExtensionHook(
        'extendPWAGenerateSWOptions',
        async hook => {
          hook.api.logger.log(`Running "extendPWAGenerateSWOptions(opts)"`)
          const overrides = await hook.fn(opts, hook.api)
          if (Object(overrides) === overrides) {
            opts = merge({}, opts, overrides)
          }
        }
      )

      if (ctx.mode.ssr) {
        if (typeof quasarConf.ssr.extendSSRGenerateSWOptions === 'function') {
          const overrides =
            await quasarConf.ssr.extendSSRGenerateSWOptions(opts)
          if (Object(overrides) === overrides) {
            opts = merge({}, opts, overrides)
          }
        }

        await ctx.appExt.runAppExtensionHook(
          'extendSSRGenerateSWOptions',
          async hook => {
            hook.api.logger.log(`Running "extendSSRGenerateSWOptions(opts)"`)
            const overrides = await hook.fn(opts, hook.api)
            if (Object(overrides) === overrides) {
              opts = merge({}, opts, overrides)
            }
          }
        )
      } else if (ctx.mode.ssg) {
        if (typeof quasarConf.ssg.extendSSGGenerateSWOptions === 'function') {
          const overrides =
            await quasarConf.ssg.extendSSGGenerateSWOptions(opts)
          if (Object(overrides) === overrides) {
            opts = merge({}, opts, overrides)
          }
        }

        await ctx.appExt.runAppExtensionHook(
          'extendSSGGenerateSWOptions',
          async hook => {
            hook.api.logger.log(`Running "extendSSGGenerateSWOptions(opts)"`)
            const overrides = await hook.fn(opts, hook.api)
            if (Object(overrides) === overrides) {
              opts = merge({}, opts, overrides)
            }
          }
        )
      }
    } else {
      // else workboxMode is "InjectManifest"
      if (ctx.prod || !quasarConf.build.ignorePublicFolder) {
        Object.assign(opts, {
          globDirectory: ctx.dev
            ? appPaths.publicDir
            : quasarConf.build.distDir,
          globPatterns: ['**/*'],
          globIgnores: [`**/${quasarConf.pwa.swFilename}`, '**/workbox-*']
        })
      }

      if (typeof quasarConf.pwa.extendPWAInjectManifestOptions === 'function') {
        const overrides =
          await quasarConf.pwa.extendPWAInjectManifestOptions(opts)

        if (Object(overrides) === overrides) {
          opts = merge({}, opts, overrides)
        }
      }

      await ctx.appExt.runAppExtensionHook(
        'extendPWAInjectManifestOptions',
        async hook => {
          hook.api.logger.log(`Running "extendPWAInjectManifestOptions(opts)"`)
          const overrides = await hook.fn(opts, hook.api)
          if (Object(overrides) === overrides) {
            opts = merge({}, opts, overrides)
          }
        }
      )

      if (ctx.mode.ssr) {
        if (
          typeof quasarConf.ssr.extendSSRInjectManifestOptions === 'function'
        ) {
          const overrides =
            await quasarConf.ssr.extendSSRInjectManifestOptions(opts)

          if (Object(overrides) === overrides) {
            opts = merge({}, opts, overrides)
          }
        }

        await ctx.appExt.runAppExtensionHook(
          'extendSSRInjectManifestOptions',
          async hook => {
            hook.api.logger.log(
              `Running "extendSSRInjectManifestOptions(opts)"`
            )
            const overrides = await hook.fn(opts, hook.api)
            if (Object(overrides) === overrides) {
              opts = merge({}, opts, overrides)
            }
          }
        )
      } else if (ctx.mode.ssg) {
        if (
          typeof quasarConf.ssg.extendSSGInjectManifestOptions === 'function'
        ) {
          const overrides =
            await quasarConf.ssg.extendSSGInjectManifestOptions(opts)

          if (Object(overrides) === overrides) {
            opts = merge({}, opts, overrides)
          }
        }

        await ctx.appExt.runAppExtensionHook(
          'extendSSGInjectManifestOptions',
          async hook => {
            hook.api.logger.log(
              `Running "extendSSGInjectManifestOptions(opts)"`
            )
            const overrides = await hook.fn(opts, hook.api)
            if (Object(overrides) === overrides) {
              opts = merge({}, opts, overrides)
            }
          }
        )
      }

      opts.swSrc = appPaths.resolve.entry('compiled-custom-sw.js')
    }

    opts.swDest = ctx.dev
      ? appPaths.resolve.entry(`service-worker/${quasarConf.pwa.swFilename}`)
      : join(quasarConf.build.distDir, quasarConf.pwa.swFilename)

    return opts
  },

  // exported to ssr-config.js & ssg-config.js as well;
  // returns a Promise
  customSw: quasarConf => {
    const { ctx } = quasarConf
    const { appPaths } = ctx

    const cfg = createBrowserRolldownConfig(quasarConf, {
      shippedToClient: true
    })

    cfg.transform.define['import.meta.env.QUASAR_PWA_FALLBACK_HTML'] =
      JSON.stringify(
        ctx.mode.ssr && ctx.prod
          ? quasarConf.ssr.pwaOfflineHtmlFilename
          : ctx.mode.ssg && ctx.prod
            ? quasarConf.ssg.pwaOfflineHtmlFilename
            : 'index.html'
      )

    cfg.transform.define['import.meta.env.QUASAR_PWA_SERVICE_WORKER_REGEX'] =
      JSON.stringify(`${escapeRegexString(quasarConf.pwa.swFilename)}$`)

    cfg.input = quasarConf.sourceFiles.pwaServiceWorker
    cfg.output.file = appPaths.resolve.entry('compiled-custom-sw.js')

    cfg.resolve.modules = ['node_modules', appPaths.resolve.pwa('node_modules')]

    return extendRolldownConfig(
      cfg,
      quasarConf.pwa,
      ctx,
      'extendPWACustomSWConf'
    )
  }
}

export const modeConfig = quasarPwaConfig
