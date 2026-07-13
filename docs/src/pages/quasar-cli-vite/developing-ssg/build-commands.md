---
title: SSG Build Commands
desc: (@quasar/app-vite) The Quasar CLI list of commands when developing or building a SSG app.
---

::: warning Warning! Alpha Stage
The Quasar SSG Mode is currently in the "alpha" stage. The API may change in the future, so check the release notes each time you upgrade "@quasar/app-vite".
:::

## Developing

```bash
quasar dev -m ssg

# ..or the longer form:
quasar dev --mode ssg
```

For SSG Mode, the development server is similar to SSR Mode, except that you don't need to configure the webserver too.

## Building for Production

```bash
quasar build -m ssg

# ..or the longer form:
quasar build --mode ssg
```

If you want a production build with debugging enabled:

```bash
quasar build -m ssg -d

# ..or the longer form
quasar build -m ssg --debug
```
