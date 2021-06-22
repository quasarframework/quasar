---
title: Chain Webpack
desc: Tips and tricks on how to use a Quasar App Extension to configure the host app to use a Webpack loader.
---

This guide is for when you want to ensure that a [Webpack Loader](https://webpack.js.org/loaders/) is chained into the hosting app, because you depend on it for your own App Extension to work.

::: tip
In order for creating an App Extension project folder, please first read the [Development Guide > Introduction](/app-extensions/development-guide/introduction).
:::

::: tip Full Example
To see an example of what we will build, head over to [full example](https://github.com/quasarframework/app-extension-examples/tree/v2/chain-webpack), which is a GitHub repo with this App Extension.
:::

We will only need the /index.js script for this, because we can use the [Index API](/app-extensions/development-guide/index-api) to configure quasar.conf.js from the host app to include our Webpack chaining.

```bash
.
├── package.json
└── src
    └── index.js              # Described in Index API
```

And /index.js would look like this:

```js
// file: /index.js
module.exports = function (api) {
  // (Optional!)
  // Quasar compatibility check; you may need
  // hard dependencies, as in a minimum version of the "quasar"
  // package or a minimum version of "@quasar/app" CLI
  api.compatibleWith('quasar', '^2.0.0')
  api.compatibleWith('@quasar/app', '^3.0.0')

  // chain webpack
  api.chainWebpack((chain) => chainWebpack(api.ctx, chain))
}
```

Our "chainWebpack" method, in the same file as above:

```js
// file: /index.js
const MarkdownIt = require('markdown-it')
const md = new MarkdownIt()

const chainWebpack = function (ctx, chain) {
  const rule = chain.module.rule('md')
    .test(/\.md$/)
    .pre()

  rule.use('v-loader')
    .loader('vue-loader')
    .options({
      productionMode: ctx.prod,
      transformAssetUrls: {
        video: 'src',
        source: 'src',
        img: 'src',
        image: 'xlink:href'
      }
    })

  rule.use('ware-loader')
    .loader('ware-loader')
    .options({
      raw: true,
      middleware: function (source) {
        // use markdown-it to render the markdown file to html, then
        // surround the output of that that with Vue template syntax
        // so it can be processed by the 'vue-loader'
        return `<template><div>${md.render(source)}</div></template>`
      }
    })
}
```

