---
title: Stylus Variables
components:
  - style/StylusVariables
---

There are Stylus variables built into Quasar that you can change and/or use within devland should you wish to. This applies to apps built with Quasar CLI or Vue CLI only. It does NOT apply to UMD.

## Usage
In your app's `*.vue` files you can use any Quasar Stylus variables (examples: `$primary`, `$red-1`), and any other Stylus variables that you declared in your `/src/css/quasar.variables.styl` (when using Quasar CLI) and `src/styles/quasar.variables.styl` (when using Vue CLI).

```html
<!-- Notice lang="stylus" -->
<style lang="stylus">
div
  color $red-1
  background-color $grey-5
</style>
```

::: warning
If using Vue CLI, then you need to also add: `@import '~quasar-variables'` before using any Stylus variables.
:::

## Customizing
Depending on whether you are using Quasar CLI or Vue CLI, you will notice that your project folder has `src/css/quasar.variables.styl` (Quasar CLI) or `src/styles/quasar.variables.styl` (Vue CLI).

You can freely override any of Quasar's variables (see next section) in those files. For convenience, these files initially contain only the brand color-related variables.

As opposed to v0.x, Quasar is now very easy to customize without the need of tampering with the Stylus variables, so make sure that you really need to do that.

## Variables list

<stylus-variables></stylus-variables>
