---
title: Rating
description: The QRating Vue component allows the user to rate items. It's usually known as 'star rating'.
canonical: https://quasar.dev/vue-components/rating
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QRating](../../api/QRating.md)

Quasar Rating is a Component which allows users to rate items, usually known as “Star Rating”.

**API reference:** [QRating](../../api/QRating.md)

## Usage

### Basic

**Example: Basic**

Source: [Basic.vue](../../examples/QRating/Basic.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column">
      <q-rating v-model="ratingModel" size="1.5em" icon="thumb_up" />
      <q-rating
        v-model="ratingModel"
        size="2em"
        color="red-7"
        icon="favorite_border"
      />
      <q-rating
        v-model="ratingModel"
        size="2.5em"
        color="purple-4"
        icon="create"
      />
      <q-rating v-model="ratingModel" size="3em" color="brown-5" icon="pets" />
      <q-rating
        v-model="ratingModel"
        size="3.5em"
        color="green-5"
        icon="star_border"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const ratingModel = ref(3)
</script>
````

**Example: Custom number of choices**

Source: [Max.vue](../../examples/QRating/Max.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-rating v-model="ratingModel" size="2em" :max="10" color="primary" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const ratingModel = ref(3)
</script>
````

### Keyboard navigation

QRating uses radio-group keyboard behavior:

- `Arrow Right` and `Arrow Down` select the next value.
- `Arrow Left` and `Arrow Up` select the previous value.
- `Space` or `Enter` selects the focused value.

### Icons

**Example: Image icons**

Source: [Images.vue](../../examples/QRating/Images.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-rating
      v-model="ratingModel"
      size="3.5em"
      icon="img:https://cdn.quasar.dev/logo-v2/svg/logo.svg"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const ratingModel = ref(3)
</script>
````

In the example below, when using the `icon-selected` prop, notice we can still use `icon` as well. The latter becomes the icon(s) when they are not selected.

**Example: Different icon when selected**

Source: [SelectedIcon.vue](../../examples/QRating/SelectedIcon.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column">
      <q-rating
        v-model="ratingModel"
        size="3.5em"
        color="green-5"
        icon="star_border"
        icon-selected="star"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const ratingModel = ref(3)
</script>
````

**Example: Different icon for each rating**

Source: [ArrayIcon.vue](../../examples/QRating/ArrayIcon.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column">
      <q-rating
        v-model="ratingModel"
        :max="4"
        size="3.5em"
        color="green-5"
        :icon="icons"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const ratingModel = ref(3)
const icons = [
  'sentiment_very_dissatisfied',
  'sentiment_dissatisfied',
  'sentiment_satisfied',
  'sentiment_very_satisfied'
]
</script>
````

### Colors

When using the `color-selected` prop, notice we can still use `color` as well. The latter becomes the color(s) of the icons when they are not selected.

**Example: Different color for each rating**

Source: [Colors.vue](../../examples/QRating/Colors.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column">
      <q-rating
        v-model="ratingModel"
        size="3.5em"
        color="grey"
        :color-selected="ratingColors"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const ratingModel = ref(4)
const ratingColors = [
  'light-green-3',
  'light-green-6',
  'green',
  'green-9',
  'green-10'
]
</script>
````

### Floating number

**Example: Different icon and color when half selected**

Source: [HalfSelected.vue](../../examples/QRating/HalfSelected.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column">
      <q-rating
        v-model="model1"
        max="7"
        size="3em"
        color="green-5"
        icon="star_border"
        icon-selected="star"
        icon-half="star_half"
      />

      <q-rating
        v-model="model2"
        max="7"
        size="3em"
        color="yellow"
        icon="star_border"
        icon-selected="star"
        icon-half="star_half"
        no-dimming
      />

      <q-rating
        v-model="model3"
        max="7"
        size="3em"
        color="red"
        color-selected="red-9"
        icon="favorite_border"
        icon-selected="favorite"
        icon-half="favorite"
        no-dimming
      />

      <div>
        <q-btn color="grey" no-caps label="Reset" @click="resetModels" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model1 = ref(3.5)
const model2 = ref(2.3)
const model3 = ref(4.5)

function resetModels() {
  model1.value = 3.5
  model2.value = 2.3
  model3.value = 4.5
}
</script>
````

### No dimming

**Example: No dimming**

Source: [NoDimming.vue](../../examples/QRating/NoDimming.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-rating
      v-model="model"
      max="5"
      size="3.5em"
      color="yellow"
      icon="star_border"
      icon-selected="star"
      icon-half="star_half"
      no-dimming
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(2.3)
</script>
````

### Tooltips

Notice how we can add tooltips to each icon in the example below.

**Example: With QTooltip**

Source: [SlotTip.vue](../../examples/QRating/SlotTip.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-rating v-model="ratingModel" size="2em" :max="3" color="primary">
      <template v-slot:tip-1>
        <q-tooltip>Not bad</q-tooltip>
      </template>
      <template v-slot:tip-2>
        <q-tooltip>Good</q-tooltip>
      </template>
      <template v-slot:tip-3>
        <q-tooltip>Very good!</q-tooltip>
      </template>
    </q-rating>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const ratingModel = ref(2)
</script>
````

### Sizes

Apart from the standard sizes below, you can define your own through the `size` property.

**Example: Standard sizes**

Source: [StandardSizes.vue](../../examples/QRating/StandardSizes.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column">
      <q-rating
        v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']"
        :key="size"
        :size="size"
        v-model="ratingModel"
        icon="stars"
        color="primary"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const ratingModel = ref(3)
</script>
````

### Readonly and disable

**Example: Readonly and disable**

Source: [ReadonlyDisable.vue](../../examples/QRating/ReadonlyDisable.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column">
      <q-rating v-model="ratingModel" size="2em" color="orange" readonly />

      <q-rating v-model="ratingModel" size="2em" color="purple" disable />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const ratingModel = ref(3)
</script>
````

### Native form submit

When dealing with a native form which has an `action` and a `method` (eg. when using Quasar with ASP.NET controllers), you need to specify the `name` property on QRating, otherwise formData will not contain it (if it should):

**Example: Native form**

Source: [NativeForm.vue](../../examples/QRating/NativeForm.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-rating
        name="quality"
        v-model="quality"
        max="5"
        size="3.5em"
        color="yellow"
        icon="star_border"
        icon-selected="star"
        no-dimming
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

const quality = ref(3)
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
