import { defineConfig } from '#q-app'

import mdPlugin from './build/md/index.js'
import examplesPlugin from './build/examples.js'
import highlightRawPlugin from './build/highlight-raw.js'
import { codeSplitting } from './build/chunks.js'

export default defineConfig(ctx => ({
  boot: [{ path: 'gdpr', server: false }],

  css: ['~@shikijs/twoslash/style-rich.css', 'app.sass'],

  build: {
    vueRouterMode: 'history',
    distDir: 'dist/quasar.dev',
    useFilenameHashes: false,

    defineEnv: {
      DOCS_BRANCH: 'dev',
      SEARCH_INDEX: 'quasar-v2'
    },

    viteVuePluginOptions: {
      include: [/\.(vue|md)$/]
    },

    vitePlugins: [mdPlugin, examplesPlugin(ctx.prod), highlightRawPlugin()],

    extendViteConf(_viteConf, { isClient }) {
      if (ctx.prod && isClient) {
        return {
          build: {
            chunkSizeWarningLimit: 650,
            rolldownOptions: {
              output: {
                codeSplitting
              }
            }
          }
        }
      }
    }
  },

  devServer: {
    port: 9090,
    open: {
      app: { name: 'google chrome' }
    }
  },

  framework: {
    iconSet: 'svg-mdi-v7',

    devTreeshaking: true,
    autoImportVueExtensions: ['vue', 'md'],

    config: {
      loadingBar: {
        color: 'brand-primary',
        size: '4px'
      }
    },

    plugins: [
      'AddressbarColor',
      'AppFullscreen',
      'AppVisibility',
      'BottomSheet',
      'Cookies',
      'Dark',
      'Dialog',
      'Loading',
      'LoadingBar',
      'LocalStorage',
      'Meta',
      'Notify',
      'Platform',
      'Screen',
      'SessionStorage'
    ]
  },

  animations: ['fadeIn', 'fadeOut'],

  ssr: {
    pwa: ctx.prod,
    middlewares: ['render'],
    prodScriptNamedExport: 'renderSsrContext'
  },

  pwa: {
    workboxMode: 'GenerateSW',
    injectPWAMetaTags: false,
    swFilename: 'service-worker.js',

    extendPWAGenerateSWOptions(cfg) {
      Object.assign(cfg, {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn/,
            handler: 'StaleWhileRevalidate'
          }
        ]
      })
    }
  }
}))
