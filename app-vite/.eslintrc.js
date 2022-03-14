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
    'plugin:node/recommended'
  ],

  rules: {
    'no-empty': 'off',
    'no-useless-escape': 'off',
    'no-unused-vars': ['error', { ignoreRestSiblings: true, argsIgnorePattern: '^_' }],

    'no-process-exit': 'off',
  }
}
