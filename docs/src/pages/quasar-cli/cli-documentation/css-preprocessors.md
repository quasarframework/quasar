---
title: CSS Preprocessors
desc: Sass/SCSS/Stylus are the out of the box supported css preprocessors in Quasar
related:
  - /style/sass-scss-variables
  - /style/stylus-variables
---

**Sass/SCSS** (recommended) and **Stylus** are the out of the box supported css preprocessors through Quasar CLI, should you want to use them.

You won't need to install any additional packages or extend the Webpack configuration.

::: warning
For full Sass/SCSS support, you will need @quasar/app v1.1.0+
:::

## How to
Your Vue files can contain Sass/SCSS/Stylus code through the `<style>` tag.

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

```html
<!-- Notice lang="stylus" -->
<style lang="stylus">
div
  color #444
  background-color #dadada
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
Quasar also supplies variables (`$primary`, `$grey-3`, ...and many more) and you can directly use them. Read more about [Sass/SCSS variables](/style/sass-scss-variables) and [Stylus variables](/style/stylus-variables).
