---
title: Supporting TypeScript
desc: (@quasar/app-vite) How to enable support for TypeScript in a Quasar app.
related:
  - /quasar-cli-vite/quasar-config-file
  - /quasar-cli-vite/linter
---

If you didn't select TypeScript support when creating your project, you can still add it later. This guide will show you how to add TypeScript support to your existing JavaScript-based Quasar project.

::: tip
If you selected TypeScript support when creating your project, you can skip this guide.
:::

## Installation of TypeScript Support

Install the `typescript` package:

```tabs
<<| bash Yarn |>>
$ yarn add --dev typescript@~5.5.3
<<| bash NPM |>>
$ npm install --save-dev typescript@~5.5.3
<<| bash PNPM |>>
$ pnpm add -D typescript@~5.5.3
<<| bash Bun |>>
$ bun add --dev typescript@~5.5.3
```

Then, create `/tsconfig.json` file at the root of you project with this content:

```json /tsconfig.json
{
  "extends": "./.quasar/tsconfig.json"
}
```

Run `$ quasar prepare` in the root of your project folder.

Now you can start using TypeScript into your project. Note that some IDEs might require a restart for the new setup to fully kick in.

::: tip
Remember that you must change the extension of your JavaScript files to `.ts` to be allowed to write TypeScript code inside them. To use TypeScript in Vue files, you must update the script tag to include the `lang="ts"` attribute, like `<script lang="ts">` or `<script setup lang="ts">`
:::

::: warning
If you forget to add the `tsconfig.json` file, the application will break at compile time!
:::

## Linting setup

You might want to check the requirements for it [here](/quasar-cli-vite/linter).

## TypeScript Declaration Files

If you chose TypeScript support when scaffolding the project, the following declaration file was automatically scaffolded for you. If TypeScript support wasn't enabled during project creation, create it:

```ts /src/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined
    VUE_ROUTER_BASE: string | undefined
    // Define any custom env variables you have here, if you wish
  }
}
```

See the following sections for the features and build modes you are using.

### Pinia

If you are using Pinia, Quasar CLI augments the `router` property inside `.quasar/pinia.d.ts` automatically. So, don't manually add the `router` property from the `PiniaCustomProperties` interface in the `src/stores/index.ts` file.

```diff /src/stores/index.ts
import { defineStore } from '#q-app/wrappers'
import { createPinia } from 'pinia'
- import { type Router } from 'vue-router';

/*
 * When adding new properties to stores, you should also
 * extend the `PiniaCustomProperties` interface.
 * @see https://pinia.vuejs.org/core-concepts/plugins.html#Typing-new-store-properties
 */
declare module 'pinia' {
  export interface PiniaCustomProperties {
-    readonly router: Router;
+    // add your custom properties here, if any
  }
}
```

### PWA mode

If you are using [PWA mode](/quasar-cli-vite/developing-pwa/introduction), make the following modifications to your project, and create any files that do not exist:

```ts /src-pwa/pwa-env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    SERVICE_WORKER_FILE: string
    PWA_FALLBACK_HTML: string
    PWA_SERVICE_WORKER_REGEX: string
  }
}
```

```ts /src-pwa/custom-service-worker.ts
// at the top of the file
declare const self: ServiceWorkerGlobalScope &
  typeof globalThis & { skipWaiting: () => void }
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

### Electron mode

If you are using [Electron mode](/quasar-cli-vite/developing-electron-apps/introduction), add the section below to your project.

```ts /src-electron/electron-env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    QUASAR_PUBLIC_FOLDER: string
    QUASAR_ELECTRON_PRELOAD_FOLDER: string
    QUASAR_ELECTRON_PRELOAD_EXTENSION: string
    APP_URL: string
  }
}
```

### BEX mode

If you are using [BEX mode](/quasar-cli-vite/developing-browser-extensions/introduction), add the section below to your project. You may need to adjust it to your needs depending on the events you are using. The key is the event name, the value is a tuple where the first element is the input and the second is the output type.

```ts /src-bex/background.ts
declare module '@quasar/app-vite' {
  interface BexEventMap {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    log: [{ message: string; data?: any[] }, never]
    getTime: [never, number]

