---
title: Tooltip
description: The QTooltip Vue component is to be used when you want to offer the user more information about a certain area in your App. When hovering the mouse over the target element (or briefly touching and holding on mobile platforms), the tooltip will appear.
canonical: https://quasar.dev/vue-components/tooltip
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QTooltip](../../api/QTooltip.md)

The QTooltip component is to be used when you want to offer the user more information about a certain area in your App. When hovering the mouse over the target element (or briefly touching and holding on mobile platforms), the tooltip will appear.

**API reference:** [QTooltip](../../api/QTooltip.md)

## Usage

The idea with QTooltip is to place it inside your DOM element / component that you want to be the trigger as direct child. Don’t worry about QTooltip content inheriting CSS from the container as the QTooltip will be injected as a direct child of `<body>` through a Quasar Portal.

**Example: Basic**

Source: [Basic.vue](../../examples/QTooltip/Basic.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-btn label="Hover me" color="primary">
        <q-tooltip> Some text as content of Tooltip </q-tooltip>
      </q-btn>

      <div
        class="inline bg-amber rounded-borders cursor-pointer"
        style="max-width: 300px"
      >
        <div class="fit flex flex-center text-center non-selectable q-pa-md">
          I am groot!<br />(Hover me!)
        </div>

        <q-tooltip> I am groot! </q-tooltip>
      </div>
    </div>
  </div>
</template>
```

**Example: Toggle through v-model**

Source: [VModel.vue](../../examples/QTooltip/VModel.vue)

```vue
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
      Hover here or click buttons
      <q-tooltip v-model="showing">Tooltip text</q-tooltip>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showing = ref(false)
</script>
```

::: warning
If you want to conditionally activate or de-activate a QTooltip, please use `v-if` on it instead of `v-show`.
:::

### Customize

**Example: Customize**

Source: [Coloring.vue](../../examples/QTooltip/Coloring.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-btn color="primary">
        Hover
        <q-tooltip class="bg-indigo" :offset="[10, 10]"> Here I am! </q-tooltip>
      </q-btn>

      <q-btn color="primary">
        Over
        <q-tooltip class="bg-red" :offset="[10, 10]"> Here I am! </q-tooltip>
      </q-btn>

      <q-btn color="primary">
        These
        <q-tooltip class="bg-purple text-body2" :offset="[10, 10]">
          Here I am!
        </q-tooltip>
      </q-btn>

      <q-btn color="primary">
        Buttons
        <q-tooltip class="bg-amber text-black shadow-4" :offset="[10, 10]">
          Here I am!
        </q-tooltip>
      </q-btn>
    </div>
  </div>
</template>
```

**Example: Custom delay (1 second)**

Source: [OneSecond.vue](../../examples/QTooltip/OneSecond.vue)

```vue
<template>
  <div class="q-pa-md">
    <div
      style="width: 200px; height: 70px"
      class="bg-secondary text-white rounded-borders non-selectable row flex-center"
    >
      One second delay
      <q-tooltip :delay="1000" :offset="[0, 10]">Quasar Rulz!</q-tooltip>
    </div>
  </div>
</template>
```

**Example: With offset**

Source: [Offset.vue](../../examples/QTooltip/Offset.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-btn color="indigo">
        Hover
        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
          <strong>Tooltip</strong> on <em>top</em> (<q-icon
            name="keyboard_arrow_up"
          />)
        </q-tooltip>
      </q-btn>

      <q-btn color="red">
        Over
        <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
          <strong>Tooltip</strong> on <em>right</em> (<q-icon
            name="keyboard_arrow_right"
          />)
        </q-tooltip>
      </q-btn>

      <q-btn color="purple">
        These
        <q-tooltip anchor="center left" self="center right" :offset="[10, 10]">
          <strong>Tooltip</strong> on <em>left</em> (<q-icon
            name="keyboard_arrow_left"
          />)
        </q-tooltip>
      </q-btn>

      <q-btn color="amber">
        Buttons
        <q-tooltip anchor="bottom middle" self="top middle" :offset="[10, 10]">
          <strong>Tooltip</strong> on <em>bottom</em> (<q-icon
            name="keyboard_arrow_down"
          />)
        </q-tooltip>
      </q-btn>
    </div>
  </div>
</template>
```

### Transitions

In the example below there's a few transitions showcased. For a full list of transitions available, go to [Transitions](/options/transitions).

**Example: Custom transition**

Source: [CustomTransition.vue](../../examples/QTooltip/CustomTransition.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <q-btn color="primary" label="Flip">
        <q-tooltip transition-show="flip-right" transition-hide="flip-left">
          Here I am!
        </q-tooltip>
      </q-btn>

      <q-btn color="primary" label="Scale">
        <q-tooltip transition-show="scale" transition-hide="scale">
          Here I am!
        </q-tooltip>
      </q-btn>

      <q-btn color="primary" label="Rotate">
        <q-tooltip transition-show="rotate" transition-hide="rotate">
          Here I am!
        </q-tooltip>
      </q-btn>
    </div>
  </div>
</template>
```

### Reusable

The example below shows how to create a re-usable menu that can be shared with different targets.

**Example: Using target**

Source: [Target.vue](../../examples/QTooltip/Target.vue)

```vue
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
        <div class="absolute-bottom-right" style="border-top-left-radius: 5px">
          #target-img-1
        </div>
      </q-img>
      <q-img
        src="https://cdn.quasar.dev/img/parallax2.jpg"
        id="target-img-2"
        style="height: 100px"
      >
        <div class="absolute-bottom-right" style="border-top-left-radius: 5px">
          #target-img-2
        </div>
      </q-img>
      <q-img src="https://cdn.quasar.dev/img/blueish.jpg" style="height: 100px">
        <div class="absolute-bottom-right" style="border-top-left-radius: 5px">
          Original parent
        </div>
        <q-tooltip
          :target="targetEl"
          anchor="center middle"
          self="center middle"
          class="bg-black"
          >Quasar Rulz!</q-tooltip
        >
      </q-img>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const targetEl = ref('#target-img-1')
</script>
```

### Positioning

The position of QTooltip can be customized. It keeps account of the `anchor` and `self` optional props.
The final position of QTooltip popup is calculated so that it will be displayed on the available screen real estate, switching to the right-side and/or top-side when necessary.

For horizontal positioning you can use `start` and `end` when you want to automatically take into account if on RTL or non-RTL. `start` and `end` mean "left" for non-RTL and "right" for RTL.

::: tip
The `offset` prop is applied to the **anchor element's bounding box**, and only then is the final position clamped to the available screen real estate. As a result, a large offset — or anchoring QTooltip to a full-width / screen-edge element — can push the popup against a viewport edge, where it gets clamped and the offset appears to have no effect (the clamped position then becomes independent of the offset value). If an `offset` seems to be ignored on one axis, make sure the chosen `anchor`/`self` lets the popup expand into free space on that axis — for example, attach QTooltip to an inline / `inline-block` trigger rather than to a full-width block element.
:::

<TooltipPositioning />
