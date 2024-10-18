---
title: Vite plugin for Quasar
desc: How to embed Quasar into a Vite app.
---

If you want to embed Quasar into your existing [Vite](https://vitejs.dev) project then follow this guide to install and use the `@quasar/vite-plugin`.
What our Vite plugin offers out of the box is tree-shaking for Quasar and also Quasar Sass variables integration.

::: warning Warning! Limitation ahead:
* Are you sure that you've landed correctly? This page will teach you to use our Vite plugin, but it's not the same as our full-fledged [Quasar CLI with Vite](/start/quasar-cli#installation-project-scaffolding) under the hood.
* SSR builds with our Vite plugin are not supported (only through our Quasar CLI with Vite).
:::

> Cross-platform support with Vite is handled by community plugins. These are not tightly integrated with Quasar as with Quasar CLI and may have issues. This is why for the best developer experience we recommend using [Quasar CLI with Vite](/start/quasar-cli#installation-project-scaffolding) instead.

## Creating a Vite project

```tabs
<<| bash Yarn |>>
$ yarn create vite my-vue-app --template vue
<<| bash NPM |>>
$ npm init vite my-vue-app -- --template vue
<<| bash PNPM |>>
$ pnpm create vite my-vue-app -- --template vue
<<| bash Bun |>>
$ bun create vite my-vue-app
# then select "Vue"
```

For the official (and full) guide, please visit the [Vite guide for scaffolding](https://vitejs.dev/guide/#scaffolding-your-first-vite-project) a Vite project. **Select "Vue" when asked.**

## Installation

Navigate to your Vite project folder and install the necessary packages.

::: tip
* Notice that `@quasar/extras` is optional.
* Also, if you want to use the Quasar Sass/SCSS variables then you need to add the Sass dependency, based on your version of Quasar UI:
  * For Quasar >= v2.14 then add `sass-embedded@^1.80.2`
  * For Quasar <= v2.13 add `sass@1.32.12` (**_notice the exact pinned version_**)
:::

```tabs
<<| bash Yarn |>>
$ yarn add quasar @quasar/extras
$ yarn add --dev @quasar/vite-plugin sass-embedded@^1.80.2
<<| bash NPM |>>
$ npm install --save quasar @quasar/extras
$ npm install --save-dev @quasar/vite-plugin sass-embedded@^1.80.2
<<| bash PNPM |>>
$ pnpm add quasar @quasar/extras
$ pnpm add -D @quasar/vite-plugin sass-embedded@^1.80.2
<<| bash Bun |>>
$ bun add quasar @quasar/extras
$ bun add --dev @quasar/vite-plugin sass-embedded@^1.80.2
```

## Using Quasar

We have built a configurator to help you get started as quickly as possible:

<script doc>
import VitePluginUsage from './VitePluginUsage.vue'
</script>

<VitePluginUsage />

## @quasar/vite-plugin options

The full list of options can be found [here](https://github.com/quasarframework/quasar/blob/dev/vite-plugin/index.d.ts).

## RTL support

For enabling, please check out our [RTL Support](/options/rtl-support) page and follow the instructions.
