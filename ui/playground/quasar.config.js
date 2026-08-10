import { join } from 'node:path'
import { defineConfig } from '#q-app'

const rootFolder = import.meta.dirname
const resolve = _path => join(rootFolder, _path)

export default defineConfig(ctx => ({
  boot: [ctx.mode.ssr ? { path: 'ssr-client', server: false } : ''],

  extras: [
    'ionicons-v4',
    'mdi-v7',
    'fontawesome-v7',
    'eva-icons',
    'themify',
    'line-awesome',
    'bootstrap-icons',
    // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

    'roboto-font',
    'material-symbols-outlined',
    'material-symbols-rounded',
    'material-symbols-sharp',
    'material-icons-outlined',
    'material-icons-round',
    'material-icons-sharp',
    'material-icons'
  ],

  build: {
    vueRouterMode: 'history',
    vueOptionsAPI: true,

    alias: {
      'quasar/dist/quasar.sass': resolve('../src/css/index.sass'),
      'quasar/icon-set': resolve('../icon-set'),
      'quasar/lang': resolve('../lang'),
      'quasar/src': resolve('../src')
    },

    // vitePlugins: [],

    extendViteConf(_viteConf, { isServer }) {
      const conf = {
        fs: {
          allow: [
            // for quasar package (ui folder) and related deps
            '..',
            // due to workspace hoisting, some deps might come from the root node_modules
            '../..'
          ]
        }
      }

      if (isServer) {
        conf.resolve = {
          alias: {
            quasar: resolve('../src/index.ssr.js')
          }
        }
      }

      return conf
    }
  },

  framework: {
    // iconSet: 'svg-mdi-v6',
    // config: { ripple: { early: true } },
    // config: {
    //   globalNodes: {
    //     class: 'mimi'
    //   }
    // },

    // needed otherwise we need to compile Quasar UI
    // on each source file change:
    devTreeshaking: true,

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

  devServer: {
    https: false,
    // the e2e-ssr sweep boots this app headlessly and opts out
    open:
      process.env.QUASAR_PLAYGROUND_NO_OPEN === '1'
        ? false
        : {
            app: { name: 'google chrome' }
          }
  },

  ssr: {
    middlewares: [
      'render' // keep this as last one
    ]
  }
}))
