---
title: SSG with TypeScript
desc: (@quasar/app-vite) How to use TypeScript with SSG in Quasar.
---

::: warning Warning! Beta Stage
The Quasar SSG Mode is currently in the "beta" stage. Based on the community feedback, the API may change in the future, so check the release notes each time you upgrade "@quasar/app-vite".
:::

When SSG mode is added to a TypeScript project, Quasar creates `/src-ssg/ssg-renderer.ts` automatically. In an existing JavaScript setup, rename `ssg-renderer.js` to `ssg-renderer.ts`; Quasar discovers either extension.

The wrapper functions infer their callback and return types:

```ts /src-ssg/ssg-renderer.ts
import { defineSsgGetPages } from '#q-app'
import routes from '@/router/routes'

export const getSsgPages = defineSsgGetPages(({ parseVueRouterRoutes }) => {
  return parseVueRouterRoutes({ routes, verbose: true })
})
```

Dependencies imported only by the renderer belong in `/src-ssg/package.json`. If a dependency does not include its own declarations, install its `@types/*` package there as a development dependency.
