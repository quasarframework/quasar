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
    },

    rules: {
      'no-useless-escape': 'off',
      'no-unused-vars': [ 'error', { ignoreRestSiblings: true, argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' } ]
    }
  }
]
