---
title: Quasar Icon Sets
desc: How to configure icon sets for Quasar components.
related:
  - /options/installing-icon-libraries
  - /vue-components/icon
---

Quasar components have their own icons. Rather than forcing you into using one icon library in particular (so that they can display correctly), Quasar lets you choose **which icons it should use for its components**. This is called a `Quasar Icon Set`.

You can install multiple icon libraries, but you must choose only one to use on Quasar's components.

Quasar currently supports: [Material Icons](https://material.io/icons/) , [Font Awesome](http://fontawesome.io/icons/), [Ionicons](http://ionicons.com/), [MDI](https://materialdesignicons.com/), [Eva Icons](https://akveo.github.io/eva-icons), and [Themify Icons](https://themify.me/themify-icons).

It is also possible to use your own icons (as images in any format) with any Quasar component, see the [QIcon page](/vue-components/icon#Images-instead-of-webfont) for more info on this.

::: tip
Related pages: [Installing Icon Libraries](/options/installing-icon-libraries) and [QIcon component](/vue-components/icon).
:::

## Installing a Quasar Icon Set

Unless configured otherwise, Quasar uses Material Icons as its icon set for its components. You can however tell Quasar to use some other icon set, but be sure to include that set in your website/app (see [Installing Icon Libraries](/options/installing-icon-libraries)).

So let's say we included Ionicons and we want Quasar to use it for its components.

### Quasar CLI Way
We edit `/quasar.conf.js` again:

```js
framework: {
  iconSet: 'fontawesome-v5'
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

This will enable you to use both Ionicons & Fontawesome in your app, and all Quasar components will display Fontawesome icons.

#### Changing Icon Set Dynamically
Quasar Icon Set is reactive, so all components will update properly if you change the $q.iconSet object. Here is a example:

```js
methods: {
  changeIconSetToFontAwesome () {
    this.$q.iconSet = require('quasar/icon-set/fontawesome-v5.js').default
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

Check what tags you need to include in your HTML files by generating a sample with `$ quasar create <folder> --kit umd` and specifying an icon set (other than the default "material-icons").


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
