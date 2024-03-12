require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,

  parserOptions: {
    ecmaVersion: 'latest'
  },

  extends: [
    // 'eslint:recommended', // TODO: enable this
    'quasar/base'
  ]
}
