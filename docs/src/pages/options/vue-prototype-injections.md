---
title: Vue Prototype Injections
---
Quasar injects Vue prototype with `$q` object:

| Injection | Type | Description |
| --- | --- | --- |
| `$q.version` | String | Quasar version. |
| `$q.platform` | Object | Same object as [Platform](/options/platform-detection) import from Quasar. |
| `$q.cordova` | Object | Reference to Cordova global object. Available only when running under a Cordova app. |
| `$q.electron` | Object | Reference to Electron global object. Available only when running under an Electron app. |
| `$q.lang` | Object | Quasar Language pack management, containing labels etc (one of [lang files](https://github.com/quasarframework/quasar/tree/dev/quasar/lang)). Designed for Quasar components, but you can use in your app components too. |
| `$q.icon` | Object | Quasar icon set management (one of [icon set files](https://github.com/quasarframework/quasar/tree/dev/quasar/icons)). Designed for Quasar components, but you can use in your app components too. |

## Example

You can use it globally inside a Vue context (component script or template) like this:

```vue
<!-- inside a Vue template -->
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
