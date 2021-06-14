// Configuration for your app
const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin')
const { merge } = require('webpack-merge')
const transformAssetUrls = require('quasar/dist/transforms/loader-asset-urls.json')

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
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

    // preFetch: true,

    build: {
      vueRouterMode: 'history',
      showProgress: ctx.dev,
      distDir: 'dist/quasar.dev',
      // analyze: true,

      chainWebpack (chain, { isServer }) {
        chain.plugin('eslint-webpack-plugin')
          .use(ESLintPlugin, [{
            extensions: [ 'js', 'vue' ],
            exclude: [ 'node_modules', '.md.js' ]
          }])

        chain.resolve.alias
          .merge({
            examples: path.resolve(__dirname, 'src/examples'),
            markup: path.resolve(__dirname, 'src/markup')
          })

        chain.module.rule('pug')
          .test(/\.pug$/)
          .use('pug-loader').loader('pug-plain-loader')

        const rule = chain.module.rule('md')
          .test(/\.md$/)

        rule.use('v-loader')
          .loader('vue-loader')
          .options({
            ...(
              isServer === true
                ? { ssr: true, directiveTransforms: require('quasar/dist/ssr-directives/index.js') }
                : {}
            ),
            transformAssetUrls: merge({
              base: null,
              includeAbsolute: false,
              tags: {
                video: [ 'src', 'poster' ],
                source: ['src'],
                img: ['src'],
                image: [ 'xlink:href', 'href' ],
                use: [ 'xlink:href', 'href' ]
              }
            }, transformAssetUrls)
          })

        rule.use('md-loader')
          .loader(require.resolve('./build/md-loader'))
      }
    },

    devServer: {
      // https: true,
      port: 9090,
      open: true // opens browser window automatically
    },

    framework: {
      iconSet: 'svg-mdi-v5',

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
        ctx.prod ? 'compression' : '',
        'render'
      ]
    },

    pwa: {
      // workboxPluginMode: 'InjectManifest',
      workboxOptions: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn/,
            handler: 'StaleWhileRevalidate'
          }
        ]
      },
      manifest: {
        name: 'Quasar v2 Docs',
        short_name: 'Quasar v2',
        description: 'Quasar Framework v2 Documentation',
        display: 'standalone',
        orientation: 'any',
        background_color: '#000000',
        theme_color: '#00B4FF',
        icons: [
          {
            src: 'https://cdn.quasar.dev/logo-v2/favicon/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'https://cdn.quasar.dev/logo-v2/favicon/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://cdn.quasar.dev/logo-v2/favicon/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'https://cdn.quasar.dev/logo-v2/favicon/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'https://cdn.quasar.dev/logo-v2/favicon/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      metaVariables: {
        appleTouchIcon120: 'https://cdn.quasar.dev/logo-v2/favicon/apple-icon-120x120.png',
        appleTouchIcon180: 'https://cdn.quasar.dev/logo-v2/favicon/apple-icon-180x180.png',
        appleTouchIcon152: 'https://cdn.quasar.dev/logo-v2/favicon/apple-icon-152x152.png',
        appleTouchIcon167: 'https://cdn.quasar.dev/logo-v2/favicon/apple-icon-167x167.png',
        appleSafariPinnedTab: 'https://cdn.quasar.dev/logo-v2/favicon/safari-pinned-tab.svg',
        msapplicationTileImage: 'https://cdn.quasar.dev/logo-v2/favicon/ms-icon-144x144.png'
      }
    },

    vendor: {
      remove: [
        'quasar/dist/api'
      ]
    }
  }
}
