import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginLodashTemplate from '@yusufkandemir/eslint-plugin-lodash-template'
import baseConfig from '../eslint.config.base.js'

// file paths are relative to templates/*/
export default tseslint.config(
  ...baseConfig,

  {
    name: 'custom/templates/ts',
    files: [ '*/*/**/*.ts' ],

    extends: [
      ...tseslint.configs.recommended,
      pluginLodashTemplate.configs.recommendedWithScript,
    ],

    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        sourceType: 'module',
      },

      globals: {
        ...globals.browser,
        process: 'readonly'
      }
    },

    rules: {
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { args: 'none' }],
    },

    linterOptions: {
      // TS templates use recommendedTypeChecked which have extra rules
      // We can't enable it here due to the complicated nature of the templates
      // So, we simply disable unused disable directives to avoid false positives
      reportUnusedDisableDirectives: 'off'
    }
  },

  {
    name: 'custom/templates/js',
    files: [ '*/*/**/*.js' ],

    extends: [
      {
        ...pluginLodashTemplate.configs.recommendedWithScript,
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
      }
    ],

    languageOptions: {
      parserOptions: {
        sourceType: 'module',
      },

      globals: {
        ...globals.browser,
        process: 'readonly',
        // For require.context
        require: 'readonly',
      }
    },

    rules: {
      'no-empty-function': 'off',
      'no-unused-vars': [ 'warn', { args: 'none' } ],
    },
  },

  {
    name: 'custom/templates/config-files',
    files: [
      '*/*/**/_*.js',
      '*/*/**/*.{conf,config}.js',
    ],

    languageOptions: {
      parserOptions: {
        // TODO: re-evaluate this
        sourceType: 'script'
      },

      globals: {
        ...globals.node
      }
    }
  },

  {
    name: 'custom/templates/config-files/esm',
    files: [
      '*/*/**/quasar.config.js',
      '*/*/**/_eslint.config.js',
      '*/*/**/babel.config.js',
      '*/*/**/postcss.config.js'
    ],

    languageOptions: {
      parserOptions: {
        sourceType: 'module'
      },

      globals: {
        ...globals.node
      }
    }
  },

  {
    // example: ./app/quasar-v2/index.js
    name: 'custom/templates/helpers',
    files: [ '*/*/*.js' ],

    languageOptions: {
      parserOptions: {
        sourceType: 'module'
      },

      globals: {
        ...globals.node
      }
    }
  }
)
