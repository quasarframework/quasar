const {
  createWebpackChain, extendWebpackChain,
  createBrowserEsbuildConfig, extendEsbuildConfig
} = require('../../config-tools.js')

const { log } = require('../../utils/logger.js')
const { PwaManifestPlugin } = require('./plugin.webpack.pwa-manifest.js')

const { injectWebpackHtml } = require('../../utils/html-template.js')
const { escapeRegexString } = require('../../utils/escape-regex-string.js')

function injectWebpackPwa (webpackChain, quasarConf) {
  const { ctx } = quasarConf

  // must be first plugin because it fills in quasarConf.htmlVariables.pwaManifest
  // which is later used by injectWebpackHtml()
  webpackChain.plugin('pwa-manifest')
    .use(PwaManifestPlugin, [ quasarConf ])

  const opts = {}
  const pluginMode = quasarConf.pwa.workboxMode

  if (ctx.dev === true) {
    // dev resources are not optimized (contain maps, unminified code)
    // so they might be larger than the default maximum size for caching
    opts.maximumFileSizeToCacheInBytes = Number.MAX_SAFE_INTEGER
  }

  if (pluginMode === 'GenerateSW') {
    Object.assign(opts, {
      sourcemap: quasarConf.build.sourcemap !== false,
      mode: quasarConf.metaConf.debugging === true || quasarConf.build.minify === false ? 'development' : 'production',
      cacheId: ctx.pkg.appPkg.name || 'quasar-pwa-app',
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

    if (ctx.prod === true) {
      opts.navigateFallback = ctx.mode.ssr === true
        ? quasarConf.ssr.pwaOfflineHtmlFilename
        : quasarConf.build.htmlFilename

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

    opts.swDest = quasarConf.pwa.swFilename

    log('[GenerateSW] Will generate a service-worker file. Ignoring your custom written one.')
  }
  else {
    if (typeof quasarConf.pwa.extendInjectManifestOptions === 'function') {
      quasarConf.pwa.extendInjectManifestOptions(opts)
    }

    opts.swSrc = ctx.appPaths.resolve.entry('compiled-custom-sw.js')
    opts.swDest = quasarConf.pwa.swFilename

    if (typeof quasarConf.pwa.extendInjectManifestOptions === 'function') {
      quasarConf.pwa.extendInjectManifestOptions(opts)
    }

    log('[InjectManifest] Using your custom service-worker written file')
  }

  if (ctx.mode.ssr) {
    if (pluginMode === 'GenerateSW') {
      if (typeof quasarConf.ssr.pwaExtendGenerateSWOptions === 'function') {
        quasarConf.ssr.pwaExtendGenerateSWOptions(opts)
      }
    }
    else if (typeof quasarConf.ssr.pwaExtendInjectManifestOptions === 'function') {
      quasarConf.ssr.pwaExtendInjectManifestOptions(opts)
    }

    opts.exclude = opts.exclude || []
    opts.exclude.push('../quasar.manifest.json')
  }

  const WorkboxPlugin = ctx.cacheProxy.getModule('workboxWebpackPlugin')
  webpackChain.plugin('workbox')
    .use(WorkboxPlugin[ pluginMode ], [ opts ])
}

module.exports.injectWebpackPwa = injectWebpackPwa

const quasarPwaConfig = {
  webpack: async quasarConf => {
    const webpackChain = await createWebpackChain(quasarConf, { compileId: 'webpack-pwa', threadName: 'PWA UI' })

    injectWebpackPwa(webpackChain, quasarConf)
    injectWebpackHtml(webpackChain, quasarConf)

    return extendWebpackChain(webpackChain, quasarConf, { isClient: true })
  },

  // used by ssr-config.js as well
  customSw: async quasarConf => {
    const { ctx } = quasarConf
    const { appPaths } = ctx

    const cfg = await createBrowserEsbuildConfig(quasarConf, { compileId: 'browser-custom-sw' })

    const fallbackHtmlFile = quasarConf.build.publicPath + (
      ctx.mode.ssr === true && ctx.prod === true
        ? quasarConf.ssr.pwaOfflineHtmlFilename
        : quasarConf.build.htmlFilename
    )

    cfg.define[ 'process.env.PWA_FALLBACK_HTML' ] = JSON.stringify(fallbackHtmlFile)

    cfg.define[ 'process.env.PWA_SERVICE_WORKER_REGEX' ] = JSON.stringify(
      `${ escapeRegexString(quasarConf.pwa.swFilename) }$`
    )

    cfg.entryPoints = [ quasarConf.sourceFiles.pwaServiceWorker ]
    cfg.outfile = appPaths.resolve.entry('compiled-custom-sw.js')

    if (typeof quasarConf.pwa.extendPWACustomSWConf === 'function') {
      quasarConf.pwa.extendPWACustomSWConf(cfg)
    }

    return extendEsbuildConfig(cfg, quasarConf.pwa, ctx, 'extendPWACustomSWConf')
  }
}

module.exports.quasarPwaConfig = quasarPwaConfig
module.exports.modeConfig = quasarPwaConfig
