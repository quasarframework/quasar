---
title: Getting Started - Pick Quasar Flavour
---

**If you would like to learn what Quasar is all about and what it can do for you**, read the [Introduction to Quasar](/introduction-to-quasar). Otherwise, let's get started by choosing how you'd like to use Quasar.

There are three methods for using Quasar:
 * UMD/Standalone (embed into an existing project through CDN, progressive integration)
 * Development with Quasar CLI (**the premium developer experience, recommended**)
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
| One codebase to rule SPA, PWA, SSR, Mobile Apps, Electron Apps | - | **Yes** | - |
| Tree Shaking | - | **Yes** | **Yes** |
| SFC (Single File Component - for Vue) | - | **Yes** | **Yes** |
| Advanced configuration through dynamic quasar.conf.js | - | **Yes** | - |
| Unit & end to end testing | - | **Yes** | **Yes** |

## UMD / Standalone (uses CDN)
If you'd like to embed Quasar into your existing website project, integrating it in a progressive manner, then go for the UMD/Standalone (Unified Module Definition) version.

Get started by [reading more](/getting-started/umd) about it.

You can skip the following step, but it's here as a hint. There is a helper UMD starter kit, which will show you how to get started and what CSS and JS tags to include into your project. While installing the UMD kit, the CLI will ask you some questions (what Quasar theme will you be using, what Quasar I18n to include, ...) and it will generate a simple HTML file that will demo how to use CDN to add Quasar:

```bash
# Node.js >= 8.9.0 is required.

$ npm install -g quasar-cli # recommended
# or:
$ yarn global add quasar-cli

# then...
$ quasar create <folder_name> --kit umd
```

And you're done. Inspect the `index.html` file that was created in the new folder and learn how you can embed Quasar. You may want to repeat the step above to experiment with different setups based on the answers you give.

## Development with Quasar CLI (The best developer experience)
If you want to be able to build:
* a SPA (Single Page Application/Website),
* a SSR (Server-side Rendered App/Website),
* a PWA (Progressive Web App),
* a Mobile App (through Cordova),
* an Electron App,

...and

* benefit from from a faster development workflow provided by the Quasar CLI, with HMR (Hot Module Reload)
* **share the same base-code for all those modes**
* benefit from the latest web recommended practices out of the box
* ability to write ES6 code
* benefit from [Tree Shaking](https://en.wikipedia.org/wiki/Tree_shaking)
* get your code optimized, minified and bundled in the best possible way
* ability to write SFC ([Single File Component - for Vue](https://vuejs.org/v2/guide/single-file-components.html))

...then go for the best developer experience:

First, we will need to install Quasar CLI. Make sure you have Node >=8 and NPM >=5 or Yarn installed on your machine.

```bash
# Node.js >= 8.9.0 is required.
$ npm install -g quasar-cli # recommended
# or:
$ yarn global add quasar-cli
```

With Quasar CLI globally installed, we can now create a new project:
```bash
$ quasar create <folder_name>
```

Note that you don't need different projects in order to build any one of the application options described above. This one project folder can seamlessly handle all of them.

To understand more about Quasar CLI, be sure to familiarize yourself [with the guide](/getting-started/quasar-cli). With this knowledge under your belt, you'll be able to take full advantage of all of Quasar CLI's many great features.

## Vue CLI 3 plugin
To work with Quasar via its Vue CLI 3 plugin, head on to [Vue CLI 3 Quasar plugin](/getting-started/vue-cli-plugin) documention page.
