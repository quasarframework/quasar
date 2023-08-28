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

| Vendor                                                                          | Version  | quasar.conf.js extras name  | Description                                          | Notes                          | License                                      |
| ------------------------------------------------------------------------------- | -------- | --------------------------- | ---------------------------------------------------- | ------------------------------ | -------------------------------------------- |
| Roboto Font                                                                     | CDN v30  | `roboto-font`               | Recommended font along Material theme                |                                | [License](roboto-font/LICENSE)               |
| Roboto Font Latin Extended                                                      | CDN v30  | `roboto-font-latin-ext`     | Recommended font along Material theme                |                                | [License](roboto-font-latin-ext/LICENSE)     |
| [Material Icons](https://material.io/tools/icons/?style=baseline) (Google)      | CDN v140 | `material-icons`            | Material icons font                                  | Requires: @quasar/extras 1.2+  | [License](material-icons/LICENSE)            |
| [Material Icons Outlined](https://material.io/tools/icons/?style=outline)       | CDN v109 | `material-icons-outlined`   | Material icons outlined font                         | Requires: @quasar/extras 1.2+  | [License](material-icons-outlined/LICENSE)   |
| [Material Icons Round](https://material.io/tools/icons/?style=round)            | CDN v108 | `material-icons-round`      | Material icons round font                            | Requires: @quasar/extras 1.2+  | [License](material-icons-round/LICENSE)      |
| [Material Icons Sharp](https://material.io/tools/icons/?style=sharp)            | CDN v109 | `material-icons-sharp`      | Material icons sharp font                            | Requires: @quasar/extras 1.2+  | [License](material-icons-sharp/LICENSE)      |
| [Material Symbols Outlined](https://fonts.google.com/icons?icon.style=Outlined) | CDN v134 | `material-symbols-outlined` | Material symbols outlined font                       | Requires: @quasar/extras 1.14+ | [License](material-symbols-outlined/LICENSE) |
| [Material Symbols Rounded](https://fonts.google.com/icons?icon.style=Rounded)   | CDN v133 | `material-symbols-rounded`  | Material symbols rounded font                        | Requires: @quasar/extras 1.14+ | [License](material-symbols-round/LICENSE)    |
| [Material Symbols Sharp](https://fonts.google.com/icons?icon.style=Sharp)       | CDN v130 | `material-symbols-sharp`    | Material symbols sharp font                          | Requires: @quasar/extras 1.14+ | [License](material-symbols-sharp/LICENSE)    |
| [MDI v7](https://materialdesignicons.com/) (Material Design Icons)              | 7.2.96   | `mdi-v7`                    | Extended Material Design icons font                  | Requires: @quasar/extras 1.15+ | [License](mdi-v7/LICENSE)                    |
| MDI v6 (Material Design Icons)                                                  | 6.9.96   | `mdi-v6`                    | Extended Material Design icons font                  |                                | [License](mdi-v6/LICENSE)                    |
| MDI v5 (Material Design Icons)                                                  | 5.9.55   | `mdi-v5`                    | Extended Material Design icons font                  |                                | [License](mdi-v5/LICENSE)                    |
| MDI v4 (Material Design Icons)                                                  | 4.9.95   | `mdi-v4`                    | Extended Material Design icons font                  |                                | [License](mdi-v4/license.md)                 |
| MDI v3 (Material Design Icons)                                                  | 3.6.95   | `mdi-v3`                    | Extended Material Design icons font                  |                                | [License](mdi-v3/LICENSE)                    |
| [Font Awesome v6](https://fontawesome.com/icons)                                | 6.4.2    | `fontawesome-v6`            | Fontawesome icons font                               | Requires: @quasar/extras 1.13+ | [License](fontawesome-v6/LICENSE.txt)        |
| Font Awesome v5                                                                 | 5.15.4   | `fontawesome-v5`            | Fontawesome icons font                               |                                | [License](fontawesome-v5/LICENSE.txt)        |
| [Ionicons](https://ionicons.com/v4)                                             | 4.6.3    | `ionicons-v4`               | Ionicons font                                        |                                | [License](ionicons-v4/LICENSE)               |
| [Eva Icons](https://akveo.github.io/eva-icons)                                  | 1.1.3    | `eva-icons`                 | Eva Icons font                                       |                                | [License](eva-icons/LICENSE)                 |
| [Themify Icons](https://themify.me/themify-icons)                               | 1.0.1    | `themify`                   | Themify Icons font                                   |                                | [License](themify/LICENSE)                   |
| [Line Awesome](https://icons8.com/line-awesome)                                 | 1.3.0    | `line-awesome`              | Line Awesome font                                    | Requires: @quasar/extras 1.5+  | [License](line-awesome/LICENSE.md)           |
| [Bootstrap Icons](https://icons.getbootstrap.com/)                              | 1.10.5   | `bootstrap-icons`           | Bootstrap Icons font                                 | Requires: @quasar/extras 1.10+ | [License](bootstrap-icons/LICENSE.md)        |
| [Animate.css](https://animate.style/)                                           | 4.1.1    | Use `animations` prop       | Bundle of animations you can use in your website/app |                                | [License](animate/LICENSE)                   |

> Install one of MDI v6, MDI v5, MDI v4 or MDI v3, but never together at the same time.

> Note that ionicons v5+ no longer comes with a webfont.

### SVG

> Quasar v1.7+ required for svg Quasar Icon Sets.

| Vendor                                                                                   | Version  | Quasar IconSet name             | Import Icons from                          | Notes                                               | License                                      |
| ---------------------------------------------------------------------------------------- | -------- | ------------------------------- | ------------------------------------------ | --------------------------------------------------- | -------------------------------------------- |
| [Material Icons](https://material.io/tools/icons/?style=baseline) (Google)               | CDN v140 | `svg-material-icons`            | `@quasar/extras/material-icons`            |                                                     | [License](material-icons/LICENSE)            |
| [Material Icons Outlined](https://material.io/tools/icons/?style=outlined) (Google)      | CDN v109 | `svg-material-icons-outlined`   | `@quasar/extras/material-icons-outlined`   | Requires: @quasar/extras 1.9+                       | [License](material-icons-outlined/LICENSE)   |
| [Material Icons Round](https://material.io/tools/icons/?style=round) (Google)            | CDN v108 | `svg-material-icons-round`      | `@quasar/extras/material-icons-round`      | Requires: @quasar/extras 1.9+                       | [License](material-icons-round/LICENSE)      |
| [Material Icons Sharp](https://material.io/tools/icons/?style=sharp) (Google)            | CDN v109 | `svg-material-icons-sharp`      | `@quasar/extras/material-icons-sharp`      | Requires: @quasar/extras 1.9+                       | [License](material-icons-sharp/LICENSE)      |
| [Material Symbols Outlined](https://fonts.google.com/icons?icon.style=Outlined) (Google) | CDN v134 | `svg-material-symbols-outlined` | `@quasar/extras/material-symbols-outlined` | Requires: @quasar/extras 1.14+                      | [License](material-symbols-outlined/LICENSE) |
| [Material Symbols Rounded](https://fonts.google.com/icons?icon.style=Rounded) (Google)   | CDN v133 | `svg-material-symbols-rounded`  | `@quasar/extras/material-symbols-rounded`  | Requires: @quasar/extras 1.14+                      | [License](material-symbols-round/LICENSE)    |
| [Material Symbols Sharp](https://fonts.google.com/icons?icon.style=Sharp) (Google)       | CDN v130 | `svg-material-symbols-sharp`    | `@quasar/extras/material-symbols-sharp`    | Requires: @quasar/extras 1.14+                      | [License](material-symbols-sharp/LICENSE)    |
| [MDI v7](https://materialdesignicons.com/) (Material Design Icons)                       | 7.2.96   | `svg-mdi-v7`                    | `@quasar/extras/mdi-v7`                    |                                                     | [License](mdi-v7/LICENSE)                    |
| MDI v6 (Material Design Icons)                                                           | 6.9.96   | `svg-mdi-v6`                    | `@quasar/extras/mdi-v6`                    |                                                     | [License](mdi-v6/LICENSE)                    |
| MDI v5 (Material Design Icons)                                                           | 5.9.55   | `svg-mdi-v5`                    | `@quasar/extras/mdi-v5`                    |                                                     | [License](mdi-v5/LICENSE)                    |
| MDI v4 (Material Design Icons)                                                           | 4.9.95   | `svg-mdi-v4`                    | `@quasar/extras/mdi-v4`                    |                                                     | [License](mdi-v4/license.md)                 |
| [Font Awesome v6](https://fontawesome.com/icons)                                         | 6.4.2    | `svg-fontawesome-v6`            | `@quasar/extras/fontawesome-v6`            | Requires: @quasar/extras 1.13+                      | [License](fontawesome-v5/LICENSE.txt)        |
| Font Awesome v5                                                                          | 5.15.4   | `svg-fontawesome-v5`            | `@quasar/extras/fontawesome-v5`            |                                                     | [License](fontawesome-v5/LICENSE.txt)        |
| [Ionicons v7](https://ionicons.com/)                                                     | 7.1.2    | `svg-ionicons-v7`               | `@quasar/extras/ionicons-v7`               | Requires: @quasar/extras 1.16+                      | [Icon License](ionicons-v7/LICENSE)          |
| Ionicons v6                                                                              | 6.1.3    | `svg-ionicons-v6`               | `@quasar/extras/ionicons-v6`               | Requires: @quasar/extras 1.12+                      | [Icon License](ionicons-v6/LICENSE)          |
| Ionicons v5                                                                              | 5.5.4    | `svg-ionicons-v5`               | `@quasar/extras/ionicons-v5`               | Requires: @quasar/extras 1.7+                       | [Icon License](ionicons-v5/LICENSE)          |
| Ionicons v4                                                                              | 4.6.3    | `svg-ionicons-v4`               | `@quasar/extras/ionicons-v4`               | No icon font (woof) files for Ionicons since v4.6.3 | [Icon License](ionicons-v4/LICENSE)          |
| [Eva Icons](https://akveo.github.io/eva-icons)                                           | 1.1.3    | `svg-eva-icons`                 | `@quasar/extras/eva-icons`                 |                                                     | [License](eva-icons/LICENSE)                 |
| [Themify Icons](https://themify.me/themify-icons)                                        | 1.0.1    | `svg-themify`                   | `@quasar/extras/themify`                   |                                                     | [License](themify/LICENSE)                   |
| [Line Awesome](https://icons8.com/line-awesome)                                          | 1.3.0    | `svg-line-awesome`              | `@quasar/extras/line-awesome`              | Requires: @quasar/extras 1.5+                       | [License](line-awesome/LICENSE.md)           |
| [Bootstrap Icons](https://icons.getbootstrap.com/)                                       | 1.10.5   | `svg-bootstrap-icons`           | `@quasar/extras/bootstrap-icons`           | Requires: @quasar/extras 1.10+                      | [License](bootstrap-icons/LICENSE.md)        |

Example:

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
import { mdiAbTesting } from '@quasar/extras/mdi-v5'

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
| ionicons-v4             | ion-, ion-md-, ion-ios-, ion-logo- | ion-heart, ion-logo-npm, ion-md-airplane | Use QIcon instead of `<ion-icon>` component; Logo icons require 'ion-logo-' prefix                                  |         |
| fontawesome-v5          | fa[s,r,l,b,d] fa-                  | "fas fa-ambulance"                       | QIcon "name" property is same as "class" attribute value in Fontawesome docs examples (where they show `<i>` tags)  |         |
| mdi-v5                  | mdi-                               | mdi-alert-circle-outline                 | Notice the use of dash characters                                                                                   |         |
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
