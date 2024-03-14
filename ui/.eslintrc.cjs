module.exports = {
  root: true,

  parserOptions: {
    ecmaVersion: 'latest'
  },

  env: {
    browser: true,
    node: true
  },

  plugins: [
    'no-only-tests'
  ],

  extends: [
    'quasar/base',
    'quasar/vue'
  ],

  globals: {
    cordova: 'readonly',
    __QUASAR_VERSION__: 'readonly',
    __QUASAR_SSR__: 'readonly',
    __QUASAR_SSR_SERVER__: 'readonly',
    __QUASAR_SSR_CLIENT__: 'readonly',
    __QUASAR_SSR_PWA__: 'readonly'
  },

  overrides: [
    {
      files: [ '**/*.cy.{js,jsx,ts,tsx}', 'test/cypress/**/*' ],
      extends: [
        // Add Cypress-specific lint rules, globals and Cypress plugin
        // See https://github.com/cypress-io/eslint-plugin-cypress#rules
        'plugin:cypress/recommended'
      ],

      rules: {
        'no-only-tests/no-only-tests': 'error'
      }
    }
  ]
}
