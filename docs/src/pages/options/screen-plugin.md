---
title: Screen Plugin
desc: Quasar plugin that helps in writing a dynamic and responsive UI through Javascript code.
---
The Quasar Screen plugin allows you to have a dynamic and responsive UI when dealing with your Javascript code. When possible, it is recommended to use the [responsive CSS classes](/style/visibility#Window-Width-Related) instead, for performance reasons.

## Installation
You don't need to do anything. The Screen plugin gets installed automatically.

## Usage
Notice `$q.screen` below. This is just a simple usage example.

```html
<q-list :dense="$q.screen.lt.md">
  <q-item>
    <q-item-section>John Doe</q-item-section>
  </q-item>

  <q-item>
    <q-item-section>Jane Doe</q-item-section>
  </q-item>
</q-list>
```

```js
// script part of a Vue component
export default {
  computed: {
    buttonColor () {
      return this.$q.screen.lt.md
        ? 'primary'
        : 'secondary'
    }
  }
}
```

We can also use Screen plugin outside of a Vue component:
```js
import { Screen } from 'quasar'

// Screen.gt.md
// Screen.md
```

## Configuration
There are a few methods that can be used to tweak how Screen plugin works:

| Method | Description | Example |
| --- | --- | --- |
| setSizes(Object) | Change window breakpoints; does NOT also changes CSS breakpoints. | setSizes({ lg: 1024, xl: 2000 }) |
| setDebounce(Number) | Change the default 100ms debounce to some other value. | setDebounce(500) // 500ms |

Examples:
```
// inside a Vue component:
this.$q.screen.setSizes({ sm: 300, md: 500, lg: 1000, xl: 2000 })

// outside of a Vue component:
import { Screen } from 'quasar'
Screen.setSizes({ sm: 300, md: 500, lg: 1000, xl: 2000 })
```

## API
<doc-api file="Screen" />
