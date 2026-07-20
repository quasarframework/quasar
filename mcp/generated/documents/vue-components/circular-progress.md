---
title: Circular Progress
description: The QCircularProgress Vue component displays a colored circular loading indicator. The bar can either have a determinate progress, or an indeterminate animation.
canonical: https://quasar.dev/vue-components/circular-progress
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QCircularProgress](../../api/QCircularProgress.md)

The QCircularProgress component displays a colored circular progress. The bar can either have a determinate progress, or an indeterminate animation. It should be used to inform the user that an action is occurring in the background.

**API reference:** [QCircularProgress](../../api/QCircularProgress.md)

## Usage

By default, QCircularProgress inherits current text color (as arc progress color and inner label color) and current font size (as component size). For customization, you can use the size and color related props.

**Example: Determined state**

Source: [Determined.vue](../../examples/QCircularProgress/Determined.vue)

````vue
<template>
  <div class="q-pa-md flex flex-center">
    <q-circular-progress
      :value="value"
      size="50px"
      color="orange"
      class="q-ma-md"
    />

    <q-circular-progress
      :value="value"
      size="90px"
      :thickness="0.2"
      color="orange"
      center-color="grey-8"
      track-color="transparent"
      class="q-ma-md"
    />

    <q-circular-progress
      :value="value"
      size="45px"
      :thickness="1"
      color="grey-8"
      track-color="orange"
      class="q-ma-md"
    />

    <q-circular-progress
      :value="value"
      size="50px"
      :thickness="0.22"
      color="orange"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-circular-progress
      :value="value"
      size="75px"
      :thickness="0.6"
      color="orange"
      center-color="grey-8"
      class="q-ma-md"
    />

    <q-circular-progress
      :value="value"
      size="40px"
      :thickness="0.4"
      color="orange"
      track-color="grey-3"
      center-color="grey-8"
      class="q-ma-md"
    />
  </div>
</template>

<script setup>
const value = 71
</script>
````

**Example: Determinate and reverse**

Source: [Reverse.vue](../../examples/QCircularProgress/Reverse.vue)

````vue
<template>
  <div class="q-pa-md flex flex-center">
    <q-circular-progress
      reverse
      :value="value"
      size="50px"
      color="light-blue"
      class="q-ma-md"
    />

    <q-circular-progress
      reverse
      :value="value"
      size="90px"
      :thickness="0.2"
      color="light-blue"
      center-color="grey-9"
      track-color="transparent"
      class="q-ma-md"
    />

    <q-circular-progress
      reverse
      :value="value"
      size="45px"
      :thickness="1"
      color="grey-9"
      track-color="light-blue"
      class="q-ma-md"
    />

    <q-circular-progress
      reverse
      :value="value"
      size="50px"
      :thickness="0.22"
      color="light-blue"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-circular-progress
      reverse
      :value="value"
      size="75px"
      :thickness="0.6"
      font-size="50px"
      color="light-blue"
      center-color="grey-9"
      class="q-ma-md"
    />

    <q-circular-progress
      reverse
      :value="value"
      size="40px"
      :thickness="0.4"
      color="light-blue"
      track-color="grey-3"
      center-color="grey-9"
      class="q-ma-md"
    />
  </div>
</template>

<script setup>
const value = 71
</script>
````

**Example: Offset angle**

Source: [Angle.vue](../../examples/QCircularProgress/Angle.vue)

````vue
<template>
  <div class="q-pa-md flex flex-center">
    <q-circular-progress
      :value="value"
      size="50px"
      :thickness="0.22"
      color="purple"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-circular-progress
      :angle="90"
      :value="value"
      size="50px"
      :thickness="0.22"
      color="purple"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-circular-progress
      :angle="180"
      :value="value"
      size="50px"
      :thickness="0.22"
      color="purple"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-circular-progress
      :angle="270"
      :value="value"
      size="50px"
      :thickness="0.22"
      color="purple"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-circular-progress
      :angle="52"
      :value="value"
      size="50px"
      :thickness="0.22"
      color="purple"
      track-color="grey-3"
      class="q-ma-md"
    />
  </div>
</template>

<script setup>
const value = 61
</script>
````

**Example: Custom min/max (same model)**

Source: [CustomMinMax.vue](../../examples/QCircularProgress/CustomMinMax.vue)

