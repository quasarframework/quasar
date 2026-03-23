---
title: App Internationalization (i18n)
desc: How to use vue-i18n in a Quasar app.
related:
  - /options/rtl-support
  - /options/quasar-language-packs
---

Internationalization is a design process that ensures a product (a website or application) can be adapted to various languages and regions without requiring engineering changes to the source code. Think of internationalization as readiness for localization.

::: tip
The recommended package for handling website/app is [vue-i18n](https://github.com/intlify/vue-i18n-next). This package should be added through a [@quasar/app-vite Boot File](/quasar-cli-vite/boot-files) or a [@quasar/app-webpack Boot File](/quasar-cli-webpack/boot-files). On the Boot File documentation page you can see a specific example for plugging in vue-i18n.
:::

::: warning
Quasar documentation assumes you are already familiar with [vue-i18n](https://github.com/intlify/vue-i18n-next). Below it's described only the basics of how to make use of it in a Quasar CLI project. For the full list of its features please visit the [Vue I18n documentation](https://vue-i18n.intlify.dev).
:::

## Setup manually

If you missed enabling i18n during `yarn create quasar` (or `npm init quasar@latest` or the pnpm or Bun equivalent) wizard, here is how you can set it up manually.

1. Install the `vue-i18n` dependency into your app.

```tabs
<<| bash Yarn |>>
$ yarn add vue-i18n
<<| bash NPM |>>
$ npm install --save vue-i18n
<<| bash PNPM |>>
$ pnpm add vue-i18n
<<| bash Bun |>>
$ bun add vue-i18n
```

2. Create a file `src/boot/i18n.js` with following content:

```tabs
<<| js JS |>>
import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

export default defineBoot(({ app }) => {
  const i18n = createI18n({
    locale: 'en-US',
    globalInjection: true,
    messages
  })

  // Set i18n instance on app
  app.use(i18n)
})
<<| js TypeScript |>>
import { defineBoot } from '#q-app/wrappers';
import { createI18n } from 'vue-i18n';

import messages from 'src/i18n';

export type MessageLanguages = keyof typeof messages;
// Type-define 'en-US' as the master schema for the resource
export type MessageSchema = typeof messages['en-US'];

// See https://vue-i18n.intlify.dev/guide/advanced/typescript.html#global-resource-schema-type-definition
/* eslint-disable @typescript-eslint/no-empty-object-type */
declare module 'vue-i18n' {
  // define the locale messages schema
  export interface DefineLocaleMessage extends MessageSchema {}

  // define the datetime format schema
  export interface DefineDateTimeFormat {}

  // define the number format schema
  export interface DefineNumberFormat {}
}
/* eslint-enable @typescript-eslint/no-empty-object-type */

export default defineBoot(({ app }) => {
  const i18n = createI18n<{ message: MessageSchema }, MessageLanguages>({
    locale: 'en-US',<% if (sfcStyle === 'composition' || sfcStyle === 'composition-setup') { %>
    legacy: false,<% } %>
    messages,
  });

  // Set i18n instance on app
  app.use(i18n);
});
```

3. Create a folder (/src/i18n/) in your app which will hold the definitions for each language that you'll support. Example: [src/i18n](https://github.com/quasarframework/quasar-starter-kit/tree/master/template/src/i18n). Notice the "import messages from 'src/i18n'" from step 2. This is step where you write the content that gets imported.

4. Now reference this file in `quasar.config` one in the `boot` section:

```js /quasar.config file
return {
  boot: [
    // ...
    'i18n'
  ]

  // ...
}
```

Now you are ready to use it in your pages.

## Setting up Translation Blocks in your SFCs <q-badge label="@quasar/app-vite only" />

::: warning
The following section applies to projects that use @quasar/app-vite only!
:::

If we want to add support to the `<i18n>` tag inside a SFC (single file component) in a Quasar CLI project then we need to modify the existing configuration.

We first install the `@intlify/unplugin-vue-i18n` package:

```tabs
<<| bash Yarn |>>
$ yarn add --dev @intlify/unplugin-vue-i18n
<<| bash NPM |>>
$ npm install --save-dev @intlify/unplugin-vue-i18n
<<| bash PNPM |>>
$ pnpm add -D @intlify/unplugin-vue-i18n
<<| bash Bun |>>
$ bun add --dev @intlify/unplugin-vue-i18n
```

Then we edit the /quasar.config file:

```js /quasar.config file
import { fileURLToPath } from 'node:url'

// ...

build: {
  vitePlugins: [
    [
      '@intlify/unplugin-vue-i18n/vite',
      {
        // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
        // compositionOnly: false,

        // if you want to use named tokens in your Vue I18n messages, such as 'Hello {name}',
        // you need to set `runtimeOnly: false`
        // runtimeOnly: false,

        ssr: ctx.modeName === 'ssr',

        // you need to set i18n resource including paths !
        include: [fileURLToPath(new URL('./src/i18n', import.meta.url))]
      }
    ]
  ]
}
```

## How to use

Here is an example displaying the main use cases:

```html
<template>
  <q-page>
    <!-- text interpolation, reactive -->
    {{ $t('hello') }}

    <!-- prop/attr binding, reactive -->
    <q-btn :label="$t('hello')" />

    <!-- v-html directive usage -->
    <span v-html="content"></span>
  </q-page>
</template>

<script setup>
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  // bound to a static variable, non-reactive
  // const staticContent = t('hello')
  // bound to a reactive variable, but one-time assignment, locale changes will not update the value
  // const reactiveStaticContent = ref(t('hello'))

  // bound to a reactive variable, locale changes will reflect the value
  const content = computed(() => t('hello'))

  function notify() {
    Notify.create({
      type: 'positive',
      message: t('hello')
    })
  }
</script>
```

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

```html Some Vue file
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

<script setup>
  import { useI18n } from 'vue-i18n'

  const { locale } = useI18n({ useScope: 'global' })

  const localeOptions: [
    { value: 'en-US', label: 'English' },
    { value: 'de', label: 'German' }
  ]
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
import { Lang } from 'quasar'
Lang.getLocale() // returns a string

// inside of a Vue file
import { useQuasar } from 'quasar'

setup () {
  const $q = useQuasar()
  $q.lang.getLocale() // returns a string
}
```

::: warning
If you use Quasar's set method (`$q.lang.set()`), this will not be reflected by Quasar's getLocale above. The reason for this is that `getLocale()` will always return the _users_ locale (based on browser settings). The `set()` method refers to Quasars internal locale setting which is used to determine which language file to use. If you would like to see which language has been set using `set()` you can use `$q.lang.isoName`.
:::
