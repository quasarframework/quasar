
const { createReadStream } = require('fs')
const fg = require('fast-glob')
const crypto = require('crypto')

const appPaths = require('../../app-paths')
const { createViteConfig, extendViteConfig } = require('../../config-tools')

const quasarVitePluginPwaResources = require('./vite-plugin.pwa-resources')

const appPkg = require(appPaths.resolve.app('package.json'))

const defaultRuntimeCache = [{
  urlPattern: () => false,
  handler: 'StaleWhileRevalidate',
  options: {
    cacheName: 'q-bogus',
    expiration: {
      maxEntries: 4,
      maxAgeSeconds: 7 * 24 * 60 * 60
    }
  }
}]

function getManifestEntry (url) {
  return new Promise((resolve, reject) => {
    const cHash = crypto.createHash('MD5')
    const stream = createReadStream(appPaths.resolve.publicDir(url))

    stream.on('error', err => { reject(err) })
    stream.on('data', data => { cHash.update(data) })
    stream.on('end', () => resolve({
      url,
      revision: `${cHash.digest('hex')}`,
    }))
  })
}

async function getAdditionalManifestEntries (precacheFromPublicFolder, userAdditionalManifestEntries = []) {
  if (precacheFromPublicFolder.length === 0) {
    return userAdditionalManifestEntries
  }

  let list = await fg(precacheFromPublicFolder, {
    cwd: appPaths.publicDir,
    onlyFiles: true,
    unique: true
  })

  const userList = userAdditionalManifestEntries.map(entry => (
    typeof entry === 'string'
      ? entry
      : entry.url
  ))

  // do not duplicate user specified entries
  list = list.filter(entry => userList.includes(entry) === false)

  list = await Promise.all(
    list.map(entry => getManifestEntry(entry))
  )

  return [
    ...list,
    ...userAdditionalManifestEntries
  ]
}

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

  workbox: async quasarConf => {
    const mode = quasarConf.pwa.workboxMode
    const opts = {
      sourcemap: quasarConf.metaConf.debugging === true,
      mode: quasarConf.metaConf.debugging === true ? 'development' : 'production'
    }

    if (mode === 'GenerateSW') {
      const { extendGenerateSWOptions, precacheFromPublicFolder } = quasarConf.pwa

      Object.assign(opts, {
        cacheId: appPkg.name || 'quasar-pwa-app',
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true
      })

      if (typeof extendGenerateSWOptions === 'function') {
        extendGenerateSWOptions(opts)
      }

      // runtimeCaching is required by Workbox
      if (opts.runtimeCaching === void 0) {
        opts.runtimeCaching = defaultRuntimeCache
      }

      Object.assign(opts, {
        swDest: quasarConf.metaConf.pwaServiceWorkerFile,
        additionalManifestEntries: await getAdditionalManifestEntries(
          precacheFromPublicFolder,
          opts.additionalManifestEntries
        )
      })
    }
    // TODO
    // else {
    //   const { injectManifestOptions, precacheFromPublicFolder } = quasarConf.pwa

    //   opts = {
    //     // swSrc: quasarConf.metaConf.pwaServiceWorkerFile,
    //     ...quasarConf.pwa.workboxInjectManifestOptions
    //   }

    //   opts.additionalManifestEntries = await getAdditionalManifestEntries(
    //     precacheFromPublicFolder,
    //     workboxInjectManifestOptions
    //   )
    // }

    if (quasarConf.ctx.dev === true) {
      // dev resources are not optimized (contain maps, unminified code)
      // so they might be larger than the default maximum size for caching
      opts.maximumFileSizeToCacheInBytes = Number.MAX_SAFE_INTEGER
    }

    return opts
  }
}
