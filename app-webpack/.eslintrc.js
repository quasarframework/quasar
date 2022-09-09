module.exports = {
  root: true,

  parserOptions: {
    ecmaVersion: 2022,
  },

  env: {
    node: true,
  },

  extends: [
    'eslint:recommended',
    'plugin:n/recommended'
  ],

  rules: {
    'no-empty': 'off',
    'no-useless-escape': 'off',
    'no-unused-vars': ['error', { ignoreRestSiblings: true, argsIgnorePattern: '^_' }],

    'n/no-process-exit': 'off',
  }
}
