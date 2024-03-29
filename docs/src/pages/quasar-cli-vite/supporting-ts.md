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
  },
  "exclude": [
    "./dist",
    "./.quasar",
    "./node_modules",
    "./src-capacitor",
    "./src-cordova",
    "./quasar.config.*.temporary.compiled*"
  ]
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

If you chose TypeScript support when scaffolding the project, these declaration files were automatically scaffolded for you. If TypeScript support wasn't enabled during project creation, create the following files.

```ts /src/shims-vue.d.ts
/* eslint-disable */

/// <reference types="vite/client" />

// Mocks all files ending in `.vue` showing them as plain Vue instances
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
```

```ts /src/quasar.d.ts
/* eslint-disable */

// Forces TS to apply `@quasar/app-vite` augmentations of `quasar` package
// Removing this would break `quasar/wrappers` imports as those typings are declared
//  into `@quasar/app-vite`
// As a side effect, since `@quasar/app-vite` reference `quasar` to augment it,
//  this declaration also apply `quasar` own
//  augmentations (eg. adds `$q` into Vue component context)
/// <reference types="@quasar/app-vite" />
```

```ts /src/env.d.ts
/* eslint-disable */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
    // Define any custom env variables you have here, if you wish
  }
}
```

See the following sections depending on the features and build modes you are using.

#### Pinia

If you are using [Pinia](/quasar-cli-vite/state-management-with-pinia), add the section below to your project. Quasar CLI provides the `router` property, you may need to add more global properties if you have them.

```ts /src/stores/index.ts
import { Router } from 'vue-router';

/*
 * When adding new properties to stores, you should also
 * extend the `PiniaCustomProperties` interface.
 * @see https://pinia.vuejs.org/core-concepts/plugins.html#typing-new-store-properties
 */
declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router;
  }
}
```

#### Vuex

If you are using [Vuex](/quasar-cli-vite/state-management-with-vuex), add the section below to your project. Quasar CLI provides the `router` property, you may need to add more global properties if you have them. Adjust the state interface to suit your application.

```ts /src/store/index.ts
import { InjectionKey } from 'vue'
import { Router } from 'vue-router'
import {
  createStore,
  Store as VuexStore,
  useStore as vuexUseStore,
} from 'vuex'

export interface StateInterface {
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  example: unknown
}

// provide typings for `this.$store`
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: VuexStore<StateInterface>
  }
}

// Provide typings for `this.$router` inside Vuex stores
declare module "vuex" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface Store<S> {
    readonly $router: Router;
  }
}

// provide typings for `useStore` helper
export const storeKey: InjectionKey<VuexStore<StateInterface>> = Symbol('vuex-key')

export function useStore() {
  return vuexUseStore(storeKey)
}

// createStore<StateInterface>({ ... })
```

#### PWA mode

If you are using [PWA mode](/quasar-cli-vite/developing-pwa/introduction), make the following modifications to your project, and create any files that do not exist:

```ts /src-pwa/pwa-env.d.ts
/* eslint-disable */

declare namespace NodeJS {
  interface ProcessEnv {
    SERVICE_WORKER_FILE: string;
    PWA_FALLBACK_HTML: string;
    PWA_SERVICE_WORKER_REGEX: string;
  }
}
```

```ts /src-pwa/custom-service-worker.ts
// at the top of the file
declare const self: ServiceWorkerGlobalScope &
  typeof globalThis & { skipWaiting: () => void };
```

```json /src-pwa/tsconfig.json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "lib": ["WebWorker", "ESNext"]
  },
  "include": ["*.ts", "*.d.ts"]
}
```

```js /src-pwa/.eslintrc.cjs
const { resolve } = require('node:path');

module.exports = {
  parserOptions: {
    project: resolve(__dirname, './tsconfig.json'),
  },

  overrides: [
    {
      files: ['custom-service-worker.ts'],

      env: {
        serviceworker: true,
      },
    },
  ],
};
```

#### Electron mode

If you are using [Electron mode](/quasar-cli-vite/developing-electron-apps/introduction), add the section below to your project.

```ts /src-electron/electron-env.d.ts
/* eslint-disable */

declare namespace NodeJS {
  interface ProcessEnv {
    QUASAR_PUBLIC_FOLDER: string;
    QUASAR_ELECTRON_PRELOAD_FOLDER: string;
    QUASAR_ELECTRON_PRELOAD_EXTENSION: string;
    APP_URL: string;
  }
}
```

#### BEX mode

If you are using [BEX mode](/quasar-cli-vite/developing-browser-extensions/introduction), add the section below to your project. You may need to adjust it to your needs depending on the events you are using. The key is the event name, the value is a tuple where the first element is the input and the second is the output type.

```ts /src-bex/background.ts
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
