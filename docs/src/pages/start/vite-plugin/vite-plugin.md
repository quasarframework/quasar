---
title: Vite plugin for Quasar
desc: How to embed Quasar into a Vite app.
components:
  - ./VitePluginUsage
---

If you want to embed Quasar into your existing [Vite](https://vitejs.dev) project then follow this guide to install and use the `@quasar/vite-plugin`.
What our Vite plugin offers out of the box is tree-shaking for Quasar and also Quasar Sass variables integration.

::: warning Warning! Limitation ahead:
* Are you sure that you've landed correctly? This page will teach you to use our Vite plugin, but it's not the same as our full-fledged [Quasar CLI with Vite](/quasar-cli-vite) under the hood.
* SSR builds with our Vite plugin are not supported (only through our Quasar CLI with Vite).
:::

> Cross-platform support with Vite is handled by community plugins. These are not tightly integrated with Quasar as with Quasar CLI and may have issues. This is why for the best developer experience we recommend to use [Quasar CLI with Vite](/quasar-cli-vite) instead.

## Creating a Vite project

``` bash
# yarn
$ yarn create vite my-vue-app --template vue

# or npm 6.x
npm init vite@latest my-vue-app --template vue

# npm 7+, extra double-dash is needed:
npm init vite@latest my-vue-app -- --template vue

# pnpm
pnpm create vite my-vue-app -- --template vue
```

For the official (and full) guide, please visit the [Vite guide for scaffolding](https://vitejs.dev/guide/#scaffolding-your-first-vite-project) a Vite project. **Select "Vue" when asked.**

## Installation

Navigate to your Vite project folder and install the necessary packages.

::: tip
* Notice that `@quasar/extras` is optional.
* Also, add `sass@1.32.12` (notice the pinned version) only if you want to use the Quasar Sass/SCSS variables.
:::

``` bash
$ yarn add quasar @quasar/extras
$ yarn add -D @quasar/vite-plugin sass@1.32.12

# or
$ npm install quasar @quasar/extras
$ npm install -D @quasar/vite-plugin sass@1.32.12

# or
$ pnpm add quasar @quasar/extras # experimental support
$ pnpm add -D @quasar/vite-plugin sass@1.32.12 # experimental support
```

## Using Quasar

We have built a configurator to help you get started as quick as possible:

<vite-plugin-usage />

## RTL support

For enabling, please check out our [RTL Support](/options/rtl-support) page and follow the instructions.

## Warning when building for production

When building for production, you may notice the warning below. You can safely ignore it. This is a known [Vite issue](https://github.com/vitejs/vite/issues/4625).

```
warnings when minifying css:
 > <stdin>:32:0: warning: "@charset" must be the first rule in the file
    32 │ @charset "UTF-8";
       ╵ ~~~~~~~~
   <stdin>:9:0: note: This rule cannot come before a "@charset" rule
     9 │ .material-icons {
```
