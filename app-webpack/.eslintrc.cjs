// eslint-disable-next-line n/no-extraneous-require
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,

  parserOptions: {
    ecmaVersion: 'latest'
  },

  extends: [
    'eslint:recommended',
    'quasar/base',
    'quasar/node'
  ],

  rules: {
    'no-useless-escape': 'off',
    'no-unused-vars': [ 'error', { ignoreRestSiblings: true, argsIgnorePattern: '^_' } ]
  }
}
