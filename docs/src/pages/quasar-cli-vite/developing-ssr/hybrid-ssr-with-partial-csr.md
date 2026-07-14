---
title: Hybrid SSR with partial CSR
desc: (@quasar/app-vite) How to handle a hybrid SSR with partial CSR with Quasar CLI.
---

Quasar CLI allows you to build a hybrid SSR with partial CSR (Client-Side Rendering). This is helpful for cases where you want some of your pages to be rendered exclusively on the client side.

## Configuration

You can instruct the Quasar CLI what Vue Router routes should be handled exclusively on the client side:

```js /quasar.config file
ssr: {
  /**
   * Requires @quasar/app-vite v3.1+
   *
   * Configure this for a hybrid SSR + partial CSR (Client-Side Rendering)
   * approach, where you have some Vue Router routes that you want to be
   * rendered on the client-side exclusively.
   *
   * You can use picomatch patterns to match the routes you want to be rendered
   * on the client-side. https://www.npmjs.com/package/picomatch
   *
   * @example ['/dashboard', '/admin/**']
   * @default []
   */
  clientSideRenderingRoutes?: string[];
}
```
