---
title: SSG with TypeScript
description: (@quasar/app-vite) How to use TypeScript with SSG in Quasar.
canonical: https://quasar.dev/quasar-cli-vite/developing-ssg/ssg-with-typescript
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

::: warning Warning! Beta Stage
The Quasar SSG Mode is currently in the "beta" stage. Based on the community feedback, the API may change in the future, so check the release notes each time you upgrade "@quasar/app-vite".
:::

When SSG mode is added to a TypeScript project, Quasar creates `/src-ssg/ssg-renderer.ts` automatically. In an existing JavaScript setup, rename `ssg-renderer.js` to `ssg-renderer.ts`; Quasar discovers either extension.

The wrapper functions infer their callback and return types:

```ts /src-ssg/ssg-renderer.ts
import { defineSsgGetPages } from '#q-app'
import routes from '@/router/routes'

export const getSsgPages = defineSsgGetPages(({ parseVueRouterRoutes }) => {
  const { ssgPages } = parseVueRouterRoutes({ routes, verbose: true })
  return ssgPages
})
```

Dependencies imported only by the renderer belong in `/src-ssg/package.json`. If a dependency does not include its own declarations, install its `@types/*` package there as a development dependency.
