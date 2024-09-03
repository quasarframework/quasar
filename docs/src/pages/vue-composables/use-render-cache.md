---
title: useRenderCache composable
desc: What is useRenderCache() composable and how you can use it
keys: useRenderCache
badge: Quasar v2.15+
---

The `useRenderCache()` composable is useful especially when you are dealing with Vue render functions (though not restricted to it). When you are building nodes through an iteration, this composable can help you inline the code while (for performance reasons) also benefitting from a cache.

When dealing with SSR, on the server-side you will not want to cache anything because the render will only happen once per client (and you don't want your memory footprint to needlessly grow). Thus the useRenderCache composable will not actually use any cache on server-side, but rather the default values supplied on each call.

You can directly cache any type of value that you want. Some examples:
* You can cache some listeners so that Vue won't be required to remove and re-attach them on each re-render.
* You can cache some Vue rendered nodes, although you must be careful in this scenario because their content should not depend on any "reactive" content (refs, computed, etc).

## Syntax

```js
import { useRenderCache } from 'quasar'

setup () {
  const {
    getCache,
    setCache,
    hasCache,
    clearCache
  } = useRenderCache()

  // ...
}
```

```js
function useRenderCache(): {
  getCache: <T = any>(key: string, defaultValue?: T | (() => T)) => T;
  setCache: <T = any>(key: string, value: T) => void;
  hasCache: (key: string) => boolean;
  clearCache: (key?: string) => void;
};
```

## Example

The next example caches some listeners in order to avoid Vue removing and re-attaching them on each render cycle:

```js
import { h } from 'vue'
import { useRenderCache } from 'quasar'

export default {
  setup () {
    const { getCache } = useRenderCache()

    function getNode (i) {
      return h('div', {
        onClick: getCache(
          `click#${ i }`,
          () => { console.log(`clicked on node ${ i }`) }
        )
      })
    }

    function getContent () {
      const acc = []
      for (let i = 0; i < 10; i++) {
        acc.push(
          getNode(i)
        )
      }
      return acc
    }

    return () => {
      h('div', getContent)
    }
  }
}
```

The following example caches some values and calls the second parameter (which is a Function) to generate the default value only when the cache has no such key already set. This way, we avoid needlessly running the function even if cache is already set:

```js
const { getCache } = useRenderCache()

getCache('my-key', () => {
  // some computation which is only run
  // when the cache does NOT have "my-key" set
  return { some: 'object' }
})
```

## Pitfall to avoid

Don't cache directly on the second parameter of the Vue `h()` function. This will tamper with Vue's DOM diff algorithm.

```js
// DON'T cache like this:
h(
  'div',
  getCache(`node#${ i }`, () => {
    return {
      onClick () => { console.log(`clicked on node ${ i }`) }
    }
  })
)

// ..rather, do it like this:
h(
  'div',
  { // new such object needs to be created on each
    // render, even if the content is cached
    ...getCache(`node#${ i }`, () => {
      return {
        onClick () => { console.log(`clicked on node ${ i }`) }
      }
    })
  }
})
```
