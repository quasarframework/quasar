---
title: Stylus Variables
components:
  - style/StylusVariables
---

There are Stylus variables built into Quasar that you can change and/or use within devland should you wish to. This applies to apps built with Quasar CLI or Vue CLI only.

## Usage
In your app's `*.vue` files you can use the colors as `$primary`, `$red-1`, and so on.

```html
<!-- Notice lang="stylus" -->
<style lang="stylus">
// "quasar-variables" is a Webpack alias injected by Quasar CLI
@import '~quasar-variables'

div
  color $red-1
  background-color $grey-5
</style>
```

## Customizing
Depending on whether you are using Quasar CLI or Vue CLI, you will notice that your project folder has `src/css/quasar.variables.styl` (Quasar CLI) or `src/styles/quasar.variables.styl` (Vue CLI).

You can freely override any of Quasar's variables (see next section) in those files. For convenience, these files initially contain only the brand color-related variables.

## Variables list

<stylus-variables></stylus-variables>
