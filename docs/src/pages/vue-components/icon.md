---
title: Icon
desc: The QIcon Vue component allows you to insert icons within other components or any other area of your pages.
related:
  - /options/installing-icon-libraries
  - /options/quasar-icon-sets
---

The QIcon component allows you to easily insert icons within other components or any other area of your pages.
Quasar currently supports: [Material Icons](https://material.io/icons/) , [Font Awesome](http://fontawesome.io/icons/), [Ionicons](http://ionicons.com/), [MDI](https://materialdesignicons.com/), [Eva Icons](https://akveo.github.io/eva-icons) and [Themify Icons](https://themify.me/themify-icons).

::: tip
Related pages: [Installing Icon Libraries](/options/installing-icon-libraries) and [Quasar Icon Sets](/options/quasar-icon-sets).
:::

## Installing
<doc-installation components="QIcon" />

## Usage
::: warning
Make sure that you [installed the icon library](/options/installing-icon-libraries) that you are using, otherwise it won't show up!
:::

### Icons name cheatsheet

```html
<q-icon name="..." />
```

| Name | Prefix | Examples | Notes |
| --- | --- | --- | --- |
| material-icons | *None* | thumb_up | Notice the underline character instead of dash or space |
| material-icons-outlined | o_ | o_thumb_up | Notice the underline character instead of dash or space; **Requires Quasar 1.0.5+** |
| material-icons-round | r_ | r_thumb_up | Notice the underline character instead of dash or space; **Requires Quasar 1.0.5+** |
| material-icons-sharp | s_ | s_thumb_up | Notice the underline character instead of dash or space; **Requires Quasar 1.0.5+** |
| ionicons-v4 | ion-, ion-md-, ion-ios-, ion-logo- | ion-heart, ion-logo-npm, ion-md-airplane | Use QIcon instead of `<ion-icon>` component; Logo icons require 'ion-logo-' prefix |
| fontawesome-v5 | fa[s,r,l,b] fa- | "fas fa-ambulance" | QIcon "name" property is same as "class" attribute value in Fontawesome docs examples (where they show `<i>` tags) |
| mdi-v4 | mdi- | mdi-alert-circle-outline | Notice the use of dash characters |
| mdi-v3 | mdi- | mdi-alert-circle-outline | Notice the use of dash characters |
| eva-icons | eva- | eva-shield-outline, eva-activity-outline | Notice the use of dash characters |
| themify | ti- | ti-hand-point-up | Notice the use of dash characters |

### Size & colors
All icons are **webfont icons**. This means that you can change size by manipulating `font-size` CSS property. And also, they inherit the current CSS text `color` used.

<doc-example title="Basic" file="QIcon/Basic" />

For `icon` properties on different Quasar components you won't have the means to specify an icon for each platform, but you can achieve the same effect with:

```html
<q-btn
  :icon="$q.platform.is.ios ? 'settings' : 'ion-ios-gear-outline'"
/>
```

<doc-example title="Standard sizes" file="QIcon/StandardSizes" />

### Images instead of webfont
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

## QIcon API
<doc-api file="QIcon" />
