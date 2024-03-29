module.exports = {
  root: true,

  parserOptions: {
    ecmaVersion: 'latest'
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
