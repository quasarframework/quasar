---
title: Toggle
description: The QToggle component is a basic element for user input. You can use it for turning settings, features or true/false inputs on and off.
canonical: https://quasar.dev/vue-components/toggle
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QToggle](../../api/QToggle.md)

The QToggle component is another basic element for user input. You can use this for turning settings, features or true/false inputs on and off.

::: tip
Please also refer to the [QOptionGroup](/vue-components/option-group) on other possibilities for creating groups of Checkboxes.
:::

**API reference:** [QToggle](../../api/QToggle.md)

## Usage

### Basic

Use the `color` prop to control the toggle’s color.

**Example: Basic**

Source: [Standard.vue](../../examples/QToggle/Standard.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-toggle v-model="value" />

    <q-toggle v-model="value" color="green" />

    <q-toggle v-model="value" color="yellow" />

    <q-toggle v-model="value" color="red" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref(true)
</script>
````

### With labels

**Example: With labels**

Source: [Labels.vue](../../examples/QToggle/Labels.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-lg">
    <div>
      <q-toggle v-model="value" label="On Right" />

      <q-toggle v-model="value" color="green" label="On Right" />

      <q-toggle v-model="value" color="yellow" label="On Right" />

      <q-toggle v-model="value" color="red" label="On Right" />
    </div>

    <div>
      <q-toggle v-model="value" label="On Left" left-label />

      <q-toggle v-model="value" color="green" label="On Left" left-label />

      <q-toggle v-model="value" color="yellow" label="On Left" left-label />

      <q-toggle v-model="value" color="red" label="On Left" left-label />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref(true)
</script>
````

### Keeping color

**Example: Keep color**

Source: [KeepColor.vue](../../examples/QToggle/KeepColor.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-toggle v-model="value" color="primary" keep-color />

    <q-toggle v-model="value" color="green" keep-color />

    <q-toggle v-model="value" color="orange" keep-color />

    <q-toggle v-model="value" color="red" keep-color readonly />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref(false)
</script>
````

### With icons

**Example: Icons**

Source: [Icons.vue](../../examples/QToggle/Icons.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <div>
      <q-toggle v-model="first" icon="alarm" />
      <q-toggle
        v-model="second"
        color="pink"
        icon="mail"
        label="Same Icon for each state"
      />
    </div>

    <div>
      <q-toggle
        v-model="third"
        checked-icon="check"
        color="green"
        unchecked-icon="clear"
      />
      <q-toggle
        v-model="fourth"
        checked-icon="check"
        color="red"
        label="Different icon for each state"
        unchecked-icon="clear"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const first = ref(true)
const second = ref(true)
const third = ref(false)
const fourth = ref(true)
</script>
````

### Custom model values

Instead of the default `true` / `false` values, you can use custom ones.

**Example: Custom model values**

Source: [CustomValues.vue](../../examples/QToggle/CustomValues.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-y-sm column">
    <q-toggle
      :label="`Model is ${blueModel} (default behaviour)`"
      v-model="blueModel"
    />

    <q-toggle
      :label="pinkModel"
      color="pink"
      false-value="Disagreed"
      true-value="Agreed"
      v-model="pinkModel"
    />

    <q-toggle
      :false-value="13"
      :label="`Model is number ${greenModel}`"
      :true-value="42"
      color="green"
      v-model="greenModel"
    />

    <q-toggle
      :false-value="true"
      :label="`Model is ${redModel} (flipped boolean)`"
      :true-value="false"
      color="red"
      v-model="redModel"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const blueModel = ref(true)
const pinkModel = ref('Agreed')
const greenModel = ref(42)
const redModel = ref(true)
</script>
````

### Indeterminate state

In the example below, as soon as you click on the first QToggle it starts toggling between true/false. The second QToggle, on the other hand toggles between the three states (indeterminate/true/false) with help from `toggle-indeterminate`. You can optionally set the property `indeterminate-value`, otherwise the indeterminate value will be considered `null`.

**Example: Indeterminate state**

Source: [IndeterminateState.vue](../../examples/QToggle/IndeterminateState.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-toggle
        indeterminate-value="maybe"
        v-model="theModel2"
        label="Did you eat lunch today?"
      />
    </div>

    <div class="q-px-sm">
      The model data: <strong>{{ JSON.stringify(theModel2) }}</strong>
    </div>

    <div class="q-gutter-sm">
      <q-toggle
        toggle-indeterminate
        v-model="theModel"
        label="Did you eat lunch today?"
      />
    </div>

    <div class="q-px-sm row no-wrap items-center">
      <div class="col">
        The model data: <strong>{{ JSON.stringify(theModel) }}</strong>
      </div>
      <q-btn color="primary" label="Reset" @click="reset" class="q-ml-md" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const theModel = ref(null)
const theModel2 = ref('maybe')

function reset() {
  theModel.value = null
  theModel2.value = 'maybe'
}
</script>
````

### Toggle order

By default, QToggle follows this chain when toggling: indeterminate -> checked -> unchecked. However, you can change this behavior through the `toggle-order` prop. This property determines the order of the states and can be `tf` (default) or `ft` (`t` stands for state of true/checked while `f` for state of false/unchecked).

Toggling order is:

- if `toggle-indeterminate` is true, then: indet -> first state -> second state -> indet (and repeat)
- otherwise (no toggle-indeterminate): indet -> first state -> second state -> first state -> second state -> ...

**Example: Toggle order**

Source: [ToggleOrder.vue](../../examples/QToggle/ToggleOrder.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn
      class="q-mb-md"
      color="primary"
      label="Reset models"
      @click="resetModels"
    />

    <div class="q-gutter-sm">
      <q-toggle v-model="teal" label="'tf' order" color="teal" />
      <q-toggle
        toggle-order="ft"
        v-model="orange"
        label="'ft' order"
        color="orange"
      />
      <q-toggle
        toggle-indeterminate
        v-model="red"
        label="'tf' order + toggle-indeterminate"
        color="red"
      />
      <q-toggle
        toggle-indeterminate
        toggle-order="ft"
        v-model="cyan"
        label="'ft' order + toggle-indeterminate"
        color="cyan"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const teal = ref(null)
const orange = ref(null)
const red = ref(true)
const cyan = ref(false)

function resetModels() {
  teal.value = null
  orange.value = null
  red.value = true
  cyan.value = false
}
</script>
````

### Array model

If you have a number of toggles for a selection, use can use an Array as the model for all of them and specify `val` prop on each toggle. If the toggle is ticked, its `val` will be inserted into the array and vice versa.

**Example: Array model**

Source: [ArrayValue.vue](../../examples/QToggle/ArrayValue.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-toggle color="blue" label="Blue" v-model="selection" val="blue" />
    <q-toggle color="yellow" label="Yellow" v-model="selection" val="yellow" />
    <q-toggle color="green" label="Green" v-model="selection" val="green" />
    <q-toggle color="red" label="Red" v-model="selection" val="red" />
    <div> Model: {{ selection }} </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selection = ref(['yellow', 'red'])
</script>
````

### Dark design

**Example: Force dark mode**

Source: [DarkBackground.vue](../../examples/QToggle/DarkBackground.vue)

````vue
<template>
  <div class="q-pa-md bg-grey-9 text-white">
    <q-toggle color="blue" dark v-model="blue" />

    <q-toggle color="green" dark v-model="green" />

    <q-toggle color="yellow" dark v-model="yellow" />

    <q-toggle color="red" dark v-model="red" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const blue = ref(false)
const green = ref(true)
const yellow = ref(true)
const red = ref(false)
</script>
````

### Disable

**Example: Disabled state**

Source: [Disabled.vue](../../examples/QToggle/Disabled.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-toggle v-model="value" color="primary" disable />

    <q-toggle v-model="value" color="green" disable />

    <q-toggle v-model="value" color="yellow" disable />

    <q-toggle v-model="value" color="red" disable />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref(true)
</script>
````

### Sizes

Apart from the standard sizes below, you can define your own through the `size` property (last one is a custom size).

**Example: Standard sizes**

Source: [StandardSizes.vue](../../examples/QToggle/StandardSizes.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-toggle size="xs" v-model="shape" val="xs" label="Size 'xs'" />
      <q-toggle size="sm" v-model="shape" val="sm" label="Size 'sm'" />
      <q-toggle size="md" v-model="shape" val="md" label="Size 'md'" />
      <q-toggle size="lg" v-model="shape" val="lg" label="Size 'lg'" />
      <q-toggle size="xl" v-model="shape" val="xl" label="Size 'xl'" />

      <!-- custom size -->
      <q-toggle size="150px" v-model="shape" val="150px" label="Size '150px'" />
    </div>

    <div class="q-px-sm">
      Your selection is: <strong>{{ shape }}</strong>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const shape = ref(['line'])
</script>
````

### With QOptionGroup

::: tip
You can also use [QOptionGroup](/vue-components/option-group), which simplifies the usage when you have groups of toggles, like in example below.
:::

**Example: Usage with QOptionGroup**

Source: [OptionGroup.vue](../../examples/QToggle/OptionGroup.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-option-group :options="options" type="toggle" v-model="group" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const group = ref([])
const options = [
  { label: 'Battery too low', value: 'bat' },
  { label: 'Friend request', value: 'friend', color: 'green' },
  { label: 'Picture uploaded', value: 'upload', color: 'red' }
]
</script>
````

### With QItem

**Example: With QItem**

Source: [List.vue](../../examples/QToggle/List.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-list>
      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Battery too low</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-toggle color="blue" v-model="notifications" val="battery" />
        </q-item-section>
      </q-item>

      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Friend request</q-item-label>
          <q-item-label caption>Allow notification</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-toggle color="green" v-model="notifications" val="friend" />
        </q-item-section>
      </q-item>

      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Picture uploaded</q-item-label>
          <q-item-label caption
            >Allow notification when uploading images</q-item-label
          >
        </q-item-section>
        <q-item-section avatar>
          <q-toggle color="red" v-model="notifications" val="picture" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const notifications = ref(['friend'])
</script>
````

### Native form submit

When dealing with a native form which has an `action` and a `method` (eg. when using Quasar with ASP.NET controllers), you need to specify the `name` property on QToggle, otherwise formData will not contain it (if it should) - all value are converted to string (native behaviour, so do not use Object values):

**Example: Native form**

Source: [NativeForm.vue](../../examples/QToggle/NativeForm.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <div
        class="q-pa-sm rounded-borders"
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'"
      >
        <q-toggle
          name="music_active"
          v-model="activateMusic"
          label="Activate music"
        />

        <q-toggle
          name="light_active"
          v-model="activateLights"
          label="Activate lights"
          true-value="YES"
        />
      </div>

      <div
        class="q-pa-sm rounded-borders"
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'"
      >
        <q-toggle
          name="music_genre"
          v-model="genreRock"
          true-value="rock"
          label="Rock"
        />

        <q-toggle
          name="music_genre"
          v-model="genreFunk"
          true-value="funk"
          label="Funk"
        />

        <q-toggle
          name="music_genre"
          v-model="genrePop"
          true-value="pop"
          label="Pop"
        />
      </div>

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
      </div>
    </q-form>

    <q-card
      v-if="submitted"
      flat
      bordered
      class="q-mt-md"
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'"
    >
      <template v-if="submitEmpty">
        <q-card-section>
          Submitted form contains empty formData.
        </q-card-section>
      </template>
      <template v-else>
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
      </template>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const submitted = ref(false)
const submitEmpty = ref(false)
const submitResult = ref([])

const activateMusic = ref(false)
const activateLights = ref(null)

const genreRock = ref('rock')
const genreFunk = ref(false)
const genrePop = ref('pop')

function onSubmit(evt) {
  const formData = new FormData(evt.target)
  const data = []

  for (const [name, value] of formData.entries()) {
    data.push({
      name,
      value
    })
  }

  submitted.value = true
  submitResult.value = data
  submitEmpty.value = data.length === 0
}
</script>
````
