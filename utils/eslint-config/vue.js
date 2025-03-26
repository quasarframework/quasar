import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...pluginVue.configs[ 'flat/essential' ],

  {
    name: 'quasar/vue',

    languageOptions: {
      globals: {
        ...globals.browser
      }
    },

    rules: {
      'vue/max-attributes-per-line': 'off',
      'vue/valid-v-for': 'off',
      'vue/require-default-prop': 'off',
      'vue/require-prop-types': 'off',
      'vue/require-v-for-key': 'off',
      'vue/return-in-computed-property': 'off',
      'vue/require-render-return': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/no-side-effects-in-computed-properties': 'off',
      'vue/array-bracket-spacing': 'off',
      'vue/object-curly-spacing': 'off',
      'vue/script-indent': 'off',
      'vue/require-explicit-emits': 'off',
      'vue/multi-word-component-names': 'off'
    }
  }
]
