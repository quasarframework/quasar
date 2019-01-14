---
title: Icons
---

The Quasar Icon component allows you to easily insert icons within other components or any other area of your pages, as you'd like.
Quasar currently supports: [Material Icons](https://material.io/icons/) , [Font Awesome](http://fontawesome.io/icons/), [Ionicons](http://ionicons.com/), [MDI](https://materialdesignicons.com/) and [Eva Icons](https://akveo.github.io/eva-icons).

::: tip
You can either choose one of then or use multiple. Quasar just needs to know which icon set to use for its components.
:::

We'll see how we can install an icon set in the following section.
Please [submit a request](https://github.com/quasarframework/quasar/issues/new) if your favorite font icon is not listed here.

## Installing

<doc-installation components="QIcon" />

If you are building a website only, then using a CDN (Content Delivery Network) approach can be an option you can follow. However, when building a mobile or Electron app, you most likely do not want to depend on an Internet connection, so it's best that you follow the next steps.

### Adding an Icon Set
First step is to make an icon set available in your website/app. For this, edit `/quasar.conf.js`:

```js
extras: [
  'material-icons'
]
```

> Icon sets are available through [@quasar/extras](https://github.com/quasarframework/quasar/extras) package. You don't need to import it in your app, just configure `/quasar.conf.js` as indicated.

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

### Quasar Using an Icon Set
Unless configured otherwise, Quasar uses Material Icons as its icon set for its components. You can however tell Quasar to use some other icon set, but be sure to include that set in your website/app (see step above: [Adding an Icon Set](#Adding-an-icon-set)).

So let's say we included Ionicons and we want Quasar to use it for its components. We edit `/quasar.conf.js` again:

```js
framework: {
  iconSet: 'fontawesome-v5'
}
```

### Full Example
Here is an example of including Ionicons & Fontawesome and telling Quasar to use Fontawesome for its components.

```js
extras: [
  'ionicons-v4',
  'fontawesome-v5'
],
framework: {
  iconSet: 'fontawesome-v5'
}
```

This will enable you to use both Ionicons & Fontawesome in your app, and all Quasar components will display Fontawesome icons.

### Including from CDN
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

### Using Fontawesome-Pro
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

## Usage
Let's take a look at how we can use QIcon component. Do not forget to check above how to [Install Icon Sets](#Installing), otherwise they won't show up!

```html
<!-- Material icons have no prefix -->
<q-icon name="thumb_up" />

<!-- Ionicons have "ion-", "ion-logo", "ion-md-" or "ion-ios-" as prefix -->
<q-icon name="ion-heart" />

<!-- Fontawesome icons have "fa[s|r|l|b] fa-" prefix -->
<q-icon name="fas fa-id-card" />

<!-- MDI icons have "mdi-" prefix -->
<q-icon name="mdi-account-card-details" />

<!-- EvaIcons icons have "eva " prefix -->
<q-icon name="eva-shield-outline" />

<!--
  or if you prefer the non self-closing tag version
  which allows to add a QPopover or QTooltip:
-->
<q-icon name="thumb_up">
  <q-tooltip>Some tooltip</q-tooltip>
</q-icon>
```

For "icon" properties on different Quasar components you won't have the means to specify an icon for each platform, but you can achieve the same effect with:

```html
<q-item-side
  :icon="$q.platform.is.ios ? 'settings' : 'ion-ios-gear-outline'"
/>
```

### Icons Name Cheatsheet

| Name | Prefix | Examples | Notes |
| --- | --- | --- | --- |
| material-icons | *None* | thumb_up | Notice the underline character instead of dash or space |
| ionicons-v4 | ion-, ion-md-, ion-ios-, ion-logo- | ion-heart, ion-logo-npm, ion-md-airplane | Use QIcon instead of `<ion-icon>` component; Logo icons require 'ion-logo-' prefix |
| fontawesome-v5 | fa[s,r,l,b] fa- | "fas fa-ambulance" | QIcon "name" property is same as "class" attribute value in Fontawesome docs examples (where they show `<i>` tags) |
| mdi-v3 | mdi- | mdi-alert-circle-outline | Notice the use of dash characters |
| eva-icons | eva- | eva-shield-outline, eva-activity-outline | Notice the use of dash characters |


### Size & Colors
All icons are **font icons**. This means that you can change size by manipulating `font-size` CSS property. And also, they inherit the current CSS `color` used.

Colors from the [Quasar Color Palette](/components/color-palette.html) can be specified in two ways:
<doc-example title="Icon Color" file="QIcon/Color" />

There's also a "size" property:
<doc-example title="Icon Size" file="QIcon/Size" />

### More Examples

<doc-example title="Icon Size with Style attribute" file="QIcon/Style" />

<doc-example title="Icon Size with Class attribute" file="QIcon/Class" />

<doc-example title="MDI Icons" file="QIcon/MDI" />

<doc-example title="Ion Icons" file="QIcon/Ion" />

<doc-example title="Eva Icons" file="QIcon/Eva" />

<doc-example title="Font Awesome" file="QIcon/FontAwesome" />

<doc-example title="Adding a 'click' event handle" file="QIcon/Click" />

## API
<doc-api file="QIcon" />
