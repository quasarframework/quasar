module.exports = {
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },

  env: {
    node: true
  },

  extends: [
    'eslint:recommended',
    'plugin:n/recommended'
  ],

  rules: {
    'no-useless-escape': 'off',
    'no-unused-vars': [ 'error', { ignoreRestSiblings: true, argsIgnorePattern: '^_' } ],

    'n/no-process-exit': 'off'
  }
}
