---
title: Installing Icon Libraries
desc: How to use icon libraries in a Quasar app.
related:
  - /options/quasar-icon-sets
  - /vue-components/icon
---

::: tip
**This page refers to using [webfont icons](/vue-components/icon#webfont-icons) only.** Svg icons do not need any installation step.
:::

You'll most likely want icons in your website/app and Quasar offers an easy way out of the box for the following icon libraries: [Material Icons](https://material.io/icons/) , [Font Awesome](http://fontawesome.io/icons/), [Ionicons](http://ionicons.com/), [MDI](https://materialdesignicons.com/), [Eva Icons](https://akveo.github.io/eva-icons), [Themify Icons](https://themify.me/themify-icons), [Line Awesome](https://icons8.com/line-awesome) and [Bootstrap Icons](https://icons.getbootstrap.com/). But you can [add support for others](/vue-components/icon#custom-mapping) by yourself.

::: tip
In regards to webfont icons, you can choose to install one or more of these icon libraries.
:::

## Installing Webfonts
If you are building a website only, then using a CDN (Content Delivery Network) approach can be an option you can follow. However, when building a mobile or Electron app, you most likely do not want to depend on an Internet connection and Quasar comes with a solution to this problem:

Edit `/quasar.conf.js`:

```js
extras: [
  'material-icons'
]
```

Webfont icons are available through [@quasar/extras](https://github.com/quasarframework/quasar/tree/dev/extras) package. You don't need to import it in your app, just configure `/quasar.conf.js` as indicated above.

Adding more than one set:
```js
extras: [
  'material-icons',
  'mdi-v5',
  'ionicons-v4',
  'eva-icons',
  'fontawesome-v5',
  'themify',
  'line-awesome',
  'bootstrap-icons'
]
```

For all available options, visit the [GitHub](https://github.com/quasarframework/quasar/tree/dev/extras#webfonts) repository.

You're now ready to use the [QIcon](/vue-components/icon) component.

## Using CDN as alternative
If you want to make use of a CDN (Content Delivery Network), all you need to do is to include style tags in your `index.template.html` which point to the CDN URL.

In case you follow this path, do not also add the icon sets that you want in `/quasar.conf.js > extras`. Play with the [UMD Installation Guide](/start/umd#installation) and edit `index.template.html` as described there.

## Using Fontawesome-Pro
If you have a Fontawesome 5 Pro license and want to use it instead of the Fontawesome Free version, follow these instructions:

1. Open the [Linked Accounts section](https://fontawesome.com/account) in Fontawesome's user account page to grab the npm TOKENID (login if necessary).
2. Create or append TOKENID into the `.npmrc` file (file path same as package.json):
  ```
  @fortawesome:registry=https://npm.fontawesome.com/
  //npm.fontawesome.com/:_authToken=TOKENID
  ```
3. Install Fontawesome webfonts:
  ```bash
  $ yarn add @fortawesome/fontawesome-pro
  ```
4. Create new boot file:
  ```bash
  $ quasar new boot fontawesome-pro [--format ts]
  ```
5. Edit `/quasar.conf.js`:
  ```js
  boot: [
    ...
    'fontawesome-pro' // Add boot file
  ],
  extras: [
    // 'fontawesome' // Disable free version!
  ],
  framework: {
    // if you want Quasar to use Fontawesome for its icons
    iconSet: 'fontawesome-v5-pro'
  }
  ```
6. Edit `/src/boot/fontawesome-pro.js`:
  ```js
  // required
  import '@fortawesome/fontawesome-pro/css/fontawesome.css'
  import '@fortawesome/fontawesome-pro/css/light.css'
  // do you want these too?
  // import '@fortawesome/fontawesome-pro/css/brands.css'
  // import '@fortawesome/fontawesome-pro/css/solid.css'
  // import '@fortawesome/fontawesome-pro/css/regular.css'
  ```
7. (Optional) Override default icons:

Since the default `font-weight` for fontawesome-pro is `light` or `fal`, some icons used by the framework components may not be desirable. The best way to handle this is to override it in the boot file that you created.

For instance, to override the `fal` version of the close icon for chips, do this:

_First_, find the icon used for chip close in Quasar Fontawesome v5 Pro [icon-set source](https://github.com/quasarframework/quasar/blob/dev/ui/icon-set/fontawesome-v5-pro.js).

(Alternatively, you can check inside the render function of the component you are overriding.)

```js
// example
chip: {
  remove: 'fal fa-times-circle'
```

_Then_, override it in your `/src/boot/fontawesome-pro.js`

```js
import Vue from 'vue'

import '@fortawesome/fontawesome-pro/css/fontawesome.min.css'
import '@fortawesome/fontawesome-pro/css/solid.min.css'
import '@fortawesome/fontawesome-pro/css/light.min.css'

// example
Vue.prototype.$q.iconSet.chip.remove = 'fas fa-times-circle'
```
