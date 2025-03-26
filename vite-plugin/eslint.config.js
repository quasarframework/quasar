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
      'dist/',
      'node_modules/'
    ]
  },

  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node,
      }
    },
  }
]
