---
title: App Handling Assets
desc: (@quasar/app-vite) How to use regular app assets and static assets in a Quasar app.
---

You will notice in the project structure we have two directories for assets: `/public/` and `/src/assets/`. What is the difference between them? Some are static assets while the others are processed and embedded by the build system.

So let's try to answer the question above. We'll first talk about using regular assets then we'll see what the difference is for static assets.

## Regular assets - /src/assets

In `*.vue` components, all your templates and CSS are parsed by Vite to look for asset URLs. For example, in `<img src="./logo.png">` and `background: url(./logo.png)`, `"./logo.png"` is a relative asset path and will be resolved by Vite as a module dependency.

Since these assets may be inlined/copied/renamed during build, they are essentially part of your source code. This is why it is recommended to place Vite-processed assets inside `/src/assets`, along side other source files. In fact, you don't even have to put them all in `/src/assets`: you can organize them based on the module/component using them. For example, you can put each component in its own directory, with its static assets right next to it.

### Asset Resolving Rules

Relative URLs, e.g. `./assets/logo.png` will be interpreted as a module dependency. They will be replaced with an auto-generated URL based on your Vite output configuration.

URLs prefixed with `~` are treated as a module request, similar to `import 'some-module/image.png'`. You need to use this prefix if you want to leverage Vite's module resolving configurations. Quasar provides the `assets` alias out of the box, so it is recommended that you use it like this: `<img src="~@/assets/logo.png">`. Notice `~` in front of '@/assets'.

## Static Assets - /public

Files that must keep their exact name and path (a favicon, `robots.txt`, images whose URLs come from data) belong in `public/`. The content of the public folder is simply copied over to the distributable folder as-is, without any processing.

Reference them with a root-relative URL, e.g. `<img src="/logo.png">`. Such URLs are not processed at all: the browser resolves them from the domain root, so they match the public folder only while [build > publicPath](/quasar-cli-vite/quasar-config-file#build) is `/` (the default). When the app is deployed under a sub-path, prefix them with `import.meta.env.BASE_URL`, which Vite sets to your publicPath:

```html
<template>
  <img :src="base + 'logo.png'" />
</template>

<script setup>
  const base = import.meta.env.BASE_URL
</script>
```

::: warning
A bare relative URL such as `logo.png` (no leading slash) is not processed either. The browser resolves it against the current page URL, so it breaks as soon as a route has more than one segment (`/users/42` would request `/users/logo.png`). Always use a leading `/` or the `import.meta.env.BASE_URL` prefix for public assets.
:::

::: tip Assets vs Statics
Files in the "assets" folder are only included in your build if they have a literal reference in one of your Vue files.
Every file and folder from the "public" folder are copied into your production build as-is, no matter what.
:::

::: danger
When not building a SPA/PWA/SSR/SSG, then `/public/icons/*` and `/public/favicon.ico` will NOT be embedded into your app because they would not serve any purpose. For example, Electron or Cordova apps do not require those files.
:::

## More info with Vite

Please read Vite's guide [here](https://vitejs.dev/guide/assets.html).
