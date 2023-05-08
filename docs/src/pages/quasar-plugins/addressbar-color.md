---
title: AddressbarColor Plugin
desc: A Quasar plugin for changing the addressbar color on newer mobile browsers.
keys: AddressbarColor
---
Newer mobile browsers have the ability to specify a color for the addressbar, like in the image below.

::: warning
* There isn't yet a Web standard for this so it won't work for all mobile browsers.
* This applies when building a website only. For coloring top bar on a mobile app (built with Cordova mode), please refer to [cordova-plugin-statusbar](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-statusbar/).
:::

![Mobile Addressbar Coloring](https://cdn.quasar.dev/img/mobile-address-bar-colors.jpg "Mobile Addressbar Coloring")

<doc-api file="AddressbarColor" />

<doc-installation plugins="AddressbarColor" />

## Usage

We create boot file to initialize its usage: `$ quasar new boot addressbar-color [--format ts]`. A file is created (`/src/boot/addressbar-color.js`). We edit it:

```js
// file: /src/boot/addressbar-color.js
import { AddressbarColor } from 'quasar'

export default () => {
  AddressbarColor.set('#a2e3fa')
}
```

We then have to tell quasar to use this boot file we just created. To do this we edit the boot section of the quasar config:
```js
// file: /quasar.config.js
return {
  boot: [
    'addressbar-color'
  ]
}
```

What this does is that it injects some `<meta>` tags into your `index.html` at runtime.

Because the meta tag doesn't get injected until run time you can dynamically change this color multiple times, based on the page the user is on (by calling the `set` method in the `created()` lifecycle hook on the respective pages):


```js
// a .vue file representing a page

import { useQuasar } from 'quasar'

export default {
  setup () {
    // equivalent to calling this on creating the component
    const $q = useQuasar()
    $q.addressbarColor.set('#a2e3fa')
  }
}
```

::: tip
Calling `set()` with no parameters will use the primary color.
:::
