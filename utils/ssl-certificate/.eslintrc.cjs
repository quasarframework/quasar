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
