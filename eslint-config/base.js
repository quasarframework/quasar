module.exports = {
  parserOptions: {
    ecmaVersion: 'latest'
  },

  extends: [
    // 'eslint:recommended', // TODO: enable this
    'standard'
  ],

  rules: {
    'brace-style': [ 'error', 'stroustrup', { allowSingleLine: true } ],
    'prefer-const': 'error',
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
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    'array-bracket-spacing': [ 'error', 'always' ],
    'object-curly-spacing': [ 'error', 'always' ],
    'computed-property-spacing': [ 'error', 'always' ],
    'template-curly-spacing': [ 'error', 'always' ],

    'import/first': 'off',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off'
  }
}
