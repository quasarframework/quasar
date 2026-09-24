---
title: App Network
desc: A Quasar plugin that tells you whether the browser is online and what kind of connection it has.
keys: AppNetwork
badge: v2.34+
examples: AppNetwork
related:
  - /quasar-plugins/app-visibility
---

The AppNetwork plugin keeps a reactive picture of the network the browser is on. It wraps the [Navigator.onLine](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) property together with the `online`/`offline` events and, where the browser exposes it, the [Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API).

<DocApi file="AppNetwork" />

<DocInstall plugins="AppNetwork" scrollable />

## Usage

```js
// outside of a Vue file
import { AppNetwork } from 'quasar'
AppNetwork.online // Boolean

// inside of a Vue file
import { useQuasar } from 'quasar'
setup () {
  const $q = useQuasar()
  // now use $q.network.online (Boolean)
}
```

<DocExample title="AppNetwork" file="Basic" />

> [!WARNING]
> **What "online" really means**
>
> `online` being `false` is reliable: the browser knows that it has no network. `online` being `true` only tells you that some network is present. A captive portal, a router with no upstream or a dead Wi-Fi link all still report `true`, so treat it as a hint and let your actual requests have the final word.

## Connection details

Chromium-based browsers (Chrome, Edge, Opera, Samsung Internet, Android WebView) also expose the Network Information API, which the plugin mirrors into `effectiveType`, `downlink`, `rtt` and `saveData`. Firefox and Safari do not implement it, so on those browsers the four props stay `undefined` and `hasConnectionInfo` is `false`.

```html
<template>
  <q-banner v-if="$q.network.saveData" class="bg-grey-3">
    Data Saver is on, so images load at a lower quality.
  </q-banner>
</template>
```

The values are the browser's own estimates, rounded on purpose (they are a fingerprinting vector), and they describe the link, not the far end: a `4g` effective type says nothing about how quickly your API answers.

> [!TIP]
> **Hybrid apps**
>
> Capacitor and Cordova apps can additionally rely on their native network plugins, which know about the device's radio state. AppNetwork stays the web-side answer, so it also works inside a WebView, on Electron and as a PWA.

## Watching for status change

```html
<template>...</template>

<script setup>
  import { useQuasar } from 'quasar'
  import { watch } from 'vue'

  const $q = useQuasar()

  watch(
    () => $q.network.online,
    val => {
      console.log(val ? 'Back online' : 'Went offline')
    }
  )
</script>
```

## SSR and SSG

On the server there is no network to observe, so `$q.network.online` is `true`, `hasConnectionInfo` is `false` and the connection props are `undefined`. On the client, the plugin only fills in the real values after hydration completes, which keeps the server-rendered markup from mismatching when the page was loaded offline (for example from a PWA cache).
