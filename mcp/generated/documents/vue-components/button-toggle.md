---
title: Button Toggle
description: The QBtnToggle Vue component is a basic element for user input, similar to QRadio but with buttons.
canonical: https://quasar.dev/vue-components/button-toggle
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QBtnToggle](../../api/QBtnToggle.md)

The QBtnToggle component is another basic element for user input, similar to QRadio but with buttons. You can use this to supply a way for the user to pick an option from multiple choices.

**API reference:** [QBtnToggle](../../api/QBtnToggle.md)

## Usage

### Basic

**Example: Basic**

Source: [Basic.vue](../../examples/QBtnToggle/Basic.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn-toggle
      v-model="model"
      toggle-color="primary"
      :options="[
        { label: 'One', value: 'one' },
        { label: 'Two', value: 'two' },
        { label: 'Three', value: 'three' }
      ]"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
</script>
````

### Design

::: tip
Since QBtnToggle uses QBtn, you can use design related props of QBtn to style this component.
:::

**Example: Some design examples**

Source: [Design.vue](../../examples/QBtnToggle/Design.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-md">
    <div>
      <q-btn-toggle
        v-model="model"
        push
        glossy
        toggle-color="primary"
        :options="[
          { label: 'One', value: 'one' },
          { label: 'Two', value: 'two' },
          { label: 'Three', value: 'three' }
        ]"
      />
    </div>

    <div>
      <q-btn-toggle
        v-model="model"
        toggle-color="primary"
        flat
        :options="[
          { label: 'One', value: 'one' },
          { label: 'Two', value: 'two' },
          { label: 'Three', value: 'three' }
        ]"
      />
    </div>

    <div>
      <q-btn-toggle
        v-model="model"
        color="brown"
        text-color="white"
        toggle-color="orange"
        toggle-text-color="black"
        rounded
        unelevated
        glossy
        :options="[
          { label: 'One', value: 'one' },
          { label: 'Two', value: 'two' },
          { label: 'Three', value: 'three' },
          { label: 'Four', value: 'four' }
        ]"
      />
    </div>

    <div>
      <q-btn-toggle
        v-model="model"
        class="my-custom-toggle"
        no-caps
        rounded
        unelevated
        toggle-color="primary"
        color="white"
        text-color="primary"
        :options="[
          { label: 'Option 1', value: 'one' },
          { label: 'Option 2', value: 'two' }
        ]"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref('one')
</script>

<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
````

**Example: Spread horizontally**

Source: [Spread.vue](../../examples/QBtnToggle/Spread.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <q-btn-toggle
        v-model="model"
        spread
        no-caps
        toggle-color="purple"
        color="white"
        text-color="black"
        :options="[
          { label: 'Option 1', value: 'one' },
          { label: 'Option 2', value: 'two' }
        ]"
      />

      <q-btn-toggle
        v-model="secondModel"
        spread
        class="my-custom-toggle"
        no-caps
        rounded
        unelevated
        toggle-color="primary"
        color="white"
        text-color="primary"
        :options="[
          { label: 'Option 1', value: 'one' },
          { label: 'Option 2', value: 'two' }
        ]"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref('one')
const secondModel = ref('one')
</script>

<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
````

### Custom content

First QBtnToggle below has tooltips on each button. Second QBtnToggle has customized the content. Notice the `slot` prop in the `options` Object definition. When you use this `slot` prop, you don't necessary need the `label` / `icon` props in `options`.

**Example: Custom buttons content**

Source: [CustomContent.vue](../../examples/QBtnToggle/CustomContent.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-btn-toggle
        v-model="model"
        push
        glossy
        toggle-color="teal"
        :options="[
          { label: 'One', value: 'one', slot: 'one' },
          { label: 'Two', value: 'two', slot: 'two' },
          { label: 'Three', value: 'three', slot: 'three' }
        ]"
      >
        <template v-slot:one>
          <q-tooltip>One!</q-tooltip>
        </template>

        <template v-slot:two>
          <q-tooltip>Two!</q-tooltip>
        </template>

        <template v-slot:three>
          <q-tooltip>Three!</q-tooltip>
        </template>
      </q-btn-toggle>

      <q-btn-toggle
        v-model="model"
        push
        rounded
        glossy
        toggle-color="purple"
        :options="[
          { value: 'one', slot: 'one' },
          { value: 'two', slot: 'two' },
          { value: 'three', slot: 'three' }
        ]"
      >
        <template v-slot:one>
          <div class="row items-center no-wrap">
            <div class="text-center"> Pick<br />boat </div>
            <q-icon right name="directions_boat" />
          </div>
        </template>

        <template v-slot:two>
          <div class="row items-center no-wrap">
            <div class="text-center"> Pick<br />car </div>
            <q-icon right name="directions_car" />
          </div>
        </template>

        <template v-slot:three>
          <div class="row items-center no-wrap">
            <div class="text-center"> Pick<br />railway </div>
            <q-icon right name="directions_railway" />
          </div>
        </template>
      </q-btn-toggle>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref('three')
</script>
````

### Disable and readonly

You can either disable a QBtnToggle by providing a `disable` attribute, or disable an individual button by providing the property `disable: true` to its entry, in the options.

**Example: Disable and readonly**

Source: [DisableReadonly.vue](../../examples/QBtnToggle/DisableReadonly.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn-toggle
      disable
      v-model="model"
      toggle-color="primary"
      push
      glossy
      :options="[
        { label: 'One', value: 'one' },
        { label: 'Two', value: 'two' },
        { label: 'Three', value: 'three' }
      ]"
    />

    <q-btn-toggle
      readonly
      v-model="model"
      toggle-color="primary"
      push
      glossy
      class="q-ml-md"
      :options="[
        { label: 'One', value: 'one' },
        { label: 'Two', value: 'two' },
        { label: 'Three', value: 'three' }
      ]"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref('two')
</script>
````

### Native form submit

When dealing with a native form which has an `action` and a `method` (eg. when using Quasar with ASP.NET controllers), you need to specify the `name` property on QBtnToggle, otherwise formData will not contain it (if it should) - all value are converted to string (native behaviour, so do not use Object values):

**Example: Native form**

Source: [NativeForm.vue](../../examples/QBtnToggle/NativeForm.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-btn-toggle
        name="genre"
        v-model="genre"
        push
        glossy
        toggle-color="teal"
        :options="[
          { label: 'Rock', value: 'rock' },
          { label: 'Funk', value: 'funk' },
          { label: 'Pop', value: 'pop' }
        ]"
      />

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

const genre = ref(null)
const submitted = ref(false)
const submitEmpty = ref(false)
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
  submitEmpty.value = data.length === 0
  submitted.value = true
}
</script>
````
