---
title: Preparation for SSR
desc: (@quasar/app-vite) How to add SSR mode with Quasar CLI.
related:
  - /quasar-cli-vite/quasar-config-file
scope:
  nodeJsTree:
    l: src-ssr
    c:
      - l: server-assets/
        e: copied as-is to dist
      - l: middlewares
        e: SSR middleware files
        c:
          - l: render.js
            e: (or .ts) middleware to render pages with Vue
      - l: server.js
        e: (or .ts) SSR webserver
      - l: package.json
        e: helps install SSR only deps directly under /src-ssr
---

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

<DocTree :def="scope.nodeJsTree" />
