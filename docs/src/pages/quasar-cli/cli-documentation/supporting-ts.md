---
title: Supporting TypeScript
desc: How to enable support for TypeScript in a Quasar app.
related:
  - /quasar-cli/quasar-conf-js
---

If you are building a medium/large web-app, you might want to use TypeScript and its features. This support is not added by default to your project, but it can be easily integrated.

::: danger Attention Windows Developer
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

Now you can start using TypeScript into your project!

::: tip
Remember that you must change the extension of your JavaScript files to `.ts` to be allowed to write TypeScript code inside them. To write TS code into your components, instead, change the script opening tag like so `<script lang="ts">`.
:::

::: warning
If you enable the `supportTS` flag but fail to add the `tsconfig.json` file, the application will break at compile time!  
:::

## Provide a custom configuration for TypeScript webpack loaders

Behind the curtains, Quasar uses `ts-loader` and `fork-ts-checker-webpack-plugin` to manage TS files. If you ever need to provide a custom configuration for these piaces of software, you can do so providing an object to `supportTS` property like so:

```js
module.exports = function (ctx) {
  return {
    supportTS: {
      enable: true,
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

If you setup TypeScript linting and want `fork-ts-checker-webpack-plugin` to take it into account, you should provide use `tsCheckerConfig` accordingly:

```js
module.exports = function (ctx) {
  return {
    supportTS: {
      enable: true,
      tsCheckerConfig: {
        eslint: true
      }
    },
    ....
  }
}
```
