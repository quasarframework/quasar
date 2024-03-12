module.exports = {
  parserOptions: {
    ecmaVersion: 'latest'
  },

  env: {
    browser: true,
    node: true
  },

  plugins: [
    'vue',
    'no-only-tests'
  ],

  extends: [
    'plugin:vue/vue3-essential'
  ],

  globals: {
    cordova: 'readonly',
    __QUASAR_VERSION__: 'readonly',
    __QUASAR_SSR__: 'readonly',
    __QUASAR_SSR_SERVER__: 'readonly',
    __QUASAR_SSR_CLIENT__: 'readonly',
    __QUASAR_SSR_PWA__: 'readonly'
  },

  rules: {
    'vue/max-attributes-per-line': 'off',
    'vue/valid-v-for': 'off',
    'vue/require-default-prop': 'off',
    'vue/require-prop-types': 'off',
    'vue/require-v-for-key': 'off',
    'vue/return-in-computed-property': 'off',
    'vue/require-render-return': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/no-side-effects-in-computed-properties': 'off',
    'vue/array-bracket-spacing': 'off',
    'vue/object-curly-spacing': 'off',
    'vue/script-indent': 'off',
    'vue/no-v-model-argument': 'off',
    'vue/require-explicit-emits': 'off',
    'vue/multi-word-component-names': 'off'
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
