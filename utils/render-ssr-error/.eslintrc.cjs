require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },

  env: {
    node: true,
    browser: true
  },

  // Rules order is important, please avoid shuffling them
  extends: [
    'eslint:recommended',
    'quasar/base',
    'quasar/vue'
  ]
}
