---
title: useMeta composable
desc: What is Quasar's useMeta() composable and how you can use it
keys: useMeta
related:
  - /quasar-plugins/meta
---

The useMeta composable is part of [Quasar Meta Plugin](/quasar-plugins/meta). If you haven't digged into it by now, please have a first read there.

## Syntax

For static meta configuration (non-reactive):

```js
import { useMeta } from 'quasar'

setup () {
  useMeta({ /* meta config */ })
}
```

For dynamic meta configuration (reactive):

```js
import { useMeta } from 'quasar'

setup () {
  // essentially acting as a computed property
  useMeta(() => {
    // compute or reference other stuff
    // in your component
    // then return:
    return { /* meta config */ }
  })
}
```

## Example

```html
<script>
import { useQuasar } from 'quasar'

export default {
  setup () {
    const title = ref('Some title') // we define the "title" prop

    // NOTICE the parameter here is a function
    // Under the covers, it is converted to a Vue computed prop for reactivity
    useMeta(() => {
      return {
        // whenever "title" from above changes, your meta will automatically update
        title: title.value
      }
    })

    function setAnotherTitle () {
      title.value = 'Another title' // will automatically trigger a Meta update due to the binding
    }

    return {
      setAnotherTitle
    }
  }
}
</script>
```
