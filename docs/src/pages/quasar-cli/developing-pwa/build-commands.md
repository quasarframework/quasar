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
Do not run [Lighthouse](https://developers.google.com/web/tools/lighthouse/) on your development build because at this stage the code is intentionally not optimized and contains embedded source maps (among many other things).
:::

## Building for Production

```bash
$ quasar build -m pwa

# ..or the longer form:
$ quasar build --mode pwa
```
