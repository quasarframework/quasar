import eslintJs from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    name: 'eslint/recommended',

    ...eslintJs.configs.recommended
  },

  {
    name: 'custom',

    rules: {
      'no-empty': 'off',
      'no-unused-vars': [ 'error', { ignoreRestSiblings: true, argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' } ]
    }
  }
)
