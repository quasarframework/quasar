---
title: Icon
description: The QIcon Vue component allows you to insert icons within other components or any other area of your pages.
canonical: https://quasar.dev/vue-components/icon
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QIcon](../../api/QIcon.md)

The QIcon component allows you to easily insert icons within other components or any other area of your pages.
Quasar supports out of the box: [Material Icons](https://fonts.google.com/icons?icon.set=Material+Icons) , [Material Symbols](https://fonts.google.com/icons?icon.set=Material+Symbols) , [Font Awesome](https://fontawesome.com/icons), [Ionicons](http://ionicons.com/), [MDI](https://materialdesignicons.com/), [Eva Icons](https://akveo.github.io/eva-icons), [Themify Icons](https://themify.me/themify-icons), [Line Awesome](https://icons8.com/line-awesome) and [Bootstrap Icons](https://icons.getbootstrap.com/).

Furthermore you can [add support by yourself](/vue-components/icon#custom-mapping) for any icon lib.

There are multiple types of icons in Quasar: webfont-based, svg-based and image-based. You are not bound to using only one type in your website/app.

::: tip
Related pages: [Installing Icon Libraries](/options/installing-icon-libraries) and [Quasar Icon Sets](/options/quasar-icon-sets).
:::

**API reference:** [QIcon](../../api/QIcon.md)

## Size & colors

The sizing of a QIcon is manipulated by the `font-size` CSS property. Also, QIcon inherits the current CSS text `color` used. For ease of use there are the QIcon `size` and `color` props.

**Example: Basic**

Source: [Basic.vue](../../examples/QIcon/Basic.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="text-purple q-gutter-md" style="font-size: 2em">
      <q-icon name="font_download" />
      <q-icon name="warning" />
      <q-icon name="format_size" />
      <q-icon name="print" />
      <q-icon name="today" />
      <q-icon name="style" />
    </div>

    <div class="q-mt-md q-gutter-md">
      <q-icon name="font_download" color="primary" size="32px" />
      <q-icon name="warning" color="warning" size="4rem" />
      <q-icon name="format_size" style="color: #ccc; font-size: 1.4em" />
      <q-icon name="print" color="teal" size="4.4em" />
      <q-icon name="today" class="text-orange" size="2em" />
      <q-icon name="style" size="3em" />
    </div>
  </div>
</template>
```

For `icon` properties on different Quasar components you won't have the means to specify an icon for each platform, but you can achieve the same effect with:

```html
<q-btn :icon="$q.platform.is.ios ? 'settings' : 'ion-ios-gear-outline'" />
```

**Example: Standard sizes**

Source: [StandardSizes.vue](../../examples/QIcon/StandardSizes.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="text-purple q-gutter-md">
      <q-icon
        v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']"
        :key="size"
        :size="size"
        name="font_download"
      />
    </div>
  </div>
</template>
```

## Webfont icons

::: warning
If you are using webfont-based icons, make sure that you [installed the icon library](/options/installing-icon-libraries) that you are using, otherwise it won't show up!
:::

### Webfont usage

```html
<q-icon name="..." />
```

| Quasar IconSet name       | Name prefix                                      | Examples                                 | Notes                                                                                                                                         |
| ------------------------- | ------------------------------------------------ | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| material-icons            | _None_                                           | thumb_up                                 | Notice the underline character instead of dash or space                                                                                       |
| material-icons-outlined   | o\_                                              | o_thumb_up                               | Notice the underline character instead of dash or space                                                                                       |
| material-icons-round      | r\_                                              | r_thumb_up                               | Notice the underline character instead of dash or space                                                                                       |
| material-icons-sharp      | s\_                                              | s_thumb_up                               | Notice the underline character instead of dash or space                                                                                       |
| material-symbols-outlined | sym*o*                                           | sym_o_thumb_up                           | Notice the underline character instead of dash or space                                                                                       |
| material-symbols-rounded  | sym*r*                                           | sym_r_thumb_up                           | Notice the underline character instead of dash or space                                                                                       |
| material-symbols-sharp    | sym*s*                                           | sym_s_thumb_up                           | Notice the underline character instead of dash or space                                                                                       |
| ionicons-v4               | ion-, ion-md-, ion-ios-, ion-logo-               | ion-heart, ion-logo-npm, ion-md-airplane | Use QIcon instead of `<ion-icon>` component; Logo icons require 'ion-logo-' prefix                                                            |
| fontawesome-v7            | fa-[solid,regular,brands] fa-                    | "fa-solid fa-ambulance"                  | QIcon "name" property is same as "class" attribute value in Fontawesome docs examples (where they show `<i>` tags)                            |
| fontawesome-v7 Pro        | fa-[solid,regular,brands,thin,light,duotone] fa- | "fa-solid fa-ambulance"                  | Note: a license must be purchased from Fontawesome for this functionality)                                                                    |
| mdi-v7                    | mdi-                                             | mdi-alert-circle-outline                 | Notice the use of dash characters                                                                                                             |
| eva-icons                 | eva-                                             | eva-shield-outline, eva-activity-outline | Notice the use of dash characters                                                                                                             |
| themify                   | ti-                                              | ti-hand-point-up                         | Notice the use of dash characters                                                                                                             |
| line-awesome              | la[s,r,l,d,b] la-                                | "las la-atom"                            | QIcon "name" property is same as "class" attribute value in Line Awesome docs examples (where they show `<i>` tags); **@quasar/extras v1.5+** |
| bootstrap-icons           | bi-                                              | bi-bug-fill                              | Notice the use of dash characters; **@quasar/extras v1.10+**                                                                                  |

### Naming convention

#### Material Icons (Google)

- Icon names are always in snake_case.
- Go to [Material Icons and Symbols](https://material.io/icons/), look for your desired icon. Remember its name (eg. "all_inbox") and use it.

#### MDI (Material Design Icons)

- Icon names are in hyphen-separated case and always begin with "mdi-" prefix.
- Go to [MDI](https://materialdesignicons.com/), look for your desired icon, click on it. A dialog box will appear. Get the title (eg. "account-key"), prefix it with "mdi-" and you get the result (eg. "mdi-account-key").

#### Fontawesome

- Icon names are in hyphen-serapated case and always begin with "fas fa-", "fab fa-", "fal fa-" or "far fa-" prefixes.
- Newer versions also have `fa-solid`, `fa-brands`, `fa-light` or `fa-regular` (pro also has `fa-thin`, `fa-duotone`)
- Go to [FontAwesome](https://fontawesome.com/icons), look for your desired icon, click on it. You'll get to its page. Below the icon name (as title), you will see something like `<i class="fa-solid fa-flag"></i>`. The result is `fa-solid fa-flag` (you can also use `fas fa-flag`).
- Note: `fas`, `far`, `fab`, `fal`, `fat` and `fad` are deprecated and may not be available in future major versions).

#### Ionicons

- Icon names are in hyphen-separated case and always begin with "ion-", "ion-md-", "ion-ios-" or "ion-logo-" prefixes.
- Go to [Ionicons (v4)](https://ionicons.com/v4), look for your desired icon, and click on it. At the bottom of the page, a popup will appear. Notice something like `<ion-icon name="square-outline"></ion-icon>`. Remember the name (eg. "square-outline"). Based on the variant that you want (auto-detect platform, material, or iOS), you'd get the result: `ion-square-outline` or `ion-md-square-outline` or `ion-ios-square-outline`.
- **Note:** Starting with v5, Ionicons no longer supplies a webfont. Also, they no longer have Material or IOS variants.

#### Eva Icons

- Icon names are in hyphen-separated case and always begin with "eva-" prefix.
- Go to [Eva Icons](https://akveo.github.io/eva-icons), look for your desired icon, click on it. A dialog box will appear. Get the name from there (eg. "attach-outline"), prefix it with "eva" and the result is "eva-attach-outline".

#### Themify

- Icon names are in hyphen-separated case and always begin with "ti-" prefix.
- Go to [Themify](https://themify.me/themify-icons), look for your desired icon. Remember its name (eg. "ti-arrow-top-right") and use it.

#### Line Awesome

- Icon names are in hyphen-separated case and always begin with "la" prefix.
- Go to [Line Awesome](https://icons8.com/line-awesome), look for your desired icon, click on it. A dialog box will appear. You'll see something like `<i class="lab la-behance-square"></i>`. Remember its name (eg. "lab la-behance-square") and use it.

#### Bootstrap Icons

- Icon names are in hyphen-separated case and always begin with "bi-" prefix.
- Go to [Bootstrap Icons](https://icons.getbootstrap.com/), look for your desired icon. Remember its name (eg. "bi-bug-fill") and use it.

## Svg icons

There are many advantages of using only svg icons in your website/app:

- Better app footprint -- only used icons will be included in the final build (treeshaking in action)
- Better quality icons
- No need for including equivalent webfonts from `@quasar/extras` or CDN.

The current disadvantage is that it is more tedious to use these icons than their webfont counterpart.

### Svg usage

```html A .vue file
<template>
  <div>
    <q-icon :name="matMenu" />
    <q-icon :name="fasFont" />
    <q-btn :icon="mdiAbTesting" />
  </div>
</template>

<script setup>
  import { matMenu } from '@quasar/extras/material-icons'
  import { mdiAbTesting } from '@quasar/extras/mdi-v7'
  import { fasFont } from '@quasar/extras/fontawesome-v7'
</script>
```

Notice that we are using `:` to bind variables instead of plain values, it's important. We must make those variables available to the template. The way to do that depends on your Vue API preference:

::: tip
If you are only using svg icons (and have configured a [Quasar Icon Set](/options/quasar-icon-sets)) then you don't need the webfont equivalent in your app at all.
:::

| Vendor                             | Quasar IconSet name           | Import Icons from                        | Requirements           |
| ---------------------------------- | ----------------------------- | ---------------------------------------- | ---------------------- |
| Material Icons (Google)            | svg-material-icons            | @quasar/extras/material-icons            |                        |
| Material Icons Outlined (Google)   | svg-material-icons-outlined   | @quasar/extras/material-icons-outlined   | @quasar/extras v1.9+;  |
| Material Icons Sharp (Google)      | svg-material-icons-sharp      | @quasar/extras/material-icons-sharp      | @quasar/extras v1.9+   |
| Material Icons Round (Google)      | svg-material-icons-round      | @quasar/extras/material-icons-round      | @quasar/extras v1.9+   |
| Material Symbols Outlined (Google) | svg-material-symbols-outlined | @quasar/extras/material-symbols-outlined | @quasar/extras v1.14+; |
| Material Symbols Sharp (Google)    | svg-material-symbols-sharp    | @quasar/extras/material-symbols-sharp    | @quasar/extras v1.14+  |
| Material Symbols Round (Google)    | svg-material-symbols-rounded  | @quasar/extras/material-symbols-rounded  | @quasar/extras v1.14+  |
| MDI (Material Design Icons) v3-v7  | svg-mdi-v7                    | @quasar/extras/mdi-v7 etc                | @quasar/extras v1.11+  |
| Font Awesome v7                    | svg-fontawesome-v7            | @quasar/extras/fontawesome-v7            | @quasar/extras v1.18+  |
| Ionicons v8                        | svg-ionicons-v8               | @quasar/extras/ionicons-v8               | @quasar/extras v1.12+  |
| Ionicons v4                        | svg-ionicons-v4               | @quasar/extras/ionicons-v4               |                        |
| Eva Icons                          | svg-eva-icons                 | @quasar/extras/eva-icons                 |                        |
| Themify Icons                      | svg-themify                   | @quasar/extras/themify                   |                        |
| Line Awesome                       | svg-line-awesome              | @quasar/extras/line-awesome              | @quasar/extras v1.5+   |
| Bootstrap Icons                    | svg-bootstrap-icons           | @quasar/extras/bootstrap-icons           | @quasar/extras v1.10+  |

### Import guide

Svg icons are supplied by `@quasar/extras` (although you can supply [your own svg icons](/vue-components/icon#svg-icon-format) too!). Here's the ins and outs of the import syntax:

#### SVG Material Icons (Google)

- Icon names are in camel-case and always begin with "mat" prefix.
- Go to [Material Icons](https://material.io/icons/), look for your desired icon and remember its name (eg. "all_inbox"), prefix it with "mat" and camel-case the result (eg. "matAllInbox").
- Import statement example: `import { matAllInbox } from '@quasar/extras/material-icons'`.

#### SVG Material Icons Outlined (Google)

- Icon names are in camel-case and always begin with "outlined" prefix.
- Go to [Material Icons](https://material.io/icons/), look for your desired icon and remember its name (eg. "all_inbox"), prefix it with "outlined" and camel-case the result (eg. "outlinedAllInbox").
- Import statement example: `import { outlinedAllInbox } from '@quasar/extras/material-icons-outlined'`.

#### SVG Material Icons Sharp (Google)

- Icon names are in camel-case and always begin with "sharp" prefix.
- Go to [Material Icons](https://material.io/icons/), look for your desired icon and remember its name (eg. "all_inbox"), prefix it with "sharp" and camel-case the result (eg. "sharpAllInbox").
- Import statement example: `import { sharpAllInbox } from '@quasar/extras/material-icons-sharp'`.

#### SVG Material Icons Round (Google)

- Icon names are in camel-case and always begin with "round" prefix.
- Go to [Material Icons](https://material.io/icons/), look for your desired icon and remember its name (eg. "all_inbox"), prefix it with "round" and camel-case the result (eg. "roundAllInbox").
- Import statement example: `import { roundAllInbox } from '@quasar/extras/material-icons-round'`.

#### SVG Material Symbols Outlined (Google)

- Icon names are in camel-case and always begin with "symOutlined" prefix.
- Go to [Material Icons](https://material.io/icons/), look for your desired icon and remember its name (eg. "all_inbox"), prefix it with "symOutlined" and camel-case the result (eg. "symOutlinedAllInbox").
- Import statement example: `import { symOutlinedAllInbox } from '@quasar/extras/material-symbols-outlined'`.

#### SVG Material Symbols Sharp (Google)

- Icon names are in camel-case and always begin with "symSharp" prefix.
- Go to [Material Icons](https://material.io/icons/), look for your desired icon and remember its name (eg. "all_inbox"), prefix it with "symSharp" and camel-case the result (eg. "symSharpAllInbox").
- Import statement example: `import { symSharpAllInbox } from '@quasar/extras/material-symbols-sharp'`.

#### SVG Material Symbols Rounded (Google)

- Icon names are in camel-case and always begin with "symRounded" prefix.
- Go to [Material Icons](https://material.io/icons/), look for your desired icon and remember its name (eg. "all_inbox"), prefix it with "symRounded" and camel-case the result (eg. "symRoundedAllInbox").
- Import statement example: `import { symRoundedAllInbox } from '@quasar/extras/material-symbols-rounded'`.

#### SVG MDI (Material Design Icons)

- Icon names are in camel-case and always begin with "mdi" prefix.
- Go to [MDI](https://materialdesignicons.com/), look for your desired icon, click on it. A dialog box will appear. Get the title (eg. "account-key"), prefix it with "mdi" and camel-case the result (eg. "mdiAccountKey").
- Import statement example: `import { mdiAccountKey } from '@quasar/extras/mdi-v7'`.

#### SVG Fontawesome

- Icon names are in camel-case and always begin with "fas", "fab", "fal" or "far" prefixes.
- Go to [FontAwesome](https://fontawesome.com/icons), look for your desired icon, click on it. You'll get to its page. Below the icon name (as title), you will see something like `<i class="fas fa-flag"></i>`. This would translate to `fasFlag`. The prefix from the tag is important.
- Note that we cannot supply the "Pro" version of the icons in svg format because of the license.
- Import statement example: `import { fasFlag } from '@quasar/extras/fontawesome-v7'`.
- The Quasar SVG form is still using `fas`, `far` and `fab`, instead of the newer `fa-solid`, `fa-regular` and `fa-brands`.

#### SVG Ionicons

- Ionicons v4: Icon names are in camel-case and always begin with "ionMd" or "ionIos" prefixes.
- Ionicons v8: Icon names are in camel-case and always begin with "ion" prefix.
- Ionicons v4: Go to [Ionicons v4](https://ionicons.com/v4/), look for your desired icon, click on it. At the bottom of the page there will appear a popup. Notice something like `<ion-icon name="square-outline"></ion-icon>`. Remember the name (eg. "square-outline"). Camel-case this name and prefix it with either "ionMd" (for material variant) or "ionIos" (for iOS variant).
- Ionicons v5/v6: Go to [Ionicons v6](https://ionicons.com/), look for your desired icon, click on it. At the bottom of the page there will appear a popup. Notice something like `<ion-icon name="square-outline"></ion-icon>`. Remember the name (eg. "square-outline"). Prefix it with "ion" and camel-case the result (eg. "ionSquareOutline").
- Ionicons v4: Import statement example: `import { ionMdSquareOutline } from '@quasar/extras/ionicons-v4'`.
- Ionicons v8: Import statement example: `import { ionSquareOutline } from '@quasar/extras/ionicons-v8'`.

#### SVG Eva Icons

- Icon names are in camel-case and always begin with "eva" prefix.
- Go to [Eva Icons](https://akveo.github.io/eva-icons), look for your desired icon, click on it. A dialog box will appear. Get the name from there (eg. "attach-outline"), prefix it with "eva" and camel-case the result (eg. "evaAttachOutline").
- Import statement example: `import { evaAttachOutline } from '@quasar/extras/eva-icons'`.

#### SVG Themify

- Icon names are in camel-case and always begin with "ti" prefix.
- Go to [Themify](https://themify.me/themify-icons), look for your desired icon. Remember its name (eg. "ti-arrow-top-right"), prefix it with "ti" and camel-case the result (eg. "tiArrowTopRight").
- Import statement example: `import { tiArrowTopRight } from '@quasar/extras/themify'`.

#### SVG Line Awesome

- Icon names are in camel-case and always begin with "la" prefix.
- Go to [Line Awesome](https://icons8.com/line-awesome), look for your desired icon, click on it. A dialog box will appear. You'll see something like `<i class="lab la-behance-square"></i>`. This would translate to: `laBehanceSquare`. There is a special case though (only for solid icons!): if the prefix before "la-" is "las" (eg. `<i class="las la-atom"></i>`), then you need to suffix "la-atom" with "-solid" and camel-case the result (eg. `laAtomSolid`).
- Import statement example: `import { laBehanceSquare } from '@quasar/extras/line-awesome'`.

#### SVG Bootstrap Icons

- Icon names are in camel-case and always begin with "bi" prefix.
- Go to [Bootstrap Icons](https://icons.getbootstrap.com/), look for your desired icon. Remember its name (eg. "bi-bug-fill"), camel-case the result (eg. "biBugFill").
- Import statement example: `import { biBugFill } from '@quasar/extras/bootstrap-icons'`.

### Svg icon format

You can also supply your own svg icons. An svg icon is essentially a String with the following syntax:

```
Syntax: "<path>&&<path>&&...|<viewBox>"
           P       P             V
                (optional)   (optional)
                             (default: 0 0 24 24)

P is a path tag with following syntax (each are attributes):
        "<d>@@<style>@@<transform>"
        (required)
            (optional)
                     (optional)
```

Examples:

```
// Simplest ("<path>"):
  M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z

// equivalent to:
<svg viewBox="0 0 24 24">
  <path d="M9 3L5 6.99h3V....."/>
</svg>
```

```
// Simplest with custom viewBox ("<path>|<viewBox>"):
  M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z|0 0 104 104

// equivalent to:
<svg viewBox="0 0 104 104">
  <path d="M9 3L5 6.99h3V....."/>
</svg>
```

```
// Path with custom style ("<path>@@<style>|<viewBox>"):
  M48,96L464,96 464,416 48,416z@@fill:none;stroke:currentColor.....|0 0 512 512

// equivalent to:
<svg viewBox="0 0 512 512">
  <path d="M416,480,256,357....." style="fill:none;stroke:curren..." />
</svg>
```

```
// Path with custom style and transform ("<path>@@<style>@@transform"):
  M9 3L5 6.99h3V...@@fill:none;stroke:cu.....@@translate(10 1) rotate(180)

// equivalent to:
<svg viewBox="0 0 24 24">
  <path
    d="M9 3L5 6.99h3V....."
    style="fill:none;stroke:curren..."
    transform="translate(10 1) rotate(180)"
  />
</svg>
```

```
// Path with custom transform ("<path>@@@@transform"):
// (Notice style separator is still specified)

  M9 3L5 6.99h3V...@@@@translate(2 4) rotate(180)

// equivalent to:
<svg viewBox="0 0 24 24">
  <path
    d="M9 3L5 6.99h3V....."
    transform="translate(2 4) rotate(180)"
  />
</svg>
```

```
// Multi-paths -- any number of paths are possible ("<path>&&<path>|<viewBox>"):
  M416,480,256,357.41,96,480V32H416Z&&M368,64L144 256 368 448 368 64z|0 0 512 512

// equivalent to:
<svg viewBox="0 0 512 512">
  <path d="M416,480,256,357....." />
  <path d="M368,64L144 256 368...." />
</svg>
```

```
// Multi-paths, each with style and transform ("<path>&&<path>|<viewBox>"):
  M9 3L5 6.99h3V...@@stroke-width:5px@@rotate(45)&&M416,480,256,...@@stroke-width:2px@@rotate(15)&&M368,64L144 2...@@stroke-width:12px@@rotate(5)|0 0 512 512

// equivalent to:
<svg viewBox="0 0 512 512">
  <path
    d="M9 3L5 6.99h3V....."
    style="stroke-width:5px"
    transform="rotate(45)"
  />
  <path
    d="M416,480,256,..."
    style="stroke-width:2px"
    transform="rotate(15)"
  />
  <path
    d="M368,64L144 2..."
    style="stroke-width:12px"
    transform="rotate(5)"
  />
</svg>
```

## SVG-use way

This svg method allows you to store the SVG files as static assets and reference them.

```html /public/icons.svg
<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="icon-1" viewBox="0 0 24 24">
    <path d="..."></path>
  </symbol>
  <symbol id="icon-2" viewBox="0 0 24 24">
    <path d="..."></path>
  </symbol>
</svg>
```

The standard HTML way is to include the file and specify the icon with the `svg use` tag.

```html
<svg>
  <use xlink:href="icons.svg#icon-1"></use>
</svg>
```

To use this with Quasar through QIcon (make sure that you are referencing the correct file from your public folder):

```html
<q-icon name="svguse:icons.svg#icon-1">
  <!-- or -->
  <q-btn-dropdown
    label="Custom Content"
    dropdown-icon="svguse:icons.svg#icon-2"
/></q-icon>
```

By default, the parent svg's viewBox is "0 0 24 24". However, you can also specify a custom one:

```html
<q-icon name="svguse:icons.svg#icon-1|10 15 40 40" />
```

## Inlined svg

If you don't want to use the webfont or svg variants from above, note that QIcon also supports one inlined `<svg>` tag (the content of the svg can be anything, not only a path).

Reasoning on why to use an `<svg>` in a QIcon is that the svg will respect the size and color as any QIcon through its props. Without these features, you're better off inlining the svg in your templates without wrapping with QIcon.

```html
<q-icon color="accent" size="5rem">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"
    />
  </svg>
</q-icon>
```

Some limitations:

- do not use "height"/"width" attributes on the `<svg>` tag (it will break QIcon's way of handling the size)
- all `<path>`s will have "fill: currentColor" CSS applied by default; if you don't want that, then add `fill="none"` to the `<path>` tag

## Image icons

You can also make an icon point to an image URL instead of relying on any webfont, by using the `img:` prefix.

**All icon related props of Quasar components can make use of this.**

```html
<q-icon name="img:/logo/logo.svg" />
<q-btn icon="img:/logo/logo.svg" ... />

<!-- reference from /public: -->
<q-icon name="img:my/path/to/some.svg" />
```

::: tip
Remember that you can place images in your `/public` folder too and point to them. You don't always need a full URL.
:::

This is not restricted to SVG only. You can use whatever image type you want (png, jpg, ...):

```html
<q-icon name="img:bla/bla/my.png" />
<q-btn icon="img:bla/bla/my.jpg" ... />
<q-input clearable clear-icon="img:bla/bla/my.gif" ... />
```

It is also possible to inline the image (svg, png, jpeg, gif...) and dynamically change its style (svg):

```html
<q-icon
  name="img:data:image/svg+xml;charset=utf8,<svg xmlns='http://www.w3.org/2000/svg' height='140' width='500'><ellipse cx='200' cy='80' rx='100' ry='50' style='fill:yellow;stroke:purple;stroke-width:2' /></svg>"
/>
```

**Example: Dynamic SVG**

Source: [DynamicSvg.vue](../../examples/QIcon/DynamicSvg.vue)

```vue
<template>
  <div class="q-pa-md row no-wrap items-center justify-around">
    <q-icon size="100px" :name="girlSvg" />

    <q-btn
      :dense="$q.screen.xs"
      no-caps
      label="Face"
      icon-right="colorize"
      color="primary"
    >
      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
        <q-color v-model="colorFace" />
      </q-popup-proxy>
    </q-btn>

    <q-btn
      :dense="$q.screen.xs"
      no-caps
      label="Hair"
      icon-right="colorize"
      color="secondary"
    >
      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
        <q-color v-model="colorHair" />
      </q-popup-proxy>
    </q-btn>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const colorFace = ref('#B33636')
const colorHair = ref('#FFD700')

const girlSvg = computed(() => {
  const face = colorFace.value.replace('#', '%23')
  const hair = colorHair.value.replace('#', '%23')
  return `img:data:image/svg+xml;charset=utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="none" fill="${face}"><path fill="none" d="M0 0h24v24H0V0z"/><path stroke="${hair}" fill="${hair}" stroke-linecap="round" opacity=".5" d="M17.5 8c.46 0 .91-.05 1.34-.12C17.44 5.56 14.9 4 12 4c-.46 0-.91.05-1.34.12C12.06 6.44 14.6 8 17.5 8zM8.08 5.03C6.37 6 5.05 7.58 4.42 9.47c1.71-.97 3.03-2.55 3.66-4.44z"/><path stroke="none" fill="${face}" stroke-linecap="round"  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c2.9 0 5.44 1.56 6.84 3.88-.43.07-.88.12-1.34.12-2.9 0-5.44-1.56-6.84-3.88.43-.07.88-.12 1.34-.12zM8.08 5.03C7.45 6.92 6.13 8.5 4.42 9.47 5.05 7.58 6.37 6 8.08 5.03zM12 20c-4.41 0-8-3.59-8-8 0-.05.01-.1.01-.15 2.6-.98 4.68-2.99 5.74-5.55 1.83 2.26 4.62 3.7 7.75 3.7.75 0 1.47-.09 2.17-.24.21.71.33 1.46.33 2.24 0 4.41-3.59 8-8 8z"/><circle cx="9" cy="13" r="1.25"/><circle cx="15" cy="13" r="1.25"/></svg>`
})
</script>
```

You can also base64 encode an image and supply it. The example below is with a QBtn, but the same principle is involved when dealing with any icon prop or with QIcon:

```html
<q-btn
  icon="
img:data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
  ...
/>
```

## Custom mapping

Should you want, you can customize the mapping of icon names. This can be done by providing a custom icon map function. There are several ways to provide one:

- Set `IconSet.iconMapFn` in an entry file:
  - In a boot file if using Quasar CLI (with Vite)
  - In `main.js`/`main.ts`(_or similar_) if using Quasar Vite plugin
  - In any suitable file or script tag if using UMD
- Set `$q.iconMapFn` in the root component, e.g. `App.vue`:
  - At the top-level if using Composition API with `<script setup>`
  - In the `setup()` function if using Composition API
  - In the `created()` hook if using Options API
- Set `iconMapFn` in Quasar Vue plugin options > config, e.g. `app.use(Quasar, { config: { iconMapFn } })` (for flavours other than Quasar CLI).

We will use the `$q.iconMapFn` approach using `<script setup>` in the use case examples below, but the same principle applies to the other methods.

The structure of `iconMapFn` is as follows:

```ts
type GlobalQuasarIconMapFn = (iconName: string) =>
  // Map to another existing icon
  | {
      icon: string // the mapped icon string, which will be handled
      // by Quasar as if the original QIcon name was this value
    }
  // Define how to interpret the icon
  | {
      cls: string // class name(s)
      content?: string // optional, in case you are using a ligature font
      // and you need it as content of the QIcon
    }
  // Leave it as is, default Quasar handling
  | void
```

Mapping icons will not only affect QIcon, but also any other Quasar component that uses icons like QBtn, QInput, and more.

#### Use case 1: Simply mapping a few icons

```js
import { useQuasar } from 'quasar'

const myIcons = {
  'app:icon1': 'img:/path/to/icon1.svg',
  'app:icon2': 'img:/path/to/icon2.svg',
  'app:copy': 'fas fa-copy'
}

// ...
const $q = useQuasar()

$q.iconMapFn = iconName => {
  const icon = myIcons[iconName]
  if (icon !== undefined) {
    return { icon }
  }
}
```

Now we can use `<q-icon name="app:copy" />` or `<q-icon name="app:icon1" />` and QIcon will treat "app:copy" and "app:icon1" as if they were written as "fas fa-copy" and "img:/path/to/icon1.svg". The same applies to any other Quasar component that uses icons, e.g. `<q-btn icon="app:copy" />`.

#### Use case 2: Support for custom icon library

This is especially useful when you are using a custom icon library (that doesn't come with Quasar and its `@quasar/extras` package).

```js
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Example of adding support for `<q-icon name="app:...." />`
// This includes support for all "icon" props of Quasar components

$q.iconMapFn = iconName => {
  // iconName is the content of QIcon "name" prop (or related icon prop of other Quasar components)

  // can be any logic you want, but for this example:
  if (iconName.startsWith('app:')) {
    // we strip the "app:" part
    const name = iconName.substring(4)

    return {
      cls: 'my-app-icon ' + name
    }
  }

  // when we don't return anything from our iconMapFn,
  // the default Quasar icon mapping takes over
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
  font-weight: 400; /* webfont.... */
  src:
    url('./my-app-icon.woff2') format('woff2'),
    url('./my-app-icon.woff') format('woff');
}
```

We should then add the newly created CSS file into our app:

- Quasar CLI: Add it to the `css` array in quasar.config file
  ```js
  // quasar.config file
  css: [
    // ....
    'my-app-icon.css'
  ]
  ```
- Other: Add it to your CSS file, import it in your `main.js`/`main.ts` or include it in your HTML file:

  ```
  // in your main.js/main.ts
  import '@/css/my-app-icon.css'

  // or in the main css file
  @import url('./my-app-icon.css');

  // or in your HTML file (UMD)
  <link rel="stylesheet" href="/css/my-app-icon.css">
  ```

And also add "my-app-icon.woff2" and "my-app-icon.woff" files into the same folder as "my-app-icon.css" (or somewhere else, but edit the relative paths (see "src:" above) to the woff/woff2 files).
