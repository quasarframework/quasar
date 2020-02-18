module.exports = {
  root: true,

  parserOptions: {
    parser: 'babel-eslint'
  },

  env: {
    browser: true
  },

  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    'standard'
  ],

  // required to lint *.vue files
  plugins: [
    'vue',
    'quasar',
  ],

  globals: {
    'ga': true, // Google Analytics
    'cordova': true,
    '__statics': true,
    'Prism': true
  },

  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow paren-less arrow functions
    'arrow-parens': 'off',
    'one-var': 'off',
    'prefer-promise-reject-errors': 'off',

    'no-void': 'off',
    'quotes': 'off',
    'array-bracket-spacing': ['error', 'always'],
    'brace-style': ['error', 'stroustrup'],

    'import/export': 'off',
    'import/first': 'off',
    'import/no-absolute-path': 'off',
    'import/no-duplicates': 'off',
    'import/no-named-default': 'off',
    'import/no-webpack-loader-syntax': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',

    'quasar/check-valid-props': 'warn',

    // allow console.log during development only
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