````vue
<template>
  <div class="q-pa-md flex flex-center">
    <q-circular-progress
      :min="40"
      :max="70"
      :value="value"
      size="50px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-circular-progress
      :min="55"
      :max="90"
      :value="value"
      size="50px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-circular-progress
      :min="40"
      :max="110"
      :value="value"
      size="50px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-circular-progress
      :min="20"
      :max="70"
      :value="value"
      size="50px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-circular-progress
      :value="value"
      size="50px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="q-ma-md"
    />
  </div>
</template>

<script setup>
const value = 61
</script>
````

In the example below, `show-value` property also enables the default slot, so you can fill it with custom content, like even a QAvatar or a QTooltip. The `font-size` prop refers to the inner label font size.

**Example: Show value**

Source: [ShowValue.vue](../../examples/QCircularProgress/ShowValue.vue)

````vue
<template>
  <div class="q-pa-md flex flex-center">
    <q-circular-progress
      show-value
      class="text-light-blue q-ma-md"
      :value="value"
      size="50px"
      color="light-blue"
    />

    <q-circular-progress
      show-value
      class="text-white q-ma-md"
      :value="value"
      size="90px"
      :thickness="0.2"
      color="orange"
      center-color="grey-8"
      track-color="transparent"
    >
      <q-icon name="volume_up" />
    </q-circular-progress>

    <q-circular-progress
      show-value
      font-size="12px"
      :value="value"
      size="50px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="q-ma-md"
    >
      {{ value }}%
    </q-circular-progress>

    <q-circular-progress
      show-value
      font-size="16px"
      class="text-red q-ma-md"
      :value="value"
      size="60px"
      :thickness="0.05"
      color="red"
      track-color="grey-3"
    >
      <q-icon name="volume_up" class="q-mr-xs" />
      {{ value }}
    </q-circular-progress>

    <q-circular-progress
      show-value
      font-size="10px"
      class="q-ma-md"
      :value="value"
      size="80px"
      :thickness="0.25"
      color="primary"
      track-color="grey-3"
    >
      <q-avatar size="60px">
        <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
      </q-avatar>
    </q-circular-progress>
  </div>
</template>

<script setup>
const value = 81
</script>
````

**Example: Indeterminate state**

Source: [Indeterminate.vue](../../examples/QCircularProgress/Indeterminate.vue)

````vue
<template>
  <div class="q-pa-md flex flex-center">
    <q-circular-progress
      indeterminate
      rounded
      size="50px"
      color="lime"
      class="q-ma-md"
    />

    <q-circular-progress
      indeterminate
      size="90px"
      :thickness="0.2"
      color="lime"
      center-color="grey-8"
      track-color="transparent"
      class="q-ma-md"
    />

    <q-circular-progress
      indeterminate
      size="45px"
      :thickness="1"
      color="grey-8"
      track-color="lime"
      class="q-ma-md"
    />

    <q-circular-progress
      indeterminate
      size="50px"
      :thickness="0.22"
      rounded
      color="lime"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-circular-progress
      indeterminate
      size="75px"
      :thickness="0.6"
      color="lime"
      center-color="grey-8"
      class="q-ma-md"
    />

    <q-circular-progress
      indeterminate
      size="40px"
      :thickness="0.4"
      font-size="50px"
      color="lime"
      track-color="grey-3"
      center-color="grey-8"
      class="q-ma-md"
    />
  </div>
</template>
````

**Example: Rounded arc of progress (v2.8.4+)**

Source: [RoundedStyle.vue](../../examples/QCircularProgress/RoundedStyle.vue)

````vue
<template>
  <div class="q-pa-md flex flex-center">
    <q-circular-progress
      rounded
      :value="value"
      size="50px"
      color="orange"
      class="q-ma-md"
    />

    <q-circular-progress
      rounded
      :value="value"
      size="90px"
      :thickness="0.2"
      color="orange"
      center-color="grey-8"
      track-color="transparent"
      class="q-ma-md"
    />

    <q-circular-progress
      rounded
      :value="value"
      size="50px"
      :thickness="0.22"
      color="orange"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-circular-progress
      rounded
      :value="value"
      size="40px"
      :thickness="0.4"
      color="orange"
      track-color="grey-3"
      center-color="grey-8"
      class="q-ma-md"
    />
  </div>
</template>

<script setup>
const value = 61
</script>
````

**Example: Standard sizes**

Source: [StandardSizes.vue](../../examples/QCircularProgress/StandardSizes.vue)

````vue
<template>
  <div class="q-pa-md flex flex-center">
    <q-circular-progress
      v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']"
      :key="size"
      :size="size"
      :value="value"
      color="orange"
      class="q-ma-md"
    />
  </div>
</template>

<script setup>
const value = 71
</script>
````
