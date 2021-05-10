const appPaths = require('../../app-paths')
const PwaManifestPlugin = require('./plugin.pwa-manifest')
const HtmlPwaPlugin = require('./plugin.html-pwa').plugin

module.exports = function (chain, cfg) {
  // write manifest.json file
  chain.plugin('pwa-manifest')
    .use(PwaManifestPlugin, [ cfg ])

  let defaultOptions
  const WorkboxPlugin = require('workbox-webpack-plugin')
  const pluginMode = cfg.pwa.workboxPluginMode
  const { log } = require('../../helpers/logger')

  if (pluginMode === 'GenerateSW') {
    const pkg = require(appPaths.resolve.app('package.json'))

    defaultOptions = {
      cacheId: pkg.name || 'quasar-pwa-app'
    }

    log('[GenerateSW] Will generate a service-worker file. Ignoring your custom written one.')
  }
  else {
    defaultOptions = {
      swSrc: appPaths.resolve.app(cfg.sourceFiles.serviceWorker)
    }

    log('[InjectManifest] Using your custom service-worker written file')
  }

  let opts = {
    ...defaultOptions,
    ...cfg.pwa.workboxOptions
  }

  if (cfg.ctx.dev) {
    // dev resources are not optimized (contain maps, unminified code)
    // so they might be larger than the default maximum size for caching
    opts.maximumFileSizeToCacheInBytes = Number.MAX_SAFE_INTEGER
  }

  if (cfg.ctx.mode.ssr) {
    // if Object form:
    if (cfg.ssr.pwa && cfg.ssr.pwa !== true) {
      const merge = require('webpack-merge')
      opts = merge(opts, cfg.ssr.pwa)
    }

    opts.exclude = opts.exclude || []
    opts.exclude.push('../quasar.client-manifest.json')
  }

  if (pluginMode === 'GenerateSW') {
    if (opts.navigateFallback === false) {
      delete opts.navigateFallback
    }
    else if (opts.navigateFallback === void 0) {
      const htmlFile = cfg.ctx.mode.ssr
        ? cfg.build.ssrPwaHtmlFilename
        : cfg.build.htmlFilename

      opts.navigateFallback = `${cfg.build.publicPath}${htmlFile}`

      if (cfg.__versions.workboxWebpackPlugin >= 5) {
        opts.navigateFallbackDenylist = opts.navigateFallbackDenylist || []
        opts.navigateFallbackDenylist.push(/service-worker\.js$/, /workbox-(.)*\.js$/)
      }
    }
  }

  opts.swDest = 'service-worker.js'

  chain.plugin('workbox')
    .use(WorkboxPlugin[pluginMode], [ opts ])

  chain.plugin('html-pwa')
    .use(HtmlPwaPlugin, [ cfg ])
}
