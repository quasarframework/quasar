<!-- This file is generated from build/README.template.md by the extras build. Do not edit README.md directly. -->

![Quasar Framework logo](https://cdn.quasar.dev/logo-v2/header.png)

## Quasar Framework Extras Package

> Build high-performance VueJS user interfaces in record time: responsive Single Page Apps, SSR Apps, PWAs, Browser extensions, Hybrid Mobile Apps and Electron Apps. If you want, all using the same codebase!

<img src="https://img.shields.io/npm/v/%40quasar/extras.svg?label=@quasar/extras">

[![Join the chat at https://chat.quasar.dev](https://img.shields.io/badge/chat-on%20discord-7289da.svg)](https://chat.quasar.dev)
<a href="https://forum.quasar.dev" target="_blank"><img src="https://img.shields.io/badge/community-forum-brightgreen.svg"></a>
[![https://good-labs.github.io/greater-good-affirmation/assets/images/badge.svg](https://good-labs.github.io/greater-good-affirmation/assets/images/badge.svg)](https://good-labs.github.io/greater-good-affirmation)

## Why?

Why this package? Because it strips down unnecessary package files (so faster download times), all in one place, tested and ready to use with Quasar. One other reason is that the material icons npm package sometimes fails to be downloaded by NPM.

## Contents

Please make sure you have latest `@quasar/extras` npm package version installed into your project folder in order for you to benefit from everything below.

### Webfonts

| Vendor                                                                          | Version  | quasar.conf.js extras name  | Description                                          | Notes                          | License                                              |
| ------------------------------------------------------------------------------- | -------- | --------------------------- | ---------------------------------------------------- | ------------------------------ | ---------------------------------------------------- |
| Roboto Font                                                                     | CDN v51  | `roboto-font`               | Recommended font along Material theme                |                                | [License](exports/roboto-font/LICENSE)               |
| Roboto Font Latin Extended                                                      | CDN v51  | `roboto-font-latin-ext`     | Recommended font along Material theme                |                                | [License](exports/roboto-font-latin-ext/LICENSE)     |
| [Material Icons](https://material.io/tools/icons/?style=baseline) (Google)      | CDN v145 | `material-icons`            | Material icons font                                  | Requires: @quasar/extras 1.2+  | [License](exports/material-icons/LICENSE)            |
| [Material Icons Outlined](https://material.io/tools/icons/?style=outline)       | CDN v110 | `material-icons-outlined`   | Material icons outlined font                         | Requires: @quasar/extras 1.2+  | [License](exports/material-icons-outlined/LICENSE)   |
| [Material Icons Round](https://material.io/tools/icons/?style=round)            | CDN v109 | `material-icons-round`      | Material icons round font                            | Requires: @quasar/extras 1.2+  | [License](exports/material-icons-round/LICENSE)      |
| [Material Icons Sharp](https://material.io/tools/icons/?style=sharp)            | CDN v110 | `material-icons-sharp`      | Material icons sharp font                            | Requires: @quasar/extras 1.2+  | [License](exports/material-icons-sharp/LICENSE)      |
| [Material Symbols Outlined](https://fonts.google.com/icons?icon.style=Outlined) | CDN v355 | `material-symbols-outlined` | Material symbols outlined font                       | Requires: @quasar/extras 1.14+ | [License](exports/material-symbols-outlined/LICENSE) |
| [Material Symbols Rounded](https://fonts.google.com/icons?icon.style=Rounded)   | CDN v356 | `material-symbols-rounded`  | Material symbols rounded font                        | Requires: @quasar/extras 1.14+ | [License](exports/material-symbols-rounded/LICENSE)  |
| [Material Symbols Sharp](https://fonts.google.com/icons?icon.style=Sharp)       | CDN v352 | `material-symbols-sharp`    | Material symbols sharp font                          | Requires: @quasar/extras 1.14+ | [License](exports/material-symbols-sharp/LICENSE)    |
| [MDI v7](https://materialdesignicons.com/) (Material Design Icons)              | 7.4.47   | `mdi-v7`                    | Extended Material Design icons font                  | Requires: @quasar/extras 1.15+ | [License](exports/mdi-v7/LICENSE)                    |
| [Font Awesome v7](https://fontawesome.com/icons)                                | 7.3.0    | `fontawesome-v7`            | Fontawesome icons font                               | Requires: @quasar/extras 1.18+ | [License](exports/fontawesome-v7/LICENSE.txt)        |
| [Ionicons](https://ionicons.com/v4)                                             | 4.6.3    | `ionicons-v4`               | Ionicons font                                        |                                | [License](exports/ionicons-v4/LICENSE)               |
| [Eva Icons](https://akveo.github.io/eva-icons)                                  | 1.1.3    | `eva-icons`                 | Eva Icons font                                       |                                | [License](exports/eva-icons/LICENSE)                 |
| [Themify Icons](https://themify.me/themify-icons)                               | 0.1.2    | `themify`                   | Themify Icons font                                   |                                | [License](exports/themify/LICENSE)                   |
| [Line Awesome](https://icons8.com/line-awesome)                                 | 1.3.0    | `line-awesome`              | Line Awesome font                                    | Requires: @quasar/extras 1.5+  | [License](exports/line-awesome/LICENSE.md)           |
| [Bootstrap Icons](https://icons.getbootstrap.com/)                              | 1.13.1   | `bootstrap-icons`           | Bootstrap Icons font                                 | Requires: @quasar/extras 1.10+ | [License](exports/bootstrap-icons/LICENSE)           |
| [Animate.css](https://animate.style/)                                           | 4.1.1    | Use `animations` prop       | Bundle of animations you can use in your website/app |                                | [License](exports/animate/LICENSE)                   |

> Install one of MDI v6, MDI v5, MDI v4 or MDI v3, but never together at the same time.

> Note that ionicons v5+ no longer comes with a webfont.

### SVG

> Quasar v1.7+ required for svg Quasar Icon Sets.

| Vendor                                                                                   | Version  | Quasar IconSet name             | Import Icons from                          | Notes                                                     | License                                              |
| ---------------------------------------------------------------------------------------- | -------- | ------------------------------- | ------------------------------------------ | --------------------------------------------------------- | ---------------------------------------------------- |
| [Material Icons](https://material.io/tools/icons/?style=baseline) (Google)               | CDN v145 | `svg-material-icons`            | `@quasar/extras/material-icons`            |                                                           | [License](exports/material-icons/LICENSE)            |
| [Material Icons Outlined](https://material.io/tools/icons/?style=outlined) (Google)      | CDN v110 | `svg-material-icons-outlined`   | `@quasar/extras/material-icons-outlined`   | Requires: @quasar/extras 1.9+                             | [License](exports/material-icons-outlined/LICENSE)   |
| [Material Icons Round](https://material.io/tools/icons/?style=round) (Google)            | CDN v109 | `svg-material-icons-round`      | `@quasar/extras/material-icons-round`      | Requires: @quasar/extras 1.9+                             | [License](exports/material-icons-round/LICENSE)      |
| [Material Icons Sharp](https://material.io/tools/icons/?style=sharp) (Google)            | CDN v110 | `svg-material-icons-sharp`      | `@quasar/extras/material-icons-sharp`      | Requires: @quasar/extras 1.9+                             | [License](exports/material-icons-sharp/LICENSE)      |
| [Material Symbols Outlined](https://fonts.google.com/icons?icon.style=Outlined) (Google) | CDN v355 | `svg-material-symbols-outlined` | `@quasar/extras/material-symbols-outlined` | Requires: @quasar/extras 1.14+                            | [License](exports/material-symbols-outlined/LICENSE) |
| [Material Symbols Rounded](https://fonts.google.com/icons?icon.style=Rounded) (Google)   | CDN v356 | `svg-material-symbols-rounded`  | `@quasar/extras/material-symbols-rounded`  | Requires: @quasar/extras 1.14+                            | [License](exports/material-symbols-rounded/LICENSE)  |
| [Material Symbols Sharp](https://fonts.google.com/icons?icon.style=Sharp) (Google)       | CDN v352 | `svg-material-symbols-sharp`    | `@quasar/extras/material-symbols-sharp`    | Requires: @quasar/extras 1.14+                            | [License](exports/material-symbols-sharp/LICENSE)    |
| [MDI v7](https://materialdesignicons.com/) (Material Design Icons)                       | 7.4.47   | `svg-mdi-v7`                    | `@quasar/extras/mdi-v7`                    |                                                           | [License](exports/mdi-v7/LICENSE)                    |
| [Font Awesome v7](https://fontawesome.com/icons)                                         | 7.3.0    | `svg-fontawesome-v7`            | `@quasar/extras/fontawesome-v7`            | Requires: @quasar/extras 1.17+                            | [License](exports/fontawesome-v7/LICENSE.txt)        |
| [Ionicons v8](https://ionicons.com/)                                                     | 8.0.13   | `svg-ionicons-v8`               | `@quasar/extras/ionicons-v8`               | Requires: @quasar/extras 1.18+                            | [Icon License](exports/ionicons-v8/LICENSE)          |
| Ionicons v4                                                                              | 4.6.3    | `svg-ionicons-v4`               | `@quasar/extras/ionicons-v4`               | No icon font (woff/woff2) files for Ionicons since v4.6.3 | [Icon License](exports/ionicons-v4/LICENSE)          |
| [Eva Icons](https://akveo.github.io/eva-icons)                                           | 1.1.3    | `svg-eva-icons`                 | `@quasar/extras/eva-icons`                 |                                                           | [License](exports/eva-icons/LICENSE)                 |
| [Themify Icons](https://themify.me/themify-icons)                                        | 0.1.2    | `svg-themify`                   | `@quasar/extras/themify`                   |                                                           | [License](exports/themify/LICENSE)                   |
| [Line Awesome](https://icons8.com/line-awesome)                                          | 1.3.0    | `svg-line-awesome`              | `@quasar/extras/line-awesome`              | Requires: @quasar/extras 1.5+                             | [License](exports/line-awesome/LICENSE.md)           |
| [Bootstrap Icons](https://icons.getbootstrap.com/)                                       | 1.13.1   | `svg-bootstrap-icons`           | `@quasar/extras/bootstrap-icons`           | Requires: @quasar/extras 1.10+                            | [License](exports/bootstrap-icons/LICENSE)           |

Example:

Using `<script setup>`:

```html
// some .vue file in devland
<template>
  <div>
    <q-icon :name="matMenu" />
    <q-btn :icon="mdiAbTesting" />
  </div>
</template>

<script setup>
  import { matMenu } from '@quasar/extras/material-icons'
  import { mdiAbTesting } from '@quasar/extras/mdi-v7'
</script>
```

Using the Options API:

```html
// some .vue file in devland
<template>
  <div>
    <q-icon :name="matMenu" />
    <q-btn :icon="mdiAbTesting" />
  </div>
</template>

<script>
import { matMenu } from '@quasar/extras/material-icons'
import { mdiAbTesting } from '@quasar/extras/mdi-v7'

export default {
  // ...
  created () {
    this.matMenu = matMenu
    this.mdiAbTesting = mdiAbTesting
  }
}
```

### QIcon cheatsheet

```html
<q-icon name="..." />
```

| Name                    | Prefix                             | Examples                                 | Notes                                                                                                               | License |
| ----------------------- | ---------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------- |
| material-icons          | _None_                             | thumb_up                                 | Notice the underline character instead of dash or space                                                             |         |
| material-icons-outlined | o\_                                | o_thumb_up                               | Notice the underline character instead of dash or space                                                             |         |
| material-icons-round    | r\_                                | r_thumb_up                               | Notice the underline character instead of dash or space                                                             |         |
| material-icons-sharp    | s\_                                | s_thumb_up                               | Notice the underline character instead of dash or space                                                             |         |
| ionicons-v8             | ion-, ion-md-, ion-ios-, ion-logo- | ion-heart, ion-logo-npm, ion-md-airplane | Use QIcon instead of `<ion-icon>` component; Logo icons require 'ion-logo-' prefix                                  |         |
| fontawesome-v7          | fa[s,r,l,b,d] fa-                  | "fas fa-ambulance"                       | QIcon "name" property is same as "class" attribute value in Fontawesome docs examples (where they show `<i>` tags)  |         |
| mdi-v7                  | mdi-                               | mdi-alert-circle-outline                 | Notice the use of dash characters                                                                                   |         |
| eva-icons               | eva-                               | eva-shield-outline, eva-activity-outline | Notice the use of dash characters                                                                                   |         |
| themify                 | ti-                                | ti-hand-point-up                         | Notice the use of dash characters                                                                                   |         |
| line-awesome            | la[s,r,l,b,d] la-                  | "las la-atom"                            | QIcon "name" property is same as "class" attribute value in Line Awesome docs examples (where they show `<i>` tags) |         |
| bootstrap-icons         | bi-                                | bi-bug-fill                              | Notice the use of dash characters                                                                                   |         |

### SVG name format

Svg icons will be defined as String with the following syntax:

```
Syntax: "<path>|<viewBox>" or "<path>" (with implicit viewBox of '0 0 24 24')
Examples:
  M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z|0 0 24 24
  M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z
```

## Supporting Quasar

Quasar Framework is an MIT-licensed open source project. Its ongoing development is made possible thanks to the support by these awesome [backers](https://github.com/quasarframework/quasar/blob/dev/backers.md).

**Please read our manifest on [Why donations are important](https://quasar.dev/why-donate)**. If you'd like to become a donator, check out [Quasar Framework's Donator campaign](https://donate.quasar.dev).

## Documentation

Head on to the Quasar Framework official website: [https://quasar.dev](https://quasar.dev)

## Stay in Touch

For latest releases and announcements, follow on Twitter: [@quasarframework](https://twitter.quasar.dev)

## Chat Support

Ask questions at the official community Discord server: [https://chat.quasar.dev](https://chat.quasar.dev)

## Community Forum

Head on to the official community forum: [https://forum.quasar.dev](https://forum.quasar.dev)

## Semver

Using [semver 2.0](http://semver.org/) notation for '@quasar/extras' package.

## License

All assets included in this repository are exclusive property of their respective owners and licensed under their own respective licenses. Quasar does not take any credit in packages included here.
