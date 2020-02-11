---
title: Icon
desc: The QIcon Vue component allows you to insert icons within other components or any other area of your pages.
related:
  - /options/installing-icon-libraries
  - /options/quasar-icon-sets
---

The QIcon component allows you to easily insert icons within other components or any other area of your pages.
Quasar supports out of the box: [Material Icons](https://material.io/icons/), [Font Awesome](http://fontawesome.io/icons/), [Ionicons](http://ionicons.com/), [MDI](https://materialdesignicons.com/), [Eva Icons](https://akveo.github.io/eva-icons), [Themify Icons](https://themify.me/themify-icons) and [Line Awesome](https://icons8.com/line-awesome).

Furthermore you can [add support by yourself](/vue-components/icon#Custom-mapping) for any icon lib.

There are multiple types of icons in Quasar: webfont-based, svg-based (v1.7+) and image-based. You are not bound to using only one type in your website/app.

::: tip
Related pages: [Installing Icon Libraries](/options/installing-icon-libraries) and [Quasar Icon Sets](/options/quasar-icon-sets).
:::

## Installing
<doc-installation components="QIcon" />

## Size & colors
The sizing of a QIcon is manipulated by the `font-size` CSS property. Also, QIcon inherits the current CSS text `color` used. For ease of use there are the QIcon `size` and `color` props.

<doc-example title="Basic" file="QIcon/Basic" />

For `icon` properties on different Quasar components you won't have the means to specify an icon for each platform, but you can achieve the same effect with:

```html
<q-btn
  :icon="$q.platform.is.ios ? 'settings' : 'ion-ios-gear-outline'"
/>
```

<doc-example title="Standard sizes" file="QIcon/StandardSizes" />

## Webfont icons

::: warning
If you are using webfont-based icons, make sure that you [installed the icon library](/options/installing-icon-libraries) that you are using, otherwise it won't show up!
:::

### Webfont usage

```html
<q-icon name="..." />
```

| Quasar IconSet name | Name prefix | Examples | Notes |
| --- | --- | --- | --- |
| material-icons | *None* | thumb_up | Notice the underline character instead of dash or space |
| material-icons-outlined | o_ | o_thumb_up | Notice the underline character instead of dash or space; **Quasar 1.0.5+** |
| material-icons-round | r_ | r_thumb_up | Notice the underline character instead of dash or space; **Quasar 1.0.5+** |
| material-icons-sharp | s_ | s_thumb_up | Notice the underline character instead of dash or space; **Quasar 1.0.5+** |
| ionicons-v4 | ion-, ion-md-, ion-ios-, ion-logo- | ion-heart, ion-logo-npm, ion-md-airplane | Use QIcon instead of `<ion-icon>` component; Logo icons require 'ion-logo-' prefix |
| fontawesome-v5 | fa[s,r,l,d,b] fa- | "fas fa-ambulance" | QIcon "name" property is same as "class" attribute value in Fontawesome docs examples (where they show `<i>` tags) |
| mdi-v4 | mdi- | mdi-alert-circle-outline | Notice the use of dash characters; Use only one of mdi-v4 or mdi-v3 |
| mdi-v3 | mdi- | mdi-alert-circle-outline | Notice the use of dash characters; Use only one of mdi-v4 or mdi-v3 |
| eva-icons | eva- | eva-shield-outline, eva-activity-outline | Notice the use of dash characters |
| themify | ti- | ti-hand-point-up | Notice the use of dash characters |
| line-awesome | la[s,r,l,d,b] la- | "las la-atom" | QIcon "name" property is same as "class" attribute value in Line Awesome docs examples (where they show `<i>` tags); **Quasar 1.8+ & @quasar/extras v1.5+** |

### Naming convention

#### Material Icons (Google)

* Icon names are always in snake-case.
* Go to [Material Icons](https://material.io/icons/), look for your desired icon. Remember its name (eg. "all_inbox") and use it.

#### MDI (Material Design Icons)

* Icon names are in hyphen-separated case and always begin with "mdi-" prefix.
* Go to [MDI](https://materialdesignicons.com/), look for your desired icon, click on it. A dialog box will appear. Get the title (eg. "account-key"), prefix it with "mdi-" and you get the result (eg. "mdi-account-key").

#### Fontawesome

* Icon names are in hyphen-serapated case and always begin with "fas fa-", "fab fa-", "fal fa-" or "far fa-" prefixes.
* Go to [FontAwesome](https://fontawesome.com/icons), look for your desired icon, click on it. You'll get to its page. Below the icon name (as title), you will see something like `<i class="fas fa-air-freshener"></i>`. The result is `fas fa-air-freshener`.

#### Ionicons

* Icon names are in hyphen-separated case and always begin with "ion-", "ion-md-", "ion-ios-" or "ion-logo-" prefixes.
* Go to [Ionicons](https://ionicons.com/), look for your desired icon, click on it. At the bottom of the page there will appear a popup. Notice something like `<ion-icon name="square-outline"></ion-icon>`. Remember the name (eg. "square-outline"). Based on the variant that you want (auto-detect platform, material or iOS), you'd get the result: `ion-square-outline` or `ion-md-square-outline` or `ion-ios-square-outline`.

#### Eva Icons

* Icon names are in hyphen-separated case and always begin with "eva-" prefix.
* Go to [Eva Icons](https://akveo.github.io/eva-icons), look for your desired icon, click on it. A dialog box will appear. Get the name from there (eg. "attach-outline"), prefix it with "eva" and the result is "eva-attach-outline".

#### Themify

* Icon names are in hyphen-separated case and always begin with "ti-" prefix.
* Go to [Themify](https://themify.me/themify-icons), look for your desired icon. Remember its name (eg. "ti-arrow-top-right") and use it.

#### Line Awesome

* Icon names are in hyphen-separated case and always begin with "la" prefix.
* Go to [Line Awesome](https://icons8.com/line-awesome), look for your desired icon, click on it. A dialog box will appear. You'll see something like `<i class="lab la-behance-square"></i>`. Remember its name (eg. "lab la-behance-square") and use it.

## Svg icons <q-badge align="top" label="Quasar v1.7+" /> <q-badge align="top" class="q-ml-xs" label="@quasar/extras v1.4+" />

There are many advantages of using only svg icons in your website/app:
* Better app footprint -- only used icons will be included in the final build (treeshaking in action)
* Better quality icons
* No need for including equivalent webfonts from `@quasar/extras` or CDN.

The current disadvantage is that it is more tedious to use these icons than their webfont counterpart.

### Svg usage

Notice in the example below that we want to avoid Vue observable wrapping, so we inject icons on the instance through created() hook. It will work if declared in data() too, but... overhead.

```html
<template>
  <div>
    <q-icon :name="matMenu" />
    <q-icon :name="fasFont" />
    <q-btn :icon="mdiAbTesting" />
  </div>
</template>

<script>
import { matMenu } from '@quasar/extras/material-icons'
import { mdiAbTesting } from '@quasar/extras/mdi-v4'
import { fasFont } from '@quasar/extras/fontawesome-v5'

export default {
  // ...
  created () {
    this.matMenu = matMenu
    this.mdiAbTesting = mdiAbTesting
    this.fasFont = fasFont
  }
}
```

::: tip
If you are only using svg icons (and have configured a [Quasar Icon Set](/options/quasar-icon-sets)) then you don't need the webfont equivalent in your app at all.
:::

| Vendor | Quasar IconSet name | Import Icons from | Notes |
| --- | --- | --- | --- |
| Material Icons (Google) | svg-material-icons | @quasar/extras/material-icons | |
| MDI (Material Design Icons) | svg-mdi-v4 | @quasar/extras/mdi-v4 | |
| Font Awesome | svg-fontawesome-v5 | @quasar/extras/fontawesome-v5 | |
| Ionicons | svg-ionicons-v4 | @quasar/extras/ionicons-v4 | |
| Eva Icons | svg-eva-icons | @quasar/extras/eva-icons | |
| Themify Icons | svg-themify | @quasar/extras/themify | |
| Line Awesome | svg-line-awesome | @quasar/extras/line-awesome | `@quasar/extras` v1.5+ |

### Import guide

Svg icons are supplied by `@quasar/extras` (although you can supply [your own svg icons](/vue-components/icon#Svg-icon-format) too!). Here's the ins and outs of the import syntax:

#### SVG Material Icons (Google)

::: warning
The SVG format of Material Icons from Google is parsed from **their official repo which is years out of date**. It's best if you choose the MDI svgs instead.
:::

* Icon names are in camel-case and always begin with "mat" prefix.
* Go to [Material Icons](https://material.io/icons/), look for your desired icon and remember its name (eg. "all_inbox"), prefix it with "mat" and camel-case the result (eg. "matAllInbox").
* Import statement example: `import { matAllInbox } from '@quasar/extras/material-icons'`.

#### SVG MDI (Material Design Icons)

* Icon names are in camel-case and always begin with "mdi" prefix.
* Go to [MDI](https://materialdesignicons.com/), look for your desired icon, click on it. A dialog box will appear. Get the title (eg. "account-key"), prefix it with "mdi" and camel-case the result (eg. "mdiAccountKey").
* Import statement example: `import { mdiAccountKey } from '@quasar/extras/mdi-v4'`.

#### SVG Fontawesome

* Icon names are in camel-case and always begin with "fas", "fab", "fal" or "far" prefixes.
* Go to [FontAwesome](https://fontawesome.com/icons), look for your desired icon, click on it. You'll get to its page. Below the icon name (as title), you will see something like `<i class="fas fa-air-freshener"></i>`. This would translate to `fasAirFreshner`. The prefix from the tag is important.
* Note that we cannot supply the "Pro" version of the icons in svg format because of the license.
* Import statement example: `import { fasAirFreshner } from '@quasar/extras/fontawesome-v5'`.

#### SVG Ionicons

* Icon names are in camel-case and always begin with "ionMd" or "ionIos" prefixes.
* Go to [Ionicons](https://ionicons.com/), look for your desired icon, click on it. At the bottom of the page there will appear a popup. Notice something like `<ion-icon name="square-outline"></ion-icon>`. Remember the name (eg. "square-outline"). Camel-case this name and prefix it with either "ionMd" (for material variant) or "ionIos" (for iOS variant).
* Import statement example: `import { ionMdSquareOutline } from '@quasar/extras/ionicons-v4'`.

#### SVG Eva Icons

* Icon names are in camel-case and always begin with "eva" prefix.
* Go to [Eva Icons](https://akveo.github.io/eva-icons), look for your desired icon, click on it. A dialog box will appear. Get the name from there (eg. "attach-outline"), prefix it with "eva" and camel-case the result (eg. "evaAttachOutline").
* Import statement example: `import { evaAttachOutline } from '@quasar/extras/eva-icons'`.

#### SVG Themify

* Icon names are in camel-case and always begin with "ti" prefix.
* Go to [Themify](https://themify.me/themify-icons), look for your desired icon. Remember its name (eg. "ti-arrow-top-right"), prefix it with "ti" and camel-case the result (eg. "tiArrowTopRight").
* Import statement example: `import { tiArrowTopRight } from '@quasar/extras/themify'`.

#### SVG Line Awesome

* Icon names are in camel-case and always begin with "la" prefix.
* Go to [Line Awesome](https://icons8.com/line-awesome), look for your desired icon, click on it. A dialog box will appear. You'll see something like `<i class="lab la-behance-square"></i>`. This would translate to: `laBehanceSquare`. There is a special case though (only for solid icons!): if the prefix before "la-" is "las" (eg. `<i class="las la-atom"></i>`), then you need to suffix "la-atom" with "-solid" and camel-case the result (eg. `laAtomSolid`).
* Import statement example: `import { laBehanceSquare } from '@quasar/extras/line-awesome'`.

### Svg icon format

You can also supply your own svg icons. An svg icon is essentially a String with the following syntax:

```
Syntax: "<path>|<viewBox>" or "<path>" (with implicit 0 0 24 24 viewBox)
Examples:
  M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z|0 0 104 104
  M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z

// equivalent to the original svg:
<svg viewBox="0 0 104 104">
  <path d="M9 3L5 6.99h3V....."/>
</svg>
```

## Inlined svg <q-badge align="top" label="v1.7+" />

If you don't want to use the webfont or svg variants from above, note that QIcon also supports one inlined `<svg>` tag (the content of the svg can be anything, not only a path).

Reasoning on why to use an `<svg>` in a QIcon is that the svg will respect the size and color as any QIcon through its props. Without these features, you're better off inlining the svg in your templates without wrapping with QIcon.

```html
<q-icon color="accent" size="5rem">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"/>
  </svg>
</q-icon>
```

Some limitations:
* do not use "height"/"width" attributes on the `<svg>` tag (it will brake QIcon's way of handling the size)
* all `<path>`s will have "fill: currentColor" CSS applied by default; if you don't want that, then add `fill="none"` to the `<path>` tag

## Image icons
You can also make an icon point to an image URL instead of relying on any webfont, by using the `img:` prefix.

**All icon related props of Quasar components can make use of this.**

```html
<q-icon name="img:https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
<q-btn icon="img:https://cdn.quasar.dev/logo/svg/quasar-logo.svg" ... />
<q-icon name="img:statics/my/path/to/some.svg" />
```

::: tip
Remember that you can place images in your `/src/statics` folder too and point to them. You don't always need a full URL.
:::

This is not restricted to SVG only. You can use whatever image type you want (png, jpg, ...):

```html
<q-icon name="img:statics/bla/bla/my.png" />
<q-btn icon="img:statics/bla/bla/my.jpg" ... />
<q-input clearable clear-icon="img:statics/bla/bla/my.gif" ... />
```

It is also possible to inline the image (svg, png, jpeg, gif...) and dynamically change its style (svg):

```html
<q-icon name="img:data:image/svg+xml;charset=utf8,<svg xmlns='http://www.w3.org/2000/svg' height='140' width='500'><ellipse cx='200' cy='80' rx='100' ry='50' style='fill:yellow;stroke:purple;stroke-width:2' /></svg>" />
```

<doc-example title="Dynamic SVG" file="QIcon/DynamicSvg" />

You can also base64 encode an image and supply it. The example below is with a QBtn, but the same principle is involved when dealing with any icon prop or with QIcon:

```html
<q-btn icon="
img:data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==" ... />
```

## Custom mapping <q-badge align="top" label="v1.4+" />

Should you want, you can customize the mapping of icon names. This can be done by overriding `$q.iconMapFn`. The recommended place to do it is in the `created()` hook of your `/src/App.vue` component.

The syntax for `$q.iconMapFn` is as follows:

```js
/* Syntax */
iconMapFn (String: iconName) => Object / void 0 (undefined)

/*
 The returned Object (if any) must be one of the following forms:

 1. Defines how to interpret icon
 {
   cls: String // class name(s)
   content: String // optional, in case you are using a ligature font
                   // and you need it as content of the QIcon
  }

  2. Acts essentially as a map to another icon
  {
    icon: String // the mapped icon String, which will be handled
                 // by Quasar as if the original QIcon name was this value
  }
*/
```

Let's take both cases now.

#### 1. Support for custom icon library

This is especially useful when you are using a custom icon library (that doesn't come with Quasar and its `@quasar/extras` package).

```js
created () {
  // Example of adding support for
  // <q-icon name="app:...." />
  // This includes support for all "icon" props
  // of Quasar components

  this.$q.iconMapFn = (iconName) => {
    // iconName is the content of QIcon "name" prop

    // your custom approach, the following
    // is just an example:
    if (iconName.startsWith('app:') === true) {
      // we strip the "app:" part
      const name = iconName.substring(4)

      return {
        cls: 'my-app-icon ' + name
      }
    }

    // when we don't return anything from our
    // iconMapFn, the default Quasar icon mapping
    // takes over
  }
}
```

Notice in the examples above that we are returning a `my-app-icon` class that gets applied to QIcon if our icon starts with `app:` prefix. We can use it to define how QIcon should react to it, from a CSS point of view.

Let's assume we have our own webfont called "My App Icon".

```css
/*
  For this example, we are creating:
  /src/css/my-app-icon.css
*/

.my-app-icon {
  font-family: 'My App Icon';
  font-weight: 400;
}

@font-face {
  font-family: 'My App Icon';
  font-style: normal; /* whatever is required for your */
  font-weight: 400;   /* webfont.... */
  src: url("./my-app-icon.woff2") format("woff2"), url("./my-app-icon.woff") format("woff");
}
```

We should then edit our `quasar.conf.js` (if using Quasar CLI) to add the newly created CSS file into our app:

```js
css: [
  // ....
  'my-app-icon.css'
]
```

And also add "my-app-icon.woff2" and "my-app-icon.woff" files into the same folder as "my-app-icon.css" (or somewhere else, but edit the relative paths (see "src:" above) to the woff/woff2 files).

#### 2. Simply mapping a few icons

```js
const myIcons = {
  'app:icon1': 'img:/path/to/icon1.svg',
  'app:icon2': 'img:/path/to/icon2.svg',
  'app:copy': 'fas fa-copy',
}

// ...
created () {
  this.$q.iconMapFn = (iconName) => {
    const icon = myIcons[iconName]
    if (icon !== void 0) {
      return { icon: icon }
    }
  }
}
```

Now we can use `<q-icon name="app:copy" />` or `<q-icon name="app:icon1" />` and QIcon will treat "app:copy" and "app:icon1" as if they were written as "fas fa-copy" and "img:/path/to/icon1.svg".

## QIcon API
<doc-api file="QIcon" />
