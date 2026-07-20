---
title: Popup Proxy
description: The QPopupProxy is a Vue component that should be used when you need either a QMenu or a QDialog (on smaller screens) to be displayed.
canonical: https://quasar.dev/vue-components/popup-proxy
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QPopupProxy](../../api/QPopupProxy.md)

QPopupProxy should be used when you need either a [QMenu](/vue-components/menu) (on bigger screens) or a [QDialog](/vue-components/dialog) (on smaller screens) to be displayed. It acts as a proxy which picks either of the two components to use. QPopupProxy also handles context-menus.

**API reference:** [QPopupProxy](../../api/QPopupProxy.md)

## Usage

::: tip
Use your browsers development tools to toggle the device between mobile or desktop (with browser refresh after each change) or, physically resize your browser's window to watch the QPopupProxy component switch between either a QMenu or a QDialog before clicking/tapping on its container. The default breakpoint is set at 450px.
:::

### Standard

**Example: Standard**

Source: [Standard.vue](../../examples/QPopupProxy/Standard.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn push color="primary" label="Handles click">
      <q-popup-proxy>
        <q-banner>
          <template v-slot:avatar>
            <q-icon name="signal_wifi_off" color="primary" />
          </template>
          You have lost connection to the internet. This app is offline.
        </q-banner>
      </q-popup-proxy>
    </q-btn>
  </div>
</template>
````

### Context menu

**Example: Context menu (right click / long tap)**

Source: [ContextMenu.vue](../../examples/QPopupProxy/ContextMenu.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn push color="purple" label="Handles right-click">
      <q-popup-proxy context-menu>
        <q-banner>
          <template v-slot:avatar>
            <q-icon name="signal_wifi_off" color="primary" />
          </template>
          You have lost connection to the internet. This app is offline.
        </q-banner>
      </q-popup-proxy>
    </q-btn>
  </div>
</template>
````

### Breakpoint

On the example below, click on the icon in the input.

**Example: Breakpoint @600px**

Source: [Breakpoint.vue](../../examples/QPopupProxy/Breakpoint.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-input filled v-model="input" mask="date" :rules="['date']">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover :breakpoint="600">
            <q-date v-model="input" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const input = ref('')
const date = ref('2018/11/03')
</script>
````

### Pass-through props

Keep in mind that all props from both [QMenu](/vue-components/menu) and [QDialog](/vue-components/dialog) are passed through via this component. So props like `offset` or `transition-show` (as a mere example) can be used in conjunction with QPopupProxy.

**Example: Props from QMenu or QDialog**

Source: [Passthrough.vue](../../examples/QPopupProxy/Passthrough.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-md" style="font-size: 36px">
    <q-icon name="settings_remote" class="text-brown cursor-pointer">
      <q-popup-proxy transition-show="flip-up" transition-hide="flip-down">
        <q-banner class="bg-brown text-white">
          <template v-slot:avatar>
            <q-icon name="signal_wifi_off" />
          </template>
          You have lost connection to the internet. This app is offline.
        </q-banner>
      </q-popup-proxy>
    </q-icon>

    <q-icon name="perm_data_setting" class="text-purple cursor-pointer">
      <q-popup-proxy :offset="[10, 10]">
        <q-banner class="bg-purple text-white">
          <template v-slot:avatar>
            <q-icon name="signal_wifi_off" />
          </template>
          You have lost connection to the internet. This app is offline.
        </q-banner>
      </q-popup-proxy>
    </q-icon>
  </div>
</template>
````

::: warning
QPopupProxy treats some components ([QDate](/vue-components/date), [QTime](/vue-components/time), [QCarousel](/vue-components/carousel) and [QColor](/vue-components/color-picker)) as special ones and forces `cover: true` and `maxHeight: '99vh'` on them. If you don't want this behavior just place a `div` as the first level child of QPopupProxy.
:::
