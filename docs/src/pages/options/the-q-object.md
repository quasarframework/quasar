---
title: The $q object
desc: The $q object in Quasar. Why and how to use it.
related:
  - /vue-composables/use-quasar
---

Quasar supplies a `$q` object that you can use for various purposes. You will notice it throughout the docs.

| Prop name | Type | Description |
| --- | --- | --- |
| `$q.version` | String | Quasar version. |
| `$q.platform` | Object | Same object as [Platform](/options/platform-detection) import from Quasar. |
| `$q.screen` | Object | Object supplied by [Screen Plugin](/options/screen-plugin). |
| `$q.lang` | Object | Quasar Language pack management, containing labels etc (one of [lang files](https://github.com/quasarframework/quasar/tree/dev/ui/lang)). Designed for Quasar components, but you can use it in your app components too. More info: [Quasar Language Packs](/options/quasar-language-packs). |
| `$q.iconSet` | Object | Quasar icon set management (one of [icon set files](https://github.com/quasarframework/quasar/tree/dev/ui/icon-set)). Designed for Quasar components, but you can use it in your app components too. More info: [Quasar Icon Sets](/options/quasar-icon-sets). |
| `$q.cordova` | Object | Reference to Cordova global object. Available only when running under a Cordova app. |
| `$q.capacitor` | Object | Reference to Capacitor global object. Available only when running under a Capacitor app. |

## Usage

The following sections will teach you how to use it in .vue files (with both Composition API and Options API) and outside of them.

### Composition API

The following is a .vue file:

```html
<template>
  <div>
    <div v-if="$q.platform.is.ios">
      Gets rendered only on iOS platform.
    </div>
  </div>
</template>

<script>
import { useQuasar } from 'quasar'

export default {
  setup () {
    const $q = useQuasar()

    console.log($q.platform.is.ios)

    // showing an example on a method, but
    // can be any part of Vue script
    function show () {
      // prints out Quasar version
      console.log($q.version)
    }

    return {
      show
    }
  }
}
</script>
```

### Options API

The following is a .vue file:

```html
<template>
  <div>
    <div v-if="$q.platform.is.ios">
      Gets rendered only on iOS platform.
    </div>
  </div>
</template>

<script>
// not available here outside
// of the export

export default {
  // inside a Vue component script
  ...,

  // showing an example on a method, but
  // can be any part of Vue script
  methods: {
    show () {
      // prints out Quasar version
      console.log(this.$q.version)
    }
  }
}
</script>
```

### Outside of a vue file

```js
import { Quasar } from 'quasar'

console.log(Quasar.platform.is.ios)
```
