require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },

  env: {
    node: true
  },

  extends: [
    'eslint:recommended',
    'quasar/base'
  ]
}
