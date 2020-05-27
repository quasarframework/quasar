---
title: Modern Build
desc: How to enable modern build with Quasar CLI. Generates only ES6+ code.
badge: "@quasar/app v1.9+"
---

The default build type (which we'll call "legacy" going forward) ships with transpiled and polyfilled code so that you can enjoy writing modern code that will simply work out of the box even on the older browsers. But it comes with a high cost: longer build times, the output code has a bigger size, and overall the code gets parsed and run slower than the optimal.

That optimal is the modern build, which is available through "@quasar/app" v1.9+. For the modern browsers: Chrome & Chromium-based, Firefox, Edge, Safari, ...

## What it does
By running a modern build, Quasar CLI will:
* build ES6+ code (no transpilation, so no Babel)
* generate the final bundles much faster
* generate bundles that are smaller in size (for example: 10-15% smaller for the default app of the starter kit)
* generate code that has a superior parse + run speed than the legacy ES5 equivalent

Best results will yield with Quasar v1.12+

## What it doesn't
* Old browsers with no ES6+ support won't be able to view your website/app - Other similar build CLIs also have a "modern mode" which produce two bundles and serve the one that is the most appropriate for the client's browser (modern or legacy). But modern browsers nowadays have excellent ES6+ support so we decided (for now) that Quasar CLI will only ship the ES6+ code when using the "modern build". This means that the really old browsers (that also have a very low market share) won't be able to view your website/app. On the other hand, it means that your apps will get built much faster.
* Quasar CLI will not transpile your code at all - Bleeding edge JS features won't work, like JS stage 1/2/3 feature proposals won't work. Build errors will be reported because Webpack uses [acorn](https://github.com/acornjs/acorn) which only supports stage 4 proposals.

## How to enable it
There are two ways to enable it:

1. On the terminal by adding `--modern` parameter to your "quasar dev/build" command.
2. Editing quasar.conf.js > build > modern: true.

## Future work
* A "modern" + "Babel" setting which will transpile code down to ES6 -- so you'll be able to use any JS feature, no matter how new it is.
* We're still pondering if we'll supply a dual mode -- ship ES6+ or ES5 based on client's browser at runtime.
