
const { join } = require('path')

const {
  createViteConfig, extendViteConfig, mergeViteConfig,
  createNodeEsbuildConfig, extendEsbuildConfig
} = require('../../config-tools')

const appPaths = require('../../app-paths')

const pwaConfig = require('../pwa/pwa-config')
const quasarVitePluginPwaResources = require('../pwa/vite-plugin.pwa-resources')

module.exports = {
  viteClient: quasarConf => {
    let cfg = createViteConfig(quasarConf, 'ssr-client')

    cfg = mergeViteConfig(cfg, {
      define: {
        'process.env.CLIENT': true,
        'process.env.SERVER': false,
        __QUASAR_SSR_PWA__: quasarConf.ssr.pwa === true
      },
      server: {
        middlewareMode: true
      },
      build: {
        ssrManifest: true,
        outDir: join(quasarConf.build.distDir, 'client')
      }
    })

    // also update pwa-config.js when changing here
    if (quasarConf.ssr.pwa === true) {
      cfg.plugins.push(
        quasarVitePluginPwaResources(quasarConf)
      )
    }

    // dev has js entry-point, while prod has index.html
    if (quasarConf.ctx.dev) {
      cfg.build.rollupOptions = cfg.build.rollupOptions || {}
      cfg.build.rollupOptions.input = appPaths.resolve.app('.quasar/client-entry.js')
    }

    return extendViteConfig(cfg, quasarConf, { isClient: true })
  },

  viteServer: quasarConf => {
    let cfg = createViteConfig(quasarConf, 'ssr-server')

    cfg = mergeViteConfig(cfg, {
      target: quasarConf.build.target.node,
      define: {
        'process.env.CLIENT': false,
        'process.env.SERVER': true,
        __QUASAR_SSR_PWA__: quasarConf.ssr.pwa === true
      },
      server: {
        hmr: false, // let client config deal with it
        middlewareMode: 'ssr'
      },
      ssr: {
        noExternal: [
          /\/esm\/.*\.js$/,
          /\.(es|esm|esm-browser|esm-bundler).js$/
        ]
      },
      build: {
        ssr: true,
        outDir: join(quasarConf.build.distDir, 'server'),
        rollupOptions: {
          input: appPaths.resolve.app('.quasar/server-entry.js')
        }
      }
    })

    return extendViteConfig(cfg, quasarConf, { isServer: true })
  },

  webserver: quasarConf => {
    const cfg = createNodeEsbuildConfig(quasarConf, { cacheSuffix: 'ssr-webserver' })

    cfg.define[ 'process.env.CLIENT' ] = false
    cfg.define[ 'process.env.SERVER' ] = true

    if (quasarConf.ctx.dev) {
      cfg.entryPoints = [ appPaths.resolve.app('.quasar/ssr-dev-webserver.js') ]
      cfg.outfile = appPaths.resolve.app('.quasar/ssr/compiled-dev-webserver.js')
    }
    else {
      cfg.external = [
        ...cfg.external,
        'vue/server-renderer',
        'vue/compiler-sfc',
        './render-template.js',
        './quasar.manifest.json',
        './server/server-entry.js'
      ]

      cfg.entryPoints = [ appPaths.resolve.app('.quasar/ssr-prod-webserver.js') ]
      cfg.outfile = join(quasarConf.build.distDir, 'index.js')
    }

    return extendEsbuildConfig(cfg, quasarConf.ssr, 'SSRWebserver')
  },

  workbox: pwaConfig.workbox,
  customSw: pwaConfig.customSw
}
