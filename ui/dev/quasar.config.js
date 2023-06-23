import { join } from 'node:path'
import { mergeConfig } from 'vite'

const rootFolder = new URL('.', import.meta.url).pathname
const resolve = _path => join(rootFolder, _path)

export default ctx => ({
  eslint: {
    fix: true,
    warnings: true,
    errors: true
  },

  boot: [
    ctx.mode.ssr ? { path: 'ssr-client', server: false } : ''
  ],

  css: [],

  extras: [
    'ionicons-v4',
    'mdi-v6',
    'fontawesome-v6',
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

  framework: {
    // iconSet: 'svg-mdi-v6',
    // config: { ripple: { early: true } },
    // config: {
    //   globalNodes: {
    //     class: 'mimi'
    //   }
    // },

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

  build: {
    vueRouterMode: 'history',

    // needed otherwise we need to compile Quasar UI
    // on each source file change:
    devQuasarTreeshaking: true,

    alias: {
      'quasar/dist/quasar.sass': resolve('../src/css/index.sass'),
      'quasar/icon-set': resolve('../icon-set'),
      'quasar/lang': resolve('../lang'),
      'quasar/src': resolve('../src')
    },

    extendViteConf (viteConf, { isServer }) {
      viteConf.server = mergeConfig(viteConf.server, {
        fs: {
          allow: [
            // for quasar package (ui folder) and related deps
            '..',
            // due to workspace hoisting, some deps might come from the root node_modules
            '../..'
          ]
        }
      })

      if (isServer) {
        viteConf.resolve.alias.quasar = resolve('../src/index.ssr.js')
      }
    }
  },

  devServer: {
    https: false,
    open: {
      app: { name: 'google chrome' }
    }
  },

  ssr: {
    middlewares: [
      'render' // keep this as last one
    ]
  }
})
