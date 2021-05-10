---
title: Vue Prototype Injections
desc: Injections into the Vue prototype supplied by Quasar.
---
Quasar injects Vue prototype with `$q` object:

| Injection | Type | Description |
| --- | --- | --- |
| `$q.version` | String | Quasar version. |
| `$q.platform` | Object | Same object as [Platform](/options/platform-detection) import from Quasar. |
| `$q.screen` | Object | Object supplied by [Screen Plugin](/options/screen-plugin). |
| `$q.lang` | Object | Quasar Language pack management, containing labels etc (one of [lang files](https://github.com/quasarframework/quasar/tree/dev/ui/lang)). Designed for Quasar components, but you can use it in your app components too. More info: [Quasar Language Packs](/options/quasar-language-packs). |
| `$q.iconSet` | Object | Quasar icon set management (one of [icon set files](https://github.com/quasarframework/quasar/tree/dev/ui/icon-set)). Designed for Quasar components, but you can use it in your app components too. More info: [Quasar Icon Sets](/options/quasar-icon-sets). |
| `$q.cordova` | Object | Reference to Cordova global object. Available only when running under a Cordova app. |
| `$q.capacitor` | Object | (@quasar/app v1.2+) Reference to Capacitor global object. Available only when running under a Capacitor app. |
| `$q.electron` | Object | Reference to Electron global object. Available only when running under an Electron app and **if [Node Integration](/quasar-cli/developing-electron-apps/node-integration) is NOT turned off**. |

## Example

You can use it globally inside a Vue context (component script or template) like this:

```html
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
