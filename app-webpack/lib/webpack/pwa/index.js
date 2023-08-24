const appPaths = require('../../app-paths.js')
const { appPkg } = require('../../app-pkg.js')
const { log } = require('../../utils/logger.js')
const { PwaManifestPlugin } = require('./plugin.pwa-manifest.js')
const { HtmlPwaPlugin } = require('./plugin.html-pwa.js')
const { getPackage } = require('../../utils/get-package.js')
const { escapeRegexString } = require('../../utils/escape-regex-string.js')
const WorkboxPlugin = getPackage('workbox-webpack-plugin')

module.exports.injectPwa = function injectPwa (chain, cfg) {
  // write manifest.json file
  chain.plugin('pwa-manifest')
    .use(PwaManifestPlugin, [ cfg ])

  const opts = {}
  const pluginMode = cfg.pwa.workboxMode

  if (cfg.ctx.dev === true) {
    // dev resources are not optimized (contain maps, unminified code)
    // so they might be larger than the default maximum size for caching
    opts.maximumFileSizeToCacheInBytes = Number.MAX_SAFE_INTEGER
  }

  if (pluginMode === 'GenerateSW') {
    Object.assign(opts, {
      sourcemap: cfg.build.sourcemap !== false,
      mode: cfg.ctx.debug === true || cfg.build.minify === false ? 'development' : 'production',
      cacheId: appPkg.name || 'quasar-pwa-app',
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      skipWaiting: true
    })

    if (cfg.ctx.dev === true && cfg.build.ignorePublicFolder === true) {
      // we don't have a public folder, so we can't use the glob* props,
      // but then we need a runtime caching at least
      opts.runtimeCaching = [ {
        urlPattern: `${ cfg.build.publicPath || '/' }${ cfg.pwa.manifestFilename }`,
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

    if (cfg.ctx.prod === true) {
      opts.navigateFallback = cfg.ctx.mode.ssr === true
        ? cfg.ssr.pwaOfflineHtmlFilename
        : 'index.html'

      opts.navigateFallbackDenylist = [
        new RegExp(escapeRegexString(cfg.pwa.swFilename) + '$'),
        /workbox-(.)*\\.js$/
      ]
    }
    else {
      // no one to serve workbox files if they are externalized
      opts.inlineWorkboxRuntime = true
    }

    if (typeof cfg.pwa.extendGenerateSWOptions === 'function') {
      cfg.pwa.extendGenerateSWOptions(opts)
    }

    opts.swDest = cfg.pwa.swFilename

    log('[GenerateSW] Will generate a service-worker file. Ignoring your custom written one.')
  }
  else {
    if (typeof cfg.pwa.extendInjectManifestOptions === 'function') {
      cfg.pwa.extendInjectManifestOptions(opts)
    }

    opts.swSrc = appPaths.resolve.app(`.quasar/pwa/${ cfg.pwa.swFilename }`)
    opts.swDest = cfg.pwa.swFilename

    if (typeof cfg.pwa.extendInjectManifestOptions === 'function') {
      cfg.pwa.extendInjectManifestOptions(opts)
    }

    log('[InjectManifest] Using your custom service-worker written file')
  }

  if (cfg.ctx.mode.ssr) {
    if (pluginMode === 'GenerateSW') {
      if (typeof cfg.ssr.pwaExtendGenerateSWOptions === 'function') {
        cfg.ssr.pwaExtendGenerateSWOptions(opts)
      }
    }
    else if (typeof cfg.ssr.pwaExtendInjectManifestOptions === 'function') {
      cfg.ssr.pwaExtendInjectManifestOptions(opts)
    }

    opts.exclude = opts.exclude || []
    opts.exclude.push('../quasar.manifest.json')
  }

  chain.plugin('workbox')
    .use(WorkboxPlugin[ pluginMode ], [ opts ])

  chain.plugin('html-pwa')
    .use(HtmlPwaPlugin, [ cfg ])
}
