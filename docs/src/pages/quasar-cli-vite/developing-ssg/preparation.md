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

::: warning Warning! Beta Stage
The Quasar SSG Mode is currently in the "beta" stage. Based on the community feedback, the API may change in the future, so check the release notes each time you upgrade "@quasar/app-vite".
:::

Quasar CLI selects the application target through the `--mode` (`-m`) option of the `quasar dev` and `quasar build` commands.

Add SSG mode to an existing Quasar project with:

```bash
quasar mode add ssg

# or, to skip the filename-based-routing prompt (useful for scripts/CI):
quasar mode add ssg --filename-based-routing
```

In a non-interactive environment (such as CI), where the prompt cannot be answered, the scaffolding assumes filename-based routing is NOT being used, unless the `--filename-based-routing` parameter is specified.

You can also start the SSG development server directly:

```bash
quasar dev -m ssg
```

If SSG mode is missing, Quasar CLI offers to add it before starting the server.

After you choose whether to use [Filename-Based Routing](/quasar-cli-vite/page-routing-with-vue-router#filename-based-routing), Quasar creates the following folder:

<DocTree :def="scope.nodeJsTree" />

The renderer defines which routes become static pages. See [SSG Renderer](/quasar-cli-vite/developing-ssg/ssg-renderer) before creating your first production build.
