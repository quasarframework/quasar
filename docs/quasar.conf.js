
const mdPlugin = require('./build/md')

module.exports = ctx => ({
  boot: [
    { path: 'gdpr', server: false },
    'components'
  ],

  css: [
    'app.sass'
  ],

  extras: [
    'material-icons'
  ],

  build: {
    vueRouterMode: 'history',
    distDir: 'dist/quasar.dev',
    // analyze: true,
    // rebuildCache: true,

    viteVuePluginOptions: {
      include: [ /\.(vue|md)$/ ]
    },

    vitePlugins: [
      mdPlugin
    ]
  },

  devServer: {
    // https: true,
    port: 9090,
    open: true // opens browser window automatically
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
    prodPort: 3010,
    middlewares: [
      'render'
    ]
  },

  pwa: {
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
