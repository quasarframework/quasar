import quasar from 'eslint-config-quasar'
import globals from 'globals'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...quasar.configs.base,
  ...quasar.configs.vue,

  {
    ignores: [
      'node_modules/',
      'dist/',
      'test',
      'types',
      'icon-set/*.js',
      'icon-set/svg-*.mjs',
      'lang/*.js',
      'quasar.config.*.temporary.compiled*',
      'playground/.quasar',
      'playground/dist',
      'playground/src-capacitor',
      'playground/src-cordova',
      '**/*.cy.js'
    ]
  },

  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node,

        cordova: 'readonly',
        __QUASAR_VERSION__: 'readonly',
        __QUASAR_SSR__: 'readonly',
        __QUASAR_SSR_SERVER__: 'readonly',
        __QUASAR_SSR_CLIENT__: 'readonly',
        __QUASAR_SSR_PWA__: 'readonly'
      }
    },
  }
]
