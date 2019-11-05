![Quasar Framework logo](https://cdn.quasar.dev/logo/svg/quasar-logo-full-inline.svg)

## Quasar Framework Extras Package

> Build responsive Single Page Apps, **SSR Apps**, PWAs, Hybrid Mobile Apps and Electron Apps, all using the same codebase!, powered with Vue.

<img src="https://img.shields.io/npm/v/%40quasar/extras.svg?label=@quasar/extras">

[![Join the chat at https://chat.quasar.dev](https://img.shields.io/badge/chat-on%20discord-7289da.svg)](https://chat.quasar.dev)
<a href="https://forum.quasar.dev" target="_blank"><img src="https://img.shields.io/badge/community-forum-brightgreen.svg"></a>
[![https://good-labs.github.io/greater-good-affirmation/assets/images/badge.svg](https://good-labs.github.io/greater-good-affirmation/assets/images/badge.svg)](https://good-labs.github.io/greater-good-affirmation)

## Contents

Please make sure you have latest `@quasar/extras` npm package version installed into your project folder in order for you to benefit from everything below.

| Package | quasar.conf.js extras name | Version | Description | Notes | License |
| --- | --- | --- | --- | --- | --- |
| Roboto Font | `roboto-font` | CDN v19 | Recommended font along Material theme | | [License](roboto-font/LICENSE) |
| Roboto Font Latin Extended | `roboto-font-latin-ext` | CDN v19 | Recommended font along Material theme | | [License](roboto-font-latin-ext/LICENSE) |
| [Material Icons](https://material.io/tools/icons/?style=baseline) | `material-icons` | CDN v47 | Material icons font | Requires: Quasar 1.0.5+, @quasar/extras 1.2.0+ | [License](material-icons/LICENSE) |
| [Material Icons Outlined](https://material.io/tools/icons/?style=outline) | `material-icons-outlined` | CDN v13 | Material icons outlined font | Requires: Quasar 1.0.5+, @quasar/extras 1.2.0+ | [License](material-icons-outlined/LICENSE) |
| [Material Icons Round](https://material.io/tools/icons/?style=round) | `material-icons-round` | CDN v13 | Material icons round font | Requires: Quasar 1.0.5+, @quasar/extras 1.2.0+ | [License](material-icons-round/LICENSE) |
| [Material Icons Sharp](https://material.io/tools/icons/?style=sharp) | `material-icons-sharp` | CDN v14 | Material icons sharp font | Requires: Quasar 1.0.5+, @quasar/extras 1.2.0+ | [License](material-icons-sharp/LICENSE) |
| [MDI v4](https://materialdesignicons.com/) (Material Design Icons) | `mdi-v4` | 4.4.95 | Extended Material Design icons font | | [License](mdi-v4/LICENSE) |
| MDI v3 (Material Design Icons) | `mdi-v3` | 3.6.95 | Extended Material Design icons font | | [License](mdi-v3/LICENSE) |
| [Font Awesome](https://fontawesome.com/icons?d=gallery) | `fontawesome-v5` | 5.11.1 | Fontawesome icons font | | [License](fontawesome-v5/FONT-LICENSE) |
| [Ionicons](http://ionicons.com/) | `ionicons-v4` | 4.6.3 | Ionicons font | | [Font License](/ionicons-v4/FONT_LICENSE) [Icon License](ionicons-v4/ICON-LICENSE) |
| [Eva Icons](https://akveo.github.io/eva-icons) | `eva-icons` | 1.1.1 | Eva Icons font | | [License](eva-icons/LICENSE) |
| [Themify Icons](https://themify.me/themify-icons) | `themify` | 1.0.0 | Themify Icons font | | [License](themify/LICENSE) |
| [Animate.css](https://daneden.github.io/animate.css/) | Use `animations` prop | 3.5.2 | Bundle of animations you can use in your website/app | | [License](animate/LICENSE) |

> Either install MDI v4 or MDI v3, but never both at the same time.

Why this package? Because it strips down unnecessary package files (so faster download times), all in one place, tested and ready to use with Quasar. One other reason is that the material icons npm package sometimes fails to be downloaded by NPM.

### QIcon cheatsheet

```html
<q-icon name="..." />
```

| Name | Prefix | Examples | Notes | Licence |
| --- | --- | --- | --- | --- |
| material-icons | *None* | thumb_up | Notice the underline character instead of dash or space | |
| material-icons-outlined | o_ | o_thumb_up | Notice the underline character instead of dash or space | |
| material-icons-round | r_ | r_thumb_up | Notice the underline character instead of dash or space | |
| material-icons-sharp | s_ | s_thumb_up | Notice the underline character instead of dash or space | |
| ionicons-v4 | ion-, ion-md-, ion-ios-, ion-logo- | ion-heart, ion-logo-npm, ion-md-airplane | Use QIcon instead of `<ion-icon>` component; Logo icons require 'ion-logo-' prefix | |
| fontawesome-v5 | fa[s,r,l,b] fa- | "fas fa-ambulance" | QIcon "name" property is same as "class" attribute value in Fontawesome docs examples (where they show `<i>` tags) | |
| mdi-v3 | mdi- | mdi-alert-circle-outline | Notice the use of dash characters | |
| eva-icons | eva- | eva-shield-outline, eva-activity-outline | Notice the use of dash characters | |
| themify | ti- | ti-hand-point-up | Notice the use of dash characters | |

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
Using [semver 2.0](http://semver.org/) notation for 'quasar-extras' package.

## License

All assets included in this repository are exclusive property of their respective owners and licenced under their own respective licenses. Quasar does not take any credit in packages included here.
