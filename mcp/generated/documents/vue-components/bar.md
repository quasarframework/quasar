---
title: Bar
description: The QBar Vue component is used to create the top bar on different platforms.
canonical: https://quasar.dev/vue-components/bar
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QBar](../../api/QBar.md)

The QBar is a small component for creating the top bar on different types of mobile or desktop websites/apps. For instance, in desktop apps QBar will have things like the close, minimize or maximize buttons and other menu controls for your application.

QBar is especially useful for frame-less Electron apps where you integrate it in the QHeader.

**API reference:** [QBar](../../api/QBar.md)

## Usage

::: tip
For responsiveness, use [Visibility](/style/visibility#Window-Width-Related) Quasar CSS Classes. For finer tuning you can go write your own CSS media breakpoints or even go with [QResizeObserver](/vue-components/resize-observer).
:::

### Styling

**Example: MacOS style**

Source: [MacOS.vue](../../examples/QBar/MacOS.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-bar>
      <q-btn dense flat :icon="fabApple" />
      <div class="text-weight-bold"> App </div>
      <div class="cursor-pointer gt-md">File</div>
      <div class="cursor-pointer gt-md">Edit</div>
      <div class="cursor-pointer gt-md">View</div>
      <div class="cursor-pointer gt-md">Window</div>
      <div class="cursor-pointer gt-md">Help</div>
      <q-space />
      <q-btn dense flat icon="airplay" class="gt-xs" />
      <q-btn dense flat icon="battery_charging_full" />
      <q-btn dense flat icon="wifi" />
      <div>9:41</div>
      <q-btn dense flat icon="search" />
      <q-btn dense flat icon="list" />
    </q-bar>

    <q-bar class="bg-black text-white">
      <q-btn dense flat :icon="fabApple" />
      <div class="text-weight-bold"> App </div>
      <div class="cursor-pointer gt-md">File</div>
      <div class="cursor-pointer gt-md">Edit</div>
      <div class="cursor-pointer gt-md">View</div>
      <div class="cursor-pointer gt-md">Window</div>
      <div class="cursor-pointer gt-md">Help</div>
      <q-space />
      <q-btn dense flat icon="airplay" class="gt-xs" />
      <q-btn dense flat icon="battery_charging_full" />
      <q-btn dense flat icon="wifi" />
      <div>9:41</div>
      <q-btn dense flat icon="search" />
      <q-btn dense flat icon="list" />
    </q-bar>

    <q-bar>
      <q-btn dense flat round icon="lens" size="8.5px" color="red" />
      <q-btn dense flat round icon="lens" size="8.5px" color="yellow" />
      <q-btn dense flat round icon="lens" size="8.5px" color="green" />
      <div class="col text-center text-weight-bold"> My-App </div>
    </q-bar>

    <q-bar dark class="bg-primary text-white">
      <q-btn dense flat round icon="lens" size="8.5px" color="red" />
      <q-btn dense flat round icon="lens" size="8.5px" color="yellow" />
      <q-btn dense flat round icon="lens" size="8.5px" color="green" />
      <div class="col text-center text-weight-bold"> My-App </div>
    </q-bar>
  </div>
</template>

<script setup>
import { fabApple } from '@quasar/extras/fontawesome-v7'
</script>
````

**Example: Windows style**

Source: [Windows.vue](../../examples/QBar/Windows.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-bar>
      <div class="cursor-pointer">File</div>
      <div class="cursor-pointer">Edit</div>
      <div class="cursor-pointer gt-xs">View</div>
      <div class="cursor-pointer gt-xs">Window</div>
      <div class="cursor-pointer">Help</div>
      <q-space />
      <q-btn dense flat icon="minimize" />
      <q-btn dense flat icon="crop_square" />
      <q-btn dense flat icon="close" />
    </q-bar>

    <q-bar class="bg-black text-white">
      <div class="cursor-pointer">File</div>
      <div class="cursor-pointer">Edit</div>
      <div class="cursor-pointer gt-xs">View</div>
      <div class="cursor-pointer gt-xs">Window</div>
      <div class="cursor-pointer">Help</div>
      <q-space />
      <q-btn dense flat icon="minimize" />
      <q-btn dense flat icon="crop_square" />
      <q-btn dense flat icon="close" />
    </q-bar>
  </div>
</template>
````

**Example: iOS style**

Source: [iOS.vue](../../examples/QBar/iOS.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-bar dense class="bg-teal text-white">
      <q-icon :name="fasSignal" />
      <div>mobi-net</div>
      <div>4G</div>
      <q-icon :name="fasWifi" />
      <q-space />
      <q-icon name="near_me" />
      <div>100%</div>
      <q-icon :name="fasBatteryFull" />
    </q-bar>

    <q-bar dense class="bg-amber text-grey-8">
      <q-icon :name="fasSignal" />
      <div>mobi-net</div>
      <div>4G</div>
      <q-icon :name="fasWifi" />
      <q-space />
      <q-icon name="near_me" />
      <div>100%</div>
      <q-icon :name="fasBatteryFull" />
    </q-bar>
  </div>
</template>

<script setup>
import {
  fasBatteryFull,
  fasSignal,
  fasWifi
} from '@quasar/extras/fontawesome-v7'
</script>
````

**Example: Android style**

Source: [Android.vue](../../examples/QBar/Android.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-bar dense class="bg-black text-white">
      <div>mobi-net</div>
      <q-icon name="email" />
      <q-space />
      <q-icon name="bluetooth" />
      <q-icon name="signal_wifi_4_bar" />
      <q-icon name="signal_cellular_4_bar" />
      <div class="gt-xs">100%</div>
      <q-icon name="battery_full" />
      <div>10:00AM</div>
    </q-bar>

    <q-bar dense class="bg-green text-white">
      <div>mobi-net</div>
      <q-icon name="email" />
      <q-space />
      <q-icon name="bluetooth" />
      <q-icon name="signal_wifi_4_bar" />
      <q-icon name="signal_cellular_4_bar" />
      <div class="gt-xs">100%</div>
      <q-icon name="battery_full" />
      <div>10:00AM</div>
    </q-bar>
  </div>
</template>
````

### With other components

**Example: QMenu**

Source: [Menu.vue](../../examples/QBar/Menu.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-bar>
      <div class="cursor-pointer non-selectable">
        File
        <q-menu>
          <q-list dense style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>Open...</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>New</q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable>
              <q-item-section>Preferences</q-item-section>
              <q-item-section side>
                <q-icon name="keyboard_arrow_right" />
              </q-item-section>

              <q-menu anchor="top end" self="top start">
                <q-list>
                  <q-item v-for="n in 3" :key="n" dense clickable>
                    <q-item-section>Submenu Label</q-item-section>
                    <q-item-section side>
                      <q-icon name="keyboard_arrow_right" />
                    </q-item-section>
                    <q-menu auto-close anchor="top end" self="top start">
                      <q-list>
                        <q-item v-for="n in 3" :key="n" dense clickable>
                          <q-item-section>3rd level Label</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-item>
                </q-list>
              </q-menu>
            </q-item>

            <q-separator />

            <q-item clickable v-close-popup>
              <q-item-section>Quit</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>

      <div class="q-ml-md cursor-pointer non-selectable">
        Edit
        <q-menu auto-close>
          <q-list dense style="min-width: 100px">
            <q-item clickable>
              <q-item-section>Cut</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Copy</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Paste</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Select All</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>

      <q-space />

      <q-btn dense flat icon="minimize" />
      <q-btn dense flat icon="crop_square" />
      <q-btn dense flat icon="close" />
    </q-bar>
  </div>
</template>
````

**Example: QDialog**

Source: [Dialog.vue](../../examples/QBar/Dialog.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="Light" color="primary" @click="lightDialog = true" />
    <q-btn label="Dark" color="grey-8" @click="darkDialog = true" />

    <q-dialog v-model="lightDialog" persistent>
      <q-card>
        <q-bar>
          <q-icon name="arrow_forward" />
          <div>Your Next Steps</div>

          <q-space />

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
          repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis
          perferendis totam, ea at omnis vel numquam exercitationem aut, natus
          minima, porro labore.
        </q-card-section>

        <q-card-section class="q-pt-none">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
          repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis
          perferendis totam, ea at omnis vel numquam exercitationem aut, natus
          minima, porro labore.
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="darkDialog"
      persistent
      transition-show="flip-down"
      transition-hide="flip-up"
    >
      <q-card class="bg-primary text-white">
        <q-bar>
          <q-icon name="warning" />
          <div>Are you certain?</div>

          <q-space />

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
          repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis
          perferendis totam, ea at omnis vel numquam exercitationem aut, natus
          minima, porro labore.
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const lightDialog = ref(false)
const darkDialog = ref(false)
</script>
````

**Example: QHeader with QToolbar**

Source: [Header.vue](../../examples/QBar/Header.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-layout
      view="lHh lpr lFf"
      container
      style="height: 400px"
      class="shadow-2 rounded-borders"
    >
      <q-header elevated>
        <q-bar>
          <q-icon name="laptop_chromebook" />
          <div>Google Chrome</div>

          <q-space />

          <q-btn dense flat icon="minimize" />
          <q-btn dense flat icon="crop_square" />
          <q-btn dense flat icon="close" />
        </q-bar>

        <div class="q-pa-sm q-pl-md row items-center">
          <div class="cursor-pointer non-selectable">
            File
            <q-menu>
              <q-list dense style="min-width: 100px">
                <q-item clickable v-close-popup>
                  <q-item-section>Open...</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section>New</q-item-section>
                </q-item>

                <q-separator />

                <q-item clickable>
                  <q-item-section>Preferences</q-item-section>
                  <q-item-section side>
                    <q-icon name="keyboard_arrow_right" />
                  </q-item-section>

                  <q-menu anchor="top end" self="top start">
                    <q-list>
                      <q-item v-for="n in 3" :key="n" dense clickable>
                        <q-item-section>Submenu Label</q-item-section>
                        <q-item-section side>
                          <q-icon name="keyboard_arrow_right" />
                        </q-item-section>
                        <q-menu auto-close anchor="top end" self="top start">
                          <q-list>
                            <q-item v-for="n in 3" :key="n" dense clickable>
                              <q-item-section>3rd level Label</q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-item>

                <q-separator />

                <q-item clickable v-close-popup>
                  <q-item-section>Quit</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </div>

          <div class="q-ml-md cursor-pointer non-selectable">
            Edit
            <q-menu auto-close>
              <q-list dense style="min-width: 100px">
                <q-item clickable>
                  <q-item-section>Cut</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Copy</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Paste</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable>
                  <q-item-section>Select All</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </div>
        </div>
      </q-header>

      <q-page-container>
        <q-page class="q-pa-md">
          <p v-for="n in 15" :key="n">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil
            praesentium molestias a adipisci, dolore vitae odit, quidem
            consequatur optio voluptates asperiores pariatur eos numquam rerum
            delectus commodi perferendis voluptate?
          </p>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>
````

### Frameless Electron Window

QBar component can come in really handy when developing Electron apps, especially if you choose to use a frameless window.

Read more on [Frameless Electron Window](/quasar-cli-vite/developing-electron-apps/frameless-electron-window) page.
