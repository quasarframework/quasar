---
title: Color Picker
description: The QColorPicker Vue component provides a way for the user to input colors.
canonical: https://quasar.dev/vue-components/color-picker
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QColor](../../api/QColor.md)

The QColor component provides a method to input colors.

::: tip
For handling colors, also check out [Quasar Color Utils](/quasar-utils/color-utils).
:::

**API reference:** [QColor](../../api/QColor.md)

## Usage

### Basic

**Example: Basic**

Source: [Basic.vue](../../examples/QColor/Basic.vue)

````vue
<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-color v-model="hex" class="my-picker" />
    <q-color v-model="hexa" class="my-picker" />
    <q-color v-model="rgb" class="my-picker" />
    <q-color v-model="rgba" class="my-picker" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const hex = ref('#FF00FF')
const hexa = ref('#FF00FFCC')
const rgb = ref('rgb(0,0,0)')
const rgba = ref('rgba(255,0,255,0.8)')
</script>

<style lang="sass" scoped>
.my-picker
  max-width: 250px
</style>
````

### With QInput

**Example: Input**

Source: [Input.vue](../../examples/QColor/Input.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-input filled v-model="color" class="my-input">
        <template v-slot:append>
          <q-icon name="colorize" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-color v-model="color" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <q-input
        filled
        v-model="secondColor"
        :rules="['anyColor']"
        hint="With validation"
        class="my-input"
      >
        <template v-slot:append>
          <q-icon name="colorize" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-color v-model="secondColor" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const color = ref('#FF00FF')
const secondColor = ref('#027be3')
</script>

<style lang="sass" scoped>
.my-input
  max-width: 250px
</style>
````

There are **helpers** for QInput `rules` prop: [full list](https://github.com/quasarframework/quasar/blob/dev/ui/src/utils/patterns/patterns.js). You can use these for convenience or write the string specifying your [custom needs](/vue-components/input#internal-validation).

Examples: "hexColor", "rgbOrRgbaColor", "anyColor".

More info: [QInput](/vue-components/input).

### No header or footer

You can choose if you don't want to render the header and/or footer, like in example below:

**Example: No header/footer**

Source: [NoHeaderFooter.vue](../../examples/QColor/NoHeaderFooter.vue)

````vue
<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-color v-model="hex" no-header class="my-picker" />
    <q-color v-model="hex" no-header-tabs class="my-picker" />
    <q-color v-model="hex" no-footer class="my-picker" />
    <q-color v-model="hex" no-header no-footer class="my-picker" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const hex = ref('#FF00FF')
</script>

<style lang="sass" scoped>
.my-picker
  width: 250px
</style>
````

### Custom default view

You can also pick the default view, like in example below, where we also specify we don't want to render the header and footer. The end result generates a nice color palette that the user can pick from:

**Example: Custom default view**

Source: [CustomDefaultView.vue](../../examples/QColor/CustomDefaultView.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-badge color="grey-3" text-color="black" class="q-mb-sm">
      {{ hex }}
    </q-badge>

    <q-color
      v-model="hex"
      no-header
      no-footer
      default-view="palette"
      class="my-picker"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const hex = ref('#FF00FF')
</script>

<style lang="sass" scoped>
.my-picker
  max-width: 250px
</style>
````

### Custom palette

**Example: Custom palette**

Source: [CustomPalette.vue](../../examples/QColor/CustomPalette.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-badge color="grey-3" text-color="black" class="q-mb-sm">
      {{ hex }}
    </q-badge>

    <q-color
      v-model="hex"
      default-view="palette"
      :palette="[
        '#019A9D',
        '#D9B801',
        '#E8045A',
        '#B2028A',
        '#2A0449',
        '#019A9D'
      ]"
      class="my-picker"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const hex = ref('#FF00FF')
</script>

<style lang="sass" scoped>
.my-picker
  max-width: 250px
</style>
````

### Force dark mode

**Example: Force dark mode**

Source: [Dark.vue](../../examples/QColor/Dark.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="row items-start q-gutter-md">
      <q-color v-model="hex" dark class="my-picker" />
      <q-color v-model="hexa" dark class="my-picker" />
      <q-color v-model="rgb" dark class="my-picker" />
      <q-color v-model="rgba" dark class="my-picker" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const hex = ref('#FF00FF')
const hexa = ref('#FF00FFCC')
const rgb = ref('rgb(0,0,0)')
const rgba = ref('rgba(255,0,255,0.8)')
</script>

<style lang="sass" scoped>
.my-picker
  max-width: 250px
</style>
````

### Default value

**Example: Default value**

Source: [DefaultValue.vue](../../examples/QColor/DefaultValue.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-color
      v-model="nullModel"
      default-value="#285de0"
      style="max-width: 250px"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const nullModel = ref(null)
</script>
````

### Lazy update

**Example: Lazy model**

Source: [LazyModel.vue](../../examples/QColor/LazyModel.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-badge color="grey-3" text-color="black" class="q-mb-sm">
      {{ hex }}
    </q-badge>

    <q-color
      :model-value="hex"
      @change="
        val => {
          hex = val
        }
      "
      style="max-width: 250px"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const hex = ref('#112e1b')
</script>
````

### Disable and readonly

**Example: Disable and readonly**

Source: [DisableReadonly.vue](../../examples/QColor/DisableReadonly.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="row items-start q-gutter-md">
      <q-color v-model="color" disable class="my-picker" />

      <q-color v-model="color" readonly class="my-picker" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const color = ref('#ff00ff')
</script>

<style lang="sass" scoped>
.my-picker
  max-width: 250px
</style>
````

### Native form submit

When dealing with a native form which has an `action` and a `method` (eg. when using Quasar with ASP.NET controllers), you need to specify the `name` property on QColor, otherwise formData will not contain it (if it should):

**Example: Native form**

Source: [NativeForm.vue](../../examples/QColor/NativeForm.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-color
        name="accent_color"
        v-model="color"
        style="width: 200px; max-width: 100%"
      />

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

const color = ref('#f66363')
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
