/* eslint-env node */

import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { mergeConfig } from 'vite'
import { configure } from 'quasar/wrappers'

const rootFolder = fileURLToPath(new URL('.', import.meta.url))
const resolve = _path => join(rootFolder, _path)

export default configure(ctx => {
  return {
    boot: [
      ctx.mode.ssr ? { path: 'ssr-client', server: false } : ''
    ],

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

    build: {
      vueRouterMode: 'history',

      alias: {
        'quasar/dist/quasar.sass': resolve('../src/css/index.sass'),
        'quasar/icon-set': resolve('../icon-set'),
        'quasar/lang': resolve('../lang'),
        'quasar/src': resolve('../src'),
        'quasar/wrappers': resolve('../wrappers/index.js')
      },

      vitePlugins: [
        [ 'vite-plugin-checker', {
          eslint: {
            root: resolve('../'),
            lintCommand: 'eslint  --report-unused-disable-directives "./**/*.{js,mjs,cjs,vue}"'
          }
        }, { server: false } ]
      ],

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
      open: {
        app: { name: 'google chrome' }
      }
    },

    ssr: {
      middlewares: [
        'render' // keep this as last one
      ]
    }
  }
})
