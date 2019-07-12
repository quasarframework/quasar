---
title: App Internationalization (I18n)
desc: How to use vue-i18n in a Quasar app.
related:
  - /options/rtl-support
  - /options/quasar-language-packs
---
Internationalization is a design process that ensures a product (a website or application) can be adapted to various languages and regions without requiring engineering changes to the source code. Think of internationalization as readiness for localization.

::: tip
The recommended package for handling website/app is [vue-i18n](https://github.com/kazupon/vue-i18n). This package should be added through a [Boot File](/quasar-cli/cli-documentation/boot-files). On the Boot File documentation page you can see a specific example for plugging in vue-i18n.
:::

## Setting up Translation Blocks in your SFCs
The following is an example recipe for using **vue-i18n** embedded `<i18n>` template components in your vue files with **vue-i18n-loader**, which you have to add in your `quasar.conf.js`. In this case the translations are stored in yaml format in the block.

```js
// quasar.conf.js
build: {
  // OR use the equivalent chainWebpack()
  // with its own chain statements (CLI v0.16.2+)
  extendWebpack (cfg) {
    cfg.module.rules.push({
      resourceQuery: /blockType=i18n/,
      use: [
        {loader: '@kazupon/vue-i18n-loader'},
        {loader: 'yaml-loader'}
      ]
    })
    ...
  }
}
```

## UPPERCASE
Many languages, such as Greek, German and Dutch have non-intuitive rules for uppercase display, and there is an edge case that you should be aware of:

QBtn component will use the CSS `text-transform: uppercase` rule to automatically turn its label into all-caps. According to the [MDN webdocs](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform), "The language is defined by the lang HTML attribute or the xml:lang XML attribute." Unfortunately, this has spotty implementation across browsers, and the 2017 ISO standard for the uppercase German eszett `ß` has not really entered the canon. At the moment you have two options:

1. use the prop `no-caps` in your label and write the string as it should appear
2. use the prop `no-caps` in your label and rewrite the string with [toLocaleUpperCase](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase) by using the locale as detected by `this.$q.lang.getLocale()`

## Detecting Locale
There's also a method to determine user locale which is supplied by Quasar out of the box:
```js
// outside of a Vue file

// for when you don't specify quasar.conf > framework: 'all'
import { Quasar } from 'quasar'
// OTHERWISE:
import Quasar from 'quasar'

Quasar.lang.getLocale() // returns a string

// inside of a Vue file
this.$q.lang.getLocale() // returns a string
```

::: warning
If you use Quasar's set method (`this.$q.lang.set()`), this will not be reflected by Quasar's getLocale above. The reason for this is that `getLocale()` will always return the *users* locale (based on browser settings). The `set()` method refers to Quasars internal locale setting which is used to determine which language file to use. If you would like to see which language has been set using `set()` you can use `this.$q.lang.isoName`.
:::
