---
title: Quasar Icon Sets
desc: How to configure icon sets for Quasar components.
related:
  - /options/installing-icon-libraries
  - /vue-components/icon
---

Quasar components have their own icons. Rather than forcing you into using one icon library in particular (so that they can display correctly), Quasar lets you choose **which icons it should use for its components**. This is called a `Quasar Icon Set`.

You can install multiple icon libraries, but you must choose only one to use on Quasar's components.

Quasar currently supports: [Material Icons](https://material.io/icons/), [Font Awesome](http://fontawesome.io/icons/), [Line Awesome](https://icons8.com/line-awesome), [Ionicons](http://ionicons.com/), [MDI](https://materialdesignicons.com/), [Eva Icons](https://akveo.github.io/eva-icons), and [Themify Icons](https://themify.me/themify-icons).

It is also possible to use your own icons (as custom svgs or as images in any format) with any Quasar component, see the [QIcon](/vue-components/icon#Image-icons) page for more info on this.

::: tip
Related pages: [Installing Icon Libraries](/options/installing-icon-libraries) and [QIcon component](/vue-components/icon).
:::

## Installing a Quasar Icon Set

**There are two types of Quasar Icon Sets: webfont-based and svg-based.**

Unless configured otherwise, Quasar uses Material Icons webfont as its icon set for its components. You can however tell Quasar to use some other icon set, but if it's a webfont-based one then be sure to include its icon library in your website/app (see [Installing Icon Libraries](/options/installing-icon-libraries)).

So let's say we included Ionicons and we want Quasar to use it for its components.

### Quasar CLI Way
We edit `/quasar.conf.js` again:

```js
framework: {
  // webfont-based example
  iconSet: 'fontawesome-v5'
}
```

```js
framework: {
  // svg-based example
  iconSet: 'svg-mdi-v4'
}
```

For all available options, visit the [GitHub](https://github.com/quasarframework/quasar/tree/dev/ui/icon-set) repository.

#### Full Example
Here is an example of including Ionicons & Fontawesome and telling Quasar to use Fontawesome for its components.

```js
extras: [
  'ionicons-v4',
  'fontawesome-v5'
],
framework: {
  iconSet: 'fontawesome-v5'
}
```

This will enable you to use both Ionicons & Fontawesome webfonts in your app, and all Quasar components will display Fontawesome icons.

#### Changing Icon Set Dynamically
Quasar Icon Set is reactive, so all components will update properly if you change the $q.iconSet object. Here is an example:

```js
methods: {
  changeIconSetToFontAwesome () {
    this.$q.iconSet = require('quasar/icon-set/fontawesome-v5.js').default
  }
}
```

#### Changing a Specific Icon Dynamically
If you want to change a specific icon to another, you can. Here is an example:

```js
methods: {
  changeQEditorHeaderIcon () {
    this.$q.iconSet.editor.header1 = 'fas fa-font'
  }
}
```

### UMD Way
Include the Quasar Icon Set tag for your Quasar version and also tell Quasar to use it. Example:

```html
<!-- include this after Quasar JS tag -->
<script src="https://cdn.jsdelivr.net/npm/quasar@v1.0.0/dist/icon-set/fontawesome-v5.umd.min.js"></script>
<script>
  Quasar.iconSet.set(Quasar.iconSet.fontawesomeV5)
</script>
```

Check what tags you need to include in your HTML files on [UMD / Standalone](/start/umd) page.


### Vue CLI Way
We edit your `main.js`:

```js
import iconSet from 'quasar/icon-set/fontawesome-v5'
// ...
import { Quasar } from 'quasar'
// ...
Vue.use(Quasar, {
  // ...,
  iconSet: iconSet
})
```
