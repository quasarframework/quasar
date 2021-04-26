module.exports = {
  root: true,

  parserOptions: {
    parser: '@babel/eslint-parser'
  },

  env: {
    browser: true
  },

  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/vue3-essential',
    'standard'
  ],

  // required to lint *.vue files
  plugins: [
    'vue',
    'quasar'
  ],

  globals: {
    ga: true, // Google Analytics
    cordova: true,
    __statics: true,
    __QUASAR_SSR__: true,
    __QUASAR_SSR_SERVER__: true,
    __QUASAR_SSR_CLIENT__: true,
    __QUASAR_SSR_PWA__: true,
    Prism: true
  },

  // add your custom rules here
  rules: {
    'brace-style': [ 2, 'stroustrup', { 'allowSingleLine': true } ],
    'prefer-const': 2,
    'prefer-promise-reject-errors': 'off',
    'multiline-ternary': 'off',
    'array-bracket-spacing': [ 'error', 'always', { singleValue: false } ],
    'computed-property-spacing': [ 'error', 'always' ],
    'no-prototype-builtins': 'off',
    'no-case-declarations': 'off',
    'generator-star-spacing': 'off',
    'arrow-parens': 'off',
    'one-var': 'off',
    'no-void': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

    'import/export': 'off',
    'import/first': 'off',
    'import/no-absolute-path': 'off',
    'import/no-duplicates': 'off',
    'import/no-named-default': 'off',
    'import/no-webpack-loader-syntax': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',

    'quasar/check-valid-props': 'warn',

    'vue/no-mutating-props': 'off',
    'vue/no-v-model-argument': 'off'
  }
}
