---
title: Injecting Quasar Plugin
description: Tips and tricks on how to use a Quasar App Extension to configure the host app to use a Quasar Plugin.
canonical: https://quasar.dev/app-extensions/common-formulas-and-patterns/inject-quasar-plugin
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

This guide is for when you want to ensure that a [Quasar Plugin](/quasar-plugins) will be injected into the hosting app, because you depend on it for your own App Extension to work.

We will only need to touch the Index script for this, because we can use the [Index API](/app-extensions/development-guide/index-api) to configure the /quasar.config file from the host app to include our required Quasar Plugin.

```js /ae/src/index.js (or .ts)
import { defineIndexScript } from '#q-app'

export default defineIndexScript(api => {
  // ...

  // Here we extend /quasar.config file, so we can add
  // a boot file which registers our new Vue directive;
  // "extendConf" will be defined below (keep reading the tutorial)
  api.extendQuasarConf((conf, api) => {
    // Let's play nice and add it only if it's not defined already
    if (!conf.framework.plugins.includes('AppVisibility')) {
      conf.framework.plugins.push('AppVisibility')
    }
  })
})
```
