---
title: SSG Build Commands
desc: (@quasar/app-vite) The Quasar CLI list of commands when developing or building a SSG app.
---

::: warning Warning! Beta Stage
The Quasar SSG Mode is currently in the "beta" stage. Based on the community feedback, the API may change in the future, so check the release notes each time you upgrade "@quasar/app-vite".
:::

## Developing

```bash
quasar dev -m ssg

# ..or the longer form:
quasar dev --mode ssg
```

The development server renders normal SSG routes through the SSR pipeline. Routes matched by `ssg.clientSideRenderingRoutes` are rendered on the client. The `/src-ssg/ssg-renderer` file is used only during a production build, so the development server does not write static HTML files.

## Building for Production

```bash
quasar build -m ssg

# ..or the longer form:
quasar build --mode ssg
```

The default output directory is `dist/ssg`. The build fails if `getSsgPages()` returns no pages or if two page definitions try to write the same file.

::: tip
Should you want to change the default error handling behaviour of the SSG render process (fail on first error), and instead you want to go through all SSG pages then error out, or just warn but not fail, or ignore the errors completely, you can use the quasar.config > ssg > [onSsgBuildError](/quasar-cli-vite/developing-ssg/configuring-ssg).
:::

If you want a production build with debugging enabled:

```bash
quasar build -m ssg -d

# ..or the longer form
quasar build -m ssg --debug
```
