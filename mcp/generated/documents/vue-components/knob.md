---
title: Knob
description: The QKnob Vue component is used to take a number input through mouse or touch panning.
canonical: https://quasar.dev/vue-components/knob
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QKnob](../../api/QKnob.md)

The QKnob component is used to take a number input from the user through mouse/touch panning. It is based on [QCircularProgress](/vue-components/circular-progress) and inherits all its properties and behavior.

**API reference:** [QKnob](../../api/QKnob.md)

## Usage

By default, QKnob inherits current text color (as arc progress color and inner label color) and current font size (as component size). For customization, you can use the size and color related props.

### Basic

**Example: Basic**

Source: [Basic.vue](../../examples/QKnob/Basic.vue)

````vue
<template>
  <div class="q-pa-md flex flex-center">
    <q-knob v-model="value" size="50px" color="orange" class="q-ma-md" />

    <q-knob
      v-model="value"
      size="90px"
      :thickness="0.2"
      color="purple-3"
      center-color="purple"
      track-color="purple-1"
      class="q-ma-md"
    />

    <q-knob
      v-model="value"
      size="45px"
      :thickness="1"
      color="grey-8"
      track-color="light-blue"
      class="q-ma-md"
    />

    <q-knob
      v-model="value"
      size="50px"
      :thickness="0.22"
      color="orange"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-knob
      v-model="value"
      size="75px"
      :thickness="0.6"
      color="orange"
      center-color="orange-10"
      class="q-ma-md"
    />

    <q-knob
      v-model="value"
      size="40px"
      :thickness="0.4"
      color="orange"
      track-color="orange-3"
      class="q-ma-md"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref(71)
</script>
````

### Show value

In the example below, `show-value` property also enables the default slot, so you can fill it with custom content, like even a QAvatar or a QTooltip. The `font-size` prop refers to the inner label font size.

If the default slot contains an image, you have to style it with class `no-pointer-events` or set the `draggable` prop to false. Otherwise browser's default image dragging behaviour overrides QKnob's one

**Example: Show value**

Source: [ShowValue.vue](../../examples/QKnob/ShowValue.vue)

````vue
<template>
  <div class="q-pa-md flex flex-center">
    <q-knob
      show-value
      class="text-light-blue q-ma-md"
      v-model="value"
      size="50px"
      color="light-blue"
    />

    <q-knob
      show-value
      class="text-white q-ma-md"
      v-model="value"
      size="90px"
      :thickness="0.2"
      color="orange"
      center-color="grey-8"
      track-color="transparent"
    >
      <q-icon name="volume_up" />
    </q-knob>

    <q-knob
      show-value
      font-size="12px"
      v-model="value"
      size="50px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="q-ma-md"
    >
      {{ value }}%
    </q-knob>

    <q-knob
      show-value
      font-size="16px"
      class="text-red q-ma-md"
      v-model="value"
      size="60px"
      :thickness="0.05"
      color="red"
      track-color="grey-3"
    >
      <q-icon name="volume_up" class="q-mr-xs" />
      {{ value }}
    </q-knob>

    <q-knob
      show-value
      font-size="10px"
      class="q-ma-md"
      v-model="value"
      size="80px"
      :thickness="0.25"
      color="primary"
      track-color="grey-3"
    >
      <q-avatar size="60px">
        <img
          draggable="false"
          src="https://cdn.quasar.dev/logo-v2/svg/logo.svg"
        />
      </q-avatar>
    </q-knob>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref(81)
</script>
````

### Min and max

**Example: Custom min/max**

Source: [MinMax.vue](../../examples/QKnob/MinMax.vue)

````vue
<template>
  <div class="q-pa-md flex flex-center">
    <q-knob
      :min="5"
      :max="10"
      v-model="value1"
      show-value
      size="50px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-knob
      :min="55"
      :max="90"
      v-model="value2"
      show-value
      size="50px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-knob
      :min="40"
      :max="110"
      v-model="value3"
      show-value
      size="50px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-knob
      :min="20"
      :max="70"
      v-model="value4"
      show-value
      size="50px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-knob
      v-model="value5"
      show-value
      size="50px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="q-ma-md"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(6)
const value2 = ref(70)
const value3 = ref(102)
const value4 = ref(35)
const value5 = ref(95)
</script>
````

### Inner min/max <q-badge label="v2.5.4+" />

Sometimes you need to restrict the model value to an interval inside of the track's length. For this purpose, use `inner-min` and `inner-max` props. First prop needs to be higher or equal to `min` prop while the latter needs to be lower or equal to the `max` prop.

**Example: Inner min/max**

