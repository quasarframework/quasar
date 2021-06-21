---
title: Quasar UMD - CDN install
desc: How to use the Unified Module Definition form of Quasar.
components:
  - umd/UmdTags
---

If you want to embed Quasar into your existing website project, integrating it in a progressive manner, then go for the UMD/Standalone (Unified Module Definition) version.

## Installation
UMD is all about adding Quasar style and javascript tags. Please select what you will be using and check out the output below it.

<umd-tags />

::: warning
* Please notice the `<!DOCTYPE html>` at the beginning of the document. Do not forget to add it, or else some browsers (notably Safari) will use some compatibility mode that breaks flex.
* If you are using an RTL Quasar language pack (eg. Hebrew) then toggle the "RTL CSS support" above too!
* Do NOT use self-closing tags, like `<q-icon ... />`. Instead, go with `<q-icon ...></q-icon>`.
:::

::: tip
All components, directives and Quasar plugins are ready to be used out of the box. There is no need for additional code to install them. Just make sure that you will NOT be using self-closing tags.
:::

## JsFiddle / Codepen
You can fork and use these links for reporting issues on GitHub too:

| Supplier | URL |
| --- | --- |
| jsFiddle | [https://jsfiddle.quasar.dev](https://jsfiddle.quasar.dev) |
| Codepen | [https://codepen.quasar.dev](https://codepen.quasar.dev) |

These links (obviously) use the Quasar UMD version.

## Quasar Global Object
When you embed Quasar UMD into a webpage you'll get a `Quasar` global Object injected:

```js
Quasar = {
  version, // Quasar version

  ...components,
  ...directives,
  ...plugins, // Quasar plugins
  ...utils, // Quasar utils

  // if you want to change current icon set or Quasar Language pack
  // (must include CDN links so they are available first!)
  lang,
  iconSet
}
```

Some usage examples:

```js
Quasar.QBtn
Quasar.getCssVar('primary')
Quasar.debounce(fn, 200)
Quasar.Notify.create('Hi and welcome!')
```

## Quasar Config Object
There are some configuration options for Quasar & Quasar plugins:

```js
app.use(Quasar, {
  config: {
    brand: { // this will NOT work on IE 11
      primary: '#e46262',
      // ... or all other brand colors
    },
    notify: {...}, // default set of options for Notify Quasar plugin
    loading: {...}, // default set of options for Loading Quasar plugin
    loadingBar: { ... }, // settings for LoadingBar Quasar plugin
    // ..and many more
  }
})
```

## Usage
So, after you figured out the CDN links that you need to embed into your webpages (hopefully you've inspected the project folder created by UMD demo kit), now it's time to use Quasar.

::: tip
You'll notice that all the Quasar Components, Quasar Directives and Quasar Plugins have an installation section at the top of their pages.
:::

By using the UMD version, you'll have all of the components, directives and Quasar plugins already installed for you. You just need to start using them.

**Do not use self-closing tags with the UMD version:**
You will notice that you won't be able to use the self-closing tag form of any of the components. You must close all components tags.

```html
<!-- In docs, but for Quasar CLI usage -->
<q-btn label="My Button" />
<!-- ^^^ can't use it like this on UMD -->

<!-- Instead, include a self-closing tag too: -->
<q-btn label="My Button"></q-btn>
```

### Quasar Components
An example. No need to install any component in UMD version.

```html
<q-btn label="My Button"></q-btn>
```

### Quasar Directives
An example. No need to install any directives in UMD version.

```html
<div v-ripple>...</div>
```

### Quasar Plugins
An example. No need to install any plugins in UMD version.

```js
Quasar.BottomSheet.create({...})
```

### Quasar Utils
An example.

```js
Quasar.openURL('https://quasar.dev')
```

### Changing Quasar Icon Set
Assuming you have already included the CDN link to your favorite Quasar Icon Set (unless you're using Material Icons which is used by default), you can then tell Quasar to use it:

```js
Quasar.iconSet.set(Quasar.iconSet.fontawesomeV5)
```

The list of available [Quasar Icon Sets](/options/quasar-icon-sets) can be found on [GitHub](https://github.com/quasarframework/quasar/tree/dev/ui/icon-set).

### Changing Quasar Language Pack
Assuming you have already included the CDN link to your desired Quasar I18n Language (unless you want "en-US" language pack which is used by default), you can then tell Quasar to use it:

```js
// example setting German language,
// using ISO 2 letter code:
Quasar.lang.set(Quasar.lang.de)

// example setting Portuguese (Brazil) language:
Quasar.lang.set(Quasar.lang.ptBR)
```

The list of available languages can be found on [GitHub](https://github.com/quasarframework/quasar/tree/dev/ui/lang). **If your desired language pack is not available yet, you can help by providing a PR.** We welcome any languages!
