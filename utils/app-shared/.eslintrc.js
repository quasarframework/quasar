const { resolve } = require('path');

module.exports = {
  root: true,

  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: resolve(__dirname, './tsconfig.json'),
    sourceType: 'module',
    ecmaVersion: 2022,
  },

  env: {
    node: true,
  },

  // Rules order is important, please avoid shuffling them
  extends: [
    // Base ESLint recommended rules
    'eslint:recommended',

    // ESLint typescript rules
    // See https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#usage
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],

  plugins: [
    // Required to apply rules which need type information
    '@typescript-eslint',
  ],
}
