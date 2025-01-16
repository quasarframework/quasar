import globals from 'globals'
import tseslint from 'typescript-eslint'
import baseConfig from '../eslint.config.base.js'

export default tseslint.config(
  ...baseConfig,

  {
    // Due to conditional use of mixed ESM/CJS in certain files, they can't be properly parsed and checked
    ignores: [
      'ae-js/BASE/src/index.js',
      'ae-js/install-script/src/install.js',
      'ae-js/prompts-script/src/prompts.js',
      'ae-js/uninstall-script/src/uninstall.js'
    ]
  },

  {
    files: [ 'ae-js/*/**/*.js' ],

    settings: {
      'lodash-template/globals': [
        // Base
        'name',
        'description',
        'author',

        'preset',
        'orgName',
        'license',

        'codeFormat'
      ]
    },

    languageOptions: {
      parserOptions: {
        sourceType: 'script'
      },

      globals: {
        ...globals.node
      }
    }
  },

  {
    files: [ 'ae-ts/*/**/*.ts', 'ae-ts/*/**/*.js' ],

    settings: {
      'lodash-template/globals': [
        // Base
        'name',
        'description',
        'author',

        'preset',
        'orgName',
        'license',

        'packageManagerField',
      ]
    }
  },
)
