---
title: Screen Plugin
desc: Quasar plugin that helps in writing a dynamic and responsive UI through Javascript code.
---
The Quasar Screen plugin allows you to have a dynamic and responsive UI when dealing with your Javascript code. When possible, it is recommended to use the [responsive CSS classes](/style/visibility#window-width-related) instead, for performance reasons.

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
import { useQuasar } from 'quasar'
import { computed } from 'vue'

export default {
  setup () {
    const $q = useQuasar()
    const buttonColor = computed(() => {
      return $q.screen.lt.md
        ? 'primary'
        : 'secondary'
    })

    return { buttonColor }
  }
}
```

We can also use the Screen plugin outside of a Vue component:

```js
import { Screen } from 'quasar'

// Screen.gt.md
// Screen.md
// Screen.name ('xs', 'sm', ...)
```

## Body classes

**If you enable it (see how to do it after the examples below)**, you can also style your content based on a particular set of CSS classes applied to document.body: `screen--xs`, `screen--sm`, ..., `screen-xl`.

```css
body.screen--xs {
  .my-div {
    color: #000;
  }
}

body.screen--sm {
  .my-div {
    color: #fff;
  }
}
```

Or a sexy variant in Sass:

```sass
.my-div
  body.screen--xs &
    color: #000
  body.screen--sm &
    color: #fff
```

### How to enable body classes

In order to enable the behavior above, edit your /quasar.conf.js file like below. Please note that this will increase a bit the time for First Meaningful Paint.

```js
// file: /quasar.conf.js

framework: {
  config: {
    screen: {
      bodyClasses: true // <<< add this
    }
  }
}
```

## Configuration
There are a few methods that can be used to tweak how Screen plugin works:

| Method | Description | Example |
| --- | --- | --- |
| setSizes(Object) | Change window breakpoints; does NOT also changes CSS breakpoints. | setSizes({ lg: 1024, xl: 2000 }) |
| setDebounce(Number) | Change the default 100ms debounce to some other value. | setDebounce(500) // 500ms |

Examples:

```js
// inside a Vue component:
import { useQuasar } from 'quasar'

setup () {
  const $q = useQuasar()

  $q.screen.setSizes({ sm: 300, md: 500, lg: 1000, xl: 2000 })
}

// outside of a Vue component:
import { Screen } from 'quasar'
Screen.setSizes({ sm: 300, md: 500, lg: 1000, xl: 2000 })
```

## API
<doc-api file="Screen" />
