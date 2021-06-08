---
title: Electron with Typescript
desc: How to use Typescript with Electron in Quasar
---

In order to support Electron with Typescript, you will need to:

1. Make sure that you are using `@quasar/app` v3.0.0-beta.8+
2. Edit quasar.conf.js > supportTS. Set it to `true` or use the Object form.
3. Rename the extension for your files in /src-electron from `.js` to `.ts` and make the necessary TS code changes.

More info: [Supporting TS](/quasar-cli/supporting-ts)
