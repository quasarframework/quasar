module.exports = {
  parserOptions: {
    ecmaVersion: 'latest'
  },

  env: {
    node: true,
    browser: true
  },

  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/vue3-essential'
  ],

  // required to lint *.vue files
  plugins: [
    'vue',
    'quasar'
  ],

  globals: {
    __QUASAR_SSR__: true,
    __QUASAR_SSR_SERVER__: true,
    __QUASAR_SSR_CLIENT__: true,
    __QUASAR_SSR_PWA__: true,
    Prism: true
  },

  rules: {
    // TODO: Unify rules with the root config
    'array-bracket-spacing': [ 'error', 'always', { singleValue: false } ],
    'template-curly-spacing': 'off',
    'no-useless-concat': 'off',
    'operator-linebreak': 'off',
    'no-console': 'error',
    'no-confusing-arrow': 'off',

    'quasar/check-valid-props': 'warn',

    'vue/no-mutating-props': 'off',
    'vue/no-v-model-argument': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-v-text-v-html-on-component': 'off',
    'vue/no-setup-props-destructure': 'off',
    'vue/require-toggle-inside-transition': 'off'
  }
}
