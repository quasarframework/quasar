---
title: Installing SSG-specific dependencies
description: (@quasar/app-vite) How to handle SSG-specific dependencies.
canonical: https://quasar.dev/quasar-cli-vite/developing-ssg/installing-ssg-dependencies
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

::: warning Warning! Beta Stage
The Quasar SSG Mode is currently in the "beta" stage. Based on the community feedback, the API may change in the future, so check the release notes each time you upgrade "@quasar/app-vite".
:::

The generated `/src-ssg/package.json` keeps build-time renderer dependencies separate from your application dependencies. Add a package here when it is imported directly by `/src-ssg/ssg-renderer`.

```json /src-ssg/package.json
{
  "name": "quasar-ssg-app",
  "version": "1.0.0",
  "description": "Quasar SSG folder",
  "type": "module",
  "private": true,
  "dependencies": {}
}
```

::: warning
Packages imported by application code under `/src` still belong in the root `package.json`. Install only renderer-specific packages under `/src-ssg`.
:::

For example, to discover Markdown files from the renderer with `tinyglobby`:

```tabs
<<| bash PNPM |>>
# run in /src-ssg
pnpm add tinyglobby
<<| bash Yarn |>>
# run in /src-ssg
yarn add tinyglobby
<<| bash NPM |>>
# run in /src-ssg
npm install tinyglobby
<<| bash Bun |>>
# run in /src-ssg
bun add tinyglobby
```
