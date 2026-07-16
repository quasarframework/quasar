<!-- This file is generated from build/README.template.md by the extras build. Do not edit README.md directly. -->

![Quasar Framework logo](https://cdn.quasar.dev/logo-v2/header.png)

## Quasar Framework Extras Package

> Build high-performance Vue.js user interfaces in record time: responsive Single Page Apps, SSR Apps, SSG Apps, PWAs, browser extensions, hybrid mobile apps and Electron apps. If you want, all using the same codebase!

<img src="https://img.shields.io/npm/v/%40quasar/extras.svg?label=@quasar/extras">

[![Join the chat at https://chat.quasar.dev](https://img.shields.io/badge/chat-on%20discord-7289da.svg)](https://chat.quasar.dev)
<a href="https://forum.quasar.dev" target="_blank"><img src="https://img.shields.io/badge/community-forum-brightgreen.svg"></a>
[![https://good-labs.github.io/greater-good-affirmation/assets/images/badge.svg](https://good-labs.github.io/greater-good-affirmation/assets/images/badge.svg)](https://good-labs.github.io/greater-good-affirmation)

## Why?

Why this package? Because it strips down unnecessary package files (so faster download times), all in one place, tested and ready to use with Quasar. One other reason is that the material icons npm package sometimes fails to be downloaded by NPM.

## Contents

Please make sure you have latest `@quasar/extras` npm package version installed into your project folder in order for you to benefit from everything below.

### Webfonts

{{WEBFONTS_TABLE}}

> Install one of MDI v6, MDI v5, MDI v4 or MDI v3, but never together at the same time.

> Note that ionicons v5+ no longer comes with a webfont.

### SVG

> Quasar v1.7+ required for svg Quasar Icon Sets.

{{SVG_TABLE}}

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
