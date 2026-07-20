---
title: Field
description: The QField Vue component is used to provide common functionality and aspect to form components.
canonical: https://quasar.dev/vue-components/field
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QField](../../api/QField.md)

The QField component is used to provide common functionality and aspect to form components. It uses `:model-value` (or `v-model` if you want to use `clearable` property) to have knowledge of the model of the component inside. It has support for labels, hints, errors, validation, and comes in a variety of styles and colors.

QField allows you to display any form control (or almost anything as a matter of fact) inside it. Just place your desired content inside the `control` slot.

::: danger
Do NOT wrap QInput, QFile or QSelect with QField as these components already inherit QField.
:::

**API reference:** [QField](../../api/QField.md)

## Design

::: tip
The examples below use dumb content (text) just to show you the design that QField can use. For checking out examples that wrap real components, see the "Basic Features" section.
:::

::: danger
QField does not (and should not) manage your `control` slot, so if you use `label` prop, it might be a good idea to also specify `stack-label`, otherwise it might overlap your control when QField is not focused.
:::

### Overview

For your QField you can use only one of the main designs (`filled`, `outlined`, `standout`, `borderless`). You cannot use multiple as they are self-exclusive.

**Example: Design Overview**

Source: [DesignOverview.vue](../../examples/QField/DesignOverview.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md" style="max-width: 300px">
      <q-field label="Standard" stack-label>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0"
            >Field content</div
          >
        </template>
      </q-field>

      <q-field filled label="Filled" stack-label>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0"
            >Field content</div
          >
        </template>
      </q-field>

      <q-field outlined label="Outlined" stack-label>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0"
            >Field content</div
          >
        </template>
      </q-field>

      <q-field standout label="Standout" stack-label>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0"
            >Field content</div
          >
        </template>
      </q-field>

      <q-field
        standout="bg-teal text-white"
        label="Custom standout"
        stack-label
      >
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0"
            >Field content</div
          >
        </template>
      </q-field>

      <q-field borderless label="Borderless" stack-label>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0"
            >Field content</div
          >
        </template>
      </q-field>

      <q-field rounded filled label="Rounded filled" stack-label>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0"
            >Field content</div
          >
        </template>
      </q-field>

      <q-field rounded outlined label="Rounded outlined" stack-label>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0"
            >Field content</div
          >
        </template>
      </q-field>

      <q-field rounded standout label="Rounded standout" stack-label>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0"
            >Field content</div
          >
        </template>
      </q-field>

      <q-field square filled label="Square filled" stack-label>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0"
            >Field content</div
          >
        </template>
      </q-field>

      <q-field square outlined label="Square outlined" stack-label>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0"
            >Field content</div
          >
        </template>
      </q-field>

      <q-field square standout label="Square standout" stack-label>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0"
            >Field content</div
          >
        </template>
      </q-field>
    </div>
  </div>
</template>
````

### Coloring

**Example: Coloring**

Source: [Coloring.vue](../../examples/QField/Coloring.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-field color="purple-12" label="Label" stack-label>
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field color="teal" filled label="Label" stack-label>
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field
        color="grey-3"
        label-color="orange"
        outlined
        label="Label"
        stack-label
      >
        <template v-slot:append>
          <q-icon name="event" color="orange" />
        </template>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field
        color="lime-11"
        bg-color="green"
        filled
        label="Label"
        stack-label
      >
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field color="teal" outlined label="Label" stack-label>
        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
          </q-avatar>
        </template>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field
        color="orange"
        standout
        bottom-slots
        :model-value="text"
        label="Label"
        stack-label
        counter
        clearable
      >
        <template v-slot:prepend>
          <q-icon name="place" />
        </template>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
        <template v-slot:append>
          <q-icon name="favorite" />
        </template>

        <template v-slot:hint> Field hint </template>
      </q-field>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('Field content')
</script>
````

### Standard

**Example: Standard**

Source: [DesignStandard.vue](../../examples/QField/DesignStandard.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-toggle v-model="dense" label="Dense QField" />

      <q-field :dense="dense">
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field label="Label" stack-label :dense="dense">
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field :dense="dense">
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field :dense="dense">
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
          </q-avatar>
        </template>
      </q-field>

      <q-field
        :model-value="text"
        bottom-slots
        label="Label"
        stack-label
        counter
        :dense="dense"
      >
        <template v-slot:prepend>
          <q-icon name="place" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template v-slot:append>
          <q-icon name="close" class="cursor-pointer" />
        </template>

        <template v-slot:hint> Field hint </template>
      </q-field>

      <q-field
        :model-value="text"
        bottom-slots
        label="Label"
        stack-label
        counter
        maxlength="12"
        :dense="dense"
      >
        <template v-slot:before>
          <q-icon name="flight_takeoff" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template v-slot:append>
          <q-icon v-if="text !== ''" name="close" class="cursor-pointer" />
          <q-icon name="search" />
        </template>

        <template v-slot:hint> Field hint </template>
      </q-field>

      <q-field
        :model-value="text"
        bottom-slots
        label="Label"
        stack-label
        counter
        maxlength="12"
        :dense="dense"
      >
        <template v-slot:before>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
          </q-avatar>
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template v-slot:append>
          <q-icon v-if="text !== ''" name="close" class="cursor-pointer" />
          <q-icon name="schedule" />
        </template>

        <template v-slot:hint> Field hint </template>

        <template v-slot:after>
          <q-btn round dense flat icon="send" />
        </template>
      </q-field>

      <q-field
        :model-value="text"
        bottom-slots
        label="Label"
        stack-label
        counter
        maxlength="12"
        :dense="dense"
      >
        <template v-slot:before>
          <q-icon name="event" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template v-slot:hint> Field hint </template>

        <template v-slot:append>
          <q-btn round dense flat icon="add" />
        </template>
      </q-field>

      <q-field hint="Disable" :dense="dense" disable>
        <template v-slot:control>
          <div class="self-center full-width no-outline">{{ text }}</div>
        </template>
      </q-field>

      <q-field hint="Readonly" :dense="dense" readonly>
        <template v-slot:control>
          <div class="self-center full-width no-outline">{{ text }}</div>
        </template>
      </q-field>

      <q-field hint="Disable and readonly" :dense="dense" disable readonly>
        <template v-slot:control>
          <div class="self-center full-width no-outline">{{ text }}</div>
        </template>
      </q-field>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('Field content')
const dense = ref(false)
</script>
````

### Filled

**Example: Filled**

Source: [DesignFilled.vue](../../examples/QField/DesignFilled.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-toggle v-model="dense" label="Dense QField" />

      <q-field filled :dense="dense">
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field filled label="Label" stack-label :dense="dense">
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field filled square hint="With perfect square borders" :dense="dense">
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field filled :dense="dense">
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field filled :dense="dense">
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
          </q-avatar>
        </template>
      </q-field>

      <q-field
        filled
        :model-value="text"
        bottom-slots
        label="Label"
        stack-label
        counter
        :dense="dense"
      >
        <template v-slot:prepend>
          <q-icon name="place" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template v-slot:append>
          <q-icon name="close" class="cursor-pointer" />
        </template>

        <template v-slot:hint> Field hint </template>
      </q-field>

      <q-field
        filled
        :model-value="text"
        bottom-slots
        label="Label"
        stack-label
        counter
        maxlength="12"
        :dense="dense"
      >
        <template v-slot:before>
          <q-icon name="flight_takeoff" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template v-slot:append>
          <q-icon v-if="text !== ''" name="close" class="cursor-pointer" />
          <q-icon name="search" />
        </template>

        <template v-slot:hint> Field hint </template>
      </q-field>

      <q-field
        filled
        :model-value="text"
        bottom-slots
        label="Label"
        stack-label
        counter
        maxlength="12"
        :dense="dense"
      >
        <template v-slot:before>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
          </q-avatar>
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template v-slot:append>
          <q-icon v-if="text !== ''" name="close" class="cursor-pointer" />
          <q-icon name="schedule" />
        </template>

        <template v-slot:hint> Field hint </template>

        <template v-slot:after>
          <q-btn round dense flat icon="send" />
        </template>
      </q-field>

      <q-field
        filled
        :model-value="text"
        bottom-slots
        label="Label"
        stack-label
        counter
        maxlength="12"
        :dense="dense"
      >
        <template v-slot:before>
          <q-icon name="event" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template v-slot:hint> Field hint </template>

        <template v-slot:append>
          <q-btn round dense flat icon="add" />
        </template>
      </q-field>

      <q-field filled hint="Disable" :dense="dense" disable>
        <template v-slot:control>
          <div class="self-center full-width no-outline">{{ text }}</div>
        </template>
      </q-field>

      <q-field filled hint="Readonly" :dense="dense" readonly>
        <template v-slot:control>
          <div class="self-center full-width no-outline">{{ text }}</div>
        </template>
      </q-field>

      <q-field
        filled
        hint="Disable and readonly"
        :dense="dense"
        disable
        readonly
      >
        <template v-slot:control>
          <div class="self-center full-width no-outline">{{ text }}</div>
        </template>
      </q-field>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('Field content')
const dense = ref(false)
</script>
````

### Outlined

**Example: Outlined**

Source: [DesignOutlined.vue](../../examples/QField/DesignOutlined.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-toggle v-model="dense" label="Dense QField" />

      <q-field outlined :dense="dense">
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field outlined label="Label" stack-label :dense="dense">
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field
        outlined
        square
        hint="With perfect square borders"
        :dense="dense"
      >
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field outlined :dense="dense">
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field outlined :dense="dense">
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
          </q-avatar>
        </template>
      </q-field>

      <q-field
        outlined
        :model-value="text"
        bottom-slots
        label="Label"
        stack-label
        counter
        :dense="dense"
      >
        <template v-slot:prepend>
          <q-icon name="place" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template v-slot:append>
          <q-icon name="close" class="cursor-pointer" />
        </template>

        <template v-slot:hint> Field hint </template>
      </q-field>

      <q-field
        outlined
        :model-value="text"
        bottom-slots
        label="Label"
        stack-label
        counter
        maxlength="12"
        :dense="dense"
      >
        <template v-slot:before>
          <q-icon name="flight_takeoff" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template v-slot:append>
          <q-icon v-if="text !== ''" name="close" class="cursor-pointer" />
          <q-icon name="search" />
        </template>

        <template v-slot:hint> Field hint </template>
      </q-field>

      <q-field
        outlined
        :model-value="text"
        bottom-slots
        label="Label"
        stack-label
        counter
        maxlength="12"
        :dense="dense"
      >
        <template v-slot:before>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
          </q-avatar>
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template v-slot:append>
          <q-icon v-if="text !== ''" name="close" class="cursor-pointer" />
          <q-icon name="schedule" />
        </template>

        <template v-slot:hint> Field hint </template>

        <template v-slot:after>
          <q-btn round dense flat icon="send" />
        </template>
      </q-field>

      <q-field
        outlined
        :model-value="text"
        bottom-slots
        label="Label"
        stack-label
        counter
        maxlength="12"
        :dense="dense"
      >
        <template v-slot:before>
          <q-icon name="event" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template v-slot:hint> Field hint </template>

        <template v-slot:append>
          <q-btn round dense flat icon="add" />
        </template>
      </q-field>

      <q-field outlined hint="Disable" :dense="dense" disable>
        <template v-slot:control>
          <div class="self-center full-width no-outline">{{ text }}</div>
        </template>
      </q-field>

      <q-field outlined hint="Readonly" :dense="dense" readonly>
        <template v-slot:control>
          <div class="self-center full-width no-outline">{{ text }}</div>
        </template>
      </q-field>

      <q-field
        outlined
        hint="Disable and readonly"
        :dense="dense"
        disable
        readonly
      >
        <template v-slot:control>
          <div class="self-center full-width no-outline">{{ text }}</div>
        </template>
      </q-field>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('Field content')
const dense = ref(false)
</script>
````

### Standout

**Example: Standout**

Source: [DesignStandout.vue](../../examples/QField/DesignStandout.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-toggle v-model="dense" label="Dense QInput" />

      <q-field standout :dense="dense">
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field standout label="Label" stack-label :dense="dense">
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field
        standout="bg-teal text-white"
        label="Custom standout"
        stack-label
        :dense="dense"
      >
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field
        standout
        square
        hint="With perfect square borders"
        :dense="dense"
      >
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field standout :dense="dense">
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field standout :dense="dense">
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
          </q-avatar>
        </template>
      </q-field>

      <q-field
        standout
        :model-value="text"
        bottom-slots
        label="Label"
        stack-label
        counter
        :dense="dense"
      >
        <template v-slot:prepend>
          <q-icon name="place" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template v-slot:append>
          <q-icon name="close" class="cursor-pointer" />
        </template>

        <template v-slot:hint> Field hint </template>
      </q-field>

      <q-field
        standout
        :model-value="text"
        bottom-slots
        label="Label"
        stack-label
        counter
        maxlength="12"
        :dense="dense"
      >
        <template v-slot:before>
          <q-icon name="flight_takeoff" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template v-slot:append>
          <q-icon v-if="text !== ''" name="close" class="cursor-pointer" />
          <q-icon name="search" />
        </template>

        <template v-slot:hint> Field hint </template>
      </q-field>

      <q-field
        standout
        :model-value="text"
        bottom-slots
        label="Label"
        stack-label
        counter
        maxlength="12"
        :dense="dense"
      >
        <template v-slot:before>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
          </q-avatar>
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template v-slot:append>
          <q-icon v-if="text !== ''" name="close" class="cursor-pointer" />
          <q-icon name="schedule" />
        </template>

        <template v-slot:hint> Field hint </template>

        <template v-slot:after>
          <q-btn round dense flat icon="send" />
        </template>
      </q-field>

      <q-field
        standout
        :model-value="text"
        bottom-slots
        label="Label"
        stack-label
        counter
        maxlength="12"
        :dense="dense"
      >
        <template v-slot:before>
          <q-icon name="event" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template v-slot:hint> Field hint </template>

        <template v-slot:append>
          <q-btn round dense flat icon="add" />
        </template>
      </q-field>

      <q-field standout hint="Disable" :dense="dense" disable>
        <template v-slot:control>
          <div class="self-center full-width no-outline">{{ text }}</div>
        </template>
      </q-field>

      <q-field standout hint="Readonly" :dense="dense" readonly>
        <template v-slot:control>
          <div class="self-center full-width no-outline">{{ text }}</div>
        </template>
      </q-field>

      <q-field
        standout
        hint="Disable and readonly"
        :dense="dense"
        disable
        readonly
      >
        <template v-slot:control>
          <div class="self-center full-width no-outline">{{ text }}</div>
        </template>
      </q-field>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('Field content')
const dense = ref(false)
</script>
````

One of the most appropriate use cases for Standout design is in a QToolbar:

**Example: Standout in QToolbar**

Source: [StandoutToolbar.vue](../../examples/QField/StandoutToolbar.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="width: 300px; max-width: 100%">
      <q-toolbar class="bg-primary text-white rounded-borders">
        <q-btn round dense flat icon="menu" class="q-mr-xs" />
        <q-avatar class="gt-xs">
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
        </q-avatar>

        <q-space />
        <q-field dark dense standout>
          <template v-slot:control>
            <div class="self-center no-outline" tabindex="0"
              >Time is {{ value }}</div
            >
          </template>
          <template v-slot:append>
            <q-btn
              flat
              round
              dense
              :disable="value < 10"
              icon="replay_10"
              @click.stop.prevent="value -= 10"
            />
            <q-btn
              flat
              round
              dense
              :disable="value > 90"
              icon="forward_10"
              @click.stop.prevent="value += 10"
            />
          </template>
        </q-field>
      </q-toolbar>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref(50)
</script>
````

### Borderless

The `borderless` design allows you to seamlessly integrate your QField into other components without QField drawing a border around itself or changing its background color:

**Example: Borderless**

Source: [Borderless.vue](../../examples/QField/Borderless.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="width: 300px; max-width: 100%">
      <q-toolbar class="bg-primary text-white rounded-borders">
        <q-btn round dense flat icon="menu" class="q-mr-xs" />
        <q-avatar class="gt-xs">
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
        </q-avatar>

        <q-space />
        <q-field dark borderless>
          <template v-slot:control>
            <div class="self-center no-outline" tabindex="0"
              >Time is {{ value }}</div
            >
          </template>
          <template v-slot:append>
            <q-btn
              color="white"
              flat
              round
              dense
              :disable="value < 10"
              icon="replay_10"
              @click.stop.prevent="value -= 10"
            />
            <q-btn
              color="white"
              flat
              round
              dense
              :disable="value > 90"
              icon="forward_10"
              @click.stop.prevent="value += 10"
            />
          </template>
        </q-field>
      </q-toolbar>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref(50)
</script>
````

### Rounded design

The `rounded` prop only works along with Filled, Outlined and Standout designs, as showcased in the example below:

**Example: Rounded**

Source: [Rounded.vue](../../examples/QField/Rounded.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-field rounded filled>
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field rounded outlined>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
          </q-avatar>
        </template>
      </q-field>

      <q-field
        rounded
        standout
        bottom-slots
        :model-value="text"
        label="Label"
        stack-label
        counter
      >
        <template v-slot:prepend>
          <q-icon name="place" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template v-slot:append>
          <q-icon name="close" class="cursor-pointer" />
        </template>

        <template v-slot:hint> Field hint </template>
      </q-field>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('Field content')
</script>
````

### Square borders

The `square` prop only makes sense along with Filled, Outlined and Standout designs, as showcased in the example below:

**Example: Square borders**

Source: [SquareBorders.vue](../../examples/QField/SquareBorders.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-field square filled>
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field square outlined>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
          </q-avatar>
        </template>
      </q-field>

      <q-field
        square
        standout
        bottom-slots
        :model-value="text"
        label="Label"
        stack-label
        counter
      >
        <template v-slot:prepend>
          <q-icon name="place" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>

        <template v-slot:append>
          <q-icon name="close" @click="text = ''" class="cursor-pointer" />
        </template>

        <template v-slot:hint> Field hint </template>
      </q-field>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('Field content')
</script>
````

### Force dark mode

**Example: Force dark mode**

Source: [Dark.vue](../../examples/QField/Dark.vue)

````vue
<template>
  <div class="q-pa-md bg-grey-9 text-white">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <div>
        <q-toggle v-model="readonly" label="Readonly" dark />
        <q-toggle v-model="disable" label="Disable" dark />
      </div>

      <q-field dark :readonly="readonly" :disable="disable">
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" :tabindex="tabindex">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field dark filled :readonly="readonly" :disable="disable">
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" :tabindex="tabindex">{{
            text
          }}</div>
        </template>
      </q-field>

      <q-field dark outlined :readonly="readonly" :disable="disable">
        <template v-slot:control>
          <div class="self-center full-width no-outline" :tabindex="tabindex">{{
            text
          }}</div>
        </template>

        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-dark.svg" />
          </q-avatar>
        </template>
      </q-field>

      <q-field
        dark
        standout
        bottom-slots
        :model-value="text"
        label="Label"
        stack-label
        counter
        :readonly="readonly"
        :disable="disable"
      >
        <template v-slot:prepend>
          <q-icon name="place" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" :tabindex="tabindex">{{
            text
          }}</div>
        </template>

        <template v-slot:append>
          <q-icon name="close" @click="text = ''" class="cursor-pointer" />
        </template>

        <template v-slot:hint> Field hint </template>
      </q-field>

      <q-field dark borderless :readonly="readonly" :disable="disable">
        <template v-slot:control>
          <div class="self-center full-width no-outline" :tabindex="tabindex">{{
            text
          }}</div>
        </template>

        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-field>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const text = ref('Field content')
const readonly = ref(false)
const disable = ref(false)
const tabindex = computed(() => (disable.value || readonly.value ? -1 : 0))
</script>
````

## Basic features

### Clearable

As a helper, you can use `clearable` prop so user can reset model to `null` through an appended icon.

::: warning
If using `clearable` you must use `v-model` or listen on `@update:model-value` and update the value.
:::

**Example: Clearable**

Source: [Clearable.vue](../../examples/QField/Clearable.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-field
        color="orange"
        filled
        v-model="text"
        label="Label"
        stack-label
        clearable
      >
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0"
            >Text is <q>{{ text === null ? 'null' : text }}</q></div
          >
        </template>
        <template v-if="text === null" v-slot:append>
          <q-icon
            name="short_text"
            @click.stop.prevent="text = 'Some text'"
            class="cursor-pointer"
          />
        </template>
      </q-field>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('Some text')
</script>
````

### Control types

Anything you place inside the `control` slot will be used as content of the field. We provide a few examples of controls below.

**Example: Control types**

Source: [ControlTypes.vue](../../examples/QField/ControlTypes.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md column" style="max-width: 300px">
      <q-field
        filled
        :hint="`Slider with value ${slider}`"
        :model-value="slider"
        @update:model-value="val => val === null && (slider = 50)"
        clearable
      >
        <template v-slot:control>
          <q-slider
            :model-value="slider"
            @change="
              val => {
                slider = val
              }
            "
            :min="0"
            :max="100"
            label
            label-always
            class="q-mt-lg"
          />
        </template>
      </q-field>

      <q-field
        filled
        :hint="`Range between ${range.min} and ${range.max}`"
        :model-value="range"
        @update:model-value="
          val => val === null && (range = { min: 0, max: 100 })
        "
        clearable
      >
        <template v-slot:control>
          <q-range
            :model-value="range"
            @change="
              val => {
                range = val
              }
            "
            :min="0"
            :max="100"
          />
        </template>
      </q-field>

      <q-field
        filled
        :hint="`Knob with value ${knob}`"
        :model-value="knob"
        @update:model-value="val => val === null && (knob = 50)"
        clearable
      >
        <template v-slot:control>
          <div class="full-width">
            <q-knob
              :model-value="knob"
              @change="
                val => {
                  knob = val
                }
              "
              :min="0"
              :max="100"
              size="72px"
              :thickness="1"
              color="light-blue"
              track-color="grey-8"
            />
          </div>
        </template>
      </q-field>

      <q-field
        filled
        :hint="`Calendar with value ${date}`"
        label="Pick a date"
        stack-label
      >
        <template v-slot:control>
          <q-date class="q-mt-sm full-width" minimal v-model="date" />
        </template>
      </q-field>

      <q-field
        filled
        :hint="`Time with value ${time}`"
        label="Pick a time"
        stack-label
      >
        <template v-slot:control>
          <div class="q-mt-sm full-width">
            <q-time v-model="time" />
          </div>
        </template>
      </q-field>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const slider = ref(50)
const range = ref({
  min: 10,
  max: 30
})
const knob = ref(50)
const time = ref('')
const date = ref('')
</script>
````

::: tip
Most of the form controls always render something visible, so you if you're using a `label` then you might want to set it along with `stack-label`, otherwise the label will overlap the enclosed control.
:::

### Prefix and suffix

**Example: Prefix and suffix**

Source: [PrefixSuffix.vue](../../examples/QField/PrefixSuffix.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-field filled :model-value="email" suffix="@gmail.com">
        <template v-slot:before>
          <q-icon name="mail" />
        </template>

        <template v-slot:control>
          <div
            class="self-center full-width no-outline text-right"
            tabindex="0"
            >{{ email }}</div
          >
        </template>
      </q-field>

      <q-field outlined :model-value="number" prefix="$">
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            number
          }}</div>
        </template>

        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
          </q-avatar>
        </template>
      </q-field>

      <q-field
        standout
        :model-value="email"
        prefix="Email:"
        suffix="@gmail.com"
      >
        <template v-slot:prepend>
          <q-icon name="mail" />
        </template>

        <template v-slot:control>
          <div
            class="self-center full-width no-outline text-right"
            tabindex="0"
            >{{ email }}</div
          >
        </template>
      </q-field>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('john.doe')
const number = ref(123)
</script>
````

### Custom Label

Using the `label` slot you can customize the aspect of the label or add special features as `QTooltip`.

::: tip
Do not forget to set the `label-slot` property.

If you want to interact with the content of the label (QTooltip) add the `all-pointer-events` class on the element in the slot.
:::

**Example: Custom label**

Source: [CustomLabel.vue](../../examples/QField/CustomLabel.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-field filled :model-value="email" suffix="@gmail.com" label-slot>
        <template v-slot:label>
          <div class="row items-center all-pointer-events">
            <q-icon
              class="q-mr-xs"
              color="deep-orange"
              size="24px"
              name="mail"
            />
            Email (hover for more info)

            <q-tooltip
              class="bg-grey-8"
              anchor="top left"
              self="bottom left"
              :offset="[0, 8]"
              >Email address</q-tooltip
            >
          </div>
        </template>

        <template v-slot:control>
          <div
            class="self-center full-width no-outline text-right"
            tabindex="0"
            >{{ email }}</div
          >
        </template>
      </q-field>

      <q-field outlined :model-value="number" prefix="$" label-slot>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            number
          }}</div>
        </template>

        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
          </q-avatar>
        </template>

        <template v-slot:label>
          <span class="text-weight-bold text-deep-orange">You</span>
          can customize the
          <span
            class="q-px-sm bg-deep-orange text-white text-italic rounded-borders"
            >label</span
          >
        </template>
      </q-field>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('john.doe')
const number = ref(123)
</script>
````

### Slots with QBtn type "submit"

::: warning
When placing a QBtn with type "submit" in one of the "before", "after", "prepend", or "append" slots of a QField, QInput or QSelect, you should also add a `@click` listener on the QBtn in question. This listener should call the method that submits your form. All "click" events in such slots are not propagated to their parent elements.
:::

### Loading state

**Example: Loading state**

Source: [LoadingState.vue](../../examples/QField/LoadingState.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-field :loading="loadingState" filled label="Label" stack-label>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{
            text
          }}</div>
        </template>
      </q-field>
      <q-toggle v-model="loadingState" label="Loading state" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('Field content')
const loadingState = ref(false)
</script>
````

## Validation

### Internal validation

You can validate QField components with `:rules` prop. Specify array of embedded rules or your own validators. Your custom validator will be a function which returns `true` if validator succeeds or `String` with error message if it doesn't succeed.

::: tip
By default, for perf reasons, a change in the rules does not trigger a new validation until the model changes. In order to trigger the validation when rules change too, then use `reactive-rules` Boolean prop. The downside is a performance penalty (so use it when you really need this only!) and it can be slightly mitigated by using a computed prop as value for the rules (and not specify them inline in the vue template).
:::

This is so you can write convenient rules of shape like:

```js
value => condition || errorMessage
```

For example:

```js
value => value < 10 || 'Value should be lower'
```

You can reset the validation by calling `resetValidation()` method on the QField.

**Example: Basic**

Source: [ValidationRequired.vue](../../examples/QField/ValidationRequired.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 400px">
    <q-field
      ref="fieldRef"
      filled
      v-model="date"
      label="Required Field"
      stack-label
      :rules="[val => !!val || 'Field is required']"
    >
      <template v-slot:control>
        <q-date
          class="q-mt-sm full-width"
          style="width: 300px"
          minimal
          v-model="date"
        />
      </template>
    </q-field>

    <div class="q-mt-sm">
      <div class="q-gutter-sm">
        <q-btn
          label="Reset Validation"
          @click="resetValidation"
          color="primary"
        />
        <q-btn label="Reset Date" @click="resetDate" color="primary" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'

const date = ref('')
const fieldRef = useTemplateRef('fieldRef')

function resetValidation() {
  fieldRef.value.resetValidation()
}

function resetDate() {
  date.value = ''
}
</script>
````

**Example: Maximum value**

Source: [ValidationMaxValue.vue](../../examples/QField/ValidationMaxValue.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-field
      ref="fieldRef"
      filled
      :model-value="slider"
      label="Maximum 60"
      stack-label
      :rules="[val => val <= 60 || 'Please set value to maximum 60']"
    >
      <template v-slot:control>
        <q-slider
          v-model="slider"
          :min="0"
          :max="100"
          label
          label-always
          class="q-mt-lg"
          style="width: 200px"
        />
      </template>
    </q-field>

    <q-btn
      class="q-mt-sm"
      label="Reset Validation"
      @click="reset"
      color="primary"
    />
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'

const fieldRef = useTemplateRef('fieldRef')
const slider = ref(50)

function reset() {
  fieldRef.value.resetValidation()
}
</script>
````

If you set `lazy-rules`, validation starts after first blur. If `lazy-rules` is set to `ondemand` String, then validation will be triggered only when component's validate() method is manually called or when the wrapper QForm submits itself.

**Example: Lazy rules**

Source: [ValidationLazy.vue](../../examples/QField/ValidationLazy.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-field
      ref="fieldRef"
      filled
      :model-value="slider"
      label="Value must be less than 60"
      hint="Validation starts after first blur"
      :rules="[val => val < 60 || 'Please set value to maximum 60']"
      lazy-rules
    >
      <template v-slot:control>
        <q-slider
          v-model="slider"
          :min="0"
          :max="100"
          label
          label-always
          class="q-mt-lg"
          style="width: 200px"
        />
      </template>
    </q-field>

    <q-btn
      class="q-mt-sm"
      label="Reset Validation"
      @click="reset"
      color="primary"
    />
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'

const fieldRef = useTemplateRef('fieldRef')
const slider = ref(50)

function reset() {
  fieldRef.value.resetValidation()
}
</script>
````

#### Async rules

Rules can be async too, by using async/await or by directly returning a Promise.

::: tip
Consider coupling async rules with `debounce` prop to avoid calling the async rules immediately on each keystroke, which might be detrimental to performance.
:::

**Example: Async rules**

Source: [ValidationAsync.vue](../../examples/QField/ValidationAsync.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 350px">
    <q-field
      ref="fieldRef"
      filled
      :model-value="slider"
      hint="Pick between 10 and 60"
      :rules="[myRule]"
    >
      <template v-slot:control>
        <q-slider
          v-model="slider"
          :min="0"
          :max="100"
          label
          label-always
          class="q-mt-lg"
          style="width: 200px"
        />
      </template>
    </q-field>

    <q-btn
      class="q-mt-sm"
      label="Reset Validation"
      @click="reset"
      color="primary"
    />
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'

const fieldRef = useTemplateRef('fieldRef')
const slider = ref(10)

function myRule(val) {
  // simulating a delay
  return new Promise(resolve => {
    setTimeout(() => {
      // call
      //  resolve(true)
      //     --> content is valid
      //  resolve(false)
      //     --> content is NOT valid, no error message
      //  resolve(error_message)
      //     --> content is NOT valid, we have error message
      resolve((val >= 10 && val <= 60) || 'Please set value to maximum 60')

      // calling reject(...) will also mark the input
      // as having an error, but there will not be any
      // error message displayed below the input
      // (only in browser console)
    }, 1000)
  })
}

function reset() {
  fieldRef.value.resetValidation()
}
</script>
````

### External validation

You can also use external validation and only pass `error` and `error-message` (enable `bottom-slots` to display this error message).

::: tip
Depending on your needs, you might connect [Regle](https://reglejs.dev/) (our recommended approach) or some other validation library to QField.
:::

**Example: External**

Source: [ValidationExternal.vue](../../examples/QField/ValidationExternal.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-field
      filled
      :model-value="slider"
      label="Move it above 30"
      bottom-slots
      hint="Max value is 30"
      error-message="Please use a maximum value of 30"
      :error="!isValid"
    >
      <template v-slot:control>
        <q-slider
          v-model="slider"
          :min="0"
          :max="100"
          label
          label-always
          class="q-mt-lg"
          style="width: 200px"
        />
      </template>
    </q-field>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const slider = ref(10)
const isValid = computed(() => slider.value <= 30)
</script>
````

You can also customize the slot for error message:

**Example: Slot for error message**

Source: [ValidationSlots.vue](../../examples/QField/ValidationSlots.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-field
      filled
      :model-value="slider"
      label="Move it above 30"
      bottom-slots
      hint="Max value is 30"
      :error="!isValid"
    >
      <template v-slot:control>
        <q-slider
          v-model="slider"
          :min="0"
          :max="100"
          label
          label-always
          class="q-mt-lg"
          style="width: 200px"
        />
      </template>
      <template v-slot:error> Please use a maximum value of 30. </template>
    </q-field>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const slider = ref(10)
const isValid = computed(() => slider.value <= 30)
</script>
````
