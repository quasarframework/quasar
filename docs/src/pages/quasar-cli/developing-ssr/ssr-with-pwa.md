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

The first request will be served from the webserver. The PWA gets installed then it takes over on client side.

> For more information on PWA, head on to [PWA Introduction](/quasar-cli/developing-pwa/introduction) and read the whole PWA Guide section.

## Caveat
One caveat to be aware of is that, as opposed to a normal PWA build, you need to also specify the URL routes that you wish to cache. The `quasar.conf.js > ssr > pwa` can have the Object form, specifying Workbox options that will get applied on top of `quasar.conf.js > pwa > workboxOptions`. So we'll be using this to add our routes to the runtime caching:

```js
// quasar.conf.js
return {
  // ...
  ssr: {
    // we use the Object form of "pwa" now:
    pwa: {
      runtimeCaching: [
        {
          urlPattern: '/user',
          handler: 'networkFirst'
        },
        {
          // using a regex, especially useful
          // when you have Vue Routes with parameters
          urlPattern: /\/dashboard\/.*/,
          handler: 'networkFirst'
        }
      ]
    }
  }
}
```

The index route (`/`) is added by default, but you can overwrite it if you want. In the example above, we're caching routes `/`, `/user` and `/dashboard/**`.
