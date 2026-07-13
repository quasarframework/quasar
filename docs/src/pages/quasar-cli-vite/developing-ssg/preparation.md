---
title: Preparation for SSG
desc: (@quasar/app-vite) How to add SSG mode with Quasar CLI.
related:
  - /quasar-cli-vite/quasar-config-file
scope:
  nodeJsTree:
    l: src-ssg
    c:
      - l: ssg-renderer.js
        e: (or .ts) SSG generator script
      - l: package.json
        e: helps install SSG only deps directly under /src-ssg
---

::: warning Warning! Alpha Stage
The Quasar SSG Mode is currently in the "alpha" stage. The API may change in the future, so check the release notes each time you upgrade "@quasar/app-vite".
:::

We'll be using Quasar CLI (and Cordova CLI) to develop and build a Mobile App. The difference between building a SPA, PWA, SSR, SSG, Electron App or a Mobile App is simply determined by the "mode" parameter in "quasar dev" and "quasar build" commands.

In order to develop or build a SSG website, we first need to add the SSG mode to our Quasar project:

```bash
quasar mode add ssg
```

If you want to jump right in and start developing, you can skip the "quasar mode" command and issue:

```bash
quasar dev -m ssg
```

This will add SSG mode automatically, if it is missing.

After answering the question of whether you're using [Filename-Based Routing](/quasar-cli-vite/page-routing-with-vue-router#filename-based-routing), a new folder will appear in your project folder (which is explained in detail on the [Configuring SSG](/quasar-cli-vite/developing-ssg/configuring-ssg) page):

<DocTree :def="scope.nodeJsTree" />
