---
title: Linter
desc: (@quasar/app-vite) How to configure a code linter in a Quasar app.
---

Having a code linter (like [ESLint v9+](https://eslint.org/)) in place is highly recommended and ensures your code looks legible. It also helps you capture some errors before even running the code.

When you scaffold a Quasar project folder it will ask you if you want ESLint (also prettier as a code formatter).

## Javascript projects

### Needed dependencies

```tabs
<<| bash Yarn |>>
$ yarn add --dev @eslint/js eslint@9 eslint-plugin-vue vue-eslint-parser globals vite-plugin-checker
<<| bash NPM |>>
$ npm install --save-dev @eslint/js eslint@9 eslint-plugin-vue vue-eslint-parser globals vite-plugin-checker
<<| bash PNPM |>>
$ pnpm add -D @eslint/js eslint@9 eslint-plugin-vue vue-eslint-parser globals vite-plugin-checker
<<| bash Bun |>>
$ bun add --dev @eslint/js eslint@9 eslint-plugin-vue vue-eslint-parser globals vite-plugin-checker
```

If you want `prettier` as a code formatter, then install these too:

```tabs
<<| bash Yarn |>>
$ yarn add --dev prettier@3 @vue/eslint-config-prettier
<<| bash NPM |>>
$ npm install --save-dev prettier@3 @vue/eslint-config-prettier
<<| bash PNPM |>>
$ pnpm add -D prettier@3 @vue/eslint-config-prettier
<<| bash Bun |>>
$ bun add --dev prettier@3 @vue/eslint-config-prettier
```

### The quasar.config file settings

```diff [highlight=3-8] /quasar.config file
build: {
  vitePlugins: [
    ['vite-plugin-checker', {
      eslint: {
        lintCommand: 'eslint -c ./eslint.config.js "./src*/**/*.{js,mjs,cjs,vue}"',
        useFlatConfig: true
      }
    }, { server: false }]
  ]
}
```

### The ESLint configuration

```js /eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import pluginQuasar from '@quasar/app-vite/eslint'

// the following is optional, if you want prettier too:
import prettierSkipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    /**
     * Ignore the following files.
     * Please note that pluginQuasar.configs.recommended() already ignores
     * the "node_modules" folder for you (and all other Quasar project
     * relevant folders and files).
     *
     * ESLint requires "ignores" key to be the only one in this object
     */
    // ignores: []
  },

  ...pluginQuasar.configs.recommended(),
  js.configs.recommended,

  /**
   * https://eslint.vuejs.org
   *
   * pluginVue.configs.base
   *   -> Settings and rules to enable correct ESLint parsing.
   * pluginVue.configs[ 'flat/essential']
   *   -> base, plus rules to prevent errors or unintended behavior.
   * pluginVue.configs["flat/strongly-recommended"]
   *   -> Above, plus rules to considerably improve code readability and/or dev experience.
   * pluginVue.configs["flat/recommended"]
   *   -> Above, plus rules to enforce subjective community defaults to ensure consistency.
   */
  ...pluginVue.configs['flat/essential'],

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      globals: {
        ...globals.browser,
        ...globals.node, // SSR, Electron, config files
        process: 'readonly', // process.env.*
        ga: 'readonly', // Google Analytics
        cordova: 'readonly',
        Capacitor: 'readonly',
        chrome: 'readonly', // BEX related
        browser: 'readonly' // BEX related
      }
    },

    // add your custom rules here
    rules: {
      'prefer-promise-reject-errors': 'off',

      // allow debugger during development only
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
  },

  {
    files: ['src-pwa/custom-service-worker.js'],
    languageOptions: {
      globals: {
        ...globals.serviceworker
      }
    }
  },

  prettierSkipFormatting // optional, if you want prettier
]
```

## TypeScript projects

### Dependencies

```tabs
<<| bash Yarn |>>
$ yarn add --dev vue-tsc @vue/eslint-config-typescript @eslint/js eslint@9 eslint-plugin-vue globals vite-plugin-checker
<<| bash NPM |>>
$ npm install --save-dev vue-tsc @vue/eslint-config-typescript @eslint/js eslint@9 eslint-plugin-vue globals vite-plugin-checker
<<| bash PNPM |>>
$ pnpm add -D vue-tsc @vue/eslint-config-typescript @eslint/js eslint@9 eslint-plugin-vue globals vite-plugin-checker
<<| bash Bun |>>
$ bun add --dev vue-tsc @vue/eslint-config-typescript @eslint/js eslint@9 eslint-plugin-vue globals vite-plugin-checker
```

If you want `prettier` as a code formatter, then install these too:

```tabs
<<| bash Yarn |>>
$ yarn add --dev prettier@3 @vue/eslint-config-prettier
<<| bash NPM |>>
$ npm install --save-dev prettier@3 @vue/eslint-config-prettier
<<| bash PNPM |>>
$ pnpm add -D prettier@3 @vue/eslint-config-prettier
<<| bash Bun |>>
$ bun add --dev prettier@3 @vue/eslint-config-prettier
```

### The quasar.config settings

```diff [highlight=3-9] /quasar.config file
build: {
  vitePlugins: [
    ['vite-plugin-checker', {
      vueTsc: true,
      eslint: {
        lintCommand: 'eslint -c ./eslint.config.js "./src*/**/*.{ts,js,mjs,cjs,vue}"',
        useFlatConfig: true
      }
    }, { server: false }]
  ]
}
```

### ESLint configuration file

```js /eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import pluginQuasar from '@quasar/app-vite/eslint'
import {
  defineConfigWithVueTs,
  vueTsConfigs
} from '@vue/eslint-config-typescript'

// the following is optional, if you want prettier too:
import prettierSkipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfigWithVueTs(
  {
    /**
     * Ignore the following files.
     * Please note that pluginQuasar.configs.recommended() already ignores
     * the "node_modules" folder for you (and all other Quasar project
     * relevant folders and files).
     *
     * ESLint requires "ignores" key to be the only one in this object
     */
    // ignores: []
  },

  pluginQuasar.configs.recommended(),
  js.configs.recommended,

  /**
   * https://eslint.vuejs.org
   *
   * pluginVue.configs.base
   *   -> Settings and rules to enable correct ESLint parsing.
   * pluginVue.configs[ 'flat/essential']
   *   -> base, plus rules to prevent errors or unintended behavior.
   * pluginVue.configs["flat/strongly-recommended"]
   *   -> Above, plus rules to considerably improve code readability and/or dev experience.
   * pluginVue.configs["flat/recommended"]
   *   -> Above, plus rules to enforce subjective community defaults to ensure consistency.
   */
  pluginVue.configs['flat/essential'],

  {
    files: ['**/*.ts', '**/*.vue'],
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' }
      ]
    }
  },
  vueTsConfigs.recommendedTypeChecked,

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      globals: {
        ...globals.browser,
        ...globals.node, // SSR, Electron, config files
        process: 'readonly', // process.env.*
        ga: 'readonly', // Google Analytics
        cordova: 'readonly',
        Capacitor: 'readonly',
        chrome: 'readonly', // BEX related
        browser: 'readonly' // BEX related
      }
    },

    // add your custom rules here
    rules: {
      'prefer-promise-reject-errors': 'off',

      // allow debugger during development only
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
  },

  {
    files: ['src-pwa/custom-service-worker.ts'],
    languageOptions: {
      globals: {
        ...globals.serviceworker
      }
    }
  },

  prettierSkipFormatting // optional, if you want prettier
)
```

## Performance and ignoring files

::: warning
Please be sure to ignore unused files to increase performance. If you lint unused files/folders the UX will degrade significantly.
:::

You can ignore files by editing your `/eslint.config.js` file:

```js /eslint.config.js
export default [
  {
    /**
     * Ignore the following files.
     * Please note that pluginQuasar.configs.recommended() already ignores
     * the "node_modules" folder for you (and all other Quasar project
     * relevant folders and files).
     *
     * ESLint requires "ignores" key to be the only one in this object
     */
    ignores: [] // <<<---- here!
  },
```

Notice that `pluginQuasar.configs.recommended()` from a few sections above will add the following to your ESLint `ignores` setting (no need to add them yourself too!):

```js
// not an exhaustive list auto-added to "ignores"
;[
  'dist/*',
  'src-capacitor/*',
  'src-cordova/*',
  '.quasar/*',
  'quasar.config.*.temporary.compiled*'
]
```

## Lint Rules

The linting rules can be removed, changed, or added. Notice some things:

- Some rules are standard ESLint ones. Example: 'brace-style'.
- Some rules are for eslint-plugin-vue. Example: 'vue/max-attributes-per-line'.

You can add/remove/change rules by first visiting [https://eslint.org/docs/rules/](https://eslint.org/docs/rules/) or [https://eslint.vuejs.org/rules](https://eslint.vuejs.org/rules).
