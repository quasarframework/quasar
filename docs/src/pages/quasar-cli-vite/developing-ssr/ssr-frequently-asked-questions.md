---
title: SSR FAQ
desc: (@quasar/app-vite) Tips and tricks for a Quasar server-side rendered app.
---

## Why am I getting hydration errors?

Take a look at the [Client Side Hydration](/quasar-cli-vite/developing-ssr/client-side-hydration) page. A mismatch means the server-rendered HTML differs from the client's initial render. Development builds provide the useful diagnostics, but the underlying mismatch can also affect production and should be fixed before release. Use [QNoSsr](/vue-components/no-ssr) for content that can only be rendered in the browser.

## Why doesn't importing Platform and Cookies work?

When building for SSR, use only the `$q.platform` / `$q.cookies` form. Alternatively, when on server-side, this is one more example of how you can use it:

```js
// example with Platform; same thing for Cookies
import { Platform } from 'quasar'

// you need access to `ssrContext`
function (ssrContext) {
  const platform = import.meta.env.QUASAR_SERVER
    ? Platform.parseSSR(ssrContext)
    : Platform // otherwise we're on client

  // platform is equivalent to the global import as in non-SSR builds
}
```

The `ssrContext` is available in the [Boot Files](/quasar-cli-vite/boot-files) or the [PreFetch Feature](/quasar-cli-vite/prefetch-feature), where it is supplied as a parameter.

There is a good reason for this. In a client-only app, every user will be using a fresh instance of the app in their browser. For server-side rendering we want the same thing. Each request should have a fresh, isolated app instance so that there is no cross-request state pollution. So [Platform](/options/platform-detection) and [Cookies](/quasar-plugins/cookies) need to be bound to each request separately.

Also a good idea is to read the [Writing Universal Code](/quasar-cli-vite/developing-ssr/writing-universal-code) documentation page.

## Why isn't LocalStorage and SessionStorage working?

Web Storage is a browser-only API and is unavailable while code runs on the server. Access it only in client-side code, such as after the component mounts.
