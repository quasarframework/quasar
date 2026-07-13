---
title: SSG with TypeScript
desc: (@quasar/app-vite) How to use TypeScript with SSG in Quasar
---

::: warning Warning! Alpha Stage
The Quasar SSG Mode is currently in the "alpha" stage. The API may change in the future, so check the release notes each time you upgrade "@quasar/app-vite".
:::

In order to support SSG with TypeScript, you will need to rename all your files in /src-ssg from `.js` to `.ts` and make the necessary TS code changes.

Depending on the packages that you use in `/src-ssg/ssg-renderer`, you may also need to additionally [install @types/\* packages](/quasar-cli-vite/developing-ssg/installing-ssg-dependencies) into your /src-ssg folder.
