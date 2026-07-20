---
title: QSplitter
description: The QSplitter Vue component allow containers to be split vertically and/or horizontally through a draggable separator bar.
canonical: https://quasar.dev/vue-components/splitter
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QSplitter](../../api/QSplitter.md)

The QSplitter component allow containers to be split vertically and/or horizontally through a draggable separator bar.

**API reference:** [QSplitter](../../api/QSplitter.md)

## Usage

::: warning
The use of the `before` and `after` slots is required.
:::

Click and drag on the splitter separator bar to see results.

### Basic

**Example: Basic**

Source: [Basic.vue](../../examples/QSplitter/Basic.vue)

````vue
<template>
  <div>
    <q-splitter v-model="splitterModel" style="height: 400px">
      <template v-slot:before>
        <div class="q-pa-md">
          <div class="text-h4 q-mb-md">Before</div>
          <div v-for="n in 20" :key="n" class="q-my-md"
            >{{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Quis praesentium cumque magnam odio iure quidem, quod illum numquam
            possimus obcaecati commodi minima assumenda consectetur culpa fuga
            nulla ullam. In, libero.</div
          >
        </div>
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <div class="text-h4 q-mb-md">After</div>
          <div v-for="n in 20" :key="n" class="q-my-md"
            >{{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Quis praesentium cumque magnam odio iure quidem, quod illum numquam
            possimus obcaecati commodi minima assumenda consectetur culpa fuga
            nulla ullam. In, libero.</div
          >
        </div>
      </template>
    </q-splitter>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const splitterModel = ref(50) // start at 50%
</script>
````

### Horizontal

**Example: Horizontal**

Source: [Horizontal.vue](../../examples/QSplitter/Horizontal.vue)

````vue
<template>
  <div>
    <q-splitter v-model="splitterModel" horizontal style="height: 400px">
      <template v-slot:before>
        <div class="q-pa-md">
          <div class="text-h4 q-mb-md">Before</div>
          <div v-for="n in 20" :key="n" class="q-my-md"
            >{{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Quis praesentium cumque magnam odio iure quidem, quod illum numquam
            possimus obcaecati commodi minima assumenda consectetur culpa fuga
            nulla ullam. In, libero.</div
          >
        </div>
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <div class="text-h4 q-mb-md">After</div>
          <div v-for="n in 20" :key="n" class="q-my-md"
            >{{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Quis praesentium cumque magnam odio iure quidem, quod illum numquam
            possimus obcaecati commodi minima assumenda consectetur culpa fuga
            nulla ullam. In, libero.</div
          >
        </div>
      </template>
    </q-splitter>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const splitterModel = ref(50) // start at 50%
</script>
````

### Custom dragging limits

**Example: Custom dragging limits (50-100)**

Source: [Limits.vue](../../examples/QSplitter/Limits.vue)

````vue
<template>
  <div>
    <q-splitter
      v-model="splitterModel"
      :limits="[50, 100]"
      style="height: 400px"
    >
      <template v-slot:before>
        <div class="q-pa-md">
          <div class="text-h4 q-mb-md">Before</div>
          <div v-for="n in 20" :key="n" class="q-my-md"
            >{{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Quis praesentium cumque magnam odio iure quidem, quod illum numquam
            possimus obcaecati commodi minima assumenda consectetur culpa fuga
            nulla ullam. In, libero.</div
          >
        </div>
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <div class="text-h4 q-mb-md">After</div>
          <div v-for="n in 20" :key="n" class="q-my-md"
            >{{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Quis praesentium cumque magnam odio iure quidem, quod illum numquam
            possimus obcaecati commodi minima assumenda consectetur culpa fuga
            nulla ullam. In, libero.</div
          >
        </div>
      </template>
    </q-splitter>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const splitterModel = ref(50) // start at 50%
</script>
````

### Model units

By default, the CSS `unit` used is '%' (percentage). But you can also use 'px' (pixels), as in the example below.

**Example: Model in pixels**

Source: [PixelModel.vue](../../examples/QSplitter/PixelModel.vue)

````vue
<template>
  <div>
    <q-splitter v-model="splitterModel" unit="px" style="height: 400px">
      <template v-slot:before>
        <div class="q-pa-md">
          <div class="text-h4 q-mb-md">Before</div>
          <div v-for="n in 20" :key="n" class="q-my-md"
            >{{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Quis praesentium cumque magnam odio iure quidem, quod illum numquam
            possimus obcaecati commodi minima assumenda consectetur culpa fuga
            nulla ullam. In, libero.</div
          >
        </div>
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <div class="text-h4 q-mb-md">After</div>
          <div v-for="n in 20" :key="n" class="q-my-md"
            >{{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Quis praesentium cumque magnam odio iure quidem, quod illum numquam
            possimus obcaecati commodi minima assumenda consectetur culpa fuga
            nulla ullam. In, libero.</div
          >
        </div>
      </template>
    </q-splitter>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const splitterModel = ref(150) // start at 150px
</script>
````

### Reverse model

By default, the model is connected to the `before` slot size. But you can reverse that and make it connect to the `after` slot, as in the example below. This feature turns out especially useful if your `unit` is set to pixels and you want to control the `after` slot.

**Example: Reverse model**

Source: [ReverseModel.vue](../../examples/QSplitter/ReverseModel.vue)

````vue
<template>
  <div>
    <q-splitter v-model="splitterModel" reverse unit="px" style="height: 400px">
      <template v-slot:before>
        <div class="q-pa-md">
          <div class="text-h4 q-mb-md">Before</div>
          <div v-for="n in 20" :key="n" class="q-my-md"
            >{{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Quis praesentium cumque magnam odio iure quidem, quod illum numquam
            possimus obcaecati commodi minima assumenda consectetur culpa fuga
            nulla ullam. In, libero.</div
          >
        </div>
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <div class="text-h4 q-mb-md">After</div>
          <div v-for="n in 20" :key="n" class="q-my-md"
            >{{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Quis praesentium cumque magnam odio iure quidem, quod illum numquam
            possimus obcaecati commodi minima assumenda consectetur culpa fuga
            nulla ullam. In, libero.</div
          >
        </div>
      </template>
    </q-splitter>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const splitterModel = ref(150) // start at 150px
</script>
````

### Adding content to separator

::: tip
If you use images as content for the separator slot, you might want to add `draggable="false"` to them, otherwise the native browser behavior might interfere in a negative way.
:::

**Example: Adding to separator**

Source: [SeparatorSlot.vue](../../examples/QSplitter/SeparatorSlot.vue)

````vue
<template>
  <div>
    <q-splitter v-model="splitterModel" style="height: 400px">
      <template v-slot:before>
        <div class="q-pa-md">
          <div class="text-h4 q-mb-md">Before</div>
          <div v-for="n in 20" :key="n" class="q-my-md"
            >{{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Quis praesentium cumque magnam odio iure quidem, quod illum numquam
            possimus obcaecati commodi minima assumenda consectetur culpa fuga
            nulla ullam. In, libero.</div
          >
        </div>
      </template>

      <template v-slot:separator>
        <q-avatar
          color="primary"
          text-color="white"
          size="40px"
          icon="drag_indicator"
        />
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <div class="text-h4 q-mb-md">After</div>
          <div v-for="n in 20" :key="n" class="q-my-md"
            >{{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Quis praesentium cumque magnam odio iure quidem, quod illum numquam
            possimus obcaecati commodi minima assumenda consectetur culpa fuga
            nulla ullam. In, libero.</div
          >
        </div>
      </template>
    </q-splitter>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const splitterModel = ref(50) // start at 50%
</script>
````

### Dark design

**Example: On a dark background with customized separator**

Source: [CustomizedSeparator.vue](../../examples/QSplitter/CustomizedSeparator.vue)

````vue
<template>
  <div class="bg-grey-9 text-white">
    <q-splitter
      v-model="splitterModel"
      separator-class="bg-orange"
      separator-style="width: 3px"
      style="height: 400px"
    >
      <template v-slot:before>
        <div class="q-pa-md">
          <div class="text-h4 q-mb-md">Before</div>
          <div v-for="n in 20" :key="n" class="q-my-md"
            >{{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Quis praesentium cumque magnam odio iure quidem, quod illum numquam
            possimus obcaecati commodi minima assumenda consectetur culpa fuga
            nulla ullam. In, libero.</div
          >
        </div>
      </template>

      <template v-slot:after>
        <div class="q-pa-md">
          <div class="text-h4 q-mb-md">After</div>
          <div v-for="n in 20" :key="n" class="q-my-md"
            >{{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Quis praesentium cumque magnam odio iure quidem, quod illum numquam
            possimus obcaecati commodi minima assumenda consectetur culpa fuga
            nulla ullam. In, libero.</div
          >
        </div>
      </template>
    </q-splitter>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const splitterModel = ref(50) // start at 50%
</script>
````

### Embedded

A QSplitter can be embedded in another QSplitter's `before` and/or `after` slots, like shown in example below.

**Example: Embedded**

Source: [Embedded.vue](../../examples/QSplitter/Embedded.vue)

````vue
<template>
  <div>
    <q-splitter v-model="splitterModel" style="height: 400px">
      <template v-slot:before>
        <div class="q-pa-md">
          <div class="text-h4 q-mb-md">Before</div>
          <div v-for="n in 20" :key="n" class="q-my-md"
            >{{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Quis praesentium cumque magnam odio iure quidem, quod illum numquam
            possimus obcaecati commodi minima assumenda consectetur culpa fuga
            nulla ullam. In, libero.</div
          >
        </div>
      </template>

      <template v-slot:after>
        <q-splitter v-model="insideModel" horizontal>
          <template v-slot:before>
            <div class="q-pa-md">
              <div class="text-h4 q-mb-md">Before</div>
              <div v-for="n in 20" :key="n" class="q-my-md"
                >{{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing
                elit. Quis praesentium cumque magnam odio iure quidem, quod
                illum numquam possimus obcaecati commodi minima assumenda
                consectetur culpa fuga nulla ullam. In, libero.</div
              >
            </div>
          </template>

          <template v-slot:after>
            <div class="q-pa-md">
              <div class="text-h4 q-mb-md">After</div>
              <div v-for="n in 20" :key="n" class="q-my-md"
                >{{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing
                elit. Quis praesentium cumque magnam odio iure quidem, quod
                illum numquam possimus obcaecati commodi minima assumenda
                consectetur culpa fuga nulla ullam. In, libero.</div
              >
            </div>
          </template>
        </q-splitter>
      </template>
    </q-splitter>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const splitterModel = ref(50) // start at 50%
const insideModel = ref(50)
</script>
````

### Fun examples

**Example: Image Fun**

Source: [ImageFun.vue](../../examples/QSplitter/ImageFun.vue)

````vue
<template>
  <div class="overflow-hidden">
    <q-resize-observer @resize="onResize" :debounce="0" />

    <q-splitter
      id="photos"
      v-model="splitterModel"
      :limits="[0, 100]"
      :style="splitterStyle"
      before-class="overflow-hidden"
      after-class="overflow-hidden"
    >
      <template v-slot:before>
        <img
          src="https://cdn.quasar.dev/img/parallax1.jpg"
          :width="width"
          class="absolute-top-left"
        />
      </template>

      <template v-slot:after>
        <img
          src="https://cdn.quasar.dev/img/parallax1-bw.jpg"
          :width="width"
          class="absolute-top-right"
        />
      </template>
    </q-splitter>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const width = ref(400)
const splitterModel = ref(50) // start at 50%

const splitterStyle = computed(() => ({
  height: Math.min(600, 0.66 * width.value) + 'px',
  width: width.value + 'px'
}))

function onResize(info) {
  width.value = info.width
}
</script>
````

**Example: Reactive Images**

Source: [ReactiveImages.vue](../../examples/QSplitter/ReactiveImages.vue)

````vue
<template>
  <div>
    <q-splitter
      v-model="splitterModel"
      style="height: 300px"
      :limits="[0, 100]"
      before-class="overflow-hidden"
      after-class="overflow-hidden"
      separator-class="bg-black"
    >
      <template v-slot:before>
        <q-img src="https://cdn.quasar.dev/img/parallax1.jpg" :ratio="16 / 9" />
      </template>

      <template v-slot:after>
        <q-img
          src="https://cdn.quasar.dev/img/parallax1-inverted.jpg"
          :ratio="16 / 9"
        />
      </template>
    </q-splitter>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const splitterModel = ref(50) // start at 50%
</script>
````
