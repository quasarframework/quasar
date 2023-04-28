module.exports = {
  root: true,

  parserOptions: {
    ecmaVersion: '2021' // Allows for the parsing of modern ECMAScript features
  },

  env: {
    browser: true,
    'vue/setup-compiler-macros': true
  },

  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/vue3-essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],

  // required to lint *.vue files
  plugins: [
    'vue',
    'no-only-tests'
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
      ]
    }
  ],

  // add your custom rules here
  rules: {
    'brace-style': [ 2, 'stroustrup', { allowSingleLine: true } ],
    'prefer-const': 2,
    'prefer-promise-reject-errors': 'off',
    'multiline-ternary': 'off',
    'no-prototype-builtins': 'off',
    'no-case-declarations': 'off',
    'generator-star-spacing': 'off',
    'arrow-parens': 'off',
    'object-property-newline': 'off',
    'one-var': 'off',
    'no-void': 'off',
    'no-lone-blocks': 'error',
    'no-unused-expressions': 'error',
    'no-useless-concat': 'error',
    'no-useless-return': 'error',
    'no-unneeded-ternary': 'error',
    'no-confusing-arrow': [ 'error', { allowParens: true } ],
    'operator-linebreak': [ 'error', 'before' ],
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

    'array-bracket-spacing': [ 'error', 'always' ],
    'object-curly-spacing': [ 'error', 'always' ],
    'computed-property-spacing': [ 'error', 'always' ],
    'template-curly-spacing': [ 'error', 'always' ],

    'import/first': 0,
    'import/named': 2,
    'import/namespace': 2,
    'import/default': 2,
    'import/export': 2,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': 'off',

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
    'vue/multi-word-component-names': 'off',

    // Testing
    'cypress/no-unnecessary-waiting': 'off',
    'no-only-tests/no-only-tests': 'error'
  }
}
