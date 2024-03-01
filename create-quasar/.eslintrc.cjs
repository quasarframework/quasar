module.exports = {
  root: true,

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },

  env: {
    node: true
  },

  globals: {
    Promise: 'readonly'
  },

  extends: [
    'eslint:recommended',
  ],

  rules: {
    'no-empty': 'off',
  },

  overrides: [
    {
      files: './scripts/**/*.ts',

      parserOptions: {
        sourceType: 'module',
      },

      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
      ],
    }
  ]
}
