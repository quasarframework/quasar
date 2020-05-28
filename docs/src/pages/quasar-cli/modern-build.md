---
title: Modern Build
desc: How to enable modern build with Quasar CLI. Generates only ES6+ code.
badge: "@quasar/app v1.9+"
---

The default build type ships with transpiled and polyfilled code so that you can enjoy writing modern code that will simply work out of the box even on the older browsers. But it comes with a high cost: longer build times, the output code has a bigger size, and overall the code gets parsed and run slower than the optimal.

That optimal is the modern build, which is available through "@quasar/app" v1.9+. For the modern browsers: Chrome & Chromium-based, Firefox, Edge, Safari, ...

## What it does
By running a modern build, Quasar CLI will generate **non-transpiled** code (**no transpilation** means no Babel involved). As a result:
* the final bundles are generated much faster (less compile time)
* bundles are smaller in size (for example: 15-20% smaller for the default app of the starter kit)
* generated code has a superior parse + runtime speed on client's browser than the legacy ES5 equivalent

Best results will yield with Quasar v1.12+.

## What it doesn't
* Old browsers with no ES6+ support won't be able to run your website/app - Other similar build CLIs also have a "modern mode" which produce two bundles and serve the one that is the most appropriate for the client's browser (modern or legacy). But modern browsers nowadays have excellent ES6+ support so we decided (for now; see "Future plans" section) that Quasar CLI will only ship the ES6+ code when using the "modern build". This means that the really old browsers (that also have a very low market share) won't be compatible with your website/app.
* Quasar CLI will not transpile your code at all - Bleeding edge JS features won't work, like JS stage 1/2/3 feature proposals won't work. Build errors will be reported because Webpack uses [acorn](https://github.com/acornjs/acorn) which only supports stage 4 proposals (except for [optional chaining](https://github.com/tc39/proposal-optional-chaining)).
* If you write ES5 code in your app, Quasar CLI will not transform it to ES6+. What you write is what you get into the final bundle. However, dependencies with ES6+ code (for example Quasar itself) will pass through as they are so you'll get the benefits from this.

## How to enable it
There are two ways to enable it:

1. On the terminal by adding `--modern` parameter to your "quasar dev/build" command.
2. Editing `quasar.conf.js` > build > modern: true.

If you're using Typescript, you might also want to edit the `/tsconfig.json` file in order to tell TS to generate at least ES6 code.

## Future plans
* A "modern" + "Babel" setting which will transpile code down to ES6 (or your preferred level) -- so you'll be able to use any JS feature, no matter how new it is.
* We're still pondering if we'll supply a dual mode -- ship ES6+ or ES5 based on client's browser at runtime (by using the techniques discussed in [an article written by Phillip Walton](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/)).
