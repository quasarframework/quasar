import { defineConfig } from '#q-app'

// import shikiCssStashPlugin from './build/shiki-css-stash.js'
import { mdVitePlugin } from './build/md/md-vite-plugin.js'
import { quasarApiVitePlugin } from './build/quasar-api.js'
import { codeSplitting, examplesVitePlugin } from './build/prod-chunks.js'
import { agentFiles } from './build/agent-files.js'

// stamped on the html shell (index.html) and compiled into the app
// (src-pwa/register-sw.js compares the two)
const buildId = Date.now().toString(36)

export default defineConfig(ctx => ({
  boot: [
    { path: 'gdpr', server: false },
    // the e2e sweep's hydration-complete signal; never shipped
    ...(ctx.dev && ctx.mode.ssr
      ? [{ path: 'ssr-hydrated', server: false }]
      : [])
  ],

  css: ['app.sass' /* '~virtual:shiki-tokens.css' */],

  htmlVariables: { buildId },

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
      DOCS_BUILD_ID: buildId,
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
      'AppNetwork',
      'AppVisibility',
      'AppWakeLock',
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
    workboxMode: 'InjectManifest',
    injectPWAMetaTags: false,
    swFilename: 'service-worker.js',

    async extendPWAInjectManifestOptions() {
      return {
        // (arrays merge by concatenation, onto app-vite's defaults)
        // never in the precache: a precached agent file would be served
        // from it ahead of the worker's NetworkOnly route; the OpenSearch
        // descriptor is fetched by browsers, never by the app
        globIgnores: ['**/*.md', ...agentFiles, 'search_manifest.xml'],
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
