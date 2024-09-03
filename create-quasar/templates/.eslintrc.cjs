module.exports = {
  overrides: [
    {
      files: './*/*/*/**/*.ts',

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
      files: './*/*/*/**/*.js',

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
        './*/*/*/**/_*.js',
        './*/*/*/**/*.{conf,config}.js'
      ],

      parserOptions: {
        sourceType: 'script'
      },

      env: {
        browser: false,
        node: true,
      },
    },

    {
      // Template-specific manager/helper scripts (e.g. ./app/quasar-v2/index.js)
      files: './*/*/*/*.js',

      env: {
        browser: false,
        node: true,
      },
    }
  ]
}
