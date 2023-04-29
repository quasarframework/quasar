---
title: CSS Preprocessors
desc: (@quasar/app-vite) Sass/SCSS are the out of the box supported css preprocessors in Quasar
related:
  - /style/sass-scss-variables
---

**Sass** or **SCSS** (recommending any of the two flavours) are the out of the box supported css preprocessors through Quasar CLI, should you want to use them.

## Configuration

You can configure how your CSS is handled through `/postcss.config.cjs` and through extending the Vite config:

```js
// quasar.config.js

build: {
  extendViteConf (viteConf, { isClient, isServer }) {
    viteConf.css.modules = ...
    viteConf.css.postcss = ...
    viteConf.css.preprocessorOptions
  }
}
```

More info: [css.modules](https://vitejs.dev/config/#css-modules), [css.postcss](https://vitejs.dev/config/#css-postcss), [css.preprocessorOptions](https://vitejs.dev/config/#css-preprocessoroptions).

## Usage
Your Vue files can contain Sass/SCSS code through the `<style>` tag.

```html
<!-- Notice lang="sass" -->
<style lang="sass">
div
  color: #444
  background-color: #dadada
</style>
```

```html
<!-- Notice lang="scss" -->
<style lang="scss">
div {
  color: #444;
  background-color: #dadada;
}
</style>
```

And, of course, standard CSS is also supported:

```html
<style>
div {
  color: #444;
  background-color: #dadada;
}
</style>
```

## Variables
Quasar also supplies variables (`$primary`, `$grey-3`, ...and many more) and you can directly use them. Read more about [Sass/SCSS variables](/style/sass-scss-variables).
