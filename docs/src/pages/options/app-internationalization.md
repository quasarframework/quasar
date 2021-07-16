---
title: App Internationalization (i18n)
desc: How to use vue-i18n in a Quasar app.
related:
  - /options/rtl-support
  - /options/quasar-language-packs
---
Internationalization is a design process that ensures a product (a website or application) can be adapted to various languages and regions without requiring engineering changes to the source code. Think of internationalization as readiness for localization.

::: tip
The recommended package for handling website/app is [vue-i18n](https://github.com/kazupon/vue-i18n). This package should be added through a [Boot File](/quasar-cli/boot-files). On the Boot File documentation page you can see a specific example for plugging in vue-i18n.
:::

## Setup manually

If you missed enabling i18n during `quasar create` wizard, here is how you can set it up manually.

1. Install the `vue-i18n` dependency into your app.

```bash
$ yarn add vue-i18n@next
// or:
$ npm install vue-i18n@next
```

2. Create a file `src/boot/i18n.js` with following content:

```js
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

const i18n = createI18n({
  locale: 'en-US',
  messages
})

export default ({ app }) => {
  // Set i18n instance on app
  app.use(i18n)
}

export { i18n }
```

3. Create a folder (/src/i18n/) in your app which will hold the definitions for each language that you'll support. Example: [src/i18n](https://github.com/quasarframework/quasar-starter-kit/tree/master/template/src/i18n). Notice the "import messages from 'src/i18n'" from step 2. This is step where you write the content that gets imported.

4. Now reference this file in `quasar.config.js` in the `boot` section:

```js
// quasar.conf.js
return {
  boot: [
    // ...
    'i18n'
  ],

  // ...
}
```

Now you are ready to use it in your pages.

## Setting up Translation Blocks in your SFCs
To use embedded `<i18n>` template components in your vue files with **vue-i18n-loader** you must ensure that the `@intlify/vue-i18n-loader` and `yaml-loader` dependencies are added to your project using your package manager of choice. Then in your `quasar.conf.js` file change the webpack build options. In this case the translations are stored in yaml format in the block.

```js
// quasar.conf.js

const path = require('path')

build: {
  // OR use the equivalent chainWebpack()
  // with its own chain statements
  extendWebpack (cfg) {
    // for i18n resources (json/json5/yaml)
    cfg.module.rules.push({
      test: /\.(json5?|ya?ml)$/, // target json, json5, yaml and yml files
      type: 'javascript/auto',
      // Use `Rule.include` to specify the files of locale messages to be pre-compiled
      include: [
        path.resolve(__dirname, './src/i18n'),
      ],
      loader: '@intlify/vue-i18n-loader'
    })

    // for i18n custom block
    cfg.module.rules.push({
      resourceQuery: /blockType=i18n/,
      type: 'javascript/auto',
      loader: '@intlify/vue-i18n-loader'
    })
  }
}
```

## How to use

There are 3 main cases:

```html
<template>
  <q-page>
    <q-btn :label="$t('mykey2')">
    {{ $t('mykey1') }}
    <span v-html="content"></span>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      content: this.$t('mykey3')
    }
  }
}
</script>
```

1. `mykey1` in HTML body
2. `mykey2` in attribute
3. `mykey3` programmatically

## Add new language

Let's say you want to add new German language.

1. Create the new file `src/i18n/de/index.js` and copy there the content of the file `src/i18n/en-US/index.js` then make changes to the language strings.
2. Now change `src/i18n/index.js` and add the new `de` language there.

```js
import enUS from './en-US'
import de from './de'

export default {
  'en-US': enUS,
  de: de
}
```

## Create language switcher

```html
<!-- some .vue file -->

<template>
  <!-- ...... -->
  <q-select
    v-model="locale"
    :options="localeOptions"
    label="Quasar Language"
    dense
    borderless
    emit-value
    map-options
    options-dense
    style="min-width: 150px"
  />
  <!-- ...... -->
</template>

<script>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  setup () {
    const { locale } = useI18n({ useScope: 'global' })

    return {
      locale,
      localeOptions: [
        { value: 'en-US', label: 'English' },
        { value: 'de', label: 'German' }
      ]
    }
  }
}
</script>
```

## UPPERCASE
Many languages, such as Greek, German and Dutch have non-intuitive rules for uppercase display, and there is an edge case that you should be aware of:

QBtn component will use the CSS `text-transform: uppercase` rule to automatically turn its label into all-caps. According to the [MDN webdocs](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform), "The language is defined by the lang HTML attribute or the xml:lang XML attribute." Unfortunately, this has spotty implementation across browsers, and the 2017 ISO standard for the uppercase German eszett `ß` has not really entered the canon. At the moment you have two options:

1. use the prop `no-caps` in your label and write the string as it should appear
2. use the prop `no-caps` in your label and rewrite the string with [toLocaleUpperCase](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase) by using the locale as detected by `$q.lang.getLocale()`

## Detecting Locale
There's also a method to determine user locale which is supplied by Quasar out of the box:

```js
// outside of a Vue file
import { Quasar } from 'quasar'
Quasar.lang.getLocale() // returns a string

// inside of a Vue file
import { useQuasar } from 'quasar'

setup () {
  const $q = useQuasar()
  $q.lang.getLocale() // returns a string
}
```

::: warning
If you use Quasar's set method (`$q.lang.set()`), this will not be reflected by Quasar's getLocale above. The reason for this is that `getLocale()` will always return the *users* locale (based on browser settings). The `set()` method refers to Quasars internal locale setting which is used to determine which language file to use. If you would like to see which language has been set using `set()` you can use `$q.lang.isoName`.
:::
