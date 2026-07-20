---
title: Close Popup Directive
description: Helper Vue directive when working with QDialog or QMenu.
canonical: https://quasar.dev/vue-directives/close-popup
kinds: directive
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [ClosePopup](../../api/ClosePopup.md)

This directive is a helper when dealing with [QDialog](/vue-components/dialog) and [QMenu](/vue-components/menu) components. When attached to a DOM element or component then that component will close the QDialog or QMenu (whichever is first parent) when clicked/tapped.

**API reference:** [ClosePopup](../../api/ClosePopup.md)

## Usage

### Basic

**Example: With a QMenu**

Source: [Menu.vue](../../examples/ClosePopup/Menu.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn label="Open Menu" color="primary">
      <q-menu>
        <q-list>
          <q-item tag="label">
            <q-item-section avatar>
              <q-checkbox v-model="firstItemEnabled" />
            </q-item-section>
            <q-item-section>
              <q-item-label>First Item Enabled</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-for="n in 5"
            :key="n"
            v-close-popup="n > 1 || firstItemEnabled"
            :clickable="n > 1 || firstItemEnabled"
            @click="onClick(n)"
          >
            <q-item-section>Menu Item {{ n }}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'

const $q = useQuasar()
const firstItemEnabled = ref(false)

function onClick(index) {
  if (index > 1 || firstItemEnabled.value) {
    $q.notify({
      message: `Clicked on menu item #${index} and closed QMenu`,
      color: 'primary'
    })
  }
}
</script>
````

**Example: With a QDialog**

Source: [Dialog.vue](../../examples/ClosePopup/Dialog.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn label="Open Dialog" color="primary" @click="dialog = true" />

    <q-dialog v-model="dialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
          <span class="q-ml-sm"
            >You are currently not connected to any network.</span
          >
        </q-card-section>

        <q-card-section class="row items-center">
          <q-toggle v-model="cancelEnabled" label="Cancel button enabled" />
        </q-card-section>

        <!-- Notice v-close-popup -->
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="primary"
            v-close-popup="cancelEnabled"
            :disable="!cancelEnabled"
          />
          <q-btn flat label="Turn on Wifi" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const dialog = ref(false)
const cancelEnabled = ref(false)
</script>
````

### Closing multiple levels

You can also close multiple levels of popups by supplying a level number to the directive:

```html
<... v-close-popup="3">
```

- If value is 0 or boolean `false` then directive is disabled
- If value is < 0 then it closes all popups in the chain
- If value is 1 or boolean `true` or undefined then it closes only the parent popup
- If value is > 1 it closes the specified number of parent popups in the chain (note that chained QMenus are considered 1 popup only & QPopupProxy separates chained menus)

Notice below that chained QMenus (one directly put under the other) do not require you to specify multiple levels. When `v-close-popup` is used in a chained QMenu, it considers all directly chained QMenus as one level only.

**Example: Menu tree**

Source: [MenuTree.vue](../../examples/ClosePopup/MenuTree.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn label="Menu" color="primary">
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
    </q-btn>
  </div>
</template>
````

In the example below, the menu uses 2 levels, which means it will also close the dialog, since the dialog is its parent:

**Example: Dialog with menu**

Source: [DialogMenu.vue](../../examples/ClosePopup/DialogMenu.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn label="Dialog" color="primary" @click="dialog = true" />

    <q-dialog v-model="dialog">
      <q-card>
        <q-card-section class="row items-center q-gutter-sm">
          <q-btn no-caps label="Open menu" color="primary">
            <q-menu>
              <q-list dense style="min-width: 100px">
                <q-item clickable v-close-popup="2">
                  <q-item-section>Open...</q-item-section>
                </q-item>
                <q-item clickable v-close-popup="2">
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
                        <q-menu anchor="top end" self="top start">
                          <q-list>
                            <q-item
                              v-for="n in 3"
                              :key="n"
                              dense
                              clickable
                              v-close-popup="2"
                            >
                              <q-item-section>3rd level Label</q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup="2">
                  <q-item-section>Quit</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <q-btn no-caps label="Close dialog" color="primary" v-close-popup />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const dialog = ref(false)
</script>
````

Notice below that the inner dialog is a child of the main dialog. This is the only way for which `v-close-popup` will be able to close both dialogs while using multiple levels. Otherwise, if dialogs are siblings (or any other similar scenario where one dialog is not child of the other), you will have to use v-models on dialogs and handle closing of both dialogs yourself.

**Example: Dialog in Dialog**

Source: [DialogInDialog.vue](../../examples/ClosePopup/DialogInDialog.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn label="Open Dialog" color="primary" @click="dialog = true" />

    <q-dialog v-model="dialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">First dialog</div>
        </q-card-section>
        <q-card-section class="row items-center q-gutter-sm">
          <q-btn label="Open dialog" color="primary" @click="dialog2 = true" />
          <q-btn v-close-popup label="Close" color="primary" />

          <q-dialog v-model="dialog2">
            <q-card>
              <q-card-section>
                <div class="text-h6">Second dialog</div>
              </q-card-section>
              <q-card-section class="row items-center q-gutter-sm">
                <q-btn
                  v-close-popup="2"
                  label="Close both dialogs"
                  color="accent"
                />
                <q-btn v-close-popup label="Close this dialog" color="accent" />
              </q-card-section>
            </q-card>
          </q-dialog>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const dialog = ref(false)
const dialog2 = ref(false)
</script>
````
