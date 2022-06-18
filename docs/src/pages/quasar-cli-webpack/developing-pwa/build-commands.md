---
title: PWA Build Commands
desc: (@quasar/app-webpack) The Quasar CLI list of commands when developing or building a Progressive Web App.
---

## Developing

```bash
$ quasar dev -m pwa

# ..or the longer form:
$ quasar dev --mode pwa
```

::: warning
Do not miss the [HMR for PWA](/quasar-cli-webpack/developing-pwa/hmr-for-dev) (Hot Module Reload) page.
:::

::: danger
Do not run [Lighthouse](https://developers.google.com/web/tools/lighthouse/) on your development build because at this stage the code is intentionally not optimized and contains embedded source maps (among many other things).
:::

## Building for Production

```bash
$ quasar build -m pwa

# ..or the longer form:
$ quasar build --mode pwa
```

If you want a production build with debugging enabled:

```bash
$ quasar build -m pwa -d

# ..or the longer form
$ quasar build -m pwa --debug
```
