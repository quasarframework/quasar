import jsEsLint from '@eslint/js'
import quasar from 'eslint-config-quasar'
import globals from 'globals'

/** @type {import('eslint').Linter.Config[]} */
export default [
  jsEsLint.configs.recommended,

  ...quasar.configs.base,
  ...quasar.configs.vue,

  {
    ignores: [
      '/src-ui/dist',
      '/src-ui/.quasar',
      '/node_modules'
    ]
  },

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      }
    },
  }
]
