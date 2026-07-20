---
title: Preparation for SSG
description: (@quasar/app-vite) How to add SSG mode with Quasar CLI.
canonical: https://quasar.dev/quasar-cli-vite/developing-ssg/preparation
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

::: warning Warning! Beta Stage
The Quasar SSG Mode is currently in the "beta" stage. Based on the community feedback, the API may change in the future, so check the release notes each time you upgrade "@quasar/app-vite".
:::

Quasar CLI selects the application target through the `--mode` (`-m`) option of the `quasar dev` and `quasar build` commands.

Add SSG mode to an existing Quasar project with:

```bash
quasar mode add ssg
```

You can also start the SSG development server directly:

```bash
quasar dev -m ssg
```

If SSG mode is missing, Quasar CLI offers to add it before starting the server.

After you choose whether to use [Filename-Based Routing](/quasar-cli-vite/page-routing-with-vue-router#filename-based-routing), Quasar creates the following folder:

- src-ssg
  - ssg-renderer.js — (or .ts) SSG generator script
  - package.json — helps install SSG only deps directly under /src-ssg

The renderer defines which routes become static pages. See [SSG Renderer](/quasar-cli-vite/developing-ssg/ssg-renderer) before creating your first production build.
