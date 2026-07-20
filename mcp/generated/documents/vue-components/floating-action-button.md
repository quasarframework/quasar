---
title: Floating Action Button
description: How to use the QFab component. Floating Action Buttons for your Quasar app.
canonical: https://quasar.dev/vue-components/floating-action-button
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QFab](../../api/QFab.md)
- [QFabAction](../../api/QFabAction.md)

A Floating Action Button (FAB) represents the primary action in a Page. But, it's not limited to only a single action. It can contain any number of sub-actions too. And more importantly, it can also be used inline in your Pages or Layouts.

Note that you don’t need a QLayout to use FABs.

**API reference:** [QFab](../../api/QFab.md)

**API reference:** [QFabAction](../../api/QFabAction.md)

## Usage

There are two types of FABs: expandable (has sub-actions) and non-expandable.

::: tip
For an exhausting list of options, please read the API cards (at the top of this page).
:::

### Non-Expandable

If you want a non-expandable FAB, all you need is a round button – wrapped in QPageSticky if used on a QLayout.

**Example: Non expandable**

Source: [NonExpandable.vue](../../examples/QFab/NonExpandable.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-layout
      view="lhh LpR lff"
      container
      style="height: 300px"
      class="shadow-2 rounded-borders"
    >
      <q-header class="bg-black">
        <q-toolbar>
          <q-btn flat round dense icon="menu" />
          <q-toolbar-title>Header</q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page padding>
          <p v-for="n in 15" :key="n">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil
            praesentium molestias a adipisci, dolore vitae odit, quidem
            consequatur optio voluptates asperiores pariatur eos numquam rerum
            delectus commodi perferendis voluptate?
          </p>

          <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="add" color="accent" />
          </q-page-sticky>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>
````

### Expandable

**Example: Expandable**

Source: [Expandable.vue](../../examples/QFab/Expandable.vue)

````vue
<template>
  <div class="q-px-sm q-py-lg">
    <div
      class="column items-center"
      style="margin-top: 100px; margin-bottom: 100px"
    >
      <q-fab color="purple" icon="keyboard_arrow_up" direction="up">
        <q-fab-action color="primary" @click="onClick" icon="mail" />
        <q-fab-action color="secondary" @click="onClick" icon="alarm" />
      </q-fab>

      <br />

      <q-fab
        color="amber"
        text-color="black"
        icon="keyboard_arrow_left"
        direction="left"
      >
        <q-fab-action
          color="amber"
          text-color="black"
          @click="onClick"
          icon="mail"
        />
        <q-fab-action
          color="amber"
          text-color="black"
          @click="onClick"
          icon="alarm"
        />
      </q-fab>

      <br />

      <q-fab
        color="secondary"
        push
        icon="keyboard_arrow_right"
        direction="right"
      >
        <q-fab-action color="primary" @click="onClick" icon="mail" />
        <q-fab-action color="accent" @click="onClick" icon="alarm" />
      </q-fab>

      <br />

      <q-fab color="accent" glossy icon="keyboard_arrow_down" direction="down">
        <q-fab-action
          color="amber"
          text-color="black"
          @click="onClick"
          icon="mail"
        />
        <q-fab-action
          color="amber"
          text-color="black"
          @click="onClick"
          icon="alarm"
        />
      </q-fab>
    </div>
  </div>
</template>

<script setup>
function onClick() {
  console.log('Clicked on a fab action')
}
</script>
````

### Internal labels

**Example: Internal label**

Source: [InternalLabel.vue](../../examples/QFab/InternalLabel.vue)

````vue
<template>
  <div class="q-pa-md" style="padding-bottom: 220px">
    <div>
      <q-fab
        v-model="fab1"
        label="Actions"
        label-position="left"
        color="purple"
        icon="keyboard_arrow_right"
        direction="right"
      >
        <q-fab-action
          color="primary"
          @click="onClick"
          icon="mail"
          label="Email"
        />
        <q-fab-action
          color="secondary"
          @click="onClick"
          icon="alarm"
          label="Alarm"
        />
      </q-fab>
    </div>

    <div class="q-mt-md">
      <q-fab
        v-model="fab2"
        label="Actions"
        vertical-actions-align="left"
        color="purple"
        icon="keyboard_arrow_down"
        direction="down"
      >
        <q-fab-action
          color="primary"
          @click="onClick"
          icon="mail"
          label="Email"
        />
        <!-- #region -->
        <q-fab-action
          color="secondary"
          @click="onClick"
          icon="alarm"
          label="Alarm"
        />
        <q-fab-action
          color="orange"
          @click="onClick"
          icon="airplay"
          label="Airplay"
        />
        <q-fab-action color="accent" @click="onClick" icon="room" label="Map" />
        <!-- #endregion -->
      </q-fab>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fab1 = ref(true)
const fab2 = ref(true)

function onClick() {
  console.log('Clicked on a fab action')
}
</script>
````

**Example: Toggling internal label**

Source: [InternalLabelToggling.vue](../../examples/QFab/InternalLabelToggling.vue)

````vue
<template>
  <div class="q-pa-md" style="padding-bottom: 240px">
    <q-toggle v-model="hideLabels" label="Hide labels" />

    <div class="q-mt-md">
      <q-fab
        v-model="fab1"
        label="Actions"
        color="purple"
        icon="keyboard_arrow_right"
        direction="right"
        :hide-label="hideLabels"
      >
        <q-fab-action
          :hide-label="hideLabels"
          color="primary"
          @click="onClick"
          icon="mail"
          label="Email"
        />
        <q-fab-action
          :hide-label="hideLabels"
          color="secondary"
          @click="onClick"
          icon="alarm"
          label="Alarm"
        />
      </q-fab>
    </div>

    <div class="q-mt-md row justify-center">
      <q-fab
        v-model="fab2"
        label="Actions"
        label-position="bottom"
        glossy
        color="purple"
        icon="keyboard_arrow_down"
        direction="down"
        :hide-label="hideLabels"
      >
        <q-fab-action
          :hide-label="hideLabels"
          color="primary"
          @click="onClick"
          icon="mail"
          label="Email"
        />
        <!-- #region -->
        <q-fab-action
          :hide-label="hideLabels"
          color="secondary"
          @click="onClick"
          icon="alarm"
          label="Alarm"
        />
        <q-fab-action
          :hide-label="hideLabels"
          color="orange"
          @click="onClick"
          icon="airplay"
          label="Airplay"
        />
        <q-fab-action
          :hide-label="hideLabels"
          color="accent"
          @click="onClick"
          icon="room"
          label="Map"
        />
        <!-- #endregion -->
      </q-fab>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fab1 = ref(true)
const fab2 = ref(true)
const hideLabels = ref(false)

function onClick() {
  console.log('Clicked on a fab action')
}
</script>
````

When the labels are internal and your QFab opens up vertically (up or down) then you also have the ability to choose how to vertically align the sub-actions:

**Example: Vertical actions alignment**

Source: [VerticalActionsAlignment.vue](../../examples/QFab/VerticalActionsAlignment.vue)

````vue
<template>
  <div class="q-pa-md" style="padding-top: 220px">
    <div class="row justify-between">
      <q-fab
        v-model="fabLeft"
        vertical-actions-align="left"
        color="primary"
        glossy
        icon="keyboard_arrow_up"
        direction="up"
      >
        <q-fab-action
          label-position="right"
          color="primary"
          @click="onClick"
          icon="mail"
          label="Email"
        />
        <!-- #region -->
        <q-fab-action
          label-position="right"
          color="secondary"
          @click="onClick"
          icon="alarm"
          label="Alarm"
        />
        <q-fab-action
          label-position="right"
          color="orange"
          @click="onClick"
          icon="airplay"
          label="Airplay"
        />
        <q-fab-action
          label-position="right"
          color="accent"
          @click="onClick"
          icon="room"
          label="Map"
        />
        <!-- #endregion -->
      </q-fab>

      <q-fab
        v-model="fabCenter"
        vertical-actions-align="center"
        color="primary"
        glossy
        icon="keyboard_arrow_up"
        direction="up"
      >
        <q-fab-action
          color="primary"
          @click="onClick"
          icon="mail"
          label="Email"
        />
        <!-- #region -->
        <q-fab-action
          color="secondary"
          @click="onClick"
          icon="alarm"
          label="Alarm"
        />
        <q-fab-action
          color="orange"
          @click="onClick"
          icon="airplay"
          label="Airplay"
        />
        <q-fab-action color="accent" @click="onClick" icon="room" label="Map" />
        <!-- #endregion -->
      </q-fab>

      <q-fab
        v-model="fabRight"
        vertical-actions-align="right"
        color="primary"
        glossy
        icon="keyboard_arrow_up"
        direction="up"
      >
        <q-fab-action
          label-position="left"
          color="primary"
          @click="onClick"
          icon="mail"
          label="Email"
        />
        <!-- #region -->
        <q-fab-action
          label-position="left"
          color="secondary"
          @click="onClick"
          icon="alarm"
          label="Alarm"
        />
        <q-fab-action
          label-position="left"
          color="orange"
          @click="onClick"
          icon="airplay"
          label="Airplay"
        />
        <q-fab-action
          label-position="left"
          color="accent"
          @click="onClick"
          icon="room"
          label="Map"
        />
        <!-- #endregion -->
      </q-fab>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fabLeft = ref(true)
const fabCenter = ref(true)
const fabRight = ref(true)

function onClick() {
  console.log('Clicked on a fab action')
}
</script>
````

### External labels

By default, when the label is external on the main QFab (not the sub-actions), it gets shown only when QFab is opened. However, you can override that by setting a Boolean value for `hide-label` prop.

**Example: External label**

Source: [ExternalLabel.vue](../../examples/QFab/ExternalLabel.vue)

````vue
<template>
  <div class="q-pa-md" style="padding-top: 48px; padding-bottom: 220px">
    <div>
      <q-fab
        v-model="fab1"
        label="Actions"
        label-position="top"
        external-label
        color="purple"
        icon="keyboard_arrow_right"
        direction="right"
      >
        <q-fab-action
          external-label
          label-position="top"
          color="primary"
          @click="onClick"
          icon="mail"
          label="Email"
        />
        <!-- #region -->
        <q-fab-action
          external-label
          label-position="top"
          color="secondary"
          @click="onClick"
          icon="alarm"
          label="Alarm"
        />
        <q-fab-action
          external-label
          label-position="top"
          color="orange"
          @click="onClick"
          icon="airplay"
          label="Airplay"
        />
        <q-fab-action
          external-label
          label-position="top"
          color="accent"
          @click="onClick"
          icon="room"
          label="Map"
        />
        <!-- #endregion -->
      </q-fab>
    </div>

    <div class="q-mt-md">
      <q-fab
        v-model="fab2"
        label="Actions"
        external-label
        vertical-actions-align="left"
        color="purple"
        icon="keyboard_arrow_down"
        direction="down"
      >
        <q-fab-action
          external-label
          color="primary"
          @click="onClick"
          icon="mail"
          label="Email"
        />
        <!-- #region -->
        <q-fab-action
          external-label
          color="secondary"
          @click="onClick"
          icon="alarm"
          label="Alarm"
        />
        <q-fab-action
          external-label
          color="orange"
          @click="onClick"
          icon="airplay"
          label="Airplay"
        />
        <q-fab-action
          external-label
          color="accent"
          @click="onClick"
          icon="room"
          label="Map"
        />
        <!-- #endregion -->
      </q-fab>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fab1 = ref(true)
const fab2 = ref(true)

function onClick() {
  console.log('Clicked on a fab action')
}
</script>
````

**Example: Custom styled external label**

Source: [ExternalLabelStyled.vue](../../examples/QFab/ExternalLabelStyled.vue)

````vue
<template>
  <div class="q-pa-md" style="padding-top: 48px; padding-bottom: 220px">
    <div>
      <q-fab
        v-model="fab1"
        label="Actions"
        label-position="top"
        label-class="bg-grey-3 text-purple"
        external-label
        color="purple"
        icon="keyboard_arrow_right"
        direction="right"
      >
        <q-fab-action
          label-class="bg-grey-3 text-grey-8"
          external-label
          label-position="top"
          color="primary"
          @click="onClick"
          icon="mail"
          label="Email"
        />
        <!-- #region -->
        <q-fab-action
          label-class="bg-grey-3 text-grey-8"
          external-label
          label-position="top"
          color="secondary"
          @click="onClick"
          icon="alarm"
          label="Alarm"
        />
        <q-fab-action
          label-class="bg-grey-3 text-grey-8"
          external-label
          label-position="top"
          color="orange"
          @click="onClick"
          icon="airplay"
          label="Airplay"
        />
        <q-fab-action
          label-class="bg-grey-3 text-grey-8"
          external-label
          label-position="top"
          color="accent"
          @click="onClick"
          icon="room"
          label="Map"
        />
        <!-- #endregion -->
      </q-fab>
    </div>

    <div class="q-mt-md">
      <q-fab
        v-model="fab2"
        label="Actions"
        external-label
        label-class="bg-grey-3 text-purple"
        vertical-actions-align="left"
        color="purple"
        icon="keyboard_arrow_down"
        direction="down"
      >
        <q-fab-action
          label-class="bg-grey-3 text-grey-8"
          external-label
          color="primary"
          @click="onClick"
          icon="mail"
          label="Email"
        />
        <!-- #region -->
        <q-fab-action
          label-class="bg-grey-3 text-grey-8"
          external-label
          color="secondary"
          @click="onClick"
          icon="alarm"
          label="Alarm"
        />
        <q-fab-action
          label-class="bg-grey-3 text-grey-8"
          external-label
          color="orange"
          @click="onClick"
          icon="airplay"
          label="Airplay"
        />
        <q-fab-action
          label-class="bg-grey-3 text-grey-8"
          external-label
          color="accent"
          @click="onClick"
          icon="room"
          label="Map"
        />
        <!-- #endregion -->
      </q-fab>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fab1 = ref(true)
const fab2 = ref(true)

function onClick() {
  console.log('Clicked on a fab action')
}
</script>
````

**Example: Toggling external label**

Source: [ExternalLabelToggling.vue](../../examples/QFab/ExternalLabelToggling.vue)

````vue
<template>
  <div class="q-pa-md" style="padding-bottom: 220px">
    <q-toggle v-model="hideLabels" label="Hide labels" />

    <div style="padding-top: 48px">
      <q-fab
        v-model="fab1"
        label="Actions"
        label-position="top"
        external-label
        color="purple"
        icon="keyboard_arrow_right"
        direction="right"
        :hide-label="hideLabels"
      >
        <q-fab-action
          :hide-label="hideLabels"
          external-label
          label-position="top"
          color="primary"
          @click="onClick"
          icon="mail"
          label="Email"
        />
        <!-- #region -->
        <q-fab-action
          :hide-label="hideLabels"
          external-label
          label-position="top"
          color="secondary"
          @click="onClick"
          icon="alarm"
          label="Alarm"
        />
        <q-fab-action
          :hide-label="hideLabels"
          external-label
          label-position="top"
          color="orange"
          @click="onClick"
          icon="airplay"
          label="Airplay"
        />
        <q-fab-action
          :hide-label="hideLabels"
          external-label
          label-position="top"
          color="accent"
          @click="onClick"
          icon="room"
          label="Map"
        />
        <!-- #endregion -->
      </q-fab>
    </div>

    <div class="q-mt-md">
      <q-fab
        v-model="fab2"
        label="Actions"
        external-label
        vertical-actions-align="left"
        color="purple"
        icon="keyboard_arrow_down"
        direction="down"
        :hide-label="hideLabels"
      >
        <q-fab-action
          :hide-label="hideLabels"
          external-label
          color="primary"
          @click="onClick"
          icon="mail"
          label="Email"
        />
        <!-- #region -->
        <q-fab-action
          :hide-label="hideLabels"
          external-label
          color="secondary"
          @click="onClick"
          icon="alarm"
          label="Alarm"
        />
        <q-fab-action
          :hide-label="hideLabels"
          external-label
          color="orange"
          @click="onClick"
          icon="airplay"
          label="Airplay"
        />
        <q-fab-action
          :hide-label="hideLabels"
          external-label
          color="accent"
          @click="onClick"
          icon="room"
          label="Map"
        />
        <!-- #endregion -->
      </q-fab>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fab1 = ref(true)
const fab2 = ref(true)
const hideLabels = ref(false)

function onClick() {
  console.log('Clicked on a fab action')
}
</script>
````

### Hide icons

If we hide the icon (through specific prop), we should at least use an internal label:

**Example: Hide icon**

Source: [HideIcon.vue](../../examples/QFab/HideIcon.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-fab
      v-model="fab"
      label="Actions"
      label-position="left"
      color="purple"
      hide-icon
      direction="right"
    >
      <q-fab-action color="primary" @click="onClick" hide-icon label="Email" />
      <q-fab-action
        color="secondary"
        @click="onClick"
        hide-icon
        label="Alarm"
      />
    </q-fab>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fab = ref(true)
function onClick() {
  console.log('Clicked on a fab action')
}
</script>
````

### Padding

The default padding for QFab is "md" and for QFabAction is "sm". However, you can use `padding` prop to customize it (accepts CSS units too):

**Example: Playing with padding**

Source: [Padding.vue](../../examples/QFab/Padding.vue)

````vue
<template>
  <div class="q-pa-lg" style="padding-top: 48px; padding-bottom: 220px">
    <div>
      <q-fab
        v-model="fab1"
        label="Actions"
        label-position="top"
        external-label
        color="purple"
        icon="keyboard_arrow_right"
        direction="right"
        padding="xs"
      >
        <q-fab-action
          padding="5px"
          external-label
          label-position="top"
          color="primary"
          @click="onClick"
          icon="mail"
          label="Email"
        />
        <q-fab-action
          padding="5px"
          external-label
          label-position="top"
          color="orange"
          @click="onClick"
          icon="room"
          label="Map"
        />
      </q-fab>
    </div>

    <div class="q-mt-lg">
      <q-fab
        v-model="fab2"
        label="Actions"
        vertical-actions-align="left"
        color="purple"
        padding="none xl"
        icon="keyboard_arrow_down"
        direction="down"
      >
        <q-fab-action
          padding="3px"
          external-label
          color="primary"
          @click="onClick"
          icon="mail"
          label="Email"
        />
        <!-- #region -->
        <q-fab-action
          padding="3px"
          external-label
          color="secondary"
          @click="onClick"
          icon="alarm"
          label="Alarm"
        />
        <q-fab-action
          padding="3px"
          external-label
          color="orange"
          @click="onClick"
          icon="airplay"
          label="Airplay"
        />
        <q-fab-action
          padding="3px"
          external-label
          color="accent"
          @click="onClick"
          icon="room"
          label="Map"
        />
        <!-- #endregion -->
      </q-fab>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fab1 = ref(false)
const fab2 = ref(false)

function onClick() {
  console.log('Clicked on a fab action')
}
</script>
````

### Square style

**Example: Square style**

Source: [SquareStyle.vue](../../examples/QFab/SquareStyle.vue)

````vue
<template>
  <div class="q-pa-md" style="padding-top: 48px; padding-bottom: 220px">
    <div>
      <q-fab
        v-model="fab1"
        color="primary"
        glossy
        icon="keyboard_arrow_right"
        direction="right"
      >
        <q-fab-action
          square
          external-label
          label-position="top"
          color="primary"
          @click="onClick"
          icon="mail"
          label="Email"
        />
        <!-- #region -->
        <q-fab-action
          square
          external-label
          label-position="top"
          color="secondary"
          @click="onClick"
          icon="alarm"
          label="Alarm"
        />
        <q-fab-action
          square
          external-label
          label-position="top"
          color="orange"
          @click="onClick"
          icon="airplay"
          label="Airplay"
        />
        <q-fab-action
          square
          external-label
          label-position="top"
          color="accent"
          @click="onClick"
          icon="room"
          label="Map"
        />
        <!-- #endregion -->
      </q-fab>
    </div>

    <div class="q-mt-md row justify-center">
      <q-fab
        v-model="fab2"
        square
        vertical-actions-align="right"
        color="secondary"
        glossy
        icon="keyboard_arrow_down"
        direction="down"
      >
        <q-fab-action
          square
          color="primary"
          @click="onClick"
          icon="mail"
          label="Email"
          label-position="left"
        />
        <!-- #region -->
        <q-fab-action
          square
          color="secondary"
          @click="onClick"
          icon="alarm"
          label="Alarm"
          label-position="left"
        />
        <!-- #endregion -->
        <q-fab-action
          glossy
          square
          color="orange"
          @click="onClick"
          icon="airplay"
          label="Airplay"
          label-position="left"
        />
        <!-- #region -->
        <q-fab-action
          square
          color="accent"
          @click="onClick"
          icon="room"
          label="Map"
          label-position="left"
        />
        <!-- #endregion -->
      </q-fab>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fab1 = ref(true)
const fab2 = ref(true)

function onClick() {
  console.log('Clicked on a fab action')
}
</script>
````

### Slots <q-badge label="v2.4+" />

Notice the slots for QFab and the slots for QFabAction below:

**Example: Slots: icon, active-icon and label**

Source: [FabSlots.vue](../../examples/QFab/FabSlots.vue)

````vue
<template>
  <div class="q-px-sm q-py-lg">
    <div
      class="column items-center"
      style="margin-top: 100px; margin-bottom: 100px"
    >
      <q-fab color="purple" direction="up">
        <template v-slot:icon="{ opened }">
          <q-icon
            :class="{ 'example-fab-animate--hover': !opened }"
            name="keyboard_arrow_up"
          />
        </template>

        <template v-slot:active-icon="{ opened }">
          <q-icon :class="{ 'example-fab-animate': opened }" name="close" />
        </template>

        <q-fab-action color="primary" external-label @click="onClick">
          <template v-slot:icon>
            <q-icon name="mail" />
          </template>
          <template v-slot:label> Mail </template>
        </q-fab-action>

        <q-fab-action
          color="secondary"
          external-label
          @click="onClick"
          icon="alarm"
          label="Alarm"
        />
      </q-fab>

      <br />

      <q-fab
        color="amber"
        text-color="black"
        icon="keyboard_arrow_left"
        direction="left"
      >
        <template v-slot:label="{ opened }">
          <div :class="{ 'example-fab-animate--hover': !opened }">
            {{ opened ? 'Close' : 'Open' }}
          </div>
        </template>

        <q-fab-action color="primary" @click="onClick" icon="mail" />
        <q-fab-action color="secondary" @click="onClick" icon="alarm" />
      </q-fab>
    </div>
  </div>
</template>

<script setup>
function onClick() {
  console.log('Clicked on a fab action')
}
</script>

<style lang="sass" scoped>
.example-fab-animate,
.q-fab:hover .example-fab-animate--hover
  animation: example-fab-animate 0.82s cubic-bezier(.36,.07,.19,.97) both
  transform: translate3d(0, 0, 0)
  backface-visibility: hidden
  perspective: 1000px

@keyframes example-fab-animate
  10%, 90%
    transform: translate3d(-1px, 0, 0)

  20%, 80%
    transform: translate3d(2px, 0, 0)

  30%, 50%, 70%
    transform: translate3d(-4px, 0, 0)

  40%, 60%
    transform: translate3d(4px, 0, 0)
</style>
````

### With QPageSticky

**Example: With QPageSticky**

Source: [PageSticky.vue](../../examples/QFab/PageSticky.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-layout
      view="lhh LpR lff"
      container
      style="height: 300px"
      class="shadow-2 rounded-borders"
    >
      <q-header reveal class="bg-black">
        <q-toolbar>
          <q-btn flat round dense icon="menu" />
          <q-toolbar-title>Header</q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page padding>
          <p v-for="n in 15" :key="n">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil
            praesentium molestias a adipisci, dolore vitae odit, quidem
            consequatur optio voluptates asperiores pariatur eos numquam rerum
            delectus commodi perferendis voluptate?
          </p>

          <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-fab icon="add" direction="up" color="accent">
              <q-fab-action
                @click="onClick"
                color="primary"
                icon="person_add"
              />
              <q-fab-action @click="onClick" color="primary" icon="mail" />
            </q-fab>
          </q-page-sticky>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup>
function onClick() {
  console.log('Clicked on a fab action')
}
</script>
````

### Draggable

Below is a nice example of using [TouchPan](/vue-directives/touch-pan) for making the QFab draggable across the screen.

**Example: Draggable**

Source: [Draggable.vue](../../examples/QFab/Draggable.vue)

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
