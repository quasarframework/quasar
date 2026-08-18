---
title: Capacitor APIs
desc: (@quasar/app-vite) How to use the Capacitor plugins in a Quasar app.
---

You can access native device features through [Capacitor plugins](https://capacitorjs.com/docs/plugins).

## Capacitor APIs

A few examples include:

- Camera
- Device
- Filesystem
- Geolocation
- Motion
- Network
- Push Notifications
- Share
- Splash Screen
- Status Bar

## Using a Capacitor API

Let's learn by taking some examples, assuming you've added Capacitor mode to your Quasar project already.

### Example: Geolocation

First install the plugin in `/src-capacitor`, then synchronize the native projects:

```bash
cd src-capacitor
pnpm add @capacitor/geolocation
pnpm exec cap sync
```

Review the plugin's [installation and permission requirements](https://capacitorjs.com/docs/apis/geolocation) for each target platform before using it.

Now let's put this plugin to some good use. In one of your Quasar project's pages/layouts/components Vue file, we write:

```html
<template>
  <div> GPS position: <strong>{{ position }}</strong> </div>
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import { Geolocation } from '@capacitor/geolocation'

  const position = ref('determining...')

  async function getCurrentPosition() {
    const newPosition = await Geolocation.getCurrentPosition()
    console.log('Current', newPosition)
    position.value = newPosition
  }

  let geoId

  onMounted(async () => {
    await getCurrentPosition()

    // we start listening
    geoId = await Geolocation.watchPosition({}, (newPosition, err) => {
      if (err) {
        console.error(err)
        return
      }

      console.log('New GPS position')
      position.value = newPosition
    })
  })

  onBeforeUnmount(async () => {
    // we do cleanup
    if (geoId !== void 0) {
      await Geolocation.clearWatch({ id: geoId })
    }
  })
</script>
```

### Example: Camera

Install `@capacitor/camera` in `/src-capacitor`, run `pnpm exec cap sync`, and follow the [Camera plugin's platform setup](https://capacitorjs.com/docs/apis/camera) before using it.

Now let's put this API to some good use. In one of your Quasar project's pages/layouts/components Vue file, we write:

```html
<template>
  <div>
    <q-btn color="primary" label="Get Picture" @click="captureImage" />

    <img :src="imageSrc" />
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { Camera, CameraResultType } from '@capacitor/camera'

  const imageSrc = ref('')

  async function captureImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    })

    // The result will vary on the value of the resultType option.
    // CameraResultType.Uri - Get the result from image.webPath
    // CameraResultType.Base64 - Get the result from image.base64String
    // CameraResultType.DataUrl - Get the result from image.dataUrl
    imageSrc.value = image.webPath
  }
</script>
```

Some Capacitor plugins, such as Camera, have a web-based UI available when running in a browser. To enable these controls, add `@ionic/pwa-elements` to the main Quasar project:

```bash
pnpm add @ionic/pwa-elements
```

Then create a boot file to initialize them, for example `/src/boot/capacitor.js`:

```js
import { defineBoot } from '#q-app'
import { defineCustomElements } from '@ionic/pwa-elements/loader'

export default defineBoot(() => {
  defineCustomElements(window)
})
```

Don't forget to call the boot script in the `quasar.config` file:

```js
boot: ['capacitor']
```

You can now use the Camera API in native Android and iOS builds as well as browser-based modes such as SPA and PWA, subject to the plugin's platform support.

### Example: Device

Install `@capacitor/device` in `/src-capacitor`, run `pnpm exec cap sync`, and review the [Device plugin documentation](https://capacitorjs.com/docs/apis/device) before using it.

Now let's put this API to some good use. In one of your Quasar project's pages/layouts/components Vue file, we write:

```html
<template>
  <div>
    <div>Model: {{ model }}</div>
    <div>Manufacturer: {{ manufacturer }}</div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { Device } from '@capacitor/device'

  const model = ref('Please wait...')
  const manufacturer = ref('Please wait...')

  onMounted(() => {
    Device.getInfo().then(info => {
      model.value = info.model
      manufacturer.value = info.manufacturer
    })
  })
</script>
```

## Capacitor APIs in other Quasar modes <q-badge label="@quasar/app-vite v3.6.2+" />

The packages installed in `/src-capacitor` are resolvable from the `/src` folder regardless of the Quasar mode being built, so the examples on this page work when building for SPA, PWA or any other mode too. Many Capacitor plugins ship a web implementation and simply work in a browser, like the Camera example above.

For plugins without a web implementation, or for code that should only run inside the Capacitor-built app, guard the usage with the `QUASAR_CAPACITOR_MODE` [environment flag](/quasar-cli-vite/handling-import-meta-env) and a dynamic import. The guarded branch is dead-code eliminated in the production builds of all other modes, so it adds nothing to their bundles:

```js
if (import.meta.env.QUASAR_CAPACITOR_MODE) {
  const { Preferences } = await import('@capacitor/preferences')
  const { value } = await Preferences.get({ key: 'locale' })
  // ...
}
```
