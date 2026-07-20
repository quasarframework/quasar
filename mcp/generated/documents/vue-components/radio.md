---
title: Radio
description: The QRadio Vue component is a basic element for user input. It can be used to supply a way for the user to pick an option from multiple choices.
canonical: https://quasar.dev/vue-components/radio
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QRadio](../../api/QRadio.md)

The QRadio component is another basic element for user input. You can use this to supply a way for the user to pick an option from multiple choices.

::: tip
Please also refer to the [QOptionGroup](/vue-components/option-group) on other possibilities for creating groups of Radios.
:::

**API reference:** [QRadio](../../api/QRadio.md)

## Usage

### Standard

**Example: Standard**

Source: [Standard.vue](../../examples/QRadio/Standard.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-radio v-model="shape" val="line" label="Line" />
      <q-radio v-model="shape" val="rectangle" label="Rectangle" />
      <q-radio v-model="shape" val="ellipse" label="Ellipse" />
      <q-radio v-model="shape" val="polygon" label="Polygon" />
    </div>

    <div class="q-px-sm">
      Your selection is: <strong>{{ shape }}</strong>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const shape = ref('line')
</script>
````

### With custom icons <q-badge label="v2.5+" />

**Example: With icons**

Source: [WithIcons.vue](../../examples/QRadio/WithIcons.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-radio
        v-model="shape"
        checked-icon="task_alt"
        unchecked-icon="panorama_fish_eye"
        val="line"
        label="Line"
      />
      <q-radio
        v-model="shape"
        checked-icon="task_alt"
        unchecked-icon="panorama_fish_eye"
        val="rectangle"
        label="Rectangle"
      />
      <q-radio
        v-model="shape"
        checked-icon="task_alt"
        unchecked-icon="panorama_fish_eye"
        val="ellipse"
        label="Ellipse"
      />
      <q-radio
        v-model="shape"
        checked-icon="task_alt"
        unchecked-icon="panorama_fish_eye"
        val="polygon"
        label="Polygon"
      />
    </div>

    <div class="q-px-sm">
      Your selection is: <strong>{{ shape }}</strong>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const shape = ref('line')
</script>
````

### Dense

**Example: Dense**

Source: [Dense.vue](../../examples/QRadio/Dense.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <div class="q-gutter-sm">
      <q-radio dense v-model="shape" val="line" label="Line" />
      <q-radio dense v-model="shape" val="rectangle" label="Rectangle" />
      <q-radio dense v-model="shape" val="ellipse" label="Ellipse" />
      <q-radio dense v-model="shape" val="polygon" label="Polygon" />
    </div>

    <div class="q-px-sm q-pt-sm">
      Your selection is: <strong>{{ shape }}</strong>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const shape = ref('line')
</script>
````

### Coloring

In the second row in the example below, the property `keep-color` is being used to retain the passed in color when the radio button is not in a toggled state.

**Example: Coloring**

Source: [Coloring.vue](../../examples/QRadio/Coloring.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-radio v-model="color" val="teal" label="Teal" color="teal" />
      <q-radio v-model="color" val="orange" label="Orange" color="orange" />
      <q-radio v-model="color" val="red" label="Red" color="red" />
      <q-radio v-model="color" val="cyan" label="Cyan" color="cyan" />
    </div>
    <div class="q-gutter-sm">
      <q-radio
        keep-color
        v-model="color"
        val="teal"
        label="Teal"
        color="teal"
      />
      <q-radio
        keep-color
        v-model="color"
        val="orange"
        label="Orange"
        color="orange"
      />
      <q-radio keep-color v-model="color" val="red" label="Red" color="red" />
      <q-radio
        keep-color
        v-model="color"
        val="cyan"
        label="Cyan"
        color="cyan"
      />
    </div>
    <div class="q-px-sm q-mt-sm">
      Your selection is: <strong>{{ color }}</strong>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const color = ref('cyan')
</script>
````

### Force dark mode

**Example: Force dark mode**

Source: [OnDarkBackground.vue](../../examples/QRadio/OnDarkBackground.vue)

````vue
<template>
  <div class="q-pa-md bg-grey-9 text-white">
    <div class="q-gutter-sm">
      <q-radio dark v-model="shape" val="line" label="Line" />
      <q-radio dark v-model="shape" val="rectangle" label="Rectangle" />
      <q-radio dark v-model="shape" val="ellipse" label="Ellipse" />
      <q-radio dark v-model="shape" val="polygon" label="Polygon" />
    </div>
    <div class="q-px-sm">
      Your selection is: <strong>{{ shape }}</strong>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const shape = ref('line')
</script>
````

### Disable

**Example: Disable**

Source: [Disable.vue](../../examples/QRadio/Disable.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-radio disable v-model="shape" val="line" label="Line" />
      <q-radio disable v-model="shape" val="rectangle" label="Rectangle" />
      <q-radio disable v-model="shape" val="ellipse" label="Ellipse" />
      <q-radio disable v-model="shape" val="polygon" label="Polygon" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const shape = ref('line')
</script>
````

### Label on left-side

**Example: Label on left side**

Source: [LabelPosition.vue](../../examples/QRadio/LabelPosition.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-radio left-label v-model="shape" val="line" label="Line" />
      <q-radio left-label v-model="shape" val="rectangle" label="Rectangle" />
      <q-radio left-label v-model="shape" val="ellipse" label="Ellipse" />
      <q-radio left-label v-model="shape" val="polygon" label="Polygon" />
    </div>
    <div class="q-gutter-sm">
      <q-radio left-label v-model="shape" dense val="line" label="Line" />
      <q-radio
        left-label
        v-model="shape"
        dense
        val="rectangle"
        label="Rectangle"
      />
      <q-radio left-label v-model="shape" dense val="ellipse" label="Ellipse" />
      <q-radio left-label v-model="shape" dense val="polygon" label="Polygon" />
    </div>
    <div class="q-mt-md">
      Your selection is: <strong>{{ shape }}</strong>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const shape = ref('line')
</script>
````

### Sizes

Apart from the standard sizes below, you can define your own through the `size` property (last one is a custom size).

**Example: Standard sizes**

Source: [StandardSizes.vue](../../examples/QRadio/StandardSizes.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-radio size="xs" v-model="shape" val="xs" label="Size 'xs'" />
      <q-radio size="sm" v-model="shape" val="sm" label="Size 'sm'" />
      <q-radio size="md" v-model="shape" val="md" label="Size 'md'" />
      <q-radio size="lg" v-model="shape" val="lg" label="Size 'lg'" />
      <q-radio size="xl" v-model="shape" val="xl" label="Size 'xl'" />

      <!-- custom size -->
      <q-radio size="150px" v-model="shape" val="150px" label="Size '150px'" />
    </div>

    <div class="q-px-sm">
      Your selection is: <strong>{{ shape }}</strong>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const shape = ref('line')
</script>
````

### With QOptionGroup

::: tip
You can also use [QOptionGroup](/vue-components/option-group), which simplifies the usage when you have groups of radios, like in example below.
:::

**Example: Usage with QOptionGroup**

Source: [OptionGroup.vue](../../examples/QRadio/OptionGroup.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-option-group :options="options" type="radio" v-model="group" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const group = ref(null)
const options = [
  { label: 'Battery too low', value: 'bat' },
  { label: 'Friend request', value: 'friend', color: 'green' },
  { label: 'Picture uploaded', value: 'upload', color: 'red' }
]
</script>
````

### With QItem

In the example below, we are rendering a `<label>` tag (notice `tag="label"`) so the QRadio will respond to clicks on QItems to change toggle state.

**Example: With QItem**

Source: [InaList.vue](../../examples/QRadio/InaList.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-list>
      <!--
        Rendering a <label> tag (notice tag="label")
        so QRadios will respond to clicks on QItems to
        change Toggle state.
      -->

      <q-item tag="label" v-ripple>
        <q-item-section avatar>
          <q-radio v-model="color" val="teal" color="teal" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Teal</q-item-label>
        </q-item-section>
      </q-item>

      <q-item tag="label" v-ripple>
        <q-item-section avatar>
          <q-radio v-model="color" val="orange" color="orange" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Orange</q-item-label>
          <q-item-label caption>With description </q-item-label>
        </q-item-section>
      </q-item>

      <q-item tag="label" v-ripple>
        <q-item-section avatar top>
          <q-radio v-model="color" val="cyan" color="cyan" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Cyan</q-item-label>
          <q-item-label caption
            >Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.</q-item-label
          >
        </q-item-section>
      </q-item>
    </q-list>

    <div class="q-px-sm q-mt-sm">
      Your selection is: <strong>{{ color }}</strong>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const color = ref('cyan')
</script>
````

### Native form submit

When dealing with a native form which has an `action` and a `method` (eg. when using Quasar with ASP.NET controllers), you need to specify the `name` property on QRadio, otherwise formData will not contain it (if it should) - all value are converted to string (native behaviour, so do not use Object values):

**Example: Native form**

Source: [NativeForm.vue](../../examples/QRadio/NativeForm.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-radio name="shape" v-model="shape" val="line" label="Line" />
      <q-radio name="shape" v-model="shape" val="rectangle" label="Rectangle" />
      <q-radio name="shape" v-model="shape" val="ellipse" label="Ellipse" />
      <q-radio name="shape" v-model="shape" val="polygon" label="Polygon" />

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

const shape = ref('line')
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
