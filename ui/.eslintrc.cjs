module.exports = {
  root: true,

  parserOptions: {
    ecmaVersion: 'latest'
  },

  env: {
    browser: true,
    node: true
  },

  extends: [
    'quasar/base',
    'quasar/vue'
  ],

  globals: {
    cordova: 'readonly',
    __QUASAR_VERSION__: 'readonly',
    __QUASAR_SSR__: 'readonly',
    __QUASAR_SSR_SERVER__: 'readonly',
    __QUASAR_SSR_CLIENT__: 'readonly',
    __QUASAR_SSR_PWA__: 'readonly'
  }
}
