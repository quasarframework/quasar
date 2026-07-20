---
title: Touch Pan Directive
description: Vue directive which triggers an event when the user drags the finger or mouse on a component or element.
canonical: https://quasar.dev/vue-directives/touch-pan
kinds: directive
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [TouchPan](../../api/TouchPan.md)

Quasar offers full-featured Vue directives that can totally replace libraries like Hammerjs: `v-touch-pan`, `v-touch-swipe`, `v-touch-hold` and even `v-touch-repeat`.

> **These directives also work with mouse events, not only touch events**, so you are able to build cool functionality for your App on desktops too.

We will be describing `v-touch-pan` on the lines below.

**API reference:** [TouchPan](../../api/TouchPan.md)

## Usage

Click then pan in a direction with your mouse on the area below to see it in action.
Page scrolling is prevented, but you can opt out if you wish.

::: tip
If your content also has images, you might want to add `draggable="false"` to them, otherwise the native browser behavior might interfere in a negative way.
:::

**Example: All directions**

Source: [Basic.vue](../../examples/TouchPan/Basic.vue)

````vue
<template>
  <div class="q-pa-md row justify-center">
    <q-card
      v-touch-pan.prevent.mouse="handlePan"
      class="custom-area cursor-pointer bg-primary text-white shadow-2 relative-position row flex-center"
    >
      <div v-if="info" class="custom-info">
        <pre>{{ info }}</pre>
      </div>
      <div v-else class="text-center">
        <q-icon name="arrow_upward" />
        <div class="row items-center">
          <q-icon name="arrow_back" />
          <div>Pan in any direction</div>
          <q-icon name="arrow_forward" />
        </div>
        <q-icon name="arrow_downward" />
      </div>

      <div v-show="panning" class="touch-signal">
        <q-icon name="touch_app" />
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const info = ref(null)
const panning = ref(false)

function handlePan({ evt, ...newInfo }) {
  info.value = newInfo

  // native Javascript event
  console.log(evt)

  if (newInfo.isFirst) {
    panning.value = true
  } else if (newInfo.isFinal) {
    panning.value = false
  }
}
</script>

<style lang="sass" scoped>
.custom-area
  width: 90%
  height: 480px
  border-radius: 3px
  padding: 8px

.custom-info pre
  width: 180px
  font-size: 12px

.touch-signal
  position: absolute
  top: 16px
  right: 16px
  width: 35px
  height: 35px
  font-size: 25px
  border-radius: 50% !important
  text-align: center
  background: rgba(255, 255, 255, .2)
</style>
````

Panning works both with a mouse or a native touch action.
You can also capture pan to certain directions (any) only as you'll see below.

Example on capturing only horizontal panning.
Notice that on touch capable devices the scrolling is automatically not blocked, since we are only capturing horizontally.

**Example: Horizontally**

Source: [Horizontal.vue](../../examples/TouchPan/Horizontal.vue)

````vue
<template>
  <div class="q-pa-md row justify-center">
    <q-card
      v-touch-pan.horizontal.prevent.mouse="handlePan"
      class="custom-area cursor-pointer bg-primary text-white shadow-2 relative-position row flex-center"
    >
      <div v-if="info" class="custom-info">
        <pre>{{ info }}</pre>
      </div>
      <div v-else class="row items-center">
        <q-icon name="arrow_back" />
        <div>Pan to left or right only</div>
        <q-icon name="arrow_forward" />
      </div>

      <div v-show="panning" class="touch-signal">
        <q-icon name="touch_app" />
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const info = ref(null)
const panning = ref(false)

function handlePan({ evt, ...newInfo }) {
  info.value = newInfo

  // native Javascript event
  console.log(evt)

  if (newInfo.isFirst) {
    panning.value = true
  } else if (newInfo.isFinal) {
    panning.value = false
  }
}
</script>

<style lang="sass" scoped>
.custom-area
  width: 90%
  height: 480px
  border-radius: 3px
  padding: 8px

.custom-info pre
  width: 180px
  font-size: 12px

.touch-signal
  position: absolute
  top: 16px
  right: 16px
  width: 35px
  height: 35px
  font-size: 25px
  border-radius: 50% !important
  text-align: center
  background: rgba(255, 255, 255, .2)
</style>
````

Example on capturing only vertically panning. Page scrolling is prevented, but you can opt out if you wish.

**Example: Vertically**

Source: [Vertical.vue](../../examples/TouchPan/Vertical.vue)

````vue
<template>
  <div class="q-pa-md row justify-center">
    <q-card
      v-touch-pan.vertical.prevent.mouse="handlePan"
      class="custom-area cursor-pointer bg-primary text-white shadow-2 relative-position row flex-center"
    >
      <div v-if="info" class="custom-info">
        <pre>{{ info }}</pre>
      </div>
      <div v-else class="text-center">
        <q-icon name="arrow_upward" />
        <div> Pan to up or down only </div>
        <q-icon name="arrow_downward" />
      </div>

      <div v-show="panning" class="touch-signal">
        <q-icon name="touch_app" />
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const info = ref(null)
const panning = ref(false)

