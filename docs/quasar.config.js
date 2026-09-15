import { defineConfig } from '#q-app'

// import shikiCssStashPlugin from './build/shiki-css-stash.js'
import { mdVitePlugin } from './build/md/md-vite-plugin.js'
import { quasarApiVitePlugin } from './build/quasar-api.js'
import { codeSplitting, examplesVitePlugin } from './build/prod-chunks.js'

export default defineConfig(ctx => ({
  boot: [
    { path: 'gdpr', server: false },
    // the e2e sweep's hydration-complete signal; never shipped
    ...(ctx.dev && ctx.mode.ssr
      ? [{ path: 'ssr-hydrated', server: false }]
      : [])
  ],

  css: ['app.sass' /* '~virtual:shiki-tokens.css' */],

  build: {
    vueRouterMode: 'history',
    distDir: 'dist/quasar.dev',
    useFilenameHashes: false,

    // the agent files next to the SSG pages: a .md sibling per page,
    // llms.txt and mcp.json (build/mcp)
    async afterBuild({ quasarConf }) {
      if (ctx.mode.ssg === true) {
        const { generate } = await import('./build/mcp/generate.js')
        generate({ distDir: quasarConf.build.distDir })
      }
    },

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
      if (ctx.dev) return

      if (isClient) {
        return {
          build: {
            assetsDir: 'a',
            chunkSizeWarningLimit: 600,
            rolldownOptions: {
              checks: { pluginTimings: false },
              output: {
                codeSplitting
              }
            }
          }
        }
      }

      return {
        build: {
          rolldownOptions: {
            checks: { pluginTimings: false }
          }
        }
      }
    }
  },

  devServer: {
    port: 9090,
    // the e2e-ssr sweep boots this app headlessly and opts out
    open:
      process.env.QUASAR_DOCS_NO_OPEN === '1'
        ? false
        : {
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
    middlewares: ['render']
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
      // the files agents read instead of the app: the .md page siblings,
      // llms.txt and mcp.json from the docs generator (build/mcp) and
      // public/context7.json
      const agentFiles = ['context7.json', 'llms.txt', 'mcp.json']
      const agentFilesRE = new RegExp(
        String.raw`\.md$|/(${agentFiles.map(file => file.replace('.', String.raw`\.`)).join('|')})$`
      )

      return {
        cleanupOutdatedCaches: true,
        // the updated worker waits until a page asks for it (register-sw.js)
        skipWaiting: false,
        clientsClaim: true,
        // (arrays merge by concatenation, onto app-vite's defaults)
        // never in the precache: a precached agent file would be served
        // from it ahead of the NetworkOnly route below; the OpenSearch
        // descriptor is fetched by browsers, never by the app
        globIgnores: ['**/*.md', ...agentFiles, 'search_manifest.xml'],
        // no app shell for the agent files, and never the worker cache
        navigateFallbackDenylist: [agentFilesRE],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn/,
            handler: 'StaleWhileRevalidate'
          },
          {
            urlPattern: agentFilesRE,
            handler: 'NetworkOnly',
            options: {
              cacheName: 'agent-files-network-only'
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
