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
    // Ignore auto-generated files
    ignores: [
      '*/index.*',
      '!build/index.*',
      'animate/animate-list.*'
    ]
  },

  {
    rules: {
      'no-unused-vars': [ 'error', { ignoreRestSiblings: true, argsIgnorePattern: '^_' } ]
    }
  },

  {
    files: [ 'eslint.config.mjs' ],

    languageOptions: {
      sourceType: 'module'
    },
  }
]
