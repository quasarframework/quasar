const { join } = require('path')

module.exports = function (ctx) {
  return {
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
        'quasar/dist/quasar.sass': join(__dirname, '../src/css/index.sass'),
        'quasar/icon-set': join(__dirname, '../icon-set'),
        'quasar/lang': join(__dirname, '../lang'),
        'quasar/src': join(__dirname, '../src')
      },

      extendViteConf (viteConf, { isServer }) {
        viteConf.server = viteConf.server || {}
        viteConf.server.fs = viteConf.server.fs || {}
        viteConf.server.fs.allow = [ '..' ]

        if (isServer) {
          viteConf.resolve.alias.quasar = join(__dirname, '../src/index.ssr.js')
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
  }
}
