
const { log } = require('../../helpers/logger')
const appPaths = require('../../app-paths')
const { createViteConfig, extendViteConfig } = require('../../config-tools')
const quasarVitePluginPwaResources = require('./vite-plugin.pwa-resources')

const appPkg = require(appPaths.resolve.app('package.json'))

const runtimeCaching = [
  {
    urlPattern: /.*/i,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'others',
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      },
      networkTimeoutSeconds: 10,
    },
  }
]

module.exports = {
  vite: quasarConf => {
    const cfg = createViteConfig(quasarConf)

    if (quasarConf.ctx.dev === true) {
      cfg.plugins.push(
        quasarVitePluginPwaResources(quasarConf)
      )
    }

    return extendViteConfig(cfg, quasarConf, { isClient: true })
  },

  workbox: quasarConf => {
    const mode = quasarConf.pwa.workboxMode
    let opts

    if (mode === 'GenerateSW') {
      opts = {
        cacheId: appPkg.name || 'quasar-pwa-app',
        cleanupOutdatedCaches: true,
        ...(quasarConf.ctx.dev === true
          ? {
            runtimeCaching,
            additionalManifestEntries: []
          }
          : {}),
        ...quasarConf.pwa.workboxGenerateSWOptions,
        swDest: quasarConf.metaConf.pwaServiceWorkerFile
      }

      if (opts.navigateFallback === false) {
        delete opts.navigateFallback
      }
      else if (opts.navigateFallback === void 0) {
        opts.navigateFallback = `${quasarConf.build.publicPath}index.html`
        opts.navigateFallbackDenylist = opts.navigateFallbackDenylist || []

        // TODO escape and use quasarConf.pwa.swFilename:
        opts.navigateFallbackDenylist.push(/sw\.js$/, /workbox-(.)*\.js$/)
      }
    }
    else { // TODO
      opts = {
        // swSrc: quasarConf.metaConf.pwaServiceWorkerFile,
        ...quasarConf.pwa.workboxInjectManifestOptions
      }
    }

    if (quasarConf.ctx.dev === true) {
      // dev resources are not optimized (contain maps, unminified code)
      // so they might be larger than the default maximum size for caching
      opts.maximumFileSizeToCacheInBytes = Number.MAX_SAFE_INTEGER
    }

    return opts
  }
}
