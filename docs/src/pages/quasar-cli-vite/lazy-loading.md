---
title: Lazy Loading / Code Splitting
desc: (@quasar/app-vite) How to create async chunks in a Quasar CLI with Vite app.
---
When your website/app is small, you can load all layouts/pages/components into the initial bundle and serve everything at startup. But when your code gets complex and has many layouts/pages/components, it won't be optimal to do this as it will massively impact loading time. Fortunately, there is a way to solve this.

We'll cover how you can lazy load / code split parts of your app so that they are automatically requested only on demand. This is done through dynamic imports. Let's start with an example and then convert it so that we use lazy loading -- we'll focus this example on loading a page, but the same principle can be applied to load anything (assets, JSONs, ...).

## Lazy-load router pages
It's normal to use the Vue Router calling static components as below.

::: warning
Quasar documentation assumes you are already familiar with [Vue Router](https://github.com/vuejs/vue-router). Below it's described only the basics of how to make use of it in a Quasar CLI project. For the full list of its features please visit the [Vue Router documentation](https://router.vuejs.org/).
:::

```js
import SomePage from 'pages/SomePage'

const routes = [
  {
    path: '/some-page',
    component: SomePage
  }
]
```

Now let's change this and make the page be loaded on demand only, using dynamic imports:

```js
const routes = [
  {
    path: '/some-page',
    component: () => import('pages/SomePage')
  }
]
```

Easy, right? What this does is that it creates a separate chunk for `/src/pages/SomePage.vue` which is then loaded only when it is needed. In this case, when a user visits the '/some-page' route.

## Lazy-load components
Normally you would import a component and then register it to the Page, Layout or Component.

```html
<script>
import SomeComponent from 'components/SomeComponent'

export default {
  components: {
    SomeComponent,
  }
}
</script>
```

Now let's change this and make the component be loaded on demand only, using dynamic imports:
```html
<script>
import { defineAsyncComponent } from 'vue'
export default {
  components: {
    SomeComponent: defineAsyncComponent(() => import('components/SomeComponent')),
  }
}
</script>
```

## Lazy-load on the fly
As you noticed above, we're using dynamic imports (`import('..resource..')`) instead of regular imports (`import Resource from './path/to/resource'`). Dynamic imports are essentially returning a Promise that you can use:

```js
import('./categories.json')
  .then(categories => {
    // hey, we have lazy loaded the file
    // and we have its content in "categories"
  })
  .catch(() => {
    // oops, something went wrong...
    // couldn't load the resource
  })
```

## Importing with Vite

### Dynamic import statements

```js
const importList = import.meta.glob('./pages/*.vue')
const startIndex = '/pages/'.length

const routes = Object.keys(importList).map(key => {
  return {
    path: key.substring(startIndex, key.length - 4),
    component: importList[ key ]
  }
})
```

### Other import options

More info on importing assets with Vite [here](https://vitejs.dev/guide/assets.html).
