---
title: QMenu
description: The QMenu Vue component is a convenient way to show menus.
canonical: https://quasar.dev/vue-components/menu
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QMenu](../../api/QMenu.md)

The QMenu component is a convenient way to show menus. Goes very well with [QList](/vue-components/list-and-list-items) as dropdown content, but it's by no means limited to it.

**API reference:** [QMenu](../../api/QMenu.md)

## Usage

The idea with QMenu is to place it inside your DOM element / component that you want to be the trigger as direct child. Don’t worry about QMenu content inheriting CSS from the container as the QMenu will be injected as a direct child of `<body>` through a Quasar Portal.

::: tip
Don't forget to use the directive `v-close-popup` in your clickable menu items if you want the menu to close automatically.
Alternatively, you can use the QMenu's property `auto-close` or handle closing the menu yourself through its v-model.
:::

### Basic

**Example: Basic**

Source: [Basic.vue](../../examples/QMenu/Basic.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-btn color="primary" label="Basic Menu">
        <q-menu>
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>New tab</q-item-section>
            </q-item>
            <!-- #region -->
            <q-item clickable v-close-popup>
              <q-item-section>New incognito tab</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup>
              <q-item-section>Recent tabs</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>History</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>Downloads</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup>
              <q-item-section>Settings</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup>
              <q-item-section>Help &amp; Feedback</q-item-section>
            </q-item>
            <!-- #endregion -->
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="secondary" label="Auto-Close Menu">
        <q-menu auto-close>
          <q-list style="min-width: 100px">
            <q-item clickable>
              <q-item-section>New tab</q-item-section>
            </q-item>
            <!-- #region -->
            <q-item clickable>
              <q-item-section>New incognito tab</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Recent tabs</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>History</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Downloads</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Settings</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Help &amp; Feedback</q-item-section>
            </q-item>
            <!-- #endregion -->
          </q-list>
        </q-menu>
      </q-btn>

      <div
        class="inline bg-amber rounded-borders cursor-pointer"
        style="max-width: 300px"
      >
        <div class="fit flex flex-center text-center non-selectable q-pa-md">
          I am groot!<br />(Click me! Using touch-position)
        </div>

        <q-menu touch-position>
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>Branches</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>Leaves</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>Roots</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </div>
  </div>
</template>
````

**Example: Idea for content**

Source: [VariousContent.vue](../../examples/QMenu/VariousContent.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn color="purple" label="Account Settings">
      <q-menu>
        <div class="row no-wrap q-pa-md">
          <div class="column">
            <div class="text-h6 q-mb-md">Settings</div>
            <q-toggle v-model="mobileData" label="Use Mobile Data" />
            <q-toggle v-model="bluetooth" label="Bluetooth" />
          </div>

          <q-separator vertical inset class="q-mx-lg" />

          <div class="column items-center">
            <q-avatar size="72px">
              <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
            </q-avatar>

            <div class="text-subtitle1 q-mt-md q-mb-xs">John Doe</div>

            <q-btn
              color="primary"
              label="Logout"
              push
              size="sm"
              v-close-popup
            />
          </div>
        </div>
      </q-menu>
    </q-btn>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const mobileData = ref(true)
const bluetooth = ref(false)
</script>
````

**Example: Toggle through v-model**

Source: [VModel.vue](../../examples/QMenu/VModel.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-btn color="primary" @click="showing = true" label="Show" />
      <q-btn color="primary" @click="showing = false" label="Hide" />
    </div>

    <div
      style="width: 200px; height: 70px"
      class="bg-purple text-white rounded-borders row flex-center q-mt-md"
    >
      Click me

      <q-menu v-model="showing">
        <q-list style="min-width: 100px">
          <q-item clickable v-close-popup>
            <q-item-section>New tab</q-item-section>
          </q-item>
          <!-- #region -->
          <q-item clickable v-close-popup>
            <q-item-section>New incognito tab</q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable v-close-popup>
            <q-item-section>Recent tabs</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>History</q-item-section>
          </q-item>
          <!-- #endregion -->
        </q-list>
      </q-menu>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showing = ref(false)
</script>
````

::: warning
If you want to conditionally activate or de-activate a QMenu, please use `v-if` on it instead of `v-show`.
:::

### Submenus

**Example: Menus in menus**

Source: [MenuInMenu.vue](../../examples/QMenu/MenuInMenu.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-center">
      <q-btn color="primary" label="Click me">
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

      <q-bar
        style="min-width: 250px"
        class="bg-teal text-white rounded-borders"
      >
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
                  <q-list dense>
                    <q-item v-for="n in 3" :key="n" clickable>
                      <q-item-section>Submenu Label</q-item-section>
                      <q-item-section side>
                        <q-icon name="keyboard_arrow_right" />
                      </q-item-section>
                      <q-menu auto-close anchor="top end" self="top start">
                        <q-list dense>
                          <q-item v-for="n in 3" :key="n" clickable>
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
        <div class="cursor-pointer non-selectable"
          >Edit
          <q-menu>
            <q-list dense style="min-width: 100px">
              <q-item clickable v-close-popup>
                <q-item-section>Cut</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Copy</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Paste</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
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
  </div>
</template>
````

### Sizing and styling

**Example: Sizing**

Source: [Sizing.vue](../../examples/QMenu/Sizing.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-btn color="accent" label="Fit Menu" style="width: 280px">
        <q-menu fit>
          <q-list style="min-width: 100px">
            <q-item clickable>
              <q-item-section>New tab</q-item-section>
            </q-item>
            <!-- #region -->
            <q-item clickable>
              <q-item-section>New incognito tab</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Recent tabs</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>History</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Downloads</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Settings</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Help &amp; Feedback</q-item-section>
            </q-item>
            <!-- #endregion -->
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="brown" label="Max Height Menu">
        <q-menu max-height="130px">
          <q-list style="min-width: 100px">
            <q-item clickable>
              <q-item-section>New tab</q-item-section>
            </q-item>
            <!-- #region -->
            <q-item clickable>
              <q-item-section>New incognito tab</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Recent tabs</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>History</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Downloads</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Settings</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Help &amp; Feedback</q-item-section>
            </q-item>
            <!-- #endregion -->
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="indigo" label="Max Width Menu">
        <q-menu max-width="80px">
          <q-list style="min-width: 100px">
            <q-item clickable>
              <q-item-section>
                <q-item-label lines="1">New tab</q-item-label>
              </q-item-section>
            </q-item>
            <!-- #region -->
            <q-item clickable>
              <q-item-section>
                <q-item-label lines="1">New incognito tab</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>
                <q-item-label lines="1">Recent tabs</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>
                <q-item-label lines="1">History</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>
                <q-item-label lines="1">Downloads</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>
                <q-item-label lines="1">Settings</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>
                <q-item-label lines="1">Help & Feedback</q-item-label>
              </q-item-section>
            </q-item>
            <!-- #endregion -->
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>
````

**Example: Style**

Source: [Style.vue](../../examples/QMenu/Style.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <q-btn color="primary" label="Content Class Menu">
        <q-menu class="bg-purple text-white" auto-close>
          <q-list style="min-width: 100px">
            <q-item clickable>
              <q-item-section>New tab</q-item-section>
            </q-item>
            <!-- #region -->
            <q-item clickable>
              <q-item-section>New incognito tab</q-item-section>
            </q-item>
            <q-separator dark />
            <q-item clickable>
              <q-item-section>Recent tabs</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>History</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Downloads</q-item-section>
            </q-item>
            <q-separator dark />
            <q-item clickable>
              <q-item-section>Settings</q-item-section>
            </q-item>
            <q-separator dark />
            <q-item clickable>
              <q-item-section>Help &amp; Feedback</q-item-section>
            </q-item>
            <!-- #endregion -->
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="primary" label="Content Style Menu">
        <q-menu :style="{ backgroundColor: '#9C27B0', color: 'white' }">
          <q-list style="min-width: 100px">
            <q-item clickable>
              <q-item-section>New tab</q-item-section>
            </q-item>
            <!-- #region -->
            <q-item clickable>
              <q-item-section>New incognito tab</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Recent tabs</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>History</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Downloads</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Settings</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Help &amp; Feedback</q-item-section>
            </q-item>
            <!-- #endregion -->
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>
````

### Context menu

You can also set QMenu to act as a context menu. On desktop, you need to right click the parent target to trigger it, and on mobile a long tap will do the job.

**Example: Context Menu**

Source: [ContextMenu.vue](../../examples/QMenu/ContextMenu.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-img src="https://cdn.quasar.dev/img/parallax1.jpg" style="height: 100px">
      <q-menu touch-position context-menu>
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
    </q-img>
  </div>
</template>
````

### Persistent

If you want the QMenu to not close if app route changes or if hitting ESCAPE key or if clicking/tapping outside of the menu, then use `persistent` prop:

**Example: Persistent**

Source: [Persistent.vue](../../examples/QMenu/Persistent.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn color="primary" label="Persistent Menu">
      <q-menu persistent auto-close>
        <q-list style="min-width: 100px">
          <q-item clickable>
            <q-item-section>New tab</q-item-section>
          </q-item>
          <!-- #region -->
          <q-item clickable>
            <q-item-section>New incognito tab</q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable>
            <q-item-section>Recent tabs</q-item-section>
          </q-item>
          <q-item clickable>
            <q-item-section>History</q-item-section>
          </q-item>
          <q-item clickable>
            <q-item-section>Downloads</q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable>
            <q-item-section>Settings</q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable>
            <q-item-section>Help &amp; Feedback</q-item-section>
          </q-item>
          <!-- #endregion -->
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>
````

### Transitions

In the example below there's a few transitions showcased. For a full list of transitions available, go to [Transitions](/options/transitions).

**Example: Transition examples**

Source: [Transitions.vue](../../examples/QMenu/Transitions.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <q-btn color="primary" label="Flip Menu">
        <q-menu transition-show="flip-right" transition-hide="flip-left">
          <q-list style="min-width: 100px">
            <q-item clickable>
              <q-item-section>Having fun</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Crazy for transitions</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Mind blown</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="primary" label="Scale Menu">
        <q-menu transition-show="scale" transition-hide="scale">
          <q-list style="min-width: 100px">
            <q-item clickable>
              <q-item-section>Having fun</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Crazy for transitions</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Mind blown</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="primary" label="Jump Menu">
        <q-menu transition-show="jump-down" transition-hide="jump-up">
          <q-list style="min-width: 100px">
            <q-item clickable>
              <q-item-section>Having fun</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Crazy for transitions</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Mind blown</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="primary" label="Rotate Menu">
        <q-menu transition-show="rotate" transition-hide="rotate">
          <q-list style="min-width: 100px">
            <q-item clickable>
              <q-item-section>Having fun</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Crazy for transitions</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Mind blown</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>
````

### Reusable

The example below shows how to create a re-usable menu that can be shared with different targets.

**Example: Using target**

Source: [Target.vue](../../examples/QMenu/Target.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">
      <div class="row items-center q-gutter-x-sm">
        <q-radio
          v-model="targetEl"
          :val="false"
          label="false (no target whatsoever)"
        />
        <q-radio
          v-model="targetEl"
          :val="true"
          label="true (original parent)"
        />
        <q-radio v-model="targetEl" val="#target-img-1" label="#target-img-1" />
        <q-radio v-model="targetEl" val="#target-img-2" label="#target-img-2" />
        <q-radio v-model="targetEl" val="#bogus" label="#bogus" />
      </div>
    </div>
    <div class="row justify-center">
      <q-img
        src="https://cdn.quasar.dev/img/material.png"
        id="target-img-1"
        style="height: 100px"
      >
        <div class="absolute-bottom-right" style="border-top-left-radius: 5px"
          >#target-img-1</div
        >
      </q-img>
      <q-img
        src="https://cdn.quasar.dev/img/parallax2.jpg"
        id="target-img-2"
        style="height: 100px"
      >
        <div class="absolute-bottom-right" style="border-top-left-radius: 5px"
          >#target-img-2</div
        >
      </q-img>
      <q-img src="https://cdn.quasar.dev/img/blueish.jpg" style="height: 100px">
        <div class="absolute-bottom-right" style="border-top-left-radius: 5px"
          >Original parent</div
        >
        <q-menu touch-position :target="targetEl">
          <q-list>
            <q-item v-for="n in 5" :key="n" v-close-popup clickable>
              <q-item-section>Label</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-img>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const targetEl = ref('#target-img-1')
</script>
````

### Positioning

**Example: Position examples**

Source: [Positions.vue](../../examples/QMenu/Positions.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <q-btn color="primary" label="Anchor/Self Menu">
        <q-menu anchor="top right" self="top left">
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>anchor="top right"</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>self="top left"</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="primary" label="Anchor/Self Menu">
        <q-menu anchor="center middle" self="center middle">
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>anchor="center middle"</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>self="center middle"</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="primary" label="Anchor/Self Menu">
        <q-menu anchor="bottom right" self="bottom left">
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>anchor="bottom right"</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>self="bottom left"</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="primary" label="Offset Menu">
        <q-menu :offset="[0, 20]">
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>:offset="[0, 20]"</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>:offset="[0, 20]"</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="primary" label="Offset Menu">
        <q-menu :offset="[50, 10]">
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>:offset="[50, 10]"</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>:offset="[50, 10]"</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn color="primary" label="Offset Menu">
        <q-menu :offset="[-50, 10]">
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>:offset="[-50, 10]"</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>:offset="[-50, 10]"</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>
````

The position of QMenu can be customized. It keeps account of the `anchor` and `self` optional props.
The final position of QMenu popup is calculated so that it will be displayed on the available screen real estate, switching to the right-side and/or top-side when necessary.

For horizontal positioning you can use `start` and `end` when you want to automatically take into account if on RTL or non-RTL. `start` and `end` mean "left" for non-RTL and "right" for RTL.

::: tip
The `offset` prop is applied to the **anchor element's bounding box**, and only then is the final position clamped to the available screen real estate. As a result, a large offset — or anchoring QMenu to a full-width / screen-edge element — can push the popup against a viewport edge, where it gets clamped and the offset appears to have no effect (the clamped position then becomes independent of the offset value). If an `offset` seems to be ignored on one axis, make sure the chosen `anchor`/`self` lets the popup expand into free space on that axis — for example, attach QMenu to an inline / `inline-block` trigger rather than to a full-width block element.
:::



<MenuPositioning />
