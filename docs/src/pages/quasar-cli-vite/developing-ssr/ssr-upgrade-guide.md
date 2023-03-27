---
title: Upgrade guide on SSR
desc: (@quasar/app-vite) Upgrading instructions from Quasar v1 to v2 when dealing with SSR.
related:
  - /quasar-cli-vite/developing-ssr/configuring-ssr
  - /quasar-cli-vite/developing-ssr/ssr-context
  - /quasar-cli-vite/developing-ssr/ssr-middleware
  - /quasar-cli-vite/developing-ssr/ssr-webserver
scope:
  oldTree:
    l: src-ssr
    c:
    - l: index.js
      e: Production Node webserver serving the app
    - l: extension.js
      e: Common code for production & development server
  newTree:
    l: src-ssr
    c:
    - l: middlewares/
      e: SSR middleware files
    - l: server.js
      e: SSR webserver production export
---

This page refers only to upgrading a Quasar UI v1 app (with Vue 2) to a Quasar UI v2 one (with Vue 3).
## Upgrading from Quasar v1

The SSR mode for Quasar v2 is an almost complete overhaul of the previous version, significantly improving the developer experience. Some of the changes were needed due to the architectural requirements of Vue 3.

Please note that currently the only Nodejs supported server is [Expressjs](https://expressjs.com/).

### High overview of the improvements

* Introducing the concept of [SSR middleware](/quasar-cli-vite/developing-ssr/ssr-middleware) files, which also allows for HMR for them while on dev. This replaces the old `index.js` and `extension.js`.
* The exact same middleware can now run on both dev and production builds, not just the old "SSR Extension".
* You can enable linting for SSR middlewares too.
* Due to the architecture of Vue 3, you now can (and need!) to define a SSR transformation for each of your custom Vue directives (Quasar supplied Vue directives are excluded from this).
* **Out of the box support for Typescript**. All .js files under `src-ssr` can be now rewritten as .ts. Make sure to read about [SSR with Typescript](/quasar-cli-vite/developing-ssr/ssr-with-typescript) for more information.

### The /src-ssr folder

The **old** structure:

<doc-tree :def="scope.oldTree" />

The **NEW** structure:

<doc-tree :def="scope.newTree" />

### Performing the upgrade

The old `index.js` and `extension.js` have been replaced by the superior SSR middleware files. It would be a good idea to [read about the SSR middleware](/quasar-cli-vite/developing-ssr/ssr-middleware) before diving in further.

So here we go:
1. We recommend that you save the content of your current `src-ssr` folder somewhere else.
2. Remove and add back the Quasar SSR mode (`$ quasar mode remove ssr`, `$quasar mode add ssr`).
3. Declare the middleware files under quasar.config.js > ssr > middlewares: []. The array should look like this:
  ```js
  middlewares: [
    'render' // should always keep this one as last one
  ]
  ```
4. You will then have to port the old logic by using the SSR middleware files, which should be really easy (since you'll end up copy-pasting most of the old code into the middleware files).
5. Review quasar.config.js > ssr properties. Most of the old props have been removed and replaced by [new ones](/quasar-cli-vite/developing-ssr/configuring-ssr#quasar-config-js).
6. Check the new `/src-ssr/server.js` file.

Also remember that the files that you create in the `src-ssr/middlewares` folder need to also be declared under quasar.config.js > ssr > middlewares. This is because their order matters, just like how the order of applying any Expressjs middleware matters too. You can use the `$ quasar new ssrmiddleware <name>` command to speed things up.

Always keep the original `render` middleware as last one in the list.

### Tips

* You might want to check out the [new configuration](/quasar-cli-vite/developing-ssr/configuring-ssr) properties available through quasar.config.js > ssr.
* You might want to check out the [ssrContext](/quasar-cli-vite/developing-ssr/ssr-context) page which describes in detail what properties you can use from it.
* You might want to check out the [SSR Webserver](/quasar-cli-vite/developing-ssr/ssr-webserver) page which describes in detail what server.js can do for you.