    'storage.get': [{ key: string | null }, any]
    'storage.set': [{ key: string; value: any }, any]
    'storage.remove': [{ key: string }, any]
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }
}
```

You'll also need this in every content script file:

```ts /src-bex/my-content-script.ts
declare module '@quasar/app-vite' {
  interface BexEventMap {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    'some.event': [{ someProp: string }, void]
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }
}
```

## Configuring TypeScript

### tsconfig.json

Notice the `/tsconfig.json` file in your project folder. This file is used by the Quasar CLI to detect if you want TypeScript support or not. Its content should look like this:

```json /tsconfig.json
{
  "extends": "./.quasar/tsconfig.json"
}
```

For reviewing purposes, here is an example of the generated tsconfig (non strict) that your `/tsconfig.json` is extending:

```json /.quasar/tsconfig.json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "skipLibCheck": true,
    "target": "esnext",
    "allowJs": true,
    "resolveJsonModule": true,
    "moduleDetection": "force",
    "isolatedModules": true,
    "module": "preserve",
    "noEmit": true,
    "lib": [
      "esnext",
      "dom",
      "dom.iterable"
    ],
    "paths": { ... }
  },
  "exclude": [ ... ]
}
```

Properly running typechecking and linting requires the `.quasar/tsconfig.json` to be present. The file will be auto-generated when running `quasar dev` or `quasar build` commands. But, as a lightweight alternative, there is the CLI command `quasar prepare` that will generate the `.quasar/tsconfig.json` file and some types files. It is especially useful for CI/CD pipelines.

```bash
$ quasar prepare
```

You can add it as a `postinstall` script to make sure it's run after installing the dependencies. This would be helpful when someone is pulling the project for the first time.

```json /package.json
{
  "scripts": {
    "postinstall": "quasar prepare"
  }
}
```

Thanks to this setup, Capacitor dependencies are properly linked to the project's TypeScript configuration. That means you won't have to install dependencies twice, once in `/src-capacitor` and once in the root folder.

Another benefit of this change is that folder aliases (`quasar.config file > build > alias`) are automatically recognized by TypeScript. So, you can remove `tsconfig.json > compilerOptions > paths`. If you are using a plugin like `vite-tsconfig-paths`, you can uninstall it and use `quasar.config file > build > alias` as the source of truth.

If you are using ESLint, we recommend enabling `@typescript-eslint/consistent-type-imports` rules in your ESLint configuration. If you don't have linting set up, we recommend using `verbatimModuleSyntax` in your `tsconfig.json` file as an alternative (_unlike ESLint rules, it's not auto-fixable_). These changes will help you unify your imports regarding regular and type-only imports. Please read [typescript-eslint Blog - Consistent Type Imports and Exports: Why and How](https://typescript-eslint.io/blog/consistent-type-imports-and-exports-why-and-how) for more information about this and how to set it up. Here is an example:

```js /eslint.config.js
rules: {
  // ...
  '@typescript-eslint/consistent-type-imports': [
    'error',
    { prefer: 'type-imports' },
  ],
  // ...
}
```

### quasar.config.ts

You can use `quasar.config file > build > typescript` to control the TypeScript-related behavior. Add this section into your configuration:

```diff /quasar.config.ts
  build: {
+  typescript: {
+    strict: true, // (recommended) enables strict settings for TypeScript
+    vueShim: true, // required when using ESLint with type-checked rules, will generate a shim file for `*.vue` files
+    extendTsConfig (tsConfig) {
+      // You can use this hook to extend tsConfig dynamically
+      // For basic use cases, you can still update the usual tsconfig.json file to override some settings
+    },
+  }
}
```

Should you want, you should be able to set the `strict` option to `true` without facing much trouble. But, if you face any issues, you can either update your code to satisfy the stricter rules or set the "problematic" options to `false` in your `tsconfig.json` file, at least until you can fix them.

If you are using ESLint with type-check rules, enable the `vueShim` option to preserve the previous behavior with the shim file. If your project is working fine without that option, you don't need to enable it.

```diff /quasar.config.ts
build: {
  typescript: {
+    vueShim: true // required when using ESLint with type-checked rules, will generate a shim file for `*.vue` files
  }
}
```
