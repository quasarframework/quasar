---
title: Platform Detection
desc: How to detect the platform under which a Quasar app is running.
---

Helpers are built into Quasar to detect the Platform (and its capabilities) within the context of which the code is running.

::: tip
Based on your needs, you might also want to check the [Style & Identity &gt; Visibility](/style/visibility) page to see how you can achieve the same effect using CSS alone. This latter method will render your DOM elements or components regardless of platform though, so choose wisely on how you want to handle the performance of your app.
:::

## API
<doc-api file="Platform" />

## Usage
Usage inside a Vue component JS:

```js
this.$q.platform.is.mobile
```
Usage inside a Vue component template:

```js
$q.platform.is.cordova
```

You must import it when you use it outside of a Vue component :

```js
import { Platform } from 'quasar'
```

`Platform.is` by itself returns an object containing details about the current platform. For example when running Chrome on a MacOS desktop machine, `Platform.is` would return something similar to:

```js
{
  chrome: true,
  desktop: true,
  mac: true,
  name: "chrome",
  platform: "mac",
  version: "70.0.3538.110",
  versionNumber: 70,
  webkit: true
}
```

Now, let's say we want to render different components or DOM elements, based on the platform that the code is running under. We want to show something on desktop and something else on mobile. We would proceed like this:

```html
<div v-if="$q.platform.is.desktop">
  I'm only rendered on desktop!
</div>

<div v-if="$q.platform.is.mobile">
  I'm only rendered on mobile!
</div>

<div v-if="$q.platform.is.electron">
  I'm only rendered on Electron!
</div>
```

<doc-example title="Your device" file="Platform/Basic" />

## Properties

The following properties are available to the Platform object. It's not an exhaustive list though. See the API section below for more details.

| Property               | Type    | Meaning                                                  |
| ---                    | ---     | ---                                                      |
| `Platform.is.mobile`     | Boolean | Is the code running on a mobile device?                |
| `Platform.is.cordova`    | Boolean | Is the code running within Cordova?                    |
| `Platform.is.capacitor`  | Boolean | Is the code running with Capacitor? (requires @quasar/app v1.2+) |
| `Platform.is.electron`   | Boolean | Is the code running within Electron?                   |
| `Platform.is.desktop`    | Boolean | Is the code running on a desktop browser?              |
| `Platform.is.bex`        | Boolean | Is the code running in a browser extension? (requires @quasar/app v1.2+) |
| `Platform.is.android`    | Boolean | Is the app running on an Android device?               |
| `Platform.is.blackberry` | Boolean | Is the app running on a Blackberry device? |
| `Platform.is.cros`       | Boolean | Is the app running on device with the Chrome OS operating system? |
| `Platform.is.ios`        | Boolean | Is the app running on an iOS device? |
| `Platform.is.ipad`       | Boolean | Is the app running on an iPad? |
| `Platform.is.iphone`     | Boolean | Is the app running on an iPhone? |
| `Platform.is.ipod`       | Boolean | Is the app running on an iPod? |
| `Platform.is.kindle`     | Boolean | Is the app running on a Kindle device? |
| `Platform.is.linux`      | Boolean | Is the code running on a device with the Linux operating system? |
| `Platform.is.mac`        | Boolean | Is the code running on a device with the MacOS operating system? |
| `Platform.is.win`        | Boolean | Is the code running on a device with the Windows operating system? |
| `Platform.is.winphone`   | Boolean | Is the code running on a Windows Phone device? |
| `Platform.is.playbook`   | Boolean | Is the code running on a Blackberry Playbook device? |
| `Platform.is.silk`       | Boolean | Is the code running the Kindle Silk browser? |
| `Platform.is.chrome`     | Boolean | Is the code running inside the Google Chrome browser? |
| `Platform.is.opera`      | Boolean | Is the code running inside the Opera browser? |
| `Platform.is.safari`     | Boolean | Is the code running inside the Apple Safari browser? |
| `Platform.is.edge`       | Boolean | Is the code running inside the Microsoft Edge browser? |
| `Platform.is.ie`         | Boolean | Is the code running inside the Microsoft Internet Explorer browser? |
| `Platform.has.touch`     | Boolean | Is the code running on a touch capable screen?         |
| `Platform.within.iframe` | Boolean | Is the app running within an IFRAME?                   |

::: tip
Running on mobile means you can have this code running on a mobile device (phone or tablet) but with a browser, not within a Cordova wrapper.
:::

## Note about SSR
When building for SSR, use only the `$q.platform` form. If you need to use the `import { Platform } from 'quasar'` (when on server-side), then you'll need to do it like this:

```js
import { Platform } from 'quasar'

// you need access to `ssrContext`
function (ssrContext) {
  const platform = process.env.SERVER
    ? Platform.parseSSR(ssrContext)
    : Platform // otherwise we're on client

  // platform is equivalent to the global import as in non-SSR builds
}
```

The `ssrContext` is available in [boot files](/quasar-cli/boot-files). And also in the [preFetch](/quasar-cli/prefetch-feature) feature, where it is supplied as a parameter.

The reason for all this is that in a client-only app, every user will be using a fresh instance of the app in their browser. For server-side rendering we want the same: each request should have a fresh, isolated app instance so that there is no cross-request state pollution. So Platform needs to be bound to each request separately.
