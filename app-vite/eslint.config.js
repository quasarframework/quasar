// eslint-disable-next-line n/no-extraneous-import
import eslintJs from '@eslint/js'
import quasar from 'eslint-config-quasar'
// eslint-disable-next-line n/no-extraneous-import
import globals from 'globals'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    name: 'eslint/recommended',

    ...eslintJs.configs.recommended
  },

  ...quasar.configs.base,

  {
    ignores: [
      'templates',
    ]
  },

  {
    languageOptions: {
      sourceType: 'module'
    },

    rules: {
      'no-useless-escape': 'off',
      'no-unused-vars': [ 'error', { ignoreRestSiblings: true, argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' } ]
    }
  },

  ...[
    ...quasar.configs.node
  ].map(({ name: _, ...config }) => ({
    ...config,
    files: [ '**/*.js' ],
    ignores: [ 'exports/bex/**/*.js' ]
  })),
  {
    files: [ '**/*.js' ],
    ignores: [ 'exports/bex/**/*.js' ],

    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 2022, // needs to be explicitly stated for some reason
      // TODO: ^ verify if it's still needed

      globals: {
        ...globals.es2022,
        // ...globals.es2023, // node 22 and above
      }
    },
  },

  {
    files: [ '**/*.cjs' ],
    languageOptions: {
      parserOptions: {
        sourceType: 'commonjs',
        ecmaVersion: 'latest'
      }
    }
  },

  {
    files: [ 'exports/bex/**/*.js' ],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
      },
      globals: {
        ...globals.browser,
        ...globals.webextensions
      }
    }
  }
]