Source: [InnerMinMax.vue](../../examples/QKnob/InnerMinMax.vue)

````vue
<template>
  <div class="q-pa-md flex flex-center">
    <q-knob
      :min="5"
      :max="10"
      :inner-min="6"
      v-model="value1"
      show-value
      size="50px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-knob
      :min="55"
      :max="90"
      :inner-min="70"
      :inner-max="85"
      v-model="value2"
      show-value
      size="50px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-knob
      :min="40"
      :max="110"
      :inner-min="50"
      :inner-max="100"
      v-model="value3"
      show-value
      size="50px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-knob
      :min="20"
      :max="70"
      :inner-min="30"
      :inner-max="60"
      v-model="value4"
      show-value
      size="50px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-knob
      :inner-max="75"
      v-model="value5"
      show-value
      size="50px"
      :thickness="0.22"
      color="teal"
      track-color="grey-3"
      class="q-ma-md"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(7)
const value2 = ref(70)
const value3 = ref(80)
const value4 = ref(35)
const value5 = ref(70)
</script>
````

### Custom step

**Example: Custom step**

Source: [Step.vue](../../examples/QKnob/Step.vue)

````vue
<template>
  <div class="q-pa-md flex flex-center">
    <q-knob
      :step="10"
      v-model="value"
      show-value
      size="90px"
      :thickness="0.22"
      color="lime"
      track-color="lime-3"
      class="text-lime q-ma-md"
    />

    <q-knob
      :step="25"
      v-model="value"
      show-value
      size="90px"
      :thickness="0.22"
      color="orange"
      track-color="orange-3"
      class="text-orange q-ma-md"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref(61)
</script>
````

### Offset angle

**Example: Offset angle**

Source: [Angle.vue](../../examples/QKnob/Angle.vue)

````vue
<template>
  <div class="q-pa-md flex flex-center">
    <q-knob
      v-model="value"
      size="70px"
      :thickness="0.22"
      color="purple"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-knob
      :angle="90"
      v-model="value"
      size="70px"
      :thickness="0.22"
      color="purple"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-knob
      :angle="180"
      v-model="value"
      size="70px"
      :thickness="0.22"
      color="purple"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-knob
      :angle="270"
      v-model="value"
      size="70px"
      :thickness="0.22"
      color="purple"
      track-color="grey-3"
      class="q-ma-md"
    />

    <q-knob
      :angle="52"
      v-model="value"
      size="70px"
      :thickness="0.22"
      color="purple"
      track-color="grey-3"
      class="q-ma-md"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref(61)
</script>
````

### Disable and readonly

**Example: Disable and readonly**

Source: [DisableReadonly.vue](../../examples/QKnob/DisableReadonly.vue)

````vue
<template>
  <div class="q-pa-md flex flex-center">
    <q-knob
      disable
      v-model="value"
      show-value
      size="90px"
      :thickness="0.22"
      color="primary"
      track-color="grey-3"
      class="text-primary q-ma-md"
    />

    <q-knob
      readonly
      v-model="value"
      show-value
      size="90px"
      :thickness="0.22"
      color="orange"
      track-color="orange-3"
      class="text-orange q-ma-md"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref(71)
</script>
````

### Native form submit

When dealing with a native form which has an `action` and a `method` (eg. when using Quasar with ASP.NET controllers), you need to specify the `name` property on QKnob, otherwise formData will not contain it (if it should):

**Example: Native form**

Source: [NativeForm.vue](../../examples/QKnob/NativeForm.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-knob
        name="volume"
        class="text-white q-ma-md"
        v-model="volume"
        size="90px"
        :thickness="0.2"
        color="orange"
        center-color="grey-8"
        track-color="transparent"
        show-value
      >
        <q-icon name="volume_up" />
      </q-knob>

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
      </div>
    </q-form>

    <q-card
      v-if="submitResult.length > 0"
      flat
      bordered
      class="q-mt-md"
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'"
    >
      <q-card-section
        >Submitted form contains the following formData (key =
        value):</q-card-section
      >
      <q-separator />
      <q-card-section class="row q-gutter-sm items-center">
        <div
          v-for="(item, index) in submitResult"
          :key="index"
          class="q-px-sm q-py-xs bg-grey-8 text-white rounded-borders text-center text-no-wrap"
          >{{ item.name }} = {{ item.value }}</div
        >
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const volume = ref(60)
const submitResult = ref([])

function onSubmit(evt) {
  const formData = new FormData(evt.target)
  const data = []

  for (const [name, value] of formData.entries()) {
    data.push({
      name,
      value
    })
  }

  submitResult.value = data
}
</script>
````
