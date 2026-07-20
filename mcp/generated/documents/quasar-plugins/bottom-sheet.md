---
title: Bottom Sheet Plugin
description: A Quasar plugin for displaying a list of user actions that slides up from the bottom edge of the app window.
canonical: https://quasar.dev/quasar-plugins/bottom-sheet
kinds: plugin
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [BottomSheet](../../api/BottomSheet.md)

Bottom Sheets slide up from the bottom edge of the device screen, and display a set of options with the ability to confirm or cancel an action. Bottom Sheets can sometimes be used as an alternative to menus, however, they should not be used for navigation.

The Bottom Sheet always appears above any other components on the page, and must be dismissed in order to interact with the underlying content. When it is triggered, the rest of the page darkens to give more focus to the Bottom Sheet options.

Bottom Sheets can be displayed as a list or as a grid, with icons or with avatars. They can be used either as a component in your Vue file templates, or as a globally available method.

**API reference:** [BottomSheet](../../api/BottomSheet.md)

<DocInstall plugins="BottomSheet" />

## Usage

```js Outside of a Vue file
import { BottomSheet } from 'quasar'
BottomSheet.create({ ... }) // returns Object

// inside of a Vue file
import { useQuasar } from 'quasar'
setup () {
  const $q = useQuasar()
  $q.bottomSheet({ ... }) // returns Object
}
```

::: tip
When user hits the phone/tablet back button (only for Cordova apps), the Action Sheet will get closed automatically.

Also, when on a desktop browser, hitting the `ESCAPE` key also closes the Action Sheet.
:::

**Example: List and Grid**

Source: [Basic.vue](../../examples/BottomSheet/Basic.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn
      no-caps
      push
      color="primary"
      label="List BottomSheet"
      @click="show()"
    />
    <q-btn
      no-caps
      push
      color="white"
      text-color="primary"
      label="Grid BottomSheet"
      @click="show(true)"
    />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function show(grid) {
  $q.bottomSheet({
    message: 'Bottom Sheet message',
    grid,
    actions: [
      {
        label: 'Drive',
        img: 'https://cdn.quasar.dev/img/logo_drive_128px.png',
        id: 'drive'
      },
      // #region
      {
        label: 'Keep',
        img: 'https://cdn.quasar.dev/img/logo_keep_128px.png',
        id: 'keep'
      },
      {
        label: 'Google Hangouts',
        img: 'https://cdn.quasar.dev/img/logo_hangouts_128px.png',
        id: 'calendar'
      },
      {
        label: 'Calendar',
        img: 'https://cdn.quasar.dev/img/logo_calendar_128px.png',
        id: 'calendar'
      },
      // #endregion
      {},
      {
        label: 'Share',
        icon: 'share',
        id: 'share'
      },
      {
        label: 'Upload',
        icon: 'cloud_upload',
        color: 'primary',
        id: 'upload'
      },
      {},
      {
        label: 'John',
        avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
        id: 'john'
      }
    ]
  })
    .onOk(action => {
      console.log('Action chosen:', action.id)
    })
    .onCancel(() => {
      console.log('Dismissed')
    })
    .onDismiss(() => {
      console.log('I am triggered on both OK and Cancel')
    })
}
</script>
````

**Example: Force dark mode**

Source: [Dark.vue](../../examples/BottomSheet/Dark.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn
      no-caps
      push
      color="primary"
      label="List BottomSheet"
      @click="show()"
    />
    <q-btn
      no-caps
      push
      color="white"
      text-color="primary"
      label="Grid BottomSheet"
      @click="show(true)"
    />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function show(grid) {
  $q.bottomSheet({
    dark: true,
    message: 'Bottom Sheet message',
    grid,
    actions: [
      {
        label: 'Drive',
        img: 'https://cdn.quasar.dev/img/logo_drive_128px.png',
        id: 'drive'
      },
      // #region
      {
        label: 'Keep',
        img: 'https://cdn.quasar.dev/img/logo_keep_128px.png',
        id: 'keep'
      },
      {
        label: 'Google Hangouts',
        img: 'https://cdn.quasar.dev/img/logo_hangouts_128px.png',
        id: 'calendar'
      },
      {
        label: 'Calendar',
        img: 'https://cdn.quasar.dev/img/logo_calendar_128px.png',
        id: 'calendar'
      },
      // #endregion
      {},
      {
        label: 'Share',
        icon: 'share',
        id: 'share'
      },
      {
        label: 'Upload',
        icon: 'cloud_upload',
        color: 'primary',
        id: 'upload'
      },
      {},
      {
        label: 'John',
        avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
        id: 'john'
      }
    ]
  })
    .onOk(action => {
      console.log('Action chosen:', action.id)
    })
    .onCancel(() => {
      console.log('Dismissed')
    })
    .onDismiss(() => {
      console.log('I am triggered on both OK and Cancel')
    })
}
</script>
````

::: tip
For an exhaustive list of options, please check API section.
:::
