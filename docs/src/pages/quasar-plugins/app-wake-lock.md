---
title: App Wake Lock
desc: A Quasar plugin that keeps the screen from turning off through the Screen Wake Lock API.
keys: AppWakeLock
badge: v2.34+
examples: AppWakeLock
related:
  - /quasar-plugins/app-fullscreen
  - /quasar-plugins/app-visibility
---

Recipe pages, boarding passes, presentations, navigation views: some screens must stay on while the user is not touching the device. The AppWakeLock plugin wraps the [Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API) so that a single `request()` keeps the screen awake for as long as you want it to, and `release()` lets the device go back to its normal timeout.

<DocApi file="AppWakeLock" />

<DocInstall plugins="AppWakeLock" scrollable />

## Usage

```js Outside of a Vue file
import { AppWakeLock } from 'quasar'

// Keep the screen awake:
AppWakeLock.request()
  .then(() => {
    // success!
  })
  .catch(err => {
    // page hidden, battery saver, or not capable
  })

// Let the screen turn off again:
AppWakeLock.release()
```

```js Inside of a Vue file
import { useQuasar } from 'quasar'

setup () {
  const $q = useQuasar()

  $q.wakeLock.request()
    .then(() => {
      // success!
    })
    .catch(err => {
      // page hidden, battery saver, or not capable
    })

  // ...later
  $q.wakeLock.release()
}
```

<DocExample title="Basic" file="Basic" />

## The browser releases the lock on its own

A wake lock only lives while the page is visible. As soon as the user switches tabs, minimizes the browser or locks the phone, the browser releases the lock, and `isActive` drops to `false`. The plugin remembers that you asked for the lock and requests it again the moment the page becomes visible, until you call `release()`. There is nothing to wire up on your side: one `request()` on mount and one `release()` on unmount is all a component needs.

```html
<template>...</template>

<script setup>
  import { useQuasar } from 'quasar'
  import { onBeforeUnmount } from 'vue'

  const $q = useQuasar()

  $q.wakeLock.request().catch(() => {
    // not available; the page still works, the screen just times out
  })

  onBeforeUnmount(() => {
    $q.wakeLock.release()
  })
</script>
```

`isActive` always reflects the actual state: `true` only while a lock is really held. Watch it if your UI shows the current status.

> [!WARNING]
> **When the request is refused**
>
> The browser rejects `request()` with a `NotAllowedError` when the page is hidden, when the device is in a battery saver mode, or when a `screen-wake-lock` [Permissions Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy/screen-wake-lock) forbids it (relevant when your app runs inside an iframe). Treat the rejection as a soft failure: the screen behaves as it always did.

## Browser support

The Screen Wake Lock API needs a secure context (HTTPS or localhost) and is available in Chromium-based browsers, Safari 16.4+ and Firefox 126+. Check `$q.wakeLock.isCapable` before showing a "keep screen on" control; where it is `false`, the methods reject with a `Not capable` error.

> [!TIP]
> **Hybrid apps**
>
> The API works inside the WebViews used by Capacitor and Cordova on current platforms, so the plugin stays the single answer for web, PWA and hybrid builds. If you need the screen on regardless of the WebView's support, the native keep-awake plugins of those platforms are the fallback.

## SSR and SSG

There is no screen on the server, so `isCapable` and `isActive` are both `false` there and the methods resolve without doing anything. On the client, `isCapable` gets its real value only after hydration completes, which keeps markup that depends on it (a `v-if` around your toggle) from mismatching the server render.
