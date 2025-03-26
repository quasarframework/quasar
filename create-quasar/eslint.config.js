import baseConfig from './eslint.config.base.js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
// import quasar from 'eslint-config-quasar'

export default tseslint.config(
  ...baseConfig,

  // TODO: enable these configs
  // ...quasar.configs.base,
  // ...quasar.configs.node,

  {
    name: 'custom/ignores',

    ignores: [ 'test-project' ]
  },

  {
    name: 'custom',

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      globals: {
        ...globals.node
      }
    }
  },

  {
    name: 'custom/scripts',

    files: [ './scripts/**/*.ts' ],

    extends: [
      ...tseslint.configs.recommended
    ],

    parserOptions: {
      sourceType: 'module',
    },
  }
)
