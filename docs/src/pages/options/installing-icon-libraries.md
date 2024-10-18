---
title: Installing Icon Libraries
desc: How to use icon libraries in a Quasar app.
related:
  - /options/quasar-icon-sets
  - /vue-components/icon
---

::: tip
**This page refers to using [webfont icons](/vue-components/icon#webfont-icons) only.** [Svg icons](https://quasar.dev/vue-components/icon#svg-icons) do not need any installation step.
:::

You'll most likely want icons in your website/app and Quasar offers an easy way out of the box for the following icon libraries: [Material Icons](https://fonts.google.com/icons?icon.set=Material+Icons), [Material Symbols](https://fonts.google.com/icons?icon.set=Material+Symbols), [Font Awesome](https://fontawesome.com/icons), [Ionicons](http://ionicons.com/), [MDI](https://materialdesignicons.com/), [Eva Icons](https://akveo.github.io/eva-icons), [Themify Icons](https://themify.me/themify-icons), [Line Awesome](https://icons8.com/line-awesome) and [Bootstrap Icons](https://icons.getbootstrap.com/). But you can [add support for others](/vue-components/icon#custom-mapping) by yourself.

::: tip
In regards to webfont icons, you can choose to install one or more of these icon libraries.
:::

## Installing Webfonts
If you are building a website only, then using a CDN (Content Delivery Network) approach can be an option you can follow. However, when building a mobile or Electron app, you most likely do not want to depend on an Internet connection and Quasar comes with a solution to this problem:

Edit the `/quasar.config` file:

```js
extras: [
  'material-icons'
]
```

Webfont icons are available through [@quasar/extras](https://github.com/quasarframework/quasar/tree/dev/extras) package. You don't need to import it in your app, just configure the `/quasar.config` file as indicated above.

Adding more than one set:
```js
extras: [
  'material-icons',
  'mdi-v7',
  'ionicons-v4', // last webfont was available in v4.6.3
  'eva-icons',
  'fontawesome-v6',
  'themify',
  'line-awesome',
  'bootstrap-icons'
]
```

For all available options, visit the [GitHub](https://github.com/quasarframework/quasar/tree/dev/extras#webfonts) repository.

You're now ready to use the [QIcon](/vue-components/icon) component.

## Using CDN as alternative
If you want to make use of a CDN (Content Delivery Network), all you need to do is to include style tags in your /index.html or /src/index.template.html file which point to the CDN URL.

In case you follow this path, do not also add the icon sets that you want in `/quasar.config file > extras`. Play with the [UMD Installation Guide](/start/umd#installation) and edit /index.html or /src/index.template.html as described there.

## Using Fontawesome-Pro
If you have a Fontawesome v6 Pro license and want to use it instead of the Fontawesome Free version, follow these instructions. Optionally, you will be able to use Font Awesome's Kit functionality to specify just the icons you use in your project. See the next section below for instructions on how to setup Kits with Quasar.

1. Open the [Linked Accounts section](https://fontawesome.com/account) in Fontawesome's user account page to grab the npm TOKENID (login if necessary).
2. Create or append TOKENID into the `.npmrc` file (file path same as package.json):
  ```
  @fortawesome:registry=https://npm.fontawesome.com/
  //npm.fontawesome.com/:_authToken=TOKENID
  ```
3. Install Fontawesome webfonts:
  ```tabs
  <<| bash Yarn |>>
  $ yarn add @fortawesome/fontawesome-pro
  <<| bash NPM |>>
  $ npm install --save @fortawesome/fontawesome-pro
  <<| bash PNPM |>>
  $ pnpm add @fortawesome/fontawesome-pro
  <<| bash Bun |>>
  $ bun add @fortawesome/fontawesome-pro
  ```
4. Create new boot file:
  ```bash
  $ quasar new boot fontawesome-pro [--format ts]
  ```
5. Edit the `/quasar.config` file:
  ```js
  boot: [
    ...
    'fontawesome-pro' // Add boot file
  ],
  extras: [
    // 'fontawesome-v6' // Disable free version!
  ],
  framework: {
    // if you want Quasar to use Fontawesome for its icons
    iconSet: 'fontawesome-v6-pro'
  }
  ```
6. Edit `/src/boot/fontawesome-pro.js`:
  ```js
  // required
  import '@fortawesome/fontawesome-pro/css/fontawesome.css'
  import '@fortawesome/fontawesome-pro/css/light.css'
  // do you want these too?
  // import '@fortawesome/fontawesome-pro/css/thin.css'
  // import '@fortawesome/fontawesome-pro/css/duotone.css'
  // import '@fortawesome/fontawesome-pro/css/brands.css'
  // import '@fortawesome/fontawesome-pro/css/solid.css'
  // import '@fortawesome/fontawesome-pro/css/regular.css'
  ```
7. (Optional) Override default icons:

Since the default `font-weight` for fontawesome-pro is `light` or `fal`, some icons used by the framework components may not be desirable. The best way to handle this is to override it in the boot file that you created.

For instance, to override the `fal` version of the close icon for chips, do this:

_First_, find the icon used for chip close in Quasar Fontawesome v6 Pro [icon-set source](https://github.com/quasarframework/quasar/blob/dev/ui/icon-set/fontawesome-v6-pro.js).

(Alternatively, you can check inside the render function of the component you are overriding.)

```js Example
chip: {
  remove: 'fal fa-times-circle'
```

_Then_, override it in your `/src/boot/fontawesome-pro.js`

```js
import '@fortawesome/fontawesome-pro/css/fontawesome.min.css'
import '@fortawesome/fontawesome-pro/css/solid.min.css'
import '@fortawesome/fontawesome-pro/css/light.min.css'

// example
export default ({ app }) => {
  app.config.globalProperties.$q.iconSet.chip.remove = 'fas fa-times-circle'
}
```
Or, if you are changing all of the icons in the iconSet, you can make a copy of the Quasar Fontawesome v6 Pro [icon-set source](https://github.com/quasarframework/quasar/blob/dev/ui/icon-set/fontawesome-v6-pro.js) and store it in your source. Modify all the icons to be the font weight and icons you desire and then set the entire iconSet with one call. If you are using typescript, this has the benefit of type checking that you are setting all the icons and will give you an error when you upgrade Quasar to a new version that introduces more icons in the iconSet.
```js
import { boot } from 'quasar/wrappers';
import '@fortawesome/fontawesome-pro/css/fontawesome.min.css'
import '@fortawesome/fontawesome-pro/css/solid.min.css'
import '@fortawesome/fontawesome-pro/css/light.min.css'
import iconSet from 'src/<path you store the iconSet>/iconSet';

export default boot(({ app }) => {
  app.config.globalProperties.$q.iconSet.set(iconSet);
});
```

8. (Optional) If you use Cypress for component testing, you need to load your icons in the cypress component configuration file ```test/cypress/support/components.ts```
```js
// ICON SETS
// If you use multiple or different icon-sets then the default, be sure to import them here.
import 'quasar/dist/icon-set/material-icons.umd.prod';
import '@quasar/extras/material-icons/material-icons.css';

is replaced with:
// ICON SETS
// If you use multiple or different icon-sets then the default, be sure to import them here.
import '@fortawesome/fontawesome-pro/css/fontawesome.css'
// add any font awesome icon packs that you used in the boot file
import '@fortawesome/fontawesome-pro/css/light.css'
...
```
9. (Optional) Create a central ```icons.ts``` in order to ensure consistency across your app
You can give the icons names that are more meaningful and easier to remember by introducing an ```icons.ts``` file in the following form:
```js
export default {
  positive: 'far fa-check',
  negative: 'fas fa-octagon-exclamation',
  info: 'fas fa-circle-info',
  warning: 'far fa-triangle-exclamation',
  menu: 'fas fa-bars',
  close: 'far fa-xmark',
  trash: 'far fa-trash',
}
```
Then you can use the icons like this:
```js
<script setup lang='ts'>
import icons from 'src/fontAwesome/icons.ts`

const { menu, close } = icons;
</script>

<template>
  <q-icon :name="menu" />  
  <q-icon :name="close" />  
</template>
```

## Using Fontawesome-Pro Kits
Font Awesome provides a functionality that they call Kits. This is a way for you to specify just the icons that you use in your app. This procedure will illustrate how to use a kit that you download from Font Awesome and host yourself.

The initial steps are similar to above but since you are getting all of your icons from the kit download, you will not be using npm/yarn to install the Font Awesome icon packs.
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
5. Edit the `/quasar.config` file:
  ```js
  boot: [
    ...
    'fontawesome-pro' // Add boot file
  ],
  extras: [
    // 'fontawesome-v6' // Disable free version!
  ],
  framework: {
    // if you want Quasar to use Fontawesome for its icons
    iconSet: 'fontawesome-v6-pro'
  }
  ```
6. Create a [Font Awesome kit](https://fontawesome.com/kits) in order to specify just the icons you use in your project.
  ```
  You will be using the webfonts approach to rendering the icons because that is what Quasar expects for Font Awesome.
  Download the kit zip file for hosting yourself.
  Copy the css/All.css file and put it in /src/<path you store the kit>/css/all.css
  Copy the webfonts directory to /src/<path you store the kit>/webfonts
  ```
7. Edit `/src/boot/fontawesome-pro.js`:
  ```js
  import 'src/<path you store the kit>/css/all.css'
  ```
8. (Optional) Override default icons:

Since the default `font-weight` for fontawesome-pro is `light` or `fal`, some icons used by the framework components may not be desirable. The best way to handle this is to override it in the boot file that you created.

For instance, to override the `fal` version of the close icon for chips, do this:

_First_, find the icon used for chip close in Quasar Fontawesome v6 Pro [icon-set source](https://github.com/quasarframework/quasar/blob/dev/ui/icon-set/fontawesome-v6-pro.js).

(Alternatively, you can check inside the render function of the component you are overriding.)

```js
// example
chip: {
  remove: 'fal fa-times-circle'
```

_Then_, override it in your `/src/boot/fontawesome-pro.js`

```js
import 'src/<path you store the kit>/css/all.css'

// add this...
export default ({ app }) => {
  app.config.globalProperties.$q.iconSet.chip.remove = 'fas fa-times-circle'
}
```
Or, if you are changing all of the icons in the iconSet, you can make a copy of the Quasar Fontawesome v6 Pro [icon-set source](https://github.com/quasarframework/quasar/blob/dev/ui/icon-set/fontawesome-v6-pro.js) and store it in your source. Modify all the icons to be the font weight and icons you desire and then set the entire iconSet with one call. If you are using typescript, this has the benefit of type checking that you are setting all the icons and will give you an error when you upgrade Quasar to a new version that introduces more icons in the iconSet.
```js
import { boot } from 'quasar/wrappers';
import 'src/<path you store the kit>/css/all.css';
import iconSet from 'src/<path you store the iconSet>/iconSet';

export default boot(({ app }) => {
  app.config.globalProperties.$q.iconSet.set(iconSet);
});
```

9. (Optional) If you use Cypress for component testing, you need to load your icons in the cypress component configuration file ```test/cypress/support/components.ts```
```js
// ICON SETS
// If you use multiple or different icon-sets then the default, be sure to import them here.
import 'quasar/dist/icon-set/material-icons.umd.prod';
import '@quasar/extras/material-icons/material-icons.css';

is replaced with:
// ICON SETS
// If you use multiple or different icon-sets then the default, be sure to import them here.
import 'src/<path you store the kit>/css/all.css';
...
```
10. (Optional) Create a central ```icons.ts``` in order to ensure consistency across your app
You can give the icons names that are more meaningful and easier to remember by introducing an ```icons.ts``` file in the following form:
```js
export default {
  positive: 'far fa-check',
  negative: 'fas fa-octagon-exclamation',
  info: 'fas fa-circle-info',
  warning: 'far fa-triangle-exclamation',
  menu: 'fas fa-bars',
  close: 'far fa-xmark',
  trash: 'far fa-trash',
}
```
Then you can use the icons like this:
```js
<script setup lang='ts'>
import icons from 'src/fontAwesome/icons.ts`

const { menu, close } = icons;
</script>

<template>
  <q-icon :name="menu" />  
  <q-icon :name="close" />  
</template>
```
