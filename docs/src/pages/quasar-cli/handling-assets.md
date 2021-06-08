---
title: App Handling Assets
desc: How to use regular app assets and static assets in a Quasar app.
---
You will notice in the project structure we have two directories for assets: `/public/` and `/src/assets/`. What is the difference between them? Some are static assets while the others are processed and embedded by the build system.

So let's try to answer the question above. We'll first talk about using regular assets then we'll see what the difference is for static assets.

## Regular assets - /src/assets
In `*.vue` components, all your templates and CSS are parsed by `vue-html-loader` and `css-loader` to look for asset URLs. For example, in `<img src="./logo.png">` and `background: url(./logo.png)`, `"./logo.png"` is a relative asset path and will be resolved by Webpack as a module dependency.

Because `logo.png` is not JavaScript, when treated as a module dependency, we need to use `url-loader` and `file-loader` to process it. Quasar CLI has already configured these webpack loaders for you, so you basically get features such as filename fingerprinting and conditional base64 inlining for free, while being able to use relative/module paths without worrying about deployment.

Since these assets may be inlined/copied/renamed during build, they are essentially part of your source code. This is why it is recommended to place Webpack-processed assets inside `/src/assets`, along side other source files. In fact, you don't even have to put them all in `/src/assets`: you can organize them based on the module/component using them. For example, you can put each component in its own directory, with its static assets right next to it.

### Asset Resolving Rules

Relative URLs, e.g. `./assets/logo.png` will be interpreted as a module dependency. They will be replaced with an auto-generated URL based on your Webpack output configuration.

URLs prefixed with `~` are treated as a module request, similar to `require('some-module/image.png')`. You need to use this prefix if you want to leverage Webpack's module resolving configurations. Quasar provides `assets` Webpack alias out of the box, so it is recommended that you use it like this: `<img src="~assets/logo.png">`. Notice `~` in front of 'assets'.

## Static Assets - /public
Root-relative URLs (e.g. `/logo.png` -- where '/' is your publicPath) or `logo.png` are not processed at all. This should be placed in `public/`. These won't be processed by Webpack at all. The statics folder is simply copied over to the distributable folder as-is.

Quasar has some smart algorithms behind the curtains which ensure that no matter what you build (SPA, PWA, Cordova, Electron), your statics are correctly referenced *if and only if* they do not use a relative path.

```html
<!-- Good! -->
<img src="logo.png">

<!--
  BAD! Works until you change vue router
  mode (hash/history) or your public path.
  Don't!
-->
<img src="/logo.png">
```

::: tip Assets vs Statics
Files in the "assets" folder are only included in your build if they have a literal reference in one of your Vue files.
Every file and folder from the "public" folder are copied into your production build as-is, no matter what.
:::

::: danger
When not building a SPA/PWA/SSR, then `/public/icons/*` and `/public/favicon.ico` will NOT be embedded into your app because they would not serve any purpose. For example, Electron or Cordova apps do not require those files.
:::

## Vue Binding Requires Statics Only
Please note that whenever you bind "src" to a variable in your Vue scope, it must be one from the statics folder. The reason is simple: the URL is dynamic, so Webpack (which packs up assets at compile time) doesn't know which file you'll be referencing at runtime, so it won't process the URL.

```html
<template>
  <!-- imageSrc MUST reference a file from /public -->
  <img :src="imageSrc">
</template>

<script>
export default {
  setup () {
    return {
      /*
        Referencing /public.
        Notice string doesn't start with a slash. (/)
      */
      imageSrc: 'logo.png'
    }
  }
}
</script>
```

You can force serving static assets by binding `src` to a value with Vue. Instead of `src="path/to/image"` use `:src=" 'path/to/image' "` or `:src="imageSrc"`. Please note the usage of single quotes within double quotes on the second code example (spaces have been added to see this visually on the documentation website - normally you would not have the spaces).

## Getting Asset Paths in JavaScript

In order for Webpack to return the correct asset paths, you need to use `require('./relative/path/to/file.jpg')`, which will get processed by `file-loader` and returns the resolved URL. For example:

```js
computed: {
  background () {
    return require('./bgs/' + this.id + '.jpg')
  }
}
```

Note the above example will include every image under `./bgs/` in the final build. This is because Webpack cannot guess which of them will be used at runtime, so it includes them all.
