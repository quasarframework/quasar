---
title: Quasar UMD - CDN install
desc: How to use the Unified Module Definition form of Quasar.
---
If you want to embed Quasar into your existing website project, integrating it in a progressive manner, then go for the UMD/Standalone (Unified Module Definition) version.

## Installation
UMD is all about adding Quasar style and javascript tags. This is a full list. Choose only what you use.

```html
<head>
  <!-- Do you need Material Icons? -->
  <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons" rel="stylesheet" type="text/css">

  <!-- Do you need Fontawesome? -->
  <link href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" rel="stylesheet">

  <!-- Do you need Ionicons? -->
  <link href="https://cdn.jsdelivr.net/npm/ionicons@^4.0.0/dist/css/ionicons.min.css" rel="stylesheet">

  <!-- Do you need MDI? -->
  <link href="https://cdn.jsdelivr.net/npm/@mdi/font@^3.0.0/css/materialdesignicons.min.css" rel="stylesheet">

  <!-- Do you need all animations? -->
  <link href="https://cdn.jsdelivr.net/npm/animate.css@^3.5.2/animate.min.css" rel="stylesheet">


  <!--
    Finally, add Quasar's CSS:
    Replace version below (1.0.3) with your desired version of Quasar.
    Add ".rtl" for the RTL support (example: quasar.rtl.min.css).
  -->
  <link href="https://cdn.jsdelivr.net/npm/quasar@^1.0.3/dist/quasar.min.css" rel="stylesheet" type="text/css">
</head>

<body>

  <!-- Do you want IE support? Replace "1.0.3" with your desired Quasar version -->
  <script src="https://cdn.jsdelivr.net/npm/quasar@^1.0.3/dist/quasar.ie.polyfills.umd.min.js"></script>

  <!-- You need Vue too -->
  <script src="https://cdn.jsdelivr.net/npm/vue@latest/dist/vue.min.js"></script>

  <!--
    Add Quasar's JS:
    Replace version below (1.0.3) with your desired version of Quasar.
  -->
  <script src="https://cdn.jsdelivr.net/npm/quasar@^1.0.3/dist/quasar.umd.min.js"></script>

  <!--
    If you want to add a Quasar Language pack (other than "en-us").
    Notice "pt-br" in "i18n.pt-br.umd.min.js" for Brazilian Portuguese language pack.
    Replace version below (1.0.0-beta.0) with your desired version of Quasar.
    Also check final <script> tag below to enable the language
    Language pack list: https://github.com/quasarframework/quasar/tree/dev/ui/lang
  -->
  <script src="https://cdn.jsdelivr.net/npm/quasar@^1.0.3/dist/lang/pt-br.umd.min.js"></script>

  <!--
    If you want to make Quasar components (not your own) use a specific set of icons (unless you're using Material Icons already).
    Replace version below (1.0.3) with your desired version of Quasar.
    Icon sets list: https://github.com/quasarframework/quasar/tree/dev/ui/icon-set
  -->
  <script src="https://cdn.jsdelivr.net/npm/quasar@^1.0.3/dist/icon-set/fontawesome-v5.umd.min.js"></script>

  <script>
    // if using a Quasar language pack other than the default "en-us";
    // requires the language pack style tag from above
    Quasar.lang.set(Quasar.lang.ptBr) // notice camel-case "ptBr"

    // if you want Quasar components to use a specific icon library
    // other than the default Material Icons;
    // requires the icon set style tag from above
    Quasar.iconSet.set(Quasar.iconSet.fontawesomeV5) // fontawesomeV5 is just an example

    /*
      Example kicking off the UI.
      Obviously, adapt this to your specific needs.
     */

    // custom component example, assumes you have a <div id="my-page"></div> in your <body>
    Vue.component('my-page', {
      template: '#my-page'
    })

    // start the UI; assumes you have a <div id="q-app"></div> in your <body>
    new Vue({
      el: '#q-app',
      data: function () {
        return {}
      },
      methods: {},
      // ...etc
    })
  </script>
</body>
```

### Optional
One other quick way to get necessary tags based on your requirements is to use the UMD demo kit. It will ask you some questions and will generate a simple HTML file that will show you how to use CDN to add Quasar:

```bash
$ quasar create <folder_name> --kit umd
```

And you're done. Inspect `index.html` file that was created in the new folder and learn how you can embed Quasar. Notice the `<style>` and `<script>` tags and their order.

Notice that as opposed to the Main Starter Kit, you don't need to import anything. All components, directives and Quasar plugins are ready to be used out of the box.

However, the disadvantage is that you won't benefit from the top notch development experience provided by Quasar CLI -- which allows you to simultaneously develop and build SPA, PWA, SSR, Mobile and Electron Apps.

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

  plugins, // Quasar plugins
  utils, // Quasar utils

  // if you want to extend Quasar's components or directives
  components,
  directives,

  // if you want to change current icon set or Quasar Language pack
  // (must include CDN links so they are available first!)
  lang,
  iconSet
}
```

## Init Configuration
There are some configuration options for Quasar & Quasar plugins. For the Quasar UMD version you can define the following before including the Quasar script tag:

```html
<script>
  // optional
  window.quasarConfig = {
    brand: { // this will NOT work on IE 11
      primary: '#e46262',
      // ... or all other brand colors
    },
    notify: {...}, // default set of options for Notify Quasar plugin
    loading: {...}, // default set of options for Loading Quasar plugin
    loadingBar: { ... }, // settings for LoadingBar Quasar plugin
    // ..and many more
  }
</script>
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
Quasar.plugins.bottomSheet.create({...})
```

### Quasar Utils
An example.

```js
Quasar.utils.openURL('https://quasar.dev')
```

### Changing Quasar Icon Set
Assuming you have already included the CDN link to your favorite Quasar Icon Set (unless you're using Material Icons which is used by default), you can then tell Quasar to use it:

```js
Quasar.iconSet.set(Quasar.iconSet.fontawesomeV5)
```

The list of available [Quasar Icon Sets](/options/quasar-icon-sets) can be found on [GitHub](https://github.com/quasarframework/quasar/tree/dev/ui/icon-set).

### Changing Quasar Language Pack
Assuming you have already included the CDN link to your desired Quasar I18n Language (unless you want "en-us" language pack which is used by default), you can then tell Quasar to use it:

```js
// example setting German language,
// using ISO 2 letter code:
Quasar.lang.set(Quasar.lang.de)

// example setting Portuguese (Brazil) language:
Quasar.lang.set(Quasar.lang.ptBr)
```

The list of available languages can be found on [GitHub](https://github.com/quasarframework/quasar/tree/dev/ui/lang). **If your desired language pack is not available yet, you can help by providing a PR.** We welcome any languages!
