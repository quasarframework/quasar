---
title: Hybrid SSR with partial CSR
desc: (@quasar/app-vite) How to handle a hybrid SSR with partial CSR with Quasar CLI.
---

Quasar CLI allows you to build a hybrid SSR with partial CSR (Client-Side Rendering). This is helpful for cases where you want some of your pages to be rendered exclusively on the client side.

> This feature is available in "@quasar/app-vite" v3.1+

## Configuration

You can instruct the Quasar CLI what Vue Router routes should be handled exclusively on the client side:

```js /quasar.config file
ssr: {
  /**
   * Configure this for a hybrid SSR + partial CSR (Client-Side Rendering)
   * approach, where you have some Vue Router routes that you want to be
   * rendered on the client-side exclusively.
   *
   * You can use picomatch patterns to match the routes you want to be rendered
   * on the client-side. https://www.npmjs.com/package/picomatch
   *
   * Note on picomatch patterns:
   *   "/admin" matches the exact route only
   *   "/admin/**" matches the exact route and all sub-routes of /admin
   *   "/admin/*" matches only direct sub-routes of /admin
   *   "/admin/{users,settings}" matches both exact routes /admin/users and /admin/settings
   *
   * @example ['/dashboard', '/admin/**']
   * @default []
   */
  clientSideRenderingRoutes?: string[];
}
```
