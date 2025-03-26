import tseslint from 'typescript-eslint'
import baseConfig from '../eslint.config.base.js'

export default tseslint.config(
  ...baseConfig,

  {
    files: [
      'quasar-v2/js-vite-2/*/**/*.ts',
      'quasar-v2/js-vite-2/*/**/*.js',

      'quasar-v2/js-webpack-4/*/**/*.ts',
      'quasar-v2/js-webpack-4/*/**/*.js'
    ],

    settings: {
      'lodash-template/globals': [
        // Base
        'name',
        'description',
        'author',

        // Quasar v2
        'quasarVersion',
        'scriptType',
        'productName',

        // Quasar v2 - JS
        'css',
        'preset',
        'prettier'
      ]
    }
  },

  {
    files: [
      'quasar-v2/ts-vite-2/*/**/*.ts',
      'quasar-v2/ts-vite-2/*/**/*.js',

      'quasar-v2/ts-webpack-4/*/**/*.ts',
      'quasar-v2/ts-webpack-4/*/**/*.js'
    ],

    settings: {
      'lodash-template/globals': [
        // Base
        'name',
        'description',
        'author',

        // Quasar v2
        'quasarVersion',
        'scriptType',
        'productName',

        // Quasar v2 - TS
        'sfcStyle',
        'css',
        'preset',
        'prettier'
      ]
    }
  }
)
