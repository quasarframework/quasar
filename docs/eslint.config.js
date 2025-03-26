import eslintJs from '@eslint/js'
import quasar from 'eslint-config-quasar'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    name: 'eslint/recommended',

    ...eslintJs.configs.recommended
  },

  ...quasar.configs.base,
  ...quasar.configs.vue,

  {
    ignores: [
      'dist',
      'src-capacitor',
      'src-cordova',
      '.quasar',
      'quasar.config.*.temporary.compiled*'
    ]
  },

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        __QUASAR_SSR__: true,
        __QUASAR_SSR_SERVER__: true,
        __QUASAR_SSR_CLIENT__: true,
        __QUASAR_SSR_PWA__: true,
        Prism: true
      }
    },

    rules: {
      // TODO: Unify rules with the root config
      '@stylistic/array-bracket-spacing': [ 'error', 'always', { singleValue: false } ],
      '@stylistic/template-curly-spacing': 'off',
      '@stylistic/no-confusing-arrow': 'off',
      '@stylistic/operator-linebreak': 'off',
      'no-console': 'error',
      'no-useless-concat': 'off',

      'import-x/named': 'off',

      // TODO: add eslint v9 support to eslint-plugin-quasar and re-enable
      // 'quasar/check-valid-props': 'warn',

      'vue/no-mutating-props': 'off',
      'vue/no-v-text-v-html-on-component': 'off',
      'vue/no-setup-props-destructure': 'off',
      'vue/require-toggle-inside-transition': 'off'
    }
  },

  {
    files: [ 'build/**/*.js', 'src-ssr/**/*.js' ],

    rules: {
      'no-console': 'off',
    }
  }
]
