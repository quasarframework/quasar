---
title: Stylus Variables
components:
  - style/StylusVariables
---

There are Stylus variables built into Quasar that you can change and/or use within devland should you wish to. This applies to apps built with Quasar CLI or Vue CLI only. It does NOT apply to UMD.

## Usage
In your app's `*.vue` files or in the stylus files you can use any Quasar Stylus variables (examples: `$primary`, `$red-1`), and any other Stylus variables that you declared in your `/src/css/quasar.variables.styl` (when using Quasar CLI) and `src/styles/quasar.variables.styl` (when using Vue CLI).

```html
<!-- Notice lang="stylus" -->
<style lang="stylus">
div
  color $red-1
  background-color $grey-5
</style>
```

::: warning
**If using Vue CLI**, then you need to also add: `@import '~quasar-variables'` before using any Stylus variables.
:::

## Caveat

Quasar CLI detects if the file contains at least one '$' character, and if so, it automatically imports the Quasar stylus variables.

If, however, you have a nested importing statement and the file from which you are importing does not contain any '$' characters, this won't work. In this case, you need to add a simple comment (`// $`) so Quasar can detect at least one '$' character:

```html
<style lang="stylus">
// $

@import 'some-file'
// now some-file.styl can benefit
// from Quasar stylus variables too
// due to comment above
</style>
```

Same is required for stylus files that are included from quasar.conf.js > css, like the default `app.styl`.

## Customizing
Depending on whether you are using Quasar CLI or Vue CLI, you will notice that your project folder has `src/css/quasar.variables.styl` (Quasar CLI) or `src/styles/quasar.variables.styl` (Vue CLI).

You can freely override any of Quasar's variables (see next section) in those files. For convenience, these files initially contain only the brand color-related variables.

As opposed to v0.x, Quasar is now very easy to customize without the need of tampering with the Stylus variables, so make sure that you really need to do that.

## Variables list

<stylus-variables></stylus-variables>
