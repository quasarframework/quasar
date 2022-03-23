// TODO: Split this into multiple configuration files in related locations.
// Requires a script that collects them manually and invokes ESLint.
// Currently, if we ESLint pick them automatically, it fails parsing package.json templates.
// There is no way to selectively ignore some config files, so we ignore all config files
// except this file by running `eslint --no-eslintrc --config .eslintrc.js`

module.exports = {
  root: true,

  env: {
    node: true,
    es2020: true,
  },

  extends: [
    'eslint:recommended',
  ],

  rules: {
    'no-empty': 'off',
  },

  settings: {
    'lodash-template/ignoreRules': ['no-undef']
  },

  overrides: [
    {
      files: './templates/*/*/*/**/*.ts',

      parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module'
      },

      env: {
        node: false,
        browser: true,
      },

      globals: {
        process: 'readonly',
      },

      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:lodash-template/recommended-with-script'
      ],

      rules: {
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { args: 'none' }],
      },
    },

    {
      files: './templates/*/*/*/**/*.js',

      parserOptions: {
        sourceType: 'module'
      },

      env: {
        node: false,
        browser: true,
      },

      globals: {
        process: 'readonly',
        // For require.context
        require: 'readonly',
      },

      extends: [
        'eslint:recommended',
        'plugin:lodash-template/recommended-with-script'
      ],

      rules: {
        'no-empty-function': 'off',
        'no-unused-vars': ['warn', { args: 'none' }],
      },
    },

    {
      files: [
        './templates/app-extension/**/*.js',
        './templates/ui-kit/*/{ae,ae-*}/app-extension/src/*.js',
        './templates/ui-kit/*/{BASE,ui-ae}/ui/build/*.js',
        './templates/ui-kit/*/{BASE,ui-ae}/ui/build/*/!(entry)/**/*.js',

        './templates/**/_*.js',
        './templates/**/*.{conf,config}.js'
      ],

      parserOptions: {
        sourceType: 'script'
      },

      env: {
        browser: false,
        node: true,
      },

      rules: {
        'no-unused-vars': ['warn', { args: 'none' }],
      }
    },

    {
      files: './templates/ui-kit/quasar-v2/**/*.js',

      globals: {
        __UI_VERSION__: 'readonly',
      }
    },

    {
      // Template-specific manager/helper scripts (e.g. ./templates/app/quasar-v2/index.js)
      files: './templates/*/*/*/*.js',

      env: {
        browser: false,
        node: true,
      },
    }
  ]
}
