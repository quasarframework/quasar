---
title: Supporting TypeScript
badge: "@quasar/app v1.6+"
desc: How to enable support for TypeScript in a Quasar app.
related:
  - /quasar-cli/quasar-conf-js
---

The Typescript support is not added by default to your project (unless you selected TS when you created your project folder), but it can be easily integrated by following the guide on this page.

::: tip
The following steps are only required when you **have not** selected TypeScript support when creating a fresh Quasar project. If you selected the TS option on project creation, TypeScript support is already enabled.
:::

## Installation of TypeScript Support

In order to support TypeScript, you'll need to edit `/quasar.conf.js`:

```js
module.exports = function (ctx) {
  return {
    supportTS: true,
    ....
  }
}
```

Then create `/tsconfig.json` file at the root of you project with this content:

```json
{
  "extends": "@quasar/app/tsconfig-preset",
  "compilerOptions": {
    "baseUrl": "."
  }
}
```

Now you can start using TypeScript into your project.

::: tip
Remember that you must change the extension of your JavaScript files to `.ts` to be allowed to write TypeScript code inside them. To write TS code into your components, instead, change the script opening tag like so `<script lang="ts">`.
:::

::: warning
If you enable the `supportTS` flag but fail to add the `tsconfig.json` file, the application will break at compile time!
:::

## Handling TS Webpack loaders

Behind the curtains, Quasar uses `ts-loader` and `fork-ts-checker-webpack-plugin` (provided by `@quasar/app` package) to manage TS files. If you ever need to provide a custom configuration for these libs you can do so by making `supportTS` property like so:

```js
// quasar.conf.js
module.exports = function (ctx) {
  return {
    supportTS: {
      tsLoaderConfig: {
        // `appendTsSuffixTo: [/\.vue$/]` and `transpileOnly: true` are added by default and cannot be overridden
        ...
      },
      tsCheckerConfig: {
        // `vue: true` is added by default and cannot be overridden
        ...
      }
    },
    ....
  }
}
```

### Linting setup

First add needed dependencies:

```bash
$ yarn add --dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

Then update your ESLint configuration accordingly, like in the following example:

```js
// .eslintrc.js
const { resolve } = require('path');

module.exports = {
  // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
  // This option interrupts the configuration hierarchy at this file
  // Remove this if you have an higher level ESLint config file (it usually happens into a monorepos)
  root: true,

  // https://eslint.vuejs.org/user-guide/#how-to-use-custom-parser
  // Must use parserOptions instead of "parser" to allow vue-eslint-parser to keep working
  // `parser: 'vue-eslint-parser'` is already included with any 'plugin:vue/**' config and should be omitted
  parserOptions: {
    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser#configuration
    // https://github.com/TypeStrong/fork-ts-checker-webpack-plugin#eslint
    // Needed to make the parser take into account 'vue' files
    extraFileExtensions: ['.vue'],
    parser: '@typescript-eslint/parser',
    project: resolve(__dirname, './tsconfig.json'),
    tsconfigRootDir: __dirname,
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },

  // Rules order is important, please avoid shuffling them
  extends: [
    // Base ESLint recommended rules
    'eslint:recommended',

    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#usage
    // ESLint typescript rules
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    // consider disabling this class of rules if linting takes too long
    'plugin:@typescript-eslint/recommended-requiring-type-checking',

    // https://eslint.vuejs.org/rules/#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules
    'plugin:vue/essential',

    // --- ONLY WHEN USING PRETTIER ---
    // https://github.com/prettier/eslint-config-prettier#installation
    // usage with Prettier, provided by 'eslint-config-prettier'.
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/vue',
  ],

  plugins: [
    // required to apply rules which need type information
    '@typescript-eslint',

    // https://eslint.vuejs.org/user-guide/#why-doesn-t-it-work-on-vue-file
    // required to lint *.vue files
    'vue',
  ],

  // add your custom rules here
  rules: {
    // others rules...

    // TypeScript
    'quotes': ['warn', 'single'],
    '@typescript-eslint/explicit-function-return-type': 'off',
  }
}
```

If anything goes wrong, read the [typescript-eslint guide](https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md), on which this example is based.

As a last step, update your `yarn lint` command to also lint `.ts` files.

::: tip
TypeScript Linting is really slow due to type-checking overhead, we suggest you to disable Webpack lint extension into `quasar.conf.js` for dev builds.
:::

If you setup TypeScript linting and want `fork-ts-checker-webpack-plugin` (provided by `@quasar/app` package) to take it into account then you should make use of `tsCheckerConfig` property:

```js
// quasar.conf.js
module.exports = function (ctx) {
  return {
    supportTS: {
      tsCheckerConfig: {
        eslint: true
      }
    },
    ....
  }
}
```
