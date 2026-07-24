import { defineConfig } from '#q-app'

// import shikiCssStashPlugin from './build/shiki-css-stash.js'
import { mdVitePlugin } from './build/md/md-vite-plugin.js'
import { quasarApiVitePlugin } from './build/quasar-api.js'
import { codeSplitting, examplesVitePlugin } from './build/prod-chunks.js'

export default defineConfig(ctx => ({
  boot: [{ path: 'gdpr', server: false }],

  css: ['app.sass' /* '~virtual:shiki-tokens.css' */],

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

    vitePlugins: [
      quasarApiVitePlugin(),
      mdVitePlugin(ctx.prod),
      examplesVitePlugin(ctx.prod)
      // shikiCssStashPlugin()
    ],

    extendViteConf(_viteConf, { isClient }) {
      if (ctx.prod && isClient) {
        return {
          build: {
            assetsDir: 'a',
            chunkSizeWarningLimit: 600,
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
    middlewares: ['render'],
    pwa: true
  },

  ssg: {
    pwa: ctx.prod,
    error404HtmlFilename: false,
    extendSSGManifestJson(ssrManifest) {
      for (const key in ssrManifest) {
        ssrManifest[key] = ssrManifest[key].filter(
          entry => entry !== '/assets/vendor.css'
        )
      }
    }
  },

  pwa: {
    workboxMode: 'GenerateSW',
    injectPWAMetaTags: false,
    swFilename: 'service-worker.js',

    async extendPWAGenerateSWOptions() {
      return {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        navigateFallbackDenylist: [/\.md$/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn/,
            handler: 'StaleWhileRevalidate'
          },
          {
            urlPattern: /\.md$/,
            handler: 'NetworkOnly',
            options: {
              cacheName: 'markdown-network-only'
            }
          }
        ],
        additionalManifestEntries: [
          ...(await getSponsors()),
          ...(await getTeam())
        ]
      }
    }
  }
}))

async function getSponsors() {
  const {
    sponsors: { platinum, gold, silver }
  } = await import('./src/assets/sponsors.js')

  const list = [...platinum, ...gold, ...silver].map(({ src }) => src)
  return [
    ...list.map(src => ({
      url: `https://cdn.quasar.dev/logo-sponsors-v2/light/${src}`,
      revision: null
    })),
    ...list.map(src => ({
      url: `https://cdn.quasar.dev/logo-sponsors-v2/dark/${src}`,
      revision: null
    }))
  ]
}

async function getTeam() {
  const { coreTeam, honorableTeamMentions } =
    await import('./src/assets/team.js')
  return [...coreTeam, ...honorableTeamMentions].map(({ avatar }) => ({
    url: `https://cdn.quasar.dev/team/${avatar}`,
    revision: null
  }))
}
