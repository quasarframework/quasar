---
title: SSR with PWA Client Takeover
desc: How to configure your Quasar server-side rendered app to become a Progressive Web App on the client side.
---
With Quasar CLI you can build your app with the killer combo of SSR + PWA. In order to enable PWA for SSR builds, you need to edit your `/quasar.conf.js` first:

```js
// quasar.conf.js
return {
  // ...
  ssr: {
    pwa: true
  }
}
```

The first request of a **new** client will be served from the webserver (so SSR supplies the initial page content). The PWA gets installed then it takes over on client side. All further requests will be served from cache (unless you have some custom configuration to change that).

> For more information on PWA, head on to [PWA Introduction](/quasar-cli/developing-pwa/introduction) and read the whole PWA Guide section.
