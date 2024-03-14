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
