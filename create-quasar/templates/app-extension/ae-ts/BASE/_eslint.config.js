import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import configPrettier from 'eslint-config-prettier';
import globals from 'globals';
import { version as vueVersion } from 'vue';

export default tseslint.config(
  {
    name: 'eslint/recommended',
    ...eslint.configs.recommended,
  },

  // Recommended rules
  ...tseslint.configs.recommendedTypeChecked,
  // Strict rules (recommended if have good TS knowledge)
  // ...tseslint.configs.strictTypeChecked, // disable recommended above if you enable this
  ...tseslint.configs.stylisticTypeChecked,

  ...pluginVue.configs['flat/recommended'],

  {
    name: 'eslint-config-prettier',
    ...configPrettier,
  },

  {
    name: 'ignored',

    ignores: [
      "**/dist",

      "playground/*/.quasar",
      "playground/*/quasar.config.*.temporary.compiled*",
      "playground/*/src-cordova",
      "playground/*/src-capacitor",
      "playground/*/src-ssr",
      "playground/*/postcss.config.cjs",

      "playground/quasar-cli-webpack/src-bex/www",
      "playground/quasar-cli-webpack/babel.config.cjs",
    ],
  },

  {
    name: 'general',

    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        projectService: true,
      },

      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,

        chrome: 'readonly',
        cordova: 'readonly',
        Capacitor: 'readonly',
      },
    },

    rules: {
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: false },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],

      'vue/no-unsupported-features': [
        'error',
        {
          version: vueVersion,
        },
      ],
      'vue/padding-line-between-blocks': 'warn',
      'vue/no-empty-component-block': 'warn',
      'vue/eqeqeq': 'error',
      'vue/custom-event-name-casing': 'warn',
      'vue/no-unused-properties': ['warn', { groups: ['props', 'setup'] }],
      'vue/v-for-delimiter-style': 'warn',
      'vue/require-macro-variable-name': 'warn',
      'vue/prefer-separate-static-class': 'warn',

      curly: 'error',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
  },

  {
    // Layout/page components are not used as components in templates, so they don't need to be multi-word
    name: 'playground/vue-layout-and-page',
    files: [
      'playground/*/src/layouts/**/*.vue',
      'playground/*/src/pages/**/*.vue',
    ],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
);
