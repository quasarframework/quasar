import eslintJs from '@eslint/js'
import quasar from 'eslint-config-quasar'
import globals from 'globals'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    name: 'eslint/recommended',

    ...eslintJs.configs.recommended
  },

  ...quasar.configs.base,

  {
    name: 'custom/ignores',

    ignores: [
      'templates',
    ]
  },

  {
    name: 'custom',

    rules: {
      'no-useless-escape': 'off',
      'no-unused-vars': [ 'error', { ignoreRestSiblings: true, argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' } ]
    }
  },

  ...[
    ...quasar.configs.node
  ].map(config => ({
    ...config,
    files: [ '**/*.js' ]
  })),
  {
    name: 'custom/node',
    files: [ '**/*.js' ],

    languageOptions: {
      sourceType: 'commonjs',
      ecmaVersion: 2022, // needs to be explicitly stated for some reason
      // TODO: ^ verify if it's still needed

      globals: {
        ...globals.es2022,
        // ...globals.es2023, // node 22 and above
      }
    },
  },

  {
    name: 'custom/mjs',
    files: [ '**/*.mjs' ],

    languageOptions: {
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest'
      }
    }
  },

  {
    name: 'custom/bex',
    files: [ 'exports/bex/**/*.mjs' ],

    languageOptions: {
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
      globals: {
        ...globals.browser,
        ...globals.webextensions
      }
    }
  }
]
