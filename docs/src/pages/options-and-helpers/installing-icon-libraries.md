---
title: Installing Icon Libraries
---

You'll most likely want icons in your website/app and Quasar offers an easy way out of the box, for following icon libraries: [Material Icons](https://material.io/icons/) , [Font Awesome](http://fontawesome.io/icons/), [Ionicons](http://ionicons.com/), [MDI](https://materialdesignicons.com/) and [Eva Icons](https://akveo.github.io/eva-icons).

::: tip
You can either choose to install one of them or multiple.
:::

::: tip
Related pages: [Quasar Icon Sets](/options-and-helpers/quasar-icon-sets) and [QIcon component](/vue-components/icon).
:::

## Installing
If you are building a website only, then using a CDN (Content Delivery Network) approach can be an option you can follow. However, when building a mobile or Electron app, you most likely do not want to depend on an Internet connection and Quasar comes with a solution to this problem:

Edit `/quasar.conf.js`:

```js
extras: [
  'material-icons'
]
```

Icon sets are available through [@quasar/extras](https://github.com/quasarframework/quasar/extras) package. You don't need to import it in your app, just configure `/quasar.conf.js` as indicated above.

Adding more than one set (showing all options):
```js
extras: [
  'material-icons',
  'mdi-v3',
  'ionicons-v4',
  'eva-icons',
  'fontawesome-v5'
]
```

You're now ready to use [QIcon](/vue-components/icon) component.

## Using CDN as alternative
If you want to make use of CDNs (Content Delivery Network), all you need is to include style tags in your `index.template.html` which point to the CDN URL.

In case you follow this path, do not also add the icon sets that you want in `/quasar.conf.js > extras`. Simply edit `index.template.html` as follows.

The example link tag below would include Font Awesome v4.7.0 icons. Do a Google search for CDNs to make sure you include the latest version. Following are just examples.

```html
<!-- in `/src/index.template.html` -->

<head>
  ...

  <!-- CDN example for Material Icons -->
  <link
    href="https://fonts.googleapis.com/icon?family=Material+Icons"
    rel="stylesheet"
  >

  <!-- CDN example for Fontawesome 5.6.3 -->
  <link
    rel="stylesheet"
    href="https://use.fontawesome.com/releases/v5.6.3/css/all.css"
    integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/"
    crossorigin="anonymous"
  >

  <!-- CDN example for Ionicons -->
  <link
    href="https://unpkg.com/ionicons@4.5.0/dist/css/ionicons.min.css"
    rel="stylesheet"
  >
</head>
```

## Using Fontawesome-Pro
If you have a Fontawesome 5 Pro license and want to use it instead Fontawesome Free version. Following this instructions.

1. Open [Linked Accounts section](https://fontawesome.com/account) in Fontawesome's user account page to grab npm TOKENID (login if necessary).
2. Create or append TOKENID into file .npmrc (file path same as package.json):
  ```
  @fortawesome:registry=https://npm.fontawesome.com/TOKENID
  ```
3. Install Fontawesome webfonts:
  ```bash
  $ yarn add @fortawesome/fontawesome-pro
  # or:
  $ npm install @fortawesome/fontawesome-pro
  ```
4. Create new App plugin:
  ```bash
  $ quasar new plugin fontawesome-pro
  ```
5. Edit `/quasar.conf.js`:
  ```js
  plugins: [
    ...
    'fontawesome-pro' // Add app plugin
  ],
  extras: [
    // 'fontawesome' // Disable free version!
  ],
  framework: {
    // if you want Quasar to use Fontawesome for its icons
    iconSet: 'fontawesome-pro'
  }
  ```
6. Edit `/src/plugins/fontawesome-pro.js`:
```js
// required
import '@fortawesome/fontawesome-pro/css/fontawesome.min.css'
import '@fortawesome/fontawesome-pro/css/light.min.css'
// do you want these too?
// import '@fortawesome/fontawesome-pro/css/brands.min.css'
// import '@fortawesome/fontawesome-pro/css/solid.min.css'
// import '@fortawesome/fontawesome-pro/css/regular.min.css'

export default () => {
  // Leave blank or make something cool.
}
```
7. (Optional) Override default icons:

Since the default `font-weight` for fontawesome-pro is `light` or `fal`, some icons used by the framework components may not be desirable. The best way to handle this is to override it in the plugin you created.

For instance, to override the `fal` version of the close icon for chips, do this:

_First_, find the icon used for chip close in Quasar's `quasar/icons/fontawesome-pro.js`

(Alternatively, you can check inside the render function of the component you are overriding.)

```js
chip: {
  close: 'fal fa-times-circle'
},
```

_Then_, override it in your `/src/plugins/fontawesome-pro.js`
```js
import '@fortawesome/fontawesome-pro/css/fontawesome.min.css'
import '@fortawesome/fontawesome-pro/css/solid.min.css'
import '@fortawesome/fontawesome-pro/css/light.min.css'

export default ({ Vue }) => {
  Vue.prototype.$q.icon.chip.close = 'fas fa-times-circle'
}
```
