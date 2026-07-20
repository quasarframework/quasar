---
title: Preparation for SSR
description: (@quasar/app-vite) How to add SSR mode with Quasar CLI.
canonical: https://quasar.dev/quasar-cli-vite/developing-ssr/preparation
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

Quasar CLI selects the SSR build target through the mode argument passed to `quasar dev` and `quasar build`.

To develop or build an SSR website, first add SSR mode to the Quasar project:

```bash
quasar mode add ssr
```

If you want to jump right in and start developing, you can skip the "quasar mode" command and issue:

```bash
quasar dev -m ssr
```

This will add SSR mode automatically, if it is missing.

After you choose Hono, Express, Fastify, or Koa as the webserver, a new folder appears in your project (explained in detail on the [Configuring SSR](/quasar-cli-vite/developing-ssr/configuring-ssr) page):

- src-ssr
  - server-assets/ — copied as-is to dist
  - middlewares — SSR middleware files
    - render.js — (or .ts) middleware to render pages with Vue
  - server.js — (or .ts) SSR webserver
  - package.json — helps install SSR only deps directly under /src-ssr
