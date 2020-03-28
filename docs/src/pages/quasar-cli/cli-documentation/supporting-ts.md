---
title: Supporting TypeScript
badge: "@quasar/app v1.6+"
desc: How to enable support for TypeScript in a Quasar app.
related:
  - /quasar-cli/quasar-conf-js
---

The Typescript support is not added by default to your project, but it can be easily integrated by following the guide on this page.

::: warning Attention developers on Windows
It is strongly recommended to use Yarn instead of NPM when developing on a Windows machine, to avoid many problems.
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
        // `appendTsSuffixTo: [/\.vue$/]` and `transpileOnly: true` are added by default and cannot be overriden
        ...
      },
      tsCheckerConfig: {
        // `vue: true` is added by default and cannot be overriden
        ...
      }
    },
    ....
  }
}
```

### Linting setup

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
