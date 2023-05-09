
module.exports = {
  root: true,

  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },

  env: {
    node: true,
  },

  extends: [
    'eslint:recommended',
    'plugin:n/recommended',
    'standard'
  ],

  rules: {
    'brace-style': [ 2, 'stroustrup', { allowSingleLine: true } ],
    'prefer-const': 2,
    'prefer-promise-reject-errors': 'off',
    'multiline-ternary': 'off',
    'no-prototype-builtins': 'off',
    'no-case-declarations': 'off',
    'generator-star-spacing': 'off',
    'arrow-parens': 'off',
    'object-property-newline': 'off',
    'one-var': 'off',
    'no-void': 'off',
    'no-lone-blocks': 'error',
    'no-unused-expressions': [ 'error', { allowShortCircuit: true } ],
    'no-useless-concat': 'error',
    'no-useless-return': 'error',
    'no-unneeded-ternary': 'error',
    'no-confusing-arrow': [ 'error', { allowParens: true } ],
    'operator-linebreak': [ 'error', 'before' ],

    'array-bracket-spacing': [ 'error', 'always' ],
    'object-curly-spacing': [ 'error', 'always' ],
    'computed-property-spacing': [ 'error', 'always' ],
    'template-curly-spacing': [ 'error', 'always' ],

    'import/first': 0,
    'import/named': 2,
    'import/namespace': 2,
    'import/default': 2,
    'import/export': 2,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': 'off',

    'no-useless-escape': 'off',
    'no-unused-vars': [ 'error', { ignoreRestSiblings: true, argsIgnorePattern: '^_' } ],

    'n/no-process-exit': 'off'
  }
}
