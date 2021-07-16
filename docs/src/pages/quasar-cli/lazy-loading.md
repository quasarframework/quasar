---
title: Lazy Loading / Code Splitting
desc: How to create Webpack chunks in a Quasar app.
---
When your website/app is small, you can load all layouts/pages/components into the initial bundle and serve everything at startup. But when your code gets complex and has many layouts/pages/components, it won't be optimal to do this as it will massively impact loading time. Fortunately, there is a way to solve this.

We'll cover how you can lazy load / code split parts of your app so that they are automatically requested only on demand. This is done through dynamic imports. Let's start with an example and then convert it so that we use lazy loading -- we'll focus this example on loading a page, but the same principle can be applied to load anything (assets, JSONs, ...):

## Lazy-load router pages
It's normal to use the Vue-Router calling static components as below.
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

One advantage of using dynamic imports as opposed to regular imports is that the import path can be determined at runtime:

```js
import('pages/' + pageName + '/' + 'id')
```

## Caveat for dynamic imports
There's one caveat when using dynamic imports with variable parts like in the previous example. When the website/app is bundled, so at compile time, we have no way of telling what the exact import path will be at runtime. As a result, chunks will be created for each file that could match the variable path. You might see un-necessary files in the build log.

So how can we limit the number of chunks created in this case? The idea is to limit the variable part as much as you can so the matched paths are as few as possible.
1. Add file extension, even if it works without it too. This will create chunks only for that file types. Useful when that folder contains many file types.
  ```js
  // bad
  import('./folder/' + pageName)

  // much better
  import('./folder/' + pageName + '.vue')
  ```
2. Try to create a folder structure that will limit the files available in that variable path. Make it as specific as possible:
  ```js
  // bad -- makes chunks for any JSON inside ./folder (recursive search)
  const asset = 'my/jsons/categories.json'
  import('./folder/' + asset)

  // good -- makes chunks only for JSONs inside ./folder/my/jsons
  const asset = 'categories.json'
  import('./folder/my/jsons/' + asset)
  ```
3. Try to import from folders containing only files. Take the previous example and imagine ./folder/my/jsons further contains sub-folders. We made the dynamic import better by specifying a more specific path, but it's still not optimal in this case. Best is to use terminal folders that only contain files, so we limit the number of matched paths.

4. Use [Webpack magic comments](https://webpack.js.org/api/module-methods/#magic-comments) `webpackInclude` and `webpackExclude` to constrain the bundled chunks with a regular expression, for example:
  ```js
  await import(
    /* webpackInclude: /(ar|en-US|ro)\.js$/ */
    'quasar/lang/' + langIso
  )
    .then(lang => {
      Quasar.lang.set(lang.default)
    })
  ```
  will result in bundling only the language packs you need for your site/app, instead of bundling all the language packs (more than 40!) which might hamper the performance of the commands `quasar dev` and `quasar build`.

Remember that the number of matched paths equals to the number of chunks being generated.
