import pluginN from 'eslint-plugin-n'
import globals from 'globals'

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginN.configs[ 'flat/recommended' ],

  {
    name: 'quasar/node',

    languageOptions: {
      globals: {
        ...globals.node
      }
    },

    rules: {
      'n/no-process-exit': 'off'
    }
  }
]
