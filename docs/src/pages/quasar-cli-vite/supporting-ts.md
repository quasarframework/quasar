---
title: Supporting TypeScript
desc: (@quasar/app-vite) How to enable support for TypeScript in a Quasar app.
related:
  - /quasar-cli-vite/quasar-config-file
---

The Typescript support is not added by default to your project (unless you selected TS when you created your project folder), but it can be easily integrated by following the guide on this page.

::: tip
The following steps are only required when you **have not** selected TypeScript support when creating a fresh Quasar project. If you selected the TS option on project creation, TypeScript support is already enabled.
:::

## Installation of TypeScript Support

Create `/tsconfig.json` file at the root of you project with this content:

```json
{
  "extends": "@quasar/app-vite/tsconfig-preset",
  "compilerOptions": {
    "baseUrl": "."
  }
}
```

Then install the `typescript` package:

```tabs
<<| bash Yarn |>>
$ yarn add --dev typescript
<<| bash NPM |>>
$ npm install --save-dev typescript
<<| bash PNPM |>>
$ pnpm add -D typescript
<<| bash Bun |>>
$ bun add --dev typescript
```

Now you can start using TypeScript into your project. Note that some IDEs might require a restart for the new setup to fully kick in.

::: tip
Remember that you must change the extension of your JavaScript files to `.ts` to be allowed to write TypeScript code inside them. To write TS code into your components, instead, change the script opening tag like so `<script lang="ts">`.
:::

::: warning
If you fail to add the `tsconfig.json` file, the application will break at compile time!
:::

### Linting setup

::: tip
TypeScript Linting is really slow due to type-checking overhead, we suggest you to disable it in `/quasar.config` file for dev builds.
:::

First add the needed dependencies:

```tabs
<<| bash Yarn |>>
$ yarn add --dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
# you might also want to install the `eslint-plugin-vue` package.
<<| bash NPM |>>
$ npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
# you might also want to install the `eslint-plugin-vue` package.
<<| bash PNPM |>>
$ pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
# you might also want to install the `eslint-plugin-vue` package.
<<| bash Bun |>>
$ bun add --dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
# you might also want to install the `eslint-plugin-vue` package.
```

Then update your ESLint configuration accordingly, like in the following example:

```js /.eslintrc.cjs
const { resolve } = require('node:path');

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
    ecmaVersion: 2021, // Allows for the parsing of modern ECMAScript features
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
    // this rule, if on, would require explicit return type on the `render` function
    '@typescript-eslint/explicit-function-return-type': 'off',
    // in plain CommonJS modules, you can't use `import foo = require('foo')` to pass this rule, so it has to be disabled
    '@typescript-eslint/no-var-requires': 'off',
  }
}
```

If anything goes wrong, read the [typescript-eslint guide](https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md), on which this example is based.

As a last step, update your `yarn lint` command to also lint `.ts` files.

Finally, edit your `/quasar.config` file:

```js /quasar.config file
eslint: {
  // fix: true,
  // include: [],
  // exclude: [],
  // rawOptions: {},
  warnings: true,
  errors: true
},
```

### TypeScript Declaration Files

If you chose TypeScript support through the create-quasar CLI, these declaration files were automatically scaffolded for you. If TypeScript support wasn't enabled during project creation, you'll need to manually add the following files to your `/src` directory:

```ts /src/shims-vue.d.ts file
/* eslint-disable */

/// <reference types="vite/client" />

// Mocks all files ending in `.vue` showing them as plain Vue instances
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
```

```ts /src/quasar.d.ts file
/* eslint-disable */

// Forces TS to apply `@quasar/app-vite` augmentations of `quasar` package
// Removing this would break `quasar/wrappers` imports as those typings are declared
//  into `@quasar/app-vite`
// As a side effect, since `@quasar/app-vite` reference `quasar` to augment it,
//  this declaration also apply `quasar` own
//  augmentations (eg. adds `$q` into Vue component context)
/// <reference types="@quasar/app-vite" />
```

```ts /src/env.d.ts file
/* eslint-disable */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}
```

#### Bex mode

If your project is in [Bex mode](/quasar-cli-vite/developing-browser-extensions/introduction), you should include the interface below in your `src-bex/background.ts` file:

```ts /src-bex/background.ts file
declare module '@quasar/app-vite' {
  interface BexEventMap {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    log: [{ message: string; data?: any[] }, never];
    getTime: [never, number];

    'storage.get': [{ key: string | null }, any];
    'storage.set': [{ key: string; value: any }, any];
    'storage.remove': [{ key: string }, any];
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }
}
```
