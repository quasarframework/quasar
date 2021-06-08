---
title: Preparation for SSR
desc: How to add SSR mode with Quasar CLI.
related:
  - /quasar-cli/quasar-conf-js
---

We’ll be using Quasar CLI to develop and build a SSR website. The difference between building a SPA, Mobile App, Electron App, PWA or SSR is simply determined by the “mode” parameter in “quasar dev” and “quasar build” commands.

In order to develop or build a SSR website, we first need to add the SSR mode to our Quasar project:
```bash
$ quasar mode add ssr
```

If you want to jump right in and start developing, you can skip the "quasar mode" command and issue:
```bash
$ quasar dev -m ssr
```

This will add SSR mode automatically, if it is missing.

A new folder will appear in your project folder (which is explained in detail on the [Configuring SSR](/quasar-cli/developing-ssr/configuring-ssr) page):

```bash
.
└── src-ssr/
    ├── middlewares/  # SSR middleware files
    └── directives/   # SSR transformations for Vue directives
```

