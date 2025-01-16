// eslint-disable-next-line n/no-extraneous-import
import eslintJs from '@eslint/js'
import quasar from 'eslint-config-quasar'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    name: 'eslint/recommended',

    ...eslintJs.configs.recommended
  },

  ...quasar.configs.base,
  ...quasar.configs.node,

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  }
]
