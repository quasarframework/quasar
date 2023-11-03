module.exports = {
  root: true,

  env: {
    node: true,
    es2020: true,
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