function handlePan({ evt, ...newInfo }) {
  info.value = newInfo

  // native Javascript event
  console.log(evt)

  if (newInfo.isFirst) {
    panning.value = true
  } else if (newInfo.isFinal) {
    panning.value = false
  }
}
</script>

<style lang="sass" scoped>
.custom-area
  width: 90%
  height: 480px
  border-radius: 3px
  padding: 8px

.custom-info pre
  width: 180px
  font-size: 12px

.touch-signal
  position: absolute
  top: 16px
  right: 16px
  width: 35px
  height: 35px
  font-size: 25px
  border-radius: 50% !important
  text-align: center
  background: rgba(255, 255, 255, .2)
</style>
````

Example on capturing panning on custom directions. For this, use modifiers: `up`, `down`, `left`, `right`. Page scrolling is prevented, but you can opt out if you wish.

**Example: Custom directions**

Source: [Custom.vue](../../examples/TouchPan/Custom.vue)

````vue
<template>
  <div class="q-pa-md row justify-center">
    <q-card
      v-touch-pan.up.right.prevent.mouse="handlePan"
      class="custom-area cursor-pointer bg-primary text-white shadow-2 relative-position row flex-center"
    >
      <div v-if="info" class="custom-info">
        <pre>{{ info }}</pre>
      </div>
      <div v-else class="text-center">
        <q-icon name="arrow_upward" />
        <div class="row items-center">
          <div>Pan to up or to right</div>
          <q-icon name="arrow_forward" />
        </div>
      </div>

      <div v-show="panning" class="touch-signal">
        <q-icon name="touch_app" />
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const info = ref(null)
const panning = ref(false)

function handlePan({ evt, ...newInfo }) {
  info.value = newInfo

  // native Javascript event
  console.log(evt)

  if (newInfo.isFirst) {
    panning.value = true
  } else if (newInfo.isFinal) {
    panning.value = false
  }
}
</script>

<style lang="sass" scoped>
.custom-area
  width: 90%
  height: 480px
  border-radius: 3px
  padding: 8px

.custom-info pre
  width: 180px
  font-size: 12px

.touch-signal
  position: absolute
  top: 16px
  right: 16px
  width: 35px
  height: 35px
  font-size: 25px
  border-radius: 50% !important
  text-align: center
  background: rgba(255, 255, 255, .2)
</style>
````

### Handling Mouse Events

When you want to handle mouse events too, use the `mouse` modifier:

```html
<!--
  directive will also be triggered by mouse actions
-->
<div v-touch-pan.mouse="userHasPanned">...</div>
```

### Preventing Scroll (on touch capable devices)

By default, the directive does not block page scrolling. If you want to prevent scrolling, then use the `prevent` modifier.

```html
<div v-touch-pan.prevent="userHasPanned">...</div>
```

### Inhibiting TouchPan

When you want to inhibit TouchPan, you can do so by stopping propagation of the `touchstart` / `mousedown` events from the inner content:

```html
<div v-touch-pan.mouse="userHasHold">
  <!-- ...content -->
  <div @touchstart.stop @mousedown.stop>
    <!--
      TouchPan will not apply here because
      we are calling stopPropagation() on touchstart
      and mousedown events
    -->
  </div>
  <!-- ...content -->
</div>
```

However, if you are using `capture` or `mouseCapture` modifiers then events will first reach the TouchPan directive then the inner content, so TouchPan will still trigger.

## Example with FAB

Below is a nice example on using TouchPan on a QFab. You can drag it across the screen.

**Example: Draggable**

Source: [Draggable.vue](../../examples/TouchPan/Draggable.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-layout
      view="lhh LpR lff"
      container
      style="height: 500px"
      class="shadow-2 rounded-borders"
    >
      <q-page-container>
        <q-page padding>
          <p v-for="n in 15" :key="n">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil
            praesentium molestias a adipisci, dolore vitae odit, quidem
            consequatur optio voluptates asperiores pariatur eos numquam rerum
            delectus commodi perferendis voluptate?
          </p>

          <q-page-sticky position="bottom-right" :offset="fabPos">
            <q-fab
              icon="add"
              direction="up"
              color="accent"
              :disable="draggingFab"
              v-touch-pan.prevent.mouse="moveFab"
            >
              <q-fab-action
                @click="onClick"
                color="primary"
                icon="person_add"
                :disable="draggingFab"
              />
              <q-fab-action
                @click="onClick"
                color="primary"
                icon="mail"
                :disable="draggingFab"
              />
            </q-fab>
          </q-page-sticky>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fabPos = ref([18, 18])
const draggingFab = ref(false)

function onClick() {
  console.log('Clicked on a fab action')
}

function moveFab(ev) {
  draggingFab.value = ev.isFirst !== true && ev.isFinal !== true

  fabPos.value = [fabPos.value[0] - ev.delta.x, fabPos.value[1] - ev.delta.y]
}
</script>
````

## Note on HMR

Due to performance reasons, not all of the modifiers are reactive. Some require a window/page/component refresh to get updated. Please check the API card for the modifiers which are not marked as reactive.
