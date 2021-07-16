---
title: Quasar Icon Sets
desc: How to configure icon sets for Quasar components.
related:
  - /options/installing-icon-libraries
  - /vue-components/icon
---

Quasar components have their own icons. Rather than forcing you into using one icon library in particular (so that they can display correctly), Quasar lets you choose **which icons it should use for its components**. This is called a `Quasar Icon Set`.

You can install multiple icon libraries, but you must choose only one to use on Quasar's components.

Quasar currently supports: [Material Icons](https://material.io/icons/) , [Font Awesome](http://fontawesome.io/icons/), [Ionicons](http://ionicons.com/), [MDI](https://materialdesignicons.com/), [Eva Icons](https://akveo.github.io/eva-icons), [Themify Icons](https://themify.me/themify-icons), [Line Awesome](https://icons8.com/line-awesome) and [Bootstrap Icons](https://icons.getbootstrap.com/).

It is also possible to use your own icons (as custom svgs or as images in any format) with any Quasar component, see the [QIcon](/vue-components/icon#image-icons) page for more info on this.

::: tip
Related pages: [Installing Icon Libraries](/options/installing-icon-libraries) and [QIcon component](/vue-components/icon).
:::

## Configuring the default Icon Set
**There are two types of Quasar Icon Sets: webfont-based and svg-based.**

Unless configured otherwise, Quasar uses Material Icons webfont as the icon set for its components. You can however tell Quasar to use some other Icon Set, but if it's a webfont-based one then be sure to include its icon library in your website/app (see [Installing Icon Libraries](/options/installing-icon-libraries)).

### Hardcoded
If the default Quasar Icon Set is not dynamically determined (does not depends on cookies for example), then you can:

#### Quasar CLI Way
We edit `/quasar.conf.js` again:

```js
framework: {
  // webfont-based example
  iconSet: 'mdi-v5'
}
```

```js
framework: {
  // svg-based example
  iconSet: 'svg-mdi-v5'
}
```

For all available options, visit the [GitHub](https://github.com/quasarframework/quasar/tree/dev/ui/icon-set) repository.

Full example of including MDI & Fontawesome and telling Quasar to use Fontawesome for its components.

```js
extras: [
  'mdi-v5',
  'fontawesome-v5'
],
framework: {
  iconSet: 'fontawesome-v5'
}
```

This will enable you to use both Ionicons & Fontawesome webfonts in your app, and all Quasar components will display Fontawesome icons.

#### UMD Way
Include the Quasar Icon Set tag for your Quasar version and also tell Quasar to use it. Example:

```html
<!-- include this after Quasar JS tag -->
<script src="https://cdn.jsdelivr.net/npm/quasar@v2/dist/icon-set/fontawesome-v5.umd.prod.js"></script>
<script>
  Quasar.iconSet.set(Quasar.iconSet.fontawesomeV5)
</script>
```

Check what tags you need to include in your HTML files on [UMD / Standalone](/start/umd) page.


#### Vue CLI Way
We edit your `main.js`:

```js
import iconSet from 'quasar/icon-set/fontawesome-v5'
// ...
import { Quasar } from 'quasar'
// ...
app.use(Quasar, {
  // ...,
  iconSet: iconSet
})
```

### Dynamical (non-SSR)
Quasar CLI: If your desired Quasar Icon Set must be dynamically selected (example: depends on a cookie), then you need to create a boot file: `$ quasar new boot quasar-icon-set [--format ts]`. This will create `/src/boot/quasar-icon-set.js` file. Edit it to:

```js
import { Quasar } from 'quasar'

export default async () => {
  const iconSetName = 'mdi-v5' // ... some logic to determine it (use Cookies Plugin?)

  try {
    await import(
      /* webpackInclude: /(mdi-v5|fontawesome-v5)\.js$/ */
      'quasar/icon-set/' + iconSetName
      )
      .then(setDefinition => {
        Quasar.iconSet.set(setDefinition.default)
      })
  }
  catch (err) {
    // Requested Quasar Icon Set does not exist,
    // let's not break the app, so catching error
  }
}
```

Then register this boot file into `/quasar.conf.js`:

```js
boot: [
  'quasar-icon-set'
]
```

::: warning Always constrain a dynamic import
Notice the use of the [Webpack magic comment](https://webpack.js.org/api/module-methods/#magic-comments) - `webpackInclude`. Otherwise all the available icon set files will be bundled, resulting in an increase in the compilation time and the bundle size. See [Caveat for dynamic imports](https://quasar.dev/quasar-cli/lazy-loading#Caveat-for-dynamic-imports)
:::

### Dynamical (SSR)
When dealing with SSR, we can't use singleton objects because that would pollute sessions. As a result, as opposed to the dynamical example above (read it first!), you must also specify the `ssrContext` from your boot file:

```js
import { Quasar } from 'quasar'

// ! NOTICE ssrContext param:
export default async ({ ssrContext }) => {
  const iconSetName = 'mdi-v5' // ... some logic to determine it (use Cookies Plugin?)

  try {
    await import(
      /* webpackInclude: /(mdi-v5|fontawesome-v5)\.js$/ */
      'quasar/icon-set/' + iconSetName
      )
      .then(setDefinition => {
        // ! NOTICE ssrContext param:
        Quasar.iconSet.set(setDefinition.default, ssrContext)
      })
  }
  catch (err) {
    // Requested Quasar Icon Set does not exist,
    // let's not break the app, so catching error
  }
}
```

## Change Quasar Icon Set at Runtime

#### Changing Icon Set Dynamically
Quasar Icon Set is reactive, so all components will update properly if you change the $q.iconSet object. Here is an example:

```js
// Composition API variant
import { useQuasar } from 'quasar'
import mdiIconSet from 'quasar/icon-set/mdi-v5.js'

setup () {
  const $q = useQuasar()

  function changeIconSetToMdiIconSet () {
    $q.iconSet.set(mdiIconSet)
  }

  return {
    changeIconSetToMdiIconSet
  }
}
```

```js
// Options API variant
import mdiIconSet from 'quasar/icon-set/mdi-v5.js'

methods: {
  changeIconSetToMdiIconSet () {
    this.$q.iconSet.set(mdiIconSet)
  }
}
```

#### Changing a Specific Icon Dynamically
If you want to change a specific icon to another, you can. Here is an example:

```js
// Composition API variant
import { useQuasar } from 'quasar'

setup () {
  const $q = useQuasar()

  function changeQEditorHeaderIcon () {
    $q.iconSet.editor.header1 = 'fas fa-font'
  }

  return { changeQEditorHeaderIcon }
}
```

```js
// Options API variant
methods: {
  changeQEditorHeaderIcon () {
    this.$q.iconSet.editor.header1 = 'fas fa-font'
  }
}
```

