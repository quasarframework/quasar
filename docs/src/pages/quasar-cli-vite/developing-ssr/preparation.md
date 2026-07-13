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

We'll be using Quasar CLI (and Cordova CLI) to develop and build a Mobile App. The difference between building a SPA, PWA, SSR, SSG, Electron App or a Mobile App is simply determined by the "mode" parameter in "quasar dev" and "quasar build" commands.

In order to develop or build a SSR website, we first need to add the SSR mode to our Quasar project:

```bash
quasar mode add ssr
```

If you want to jump right in and start developing, you can skip the "quasar mode" command and issue:

```bash
quasar dev -m ssr
```

This will add SSR mode automatically, if it is missing.

After answering the question of what webserver you want to use (Hono/Express/Fastify/etc), a new folder will appear in your project folder (which is explained in detail on the [Configuring SSR](/quasar-cli-vite/developing-ssr/configuring-ssr) page):

<DocTree :def="scope.nodeJsTree" />
