
import mdPlugin from './build/md/index.js'
import examplesPlugin from './build/examples.js'
import manualChunks from './build/chunks.js'

export default ctx => ({
  eslint: {
    warnings: true,
    errors: true,
    exclude: [
      /(node_modules|ui[\\/])/
    ]
  },

  boot: [
    { path: 'gdpr', server: false }
  ],

  css: [
    'app.sass'
  ],

  build: {
    vueRouterMode: 'history',
    distDir: 'dist/quasar.dev',
    useFilenameHashes: false,
    // analyze: true,
    // rebuildCache: true,

    env: {
      DOCS_BRANCH: 'dev',
      SEARCH_INDEX: 'quasar-v2',
      ...(ctx.dev
        ? { FS_QUASAR_FOLDER: new URL('../ui', import.meta.url).pathname.replace('\\', '/') }
        : {}
      )
    },

    viteVuePluginOptions: {
      include: [/\.(vue|md)$/]
    },

    vitePlugins: [
      mdPlugin,
      examplesPlugin(ctx.prod)
    ],

    extendViteConf (config, { isClient }) {
      if (ctx.prod && isClient) {
        config.build.chunkSizeWarningLimit = 650
        config.build.rollupOptions = {
          output: { manualChunks }
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
    iconSet: 'svg-mdi-v6',

    config: {
      loadingBar: {
        color: 'brand-primary',
        size: '4px'
      }
    },

    components: [
      'QMarkupTable', // required md-plugin-table
      'QBtn', // used directly in some .md files
      'QBadge', // used directly in some .md files
      'QSeparator' // used directly in some .md files
    ],

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

  animations: [ 'fadeIn', 'fadeOut' ],

  ssr: {
    pwa: ctx.prod,
    prodPort: 3111,
    middlewares: [
      'render'
    ]
  },

  pwa: {
    workboxMode: 'GenerateSW',
    injectPwaMetaTags: false,
    swFilename: 'service-worker.js',

    extendWorkboxGenerateSWOptions (cfg) {
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
})
