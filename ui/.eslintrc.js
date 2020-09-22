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
    'plugin:vue/vue3-essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  globals: {
    'cordova': true,
    '__THEME__': true,
    '__statics': true
  },
  // add your custom rules here
  'rules': {
    'brace-style': [2, 'stroustrup', { 'allowSingleLine': true }],
    'prefer-const': 2,

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
    'vue/require-explicit-emits': 'error',

    // allow async-await
    'generator-star-spacing': 'off',

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
