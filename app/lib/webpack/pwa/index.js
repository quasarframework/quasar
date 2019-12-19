const appPaths = require('../../app-paths')
const PwaManifestPlugin = require('./plugin.pwa-manifest')

module.exports = function (chain, cfg) {
  // write manifest.json file
  chain.plugin('pwa-manifest')
    .use(PwaManifestPlugin, [ cfg ])

  let defaultOptions
  const WorkboxPlugin = require('workbox-webpack-plugin')
  const pluginMode = cfg.pwa.workboxPluginMode
  const log = require('../../helpers/logger')('app:workbox')

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

  if (cfg.ctx.mode.ssr) {
    if (pluginMode === 'GenerateSW' && !opts.directoryIndex) {
      opts.directoryIndex = '/'
    }

    if (!opts.exclude) {
      opts.exclude = []
    }

    opts.exclude.push('../vue-ssr-client-manifest.json')

    // if Object form:
    if (cfg.ssr.pwa && cfg.ssr.pwa !== true) {
      const merge = require('webpack-merge')
      opts = merge(opts, cfg.ssr.pwa)
    }

    if (pluginMode === 'GenerateSW') {
      opts.runtimeCaching = opts.runtimeCaching || []
      if (!opts.runtimeCaching.find(entry => entry.urlPattern === '/')) {
        opts.runtimeCaching.unshift({
          urlPattern: '/',
          handler: 'NetworkFirst'
        })
      }
    }
  }

  if (cfg.ctx.dev) {
    log('⚠️  Forcing PWA into the network-first approach to not break Hot Module Replacement while developing.')
    // forcing network-first strategy
    opts.chunks = [ 'quasar-bogus-chunk' ]
    if (opts.excludeChunks) {
      delete opts.excludeChunks
    }

    if (pluginMode === 'GenerateSW') {
      opts.runtimeCaching = opts.runtimeCaching || []
      opts.runtimeCaching.push({
        urlPattern: /^http/,
        handler: 'NetworkFirst'
      })
    }
  }

  opts.swDest = 'service-worker.js'

  chain.plugin('workbox')
    .use(WorkboxPlugin[pluginMode], [ opts ])

  if (!cfg.ctx.mode.ssr) {
    const HtmlPwaPlugin = require('./plugin.html-pwa').plugin
    chain.plugin('html-pwa')
      .use(HtmlPwaPlugin, [ cfg ])
  }
}
