---
title: Getting Started - Pick a Quasar Flavour
---

**If you'd like to learn more about what Quasar can do for you**, read the [Introduction to Quasar](/introduction-to-quasar). Otherwise, let's get started by choosing how you'd like to use Quasar.

There are three methods for using Quasar:
 * UMD/Standalone (embed into an existing project through CDN, progressive integration)
 * Quasar CLI (**the premium developer experience for free, recommended**)
 * Vue CLI 3 plugin

Here's a quick comparison:

| Feature | UMD | Quasar CLI | Vue CLI 3 Plugin |
| --- | --- | --- | --- |
| Ability to embed into an existing project | **Yes** | - | **Yes, if it is Vue CLI app** |
| Progressive integration of Quasar | **Yes** | - | - |
| Ability to serve Quasar from CDN | **Yes** | - | - |
| Build SPA, PWA | **Yes** | **Yes** | **Yes** |
| Build SSR (+ optional PWA client takeover) | - | **Yes** | ?? |
| Build Mobile Apps, Electron Apps | **Yes** | **Yes** | ?? |
| Dynamic RTL support for Quasar components | **Yes** | **Yes** | **Yes** |
| Generating your own website/app RTL equivalent CSS rules automatically by Quasar | - | **Yes** | **Yes** |
| Tight integration between build modes, taking full advantage of all Quasar's capabilities. | - | **Yes** | - |
| Develop mobile apps with HMR directly on your phone. | - | **Yes** | - |
| One codebase to rule SPA, PWA, SSR, Mobile Apps, Electron Apps | - | **Yes** | - |
| Tree Shaking | - | **Yes** | **Yes** |
| SFC (Single File Component - for Vue) | - | **Yes** | **Yes** |
| Advanced configuration through dynamic quasar.conf.js | - | **Yes** | - |
| Unit & end to end testing | - | **Yes** | **Yes** |
| Ensure everything "simply works" out of the box, using latest and greatest Quasar specs. | - | **Yes** | - |

## UMD / Standalone (uses CDN)
If you'd like to embed Quasar into your existing website project, integrating it in a progressive manner, then go for the UMD/Standalone (Unified Module Definition) version.

Get started by [reading more](/start/umd) about it.

## Quasar CLI (best developer experience)
If you want to be able to build:
* a SPA (Single Page Application/Website),
* a SSR (Server-side Rendered App/Website),
* a PWA (Progressive Web App),
* a Mobile App (through Cordova),
* an Electron App,

...and

* benefit from from a faster development workflow provided by the Quasar CLI, with HMR (Hot Module Reload)
* **share the same base-code for all those modes**
* tight integration between build modes, taking full advantage of all Quasar's capabilities
* develop mobile apps with HMR directly on your phone
* ensure everything "simply works" out of the box, using latest and greatest Quasar specs
* benefit from the latest web recommended practices out of the box
* ability to write ES6 code
* benefit from [Tree Shaking](https://en.wikipedia.org/wiki/Tree_shaking)
* get your code optimized, minified and bundled in the best possible way
* ability to write SFC ([Single File Component - for Vue](https://vuejs.org/v2/guide/single-file-components.html))

...then go for Quasar CLI.

Note that you don't need different projects in order to build any one of the application options described above. This one project folder can seamlessly handle all of them.

To understand more about Quasar CLI, be sure to check its section on the main menu. With this knowledge under your belt, you'll be able to take full advantage of all of Quasar CLI's many great features.

More info: [Getting started with Quasar CLI](/start/quasar-cli).

## Vue CLI 3 plugin
To work with Quasar via its Vue CLI 3 plugin, head on to [Vue CLI 3 Quasar plugin](/start/vue-cli-plugin) documentation page.

::: danger
Vue CLI 3 Quasar Plugin has not been updated to support v1.0-beta yet. Will be updated soon.
:::
