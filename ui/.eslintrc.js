module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  globals: {
    cordova: true,
    __THEME__: true,
    __statics: true
  },
  // add your custom rules here
  rules: {
    'brace-style': [ 2, 'stroustrup', { allowSingleLine: true } ],
    'prefer-const': 2,
    'no-undefined': 2,
    'no-void': 0,

    'vue/max-attributes-per-line': 0,
    'vue/valid-v-for': 0,
    'vue/require-default-prop': 0,
    'vue/require-prop-types': 0,
    'vue/require-v-for-key': 0,
    'vue/return-in-computed-property': 0,
    'vue/require-render-return': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/no-side-effects-in-computed-properties': 0,
    'vue/array-bracket-spacing': 0,
    'vue/object-curly-spacing': 0,
    'vue/script-indent': 0,

    // allow async-await
    'generator-star-spacing': 0,

    // allow paren-less arrow functions
    'arrow-parens': 0,
    'one-var': 0,

    'import/first': 0,
    'import/named': 2,
    'import/namespace': 2,
    'import/default': 2,
    'import/export': 2,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': 0,

    'prefer-promise-reject-errors': 0,

    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
