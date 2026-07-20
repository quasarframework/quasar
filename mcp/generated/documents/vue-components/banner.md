---
title: Banner
description: The QBanner Vue component displays a prominent message and related optional actions.
canonical: https://quasar.dev/vue-components/banner
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QBanner](../../api/QBanner.md)

The QBanner component creates a banner element to display a prominent message and related optional actions.

According to the Material Design spec, the banner should be "displayed at the top of the screen, below a top app bar" - but of course you can put one anywhere that makes sense, even in a QDialog.

**API reference:** [QBanner](../../api/QBanner.md)

## Usage

**Example: Basic**

Source: [Basic.vue](../../examples/QBanner/Basic.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-banner class="bg-primary text-white">
      Unfortunately, the credit card did not go through, please try again.
      <template v-slot:action>
        <q-btn flat color="white" label="Dismiss" />
        <q-btn flat color="white" label="Update Credit Card" />
      </template>
    </q-banner>

    <q-banner :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'">
      <template v-slot:avatar>
        <q-icon name="signal_wifi_off" color="primary" />
      </template>
      You have lost connection to the internet. This app is offline.
      <template v-slot:action>
        <q-btn flat color="primary" label="Turn on Wifi" />
      </template>
    </q-banner>

    <q-banner inline-actions class="text-white bg-red">
      You have lost connection to the internet. This app is offline.
      <template v-slot:action>
        <q-btn flat color="white" label="Turn ON Wifi" />
      </template>
    </q-banner>
  </div>
</template>
````

**Example: Rounded border**

Source: [Rounded.vue](../../examples/QBanner/Rounded.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-banner rounded class="bg-purple-8 text-white">
      We can't find your saved recipes until you sign in.

      <template v-slot:action>
        <q-btn flat color="white" label="Continue as a Guest" />
        <q-btn flat color="white" label="Sign in" />
      </template>
    </q-banner>
  </div>
</template>
````

**Example: With an image**

Source: [Image.vue](../../examples/QBanner/Image.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-banner rounded :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'">
      <template v-slot:avatar>
        <img
          src="https://cdn.quasar.dev/img/mountains.jpg"
          style="width: 100px; height: 64px"
        />
      </template>

      Could not retrieve travel data.
      <template v-slot:action>
        <q-btn flat label="Retry" />
      </template>
    </q-banner>
  </div>
</template>
````

**Example: Inline actions**

Source: [Inline.vue](../../examples/QBanner/Inline.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-banner inline-actions rounded class="bg-orange text-white">
      You have lost connection to the internet. This app is offline.

      <template v-slot:action>
        <q-btn flat label="Turn ON Wifi" />
        <q-btn flat label="Dismiss" />
      </template>
    </q-banner>
  </div>
</template>
````

**Example: Dense**

Source: [Dense.vue](../../examples/QBanner/Dense.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-banner dense class="bg-primary text-white">
      Unfortunately, the credit card did not go through, please try again.
      <template v-slot:action>
        <q-btn flat color="white" label="Dismiss" />
        <q-btn flat color="white" label="Update Credit Card" />
      </template>
    </q-banner>

    <q-banner dense :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'">
      <template v-slot:avatar>
        <q-icon name="signal_wifi_off" color="primary" />
      </template>
      You have lost connection to the internet. This app is offline.
      <template v-slot:action>
        <q-btn flat color="primary" label="Turn on Wifi" />
      </template>
    </q-banner>

    <q-banner dense inline-actions class="text-white bg-red">
      You have lost connection to the internet. This app is offline.
      <template v-slot:action>
        <q-btn flat color="white" label="Turn ON Wifi" />
      </template>
    </q-banner>
  </div>
</template>
````
