---
title: Installing Icon Libraries
desc: How to use icon libraries in a Quasar app.
related:
  - /options/quasar-icon-sets
  - /vue-components/icon
---

::: tip
**This page refers to using [webfont icons](/vue-components/icon#webfont-icons) only.** [Svg icons](/vue-components/icon#svg-icons) do not need any installation step.
:::

You'll most likely want icons in your website/app and Quasar offers an easy way out of the box for the following icon libraries: [Material Icons](https://fonts.google.com/icons?icon.set=Material+Icons), [Material Symbols](https://fonts.google.com/icons?icon.set=Material+Symbols), [Font Awesome](https://fontawesome.com/icons), [Ionicons](http://ionicons.com/), [MDI](https://materialdesignicons.com/), [Eva Icons](https://akveo.github.io/eva-icons), [Themify Icons](https://themify.me/themify-icons), [Line Awesome](https://icons8.com/line-awesome) and [Bootstrap Icons](https://icons.getbootstrap.com/). But you can [add support for others](/vue-components/icon#custom-mapping) by yourself.

::: tip
In regards to webfont icons, you can choose to install one or more of these icon libraries.
:::

## Installing Webfonts

If you are building a website only, then using a CDN (Content Delivery Network) approach can be an option you can follow. However, when building a mobile or Electron app, you most likely do not want to depend on an Internet connection and Quasar comes with a solution to this problem:

Edit the `/quasar.config` file:

```js
extras: ['material-icons']
```

Webfont icons are available through [@quasar/extras](https://github.com/quasarframework/quasar/tree/dev/extras) package. You don't need to import it in your app, just configure the `/quasar.config` file as indicated above.

Adding more than one set:

```js
extras: [
  'material-icons',
  'mdi-v7',
  'ionicons-v4', // last webfont was available in v4.6.3
  'eva-icons',
  'fontawesome-v7',
  'themify',
  'line-awesome',
  'bootstrap-icons'
]
```

For all available options, visit the [GitHub](https://github.com/quasarframework/quasar/tree/dev/extras#webfonts) repository.

You're now ready to use the [QIcon](/vue-components/icon) component.

## Using CDN as alternative

If you want to make use of a CDN (Content Delivery Network), all you need to do is to include style tags in your /index.html file which point to the CDN URL.

In case you follow this path, do not also add the icon sets that you want in `/quasar.config file > extras`. Play with the [UMD Installation Guide](/start/umd#installation) and edit /index.html as described there.

## Using Fontawesome-Pro

If you have a Fontawesome Pro license and want to use it instead of the Fontawesome Free version, follow these instructions:

1. Open the [Linked Accounts section](https://fontawesome.com/account) in Fontawesome's user account page to grab the npm TOKENID (login if necessary).
2. Create or append TOKENID into the `.npmrc` file (file path same as package.json):

```
@fortawesome:registry=https://npm.fontawesome.com/
//npm.fontawesome.com/:_authToken=TOKENID
```

3. Install Fontawesome webfonts:

```tabs
<<| bash PNPM |>>
pnpm add @fortawesome/fontawesome-pro
<<| bash Yarn |>>
yarn add @fortawesome/fontawesome-pro
<<| bash NPM |>>
npm install @fortawesome/fontawesome-pro
<<| bash Bun |>>
bun add @fortawesome/fontawesome-pro
```

4. Create new boot file:

```bash
quasar new boot fontawesome-pro [--format ts]
```

5. Edit the `/quasar.config` file:

```js
boot: [
  ...
  'fontawesome-pro' // Add boot file
],
extras: [
  // 'fontawesome-v7' // Disable free version!
],
framework: {
  // if you want Quasar to use Fontawesome for its icons
  iconSet: 'fontawesome-v7-pro'
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

_First_, find the icon used for chip close in Quasar Fontawesome Pro [icon-set source](https://github.com/quasarframework/quasar/blob/dev/ui/icon-set/fontawesome-v7-pro.js).

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

If you want to change most (or all) of the icons that the framework uses, then make a copy of the [icon-set source](https://github.com/quasarframework/quasar/blob/dev/ui/icon-set/fontawesome-v7-pro.js) inside your app source, change the icon styles and names as you see fit, then apply the whole set at once:

```js
import '@fortawesome/fontawesome-pro/css/fontawesome.min.css'
import '@fortawesome/fontawesome-pro/css/solid.min.css'
import '@fortawesome/fontawesome-pro/css/light.min.css'

import iconSet from './my-fontawesome-pro-icon-set'

// example
export default ({ app }) => {
  app.config.globalProperties.$q.iconSet.set(iconSet)
}
```

## Using Fontawesome-Pro Kits

[Font Awesome Kits](https://fontawesome.com/kits) allow you to build a custom icon package which contains only the icon styles and individual icons that you actually use (plus any custom icons that you upload to the kit). A Pro plan allows you to download such a kit and host it from your app itself, in which case you do not need the npm registry token or the `@fortawesome/fontawesome-pro` package from the previous section.

1. Create a [kit](https://fontawesome.com/kits) in your Font Awesome account and configure the icons that it should include.

::: warning
If you also set `iconSet: 'fontawesome-v7-pro'` in the `/quasar.config` file (step 4 below), then the kit must include the Light style icons referenced by the Quasar [icon-set source](https://github.com/quasarframework/quasar/blob/dev/ui/icon-set/fontawesome-v7-pro.js), otherwise the icons used internally by the framework components will not render. Alternatively, override the icon set from the boot file (step 6 below) so that it only points to icons that your kit contains.
:::

2. Download the kit for self-hosting and pick the Web Fonts flavor of it (the Quasar icon sets rely on the webfont CSS classes).

3. Copy the kit's `css` and `webfonts` folders into your app, e.g. into `src/css/fontawesome-kit/`. Keep the two folders siblings of each other, because the CSS files reference the fonts through a relative `../webfonts` path.

4. Create a new boot file and register it, while making sure that the free version is not loaded as well:

```bash
quasar new boot fontawesome-pro [--format ts]
```

```js
boot: [
  ...
  'fontawesome-pro' // Add boot file
],
extras: [
  // 'fontawesome-v7' // Disable free version!
],
framework: {
  // if you want Quasar to use Fontawesome for its icons
  iconSet: 'fontawesome-v7-pro'
}
```

5. Edit `/src/boot/fontawesome-pro.js` to load the kit's CSS (`all.css` covers every style that you included in the kit; you can also pick the individual per-style files next to it):

```js
import 'src/css/fontawesome-kit/css/all.css'
```

6. (Optional) Override the default icons the same way as in the previous section, importing the kit CSS instead of the `@fortawesome/fontawesome-pro` files.
