---
title: Cordova Plugins
desc: How to use the Cordova plugins in a Quasar app.
---
You can hook into the native device APIs by using [Cordova Plugins](https://cordova.apache.org/docs/en/latest/#plugin-apis).

## Cordova Plugins
A few examples of such plugins:

* Battery Status
* Camera
* Contacts
* Device
* Device Motion
* Geolocation
* Media
* Media Capture
* Network Information
* Splashscreen
* Vibration
* Statusbar

## Deviceready Event
You'll notice that some Cordova plugins are usable only after the `deviceready` event has been triggered. We don't need to worry about it too much. Quasar listens to this event and takes care of our root Vue component to be mounted **after** this event has been triggered. But if you need some plugin's own variable and that is initialized after `deviceready` you can follow the example of using the plugin device below

### Caveat
Let's take a vue file for example:
```html
<template>
  ... we are sure 'deviceready' has been triggered here ...
</template>

<script>
// outside of the default export,
// we need to listen to the event for ourselves:
document.addEventListener('deviceready', () => {
  // it's only now that we are sure
  // the event has triggered
}, false)

export default {
  // we are sure 'deviceready' has been triggered here
}
</script>
```

The reason is simple. Quasar listens for the event then mounts the root Vue component. But before this, the Vue files are imported into the `/src/router/routes.js` file, so the code outside of the default export gets executed.

## Using a Cordova Plugin
Let's learn by taking some examples, assuming you've added Cordova mode to your Quasar project and installed a platform (android, ios, ...) already.

### Example: Battery Status
First step is to read the documentation of the Cordova plugin that we want to use. We look at [Cordova Plugins list](https://cordova.apache.org/docs/en/latest/#plugin-apis) and click on [Battery Status doc page](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-battery-status/index.html).

We see instructions on how to install this plugin. It's always a Cordova command. **So we "cd" into `/src-cordova`** (which is a Cordova generated folder) **and issue the install command form there**:

```bash
# from /src-cordova:
$ cordova plugin add cordova-plugin-battery-status
```

Now let's put this plugin to some good use. In one of your Quasar project's pages/layouts/components Vue file, we write:

```html
// some Vue file
// remember this is simply an example;
// only look at how we use the API described in the plugin's page;
// the rest of things here are of no importance

<template>
  <div>
    Battery status is: <strong>{{ batteryStatus }}</strong>
  </div>
</template>

<script>
import { ref, onBeforeUnmount } from 'vue'

export default {
  setup () {
    const batteryStatus = ref('determining...')

    function updateBatteryStatus (status) {
      batteryStatus.value = `Level: ${status.level}, plugged: ${status.isPlugged}`
    }

    // we register the event like on plugin's doc page
    window.addEventListener('batterystatus', updateBatteryStatus, false)

    onBeforeUnmount(() => {
      // we do some cleanup;
      // we need to remove the event listener
      window.removeEventListener('batterystatus', updateBatteryStatus, false)
    })

    return {
      batteryStatus
    }
  }
}
</script>
```

### Example: Camera
First step is to read the documentation of the Cordova plugin that we want to use. We look at [Cordova Plugins list](https://cordova.apache.org/docs/en/latest/#plugin-apis) and click on [Camera doc page](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-camera/index.html).

There's a mention of the `deviceready` event. But we already know how to handle it from the previous sections.

We read the instructions on how to install this plugin. It's always a Cordova command. **So we "cd" into `/src-cordova`** (which is a Cordova generated folder) **and issue the install command form there**:

```bash
# from /src-cordova:
$ cordova plugin add cordova-plugin-camera
```

Now let's put this plugin to some good use. In one of your Quasar project's pages/layouts/components Vue file, we write:

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
import { useQuasar } from 'quasar'
import { ref } from 'vue'

export default {
  setup () {
    const $q = useQuasar()
    const imageSrc = ref('')

    function captureImage () {
      navigator.camera.getPicture(
        data => { // on success
          imageSrc.value = `data:image/jpeg;base64,${data}`
        },
        () => { // on fail
          $q.notify('Could not access device camera.')
        },
        {
          // camera options
        }
      )
    }

    return {
      imageSrc,
      captureImage
    }
  }
}
</script>
```

### Example: Device
First step is to read the documentation of the Cordova plugin that we want to use. Look at the [Cordova Plugins list](https://cordova.apache.org/docs/en/latest/#plugin-apis) and click on [Device doc page](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-device/index.html).

This plugin initializes a global variable called `device` which describes the device's hardware and software. So it can be accessed with `window.device`.

Read the instructions on how to install this plugin on its cordova doc page. It's always a Cordova command. **So we "cd" into `/src-cordova`** (which is a Cordova generated folder) and **issue the install command from there**:

```bash
# from /src-cordova:
$ cordova plugin add cordova-plugin-device
```

Now let's put this plugin to some good use. If you need the information of your device when starting the application, you will have to capture the created event. In one of your Quasar project's pages/layouts/components Vue file, we write:

```html
// some Vue file
// remember this is simply an example;
// only look at how we use the API described in the plugin's page;
// the rest of things here are of no importance

<template>
  <div>
    <q-page class="flex flex-center">
      <div>IMEI: {{ IMEI }}</div>
    </q-page>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const imei = ref(
      window.device === void 0
        ? 'Run this on a mobile/tablet device'
        : window.device
    )

    return {
      imei
    }
  }
}
</script>
```
