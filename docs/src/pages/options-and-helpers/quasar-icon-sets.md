---
title: Quasar Icon Sets
---

Quasar components have their own icons. Rather than forcing you into using one icon library in particular (so that they can display correctly), Quasar lets you choose **which icons it should use for its components**. This is called a `Quasar icon set`.

You can install multiple icon libraries, but you must choose only one to use on Quasar's components.

Quasar currently supports: [Material Icons](https://material.io/icons/) , [Font Awesome](http://fontawesome.io/icons/), [Ionicons](http://ionicons.com/), [MDI](https://materialdesignicons.com/) and [Eva Icons](https://akveo.github.io/eva-icons).

::: tip
Related pages: [Installing Icon Libraries](/options-and-helpers/installing-icon-libraries) and [QIcon component](/vue-components/icon).
:::

## Installing

Unless configured otherwise, Quasar uses Material Icons as its icon set for its components. You can however tell Quasar to use some other icon set, but be sure to include that set in your website/app (see [Installing Icon Libraries](/options-and-helpers/installing-icon-libraries)).

So let's say we included Ionicons and we want Quasar to use it for its components. We edit `/quasar.conf.js` again:

```js
framework: {
  iconSet: 'fontawesome-v5'
}
```

For all available options, visit the [Github](https://github.com/quasarframework/quasar/tree/dev/quasar/icons) repository.

### Full Example
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
