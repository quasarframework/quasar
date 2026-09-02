---
title: Vite plugin for Quasar
desc: How to embed Quasar into a Vite app.
---

If you want to embed Quasar into your existing [Vite](https://vitejs.dev) project then follow this guide to install and use the `@quasar/vite-plugin`.
What our Vite plugin offers out of the box is tree-shaking for Quasar and also Quasar Sass variables integration.

::: tip Requirements for @quasar/vite-plugin v2

- Vite 8+, `@vitejs/plugin-vue` 6+, Quasar v2.24+ and Node 20.19+.
- The package is ESM-only.
- If you are on older versions of the above, use `@quasar/vite-plugin` v1.x instead.

:::

::: warning Warning! Limitation ahead:

- Are you sure that you've landed correctly? This page will teach you to use our Vite plugin, but it's not the same as our full-fledged [Quasar CLI with Vite](/start/quasar-cli#installation-project-scaffolding) under the hood.
- SSR/SSG builds with our Vite plugin are not supported (only through our Quasar CLI with Vite).

:::

> Cross-platform support with Vite is handled by community plugins. These are not tightly integrated with Quasar as with Quasar CLI and may have issues. This is why for the best developer experience we recommend using [Quasar CLI with Vite](/start/quasar-cli#installation-project-scaffolding) instead.

## Creating a Vite project

```tabs
<<| bash PNPM |>>
pnpm create vite my-vue-app -- --template vue
<<| bash Yarn |>>
yarn create vite my-vue-app --template vue
<<| bash NPM |>>
npm init vite my-vue-app -- --template vue
<<| bash Bun |>>
bun create vite my-vue-app
# then select "Vue"
```

For the official (and full) guide, please visit the [Vite guide for scaffolding](https://vitejs.dev/guide/#scaffolding-your-first-vite-project) a Vite project. **Select "Vue" when asked.**

## Installation

Navigate to your Vite project folder and install the necessary packages.

::: tip

- Notice that `@quasar/extras` is optional.
- Also, if you want to use the Quasar Sass/SCSS variables then you need to add the Sass dependency, based on your version of Quasar UI:
  - For Quasar >= v2.14 then add `sass-embedded@^1.93.2`
  - For Quasar <= v2.13 add `sass@1.32.12` (**_notice the exact pinned version_**)

:::

```tabs
<<| bash PNPM |>>
pnpm add quasar@latest @quasar/extras@latest
pnpm add -D @quasar/vite-plugin@latest sass-embedded@^1.93.2
<<| bash Yarn |>>
yarn add quasar@latest @quasar/extras@latest
yarn add -D @quasar/vite-plugin@latest sass-embedded@^1.93.2
<<| bash NPM |>>
npm install quasar@latest @quasar/extras@latest
npm install -D @quasar/vite-plugin@latest sass-embedded@^1.93.2
<<| bash Bun |>>
bun add quasar@latest @quasar/extras@latest
bun add -D @quasar/vite-plugin@latest sass-embedded@^1.93.2
```

## Using Quasar

We have built a configurator to help you get started as quickly as possible:

<script doc>
import VitePluginUsage from './VitePluginUsage.vue'
</script>

<VitePluginUsage />

## @quasar/vite-plugin options

The full list of options can be found [here](https://github.com/quasarframework/quasar/blob/dev/vite-plugin/index.d.ts).

## Testing with Vitest

Node resolves the `quasar` package through its `node` export condition, which points to the SSR server build. Vitest does the same, so a test setup that does not go through our Vite plugin loads that build and Quasar refuses to install (`The SSR server build was installed without an ssrContext`).

Keep `quasar()` from `@quasar/vite-plugin` in the Vite config that Vitest uses. While serving (Vitest counts as serving) the plugin aliases `quasar` to the client build. If your tests have their own `vitest.config.js`, add the plugin there as well:

```js
// vitest.config.js
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

export default defineConfig({
  plugins: [vue({ template: { transformAssetUrls } }), quasar()],
  test: {
    environment: 'jsdom'
  }
})
```

Then install Quasar into `@vue/test-utils` so every `mount()` gets the `$q` object:

```js
import { config, mount } from '@vue/test-utils'
import { Quasar } from 'quasar'

config.global.plugins.unshift([Quasar, {/* Quasar plugin options */}])
```

::: tip
Quasar CLI projects should use the official [@quasar/testing-unit-vitest](/quasar-cli-vite/testing-and-auditing) App Extension instead, which wires all of this up.
:::

## RTL support

For enabling, please check out our [RTL Support](/options/rtl-support) page and follow the instructions.
