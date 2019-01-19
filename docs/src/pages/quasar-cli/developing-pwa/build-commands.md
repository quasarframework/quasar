---
title: PWA Build Commands
---
[Quasar CLI](/getting-started/quasar-cli) makes it incredibly simple to develop or build the final distributables from your source code.

## Developing
```bash
$ quasar dev -m pwa

# ..or the longer form:
$ quasar dev --mode pwa
```

::: danger
Do not run [Lighthouse](https://developers.google.com/web/tools/lighthouse/) on your development build. The development build is not optimized and does not contain a true Service Worker.
:::

## Building for Production
```bash
$ quasar build -m pwa

# ..or the longer form:
$ quasar build --mode pwa
```
