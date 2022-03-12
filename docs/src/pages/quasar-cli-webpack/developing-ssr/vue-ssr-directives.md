---
title: Vue SSR Directives
desc: (@quasar/app-webpack) Managing the Vue directives for SSR in a Quasar app.
---

::: warning
This guide refers to usage with Quasar v2.6+ and @quasar/app-webpack v3.4+
:::

A SSR app has the same code running on server and on client. Declaring a Vue directive (or directly importing it) in a .vue SFC file is usually enough for making it to work on non-SSR builds. But on SSR builds and due to the architecture of Vue 3  it requires some extra leg work.

Server-side builds require all Vue directives to also specify a getSSRProps() method in their definition.

::: tip
* You will NOT need to do anything for the Quasar supplied Vue directives to work.
* However, if you are using a third-party supplied Vue directive and the CLI errors out on it then you will need to contact the owner of that package in order for them to make it compliant with Vue 3 SSR specs (which is to add the getSSRProps() method in the directive's definition).
:::

## How to declare a directive

The following is taken from [Vue.js docs](https://vuejs.org/guide/scaling-up/ssr.html#custom-directives):

> Since most custom directives involve direct DOM manipulation, they are ignored during SSR. However, if you want to specify how a custom directive should be rendered (i.e. what attributes it should add to the rendered element), you can use the getSSRProps directive hook:

```js
const myDirective = {
  mounted (el, binding) {
    // client-side implementation:
    // directly update the DOM
    el.id = binding.value
  },

  getSSRProps (binding) {
    // server-side implementation:
    // return the props to be rendered.
    // getSSRProps only receives the directive binding.
    return {
      id: binding.value
    }
  }
}
```
