---
title: Capacitor APIs
desc: How to use the Capacitor plugins in a Quasar app.
---
You can hook into the native device APIs by using [Capacitor APIs](https://capacitor.ionicframework.com/docs/apis).

## Capacitor APIs
A few examples of such APIs:

* Background Task
* Camera
* Console
* Device
* Filesystem
* Geolocation
* Motion
* Network
* Push Notifications
* Share
* Splash Screen
* Status Bar

## Using a Capacitor API
Let's learn by taking some examples, assuming you've added Capacitor mode to your Quasar project already.

### Example: Geolocation
First step is to read the documentation of the Capacitor API that we want to use. We look at Capacitor's [Geolocation API](https://capacitor.ionicframework.com/docs/apis/geolocation).

Now let's put this plugin to some good use. In one of your Quasar project's pages/layouts/components Vue file, we write:

```html
// some Vue file
// remember this is simply an example;
// only look at how we use the API described in the plugin's page;
// the rest of things here are of no importance

<template>
  <div>
    GPS position: <strong>{{ position }}</strong>
  </div>
</template>

<script>
import { Plugins } from '@capacitor/core'

const { Geolocation } = Plugins

export default {
  data () {
    return {
      position: 'determining...'
    }
  },
  methods: {
    getCurrentPosition() {
      Geolocation.getCurrentPosition().then(position => {
        console.log('Current', position);
        this.position = position
      });
    }
  },
  mounted () {
    this.getCurrentPosition()

    // we start listening
    this.geoId = Geolocation.watchPosition({}, (position, err) => {
      console.log('New GPS position')
      this.position = position
    })
  },
  beforeDestroy () {
    // we do cleanup
    Geolocation.clearWatch(this.geoId)
  }
}
</script>
```

### Example: Camera
First step is to read the documentation of the Capacitor API that we want to use. We look at Capacitor's [Camera API](https://capacitor.ionicframework.com/docs/apis/camera).

Now let's put this API to some good use. In one of your Quasar project's pages/layouts/components Vue file, we write:

```html
// some Vue file
// remember this is simply an example;
// only look at how we use the API described in the plugin's page;
// the rest of things here are of no importance

<template>
  <div>
    <q-btn color="primary" label="Get Picture" @click="captureImage" />

    <img :src="imageSrc">
  </div>
</template>

<script>
import { Plugins, CameraResultType } from '@capacitor/core'

const { Camera } = Plugins

export default {
  data () {
    return {
      imageSrc: ''
    }
  },
  methods: {
    async captureImage () {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri
      })
      // The result will vary on the value of the resultType option.
      // CameraResultType.Uri - Get the result from image.webPath
      // CameraResultType.Base64 - Get the result from image.base64String
      // CameraResultType.DataUrl - Get the result from image.dataUrl
      this.imageSrc = image.webPath
    }
  }
}
</script>
```

Some Capacitor plugins, such as Camera, have a web-based UI available when not running natively but in a standard web browser. To enable these controls, add @ionic/pwa-elements to your project:

```bash
$ npm install @ionic/pwa-elements
```

Then create a boot file to initialize them, for example `src/boot/capacitor.js`:

```js
import { defineCustomElements } from '@ionic/pwa-elements/loader'

export default () => {
  defineCustomElements(window)
}
```

Don't forget to call the boot script in `quasar.conf.js`

```js
boot: ['capacitor']
```

Now you are able to use the Camera API not just in nativ Android or iOS, but also in web based projects like a SPA or PWA.


### Example: Device
First step is to read the documentation of the Capacitor API that we want to use. Look at the Capacitor's [Device API](https://capacitor.ionicframework.com/docs/apis/device).

Now let's put this API to some good use. In one of your Quasar project's pages/layouts/components Vue file, we write:

```html
// some Vue file
// remember this is simply an example;
// only look at how we use the API described in the plugin's page;
// the rest of things here are of no importance

<template>
  <div>
    <div>Model: {{ model }}</div>
    <div>Manufacturer: {{ manufacturer }}</div>
  </div>
</template>

<script>
import { Plugins } from '@capacitor/core'

const { Device } = Plugins

export default {
  data () {
    return {
      model: 'Please wait...',
      manufacturer: 'Please wait...'
    }
  },
  mounted () {
    Device.getInfo().then(info => {
      this.model = info.model
      this.manufacturer = info.manufacturer
    })
  }
}
</script>
```
