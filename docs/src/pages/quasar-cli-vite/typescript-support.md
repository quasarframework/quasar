---
title: TypeScript Support
desc: (@quasar/app-vite) How to enable support for TypeScript in a Quasar app.
related:
  - /quasar-cli-vite/quasar-config-file
  - /quasar-cli-vite/lint-and-format-code
---

If you didn't select TypeScript support when creating your project, you can still add it later. This guide will show you how to add TypeScript support to your existing JavaScript-based Quasar project.

## Installation of TypeScript Support

```tabs
<<| bash PNPM |>>
pnpm add -D typescript
<<| bash Yarn |>>
yarn add -D typescript
<<| bash NPM |>>
npm install -D typescript
<<| bash Bun |>>
bun add -D typescript
```

Then, create `/tsconfig.json` file at the root of you project with this content:

```json /tsconfig.json
{
  "extends": "./.quasar/tsconfig.json"
}
```

Run `quasar prepare` in the root of your project folder.

Now you can start using TypeScript into your project. Note that some IDEs might require a restart for the new setup to fully kick in.

::: tip
Remember that you must change the extension of your JavaScript files to `.ts` to be allowed to write TypeScript code inside them. To use TypeScript in Vue files, you must update the script tag to include the `lang="ts"` attribute, like `<script lang="ts">` or `<script setup lang="ts">`
:::

::: warning
If you forget to add the `tsconfig.json` file, the application will break at compile time!
:::

## Linting setup

You might want to check the requirements for it [here](/quasar-cli-vite/lint-and-format-code).

## TypeScript Declaration Files

If you chose TypeScript support when scaffolding the project, the following declaration file was automatically scaffolded for you. If TypeScript support wasn't enabled during project creation, create it:

```ts /env.d.ts
/**
 * Add types (that are not auto-magically added by Quasar CLI already)
 * for your custom variables to avoid TypeScript errors, like dynamic
 * process.env variables or definitions in dotenv files configured ONLY
 * for the /quasar.config file itself.
 *
 * @example
 * interface ImportMetaEnv {
 *   readonly MY_VAR: string;
 *   readonly MY_OTHER_VAR: string;
 * }
 */
interface ImportMetaEnv {}
```

See the following sections for the features and build modes you are using.

### Pinia

If you are using Pinia, Quasar CLI augments the `router` property inside `.quasar/pinia.d.ts` automatically. So, don't manually add the "router" property from the PiniaCustomProperties interface in the /src/stores/index.ts file.

```ts /src/stores/index.ts
import { defineStore } from '#q-app'
import { createPinia } from 'pinia'
import { type Router } from 'vue-router' // [!code --]

/*
 * When adding new properties to stores, you should also
 * extend the `PiniaCustomProperties` interface.
 * @see https://pinia.vuejs.org/core-concepts/plugins.html#Typing-new-store-properties
 */
declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router // [!code --]
    // add your custom properties here, if any
  }
}
```

### Quasar modes

Please refer to:

- [PWA with TypeScript](/quasar-cli-vite/developing-pwa/pwa-with-typescript) page.
- [Electron with TypeScript](/quasar-cli-vite/developing-electron-apps/electron-with-typescript) page.
- [BEX with TypeScript](/quasar-cli-vite/developing-browser-extensions/bex-with-typescript) page.
- [SSR with TypeScript](/quasar-cli-vite/developing-ssr/ssr-with-typescript) page.
- [SSG with TypeScript](/quasar-cli-vite/developing-ssg/ssg-with-typescript) page.

## Configuring TypeScript

### tsconfig.json

Notice the `/tsconfig.json` file in your project folder. This file is used by the Quasar CLI to detect if you want TypeScript support or not. Its content should look like this:

```json /tsconfig.json (How it should look like)
{
  "extends": "./.quasar/tsconfig.json"
}
```

For reviewing purposes, here is an example of the generated tsconfig (non strict) that your `/tsconfig.json` is extending:

```json Example /.quasar/tsconfig.json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "skipLibCheck": true,
    "target": "esnext",
    "allowJs": true,
    "resolveJsonModule": true,
    "moduleDetection": "force",
    "moduleResolution": "bundler",
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

Properly running typechecking and linting requires the `.quasar/tsconfig.json` to be present. The file will be auto-generated when running "quasar dev" or "quasar build" commands. But, as a lightweight alternative, there is the CLI command "quasar prepare" that will generate the .quasar/tsconfig.json file and some types files. It is especially useful for CI/CD pipelines.

```bash
quasar prepare
```

You can add it as a `postinstall` script to make sure it's run after installing the dependencies. This would be helpful when someone is pulling the project for the first time.

```json /package.json
{
  "scripts": {
    "postinstall": "quasar prepare --silent"
  }
}
```

Another benefit of this is that folder aliases (quasar.config file > build > alias) are automatically recognized by TypeScript. So, you can remove tsconfig.json > compilerOptions > paths. If you are using a plugin like `vite-tsconfig-paths`, you can uninstall it and use quasar.config file > build > alias as the source of truth.

If you are using ESLint, we recommend enabling `@typescript-eslint/consistent-type-imports` rules in your ESLint configuration. If you don't have linting set up, we recommend using `verbatimModuleSyntax` in your tsconfig.json file as an alternative (_unlike ESLint rules, it's not auto-fixable_). These changes will help you unify your imports regarding regular and type-only imports. Please read [typescript-eslint Blog - Consistent Type Imports and Exports: Why and How](https://typescript-eslint.io/blog/consistent-type-imports-and-exports-why-and-how) for more information about this and how to set it up. Here is an example:

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

```js /quasar.config.ts
build: {
  typescript: {
    /** recommended; enables strict settings for TypeScript */
    strict: true,
    /**
     * Required when using ESLint with type-checked rules,
     * will generate a shim file for `*.vue` files
     */
    vueShim: true,
    /**
     * Extend the generated `.quasar/tsconfig.json` file.
     *
     * If you don't have dynamic logic, you can directly modify your `tsconfig.json` file instead.
     *
     * NOT async! Can directly modify the "tsConfig" parameter or
     * return a new one that will be merged with the default one.
     */
    extendTsConfig (tsConfig) {
      // You can use this hook to extend tsConfig dynamically
      // For basic use cases, you can still update
      // the usual tsconfig.json file to override some settings
    },
  }
}
```

Should you want, you should be able to set the `strict` option to `true` without facing much trouble. But, if you face any issues, you can either update your code to satisfy the stricter rules or set the "problematic" options to `false` in your `tsconfig.json` file, at least until you can fix them.

If you are using ESLint with type-check rules, enable the `vueShim` option to preserve the previous behavior with the shim file. If your project is working fine without that option, you don't need to enable it.

```js /quasar.config.ts
build: {
  typescript: {
    /**
     * Required when using ESLint with type-checked rules,
     * will generate a shim file for `*.vue` files
     */
    vueShim: true // [!code highlight]
  }
}
```
