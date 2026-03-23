import { defineConfig } from 'eslint/config'
import globals from 'globals'
import baseConfig from '../eslint.config.base.js'

export default defineConfig(
  ...baseConfig,

  {
    // Due to conditional use of mixed ESM/CJS in certain files, they can't be properly parsed and checked
    ignores: [
      '*/ae-install/app-extension/src/install.js',
      '*/ae-prompts/app-extension/src/prompts.js',
      '*/ae-uninstall/app-extension/src/uninstall.js',
      '*/ae/app-extension/src/index.js'
    ]
  },

  {
    files: [ '*/*/**/*.js' ],

    settings: {
      'lodash-template/globals': [
        // Base
        'name',
        'description',
        'author',

        'features',
        'preset',

        'packageDescription',
        'aeDescription',

        'umdExportName',
        'componentName',
        'directiveName',

        'license'
      ]
    }
  },

  {
    files: [ '*/*/**/*.js' ],

    languageOptions: {
      globals: {
        __UI_VERSION__: 'readonly'
      },
    }
  },

  {
    files: [
      '*/{ae,ae-*}/app-extension/src/*.js',
      '*/{BASE,ui-ae}/ui/build/*.js',
      '*/{BASE,ui-ae}/ui/build/*/!(entry)/**/*.js',
    ],

    languageOptions: {
      parserOptions: {
        sourceType: 'script'
      },

      globals: {
        ...globals.node
      }
    }
  }
)
