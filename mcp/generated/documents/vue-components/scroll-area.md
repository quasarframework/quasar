---
title: Scroll Area
description: The QScrollArea Vue component offers a way of customizing the scrollbars for all desktop browsers.
canonical: https://quasar.dev/vue-components/scroll-area
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QScrollArea](../../api/QScrollArea.md)

The QScrollArea component offers a neat way of customizing the scrollbars by encapsulating your content. Think of it as a DOM element which has `overflow: auto`, but with your own custom styled scrollbar instead of browser's default one and a few nice features on top.

**API reference:** [QScrollArea](../../api/QScrollArea.md)

## Usage

The following examples are best seen on desktop as they make too little sense on a mobile device.

::: tip
You can also take a look at [Layout Drawer](/layout/drawer) to see some more examples of it in action.
:::

### Basic

**Example: Vertical content**

Source: [Vertical.vue](../../examples/QScrollArea/Vertical.vue)

````vue
<template>
  <div class="q-ma-md">
    <q-scroll-area style="height: 200px; max-width: 300px">
      <div v-for="n in 100" :key="n" class="q-py-xs">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </div>
    </q-scroll-area>
  </div>
</template>
````

**Example: Horizontal content**

Source: [Horizontal.vue](../../examples/QScrollArea/Horizontal.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-scroll-area style="height: 230px; max-width: 300px">
      <div class="row no-wrap">
        <div v-for="n in 10" :key="n" style="width: 150px" class="q-pa-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
          fuga quae veritatis blanditiis sequi id expedita amet esse aspernatur!
          Iure, doloribus!
        </div>
      </div>
    </q-scroll-area>
  </div>
</template>
````

**Example: Vertical and horizontal content**

Source: [VertHoriz.vue](../../examples/QScrollArea/VertHoriz.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-scroll-area style="height: 230px; max-width: 300px">
      <div class="row no-wrap" v-for="r in 4" :key="'r' + r">
        <div v-for="n in 10" :key="n" style="width: 150px" class="q-pa-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
          fuga quae veritatis blanditiis sequi id expedita amet esse aspernatur!
          Iure, doloribus!
        </div>
      </div>
    </q-scroll-area>
  </div>
</template>
````

### Styled

**Example: Styled thumb and bar**

Source: [StyledBar.vue](../../examples/QScrollArea/StyledBar.vue)

````vue
<template>
  <div class="q-ma-md">
    <q-scroll-area
      :horizontal-offset="[0, 2]"
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
      style="height: 200px; max-width: 300px"
    >
      <div v-for="n in 100" :key="n" class="q-pa-xs">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </div>
    </q-scroll-area>
  </div>
</template>

<script setup>
const thumbStyle = {
  borderRadius: '5px',
  backgroundColor: '#027be3',
  width: '5px',
  opacity: 0.75
}

const barStyle = {
  borderRadius: '9px',
  backgroundColor: '#027be3',
  width: '9px',
  opacity: 0.2
}
</script>
````

**Example: Styled**

Source: [Styled.vue](../../examples/QScrollArea/Styled.vue)

````vue
<template>
  <div class="q-ma-md">
    <q-scroll-area
      :horizontal-offset="[0, 2]"
      :thumb-style="thumbStyle"
      :content-style="contentStyle"
      :content-active-style="contentActiveStyle"
      style="height: 200px; max-width: 300px"
    >
      <div v-for="n in 100" :key="n" class="q-pa-xs">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </div>
    </q-scroll-area>
  </div>
</template>

<script setup>
const contentStyle = {
  backgroundColor: 'rgba(0,0,0,0.02)',
  color: '#555'
}

const contentActiveStyle = {
  backgroundColor: '#eee',
  color: 'black'
}

const thumbStyle = {
  borderRadius: '5px',
  backgroundColor: '#027be3',
  width: '5px',
  opacity: '0.75'
}
</script>
````

### Dark design

**Example: Force dark mode**

Source: [Dark.vue](../../examples/QScrollArea/Dark.vue)

````vue
<template>
  <div class="q-ma-md">
    <q-scroll-area
      dark
      class="bg-grey-9 text-white rounded-borders"
      style="height: 200px; max-width: 300px"
    >
      <div v-for="n in 100" :key="n" class="q-py-sm q-px-md">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </div>
    </q-scroll-area>
  </div>
</template>
````

### Controlling scrollbar visibility

When using the `visible` Boolean prop, the default mouse over/leave behavior is disabled, leaving you in full control of the scrollbar visibility.

**Example: Controlling scrollbar visibility**

Source: [ScrollbarVisibility.vue](../../examples/QScrollArea/ScrollbarVisibility.vue)

````vue
<template>
  <div class="q-ma-md">
    <div>
      <q-toggle v-model="visible" label="Show scrollbar" />
    </div>

    <q-scroll-area :visible="visible" style="height: 200px; max-width: 300px">
      <div v-for="n in 100" :key="n" class="q-py-xs">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </div>
    </q-scroll-area>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(true)
</script>
````

### Delay

When content changes, the scrollbar appears then disappears again. You can set a certain delay (amount of time in milliseconds) before scrollbar disappears again (if component is not hovered):

**Example: Delay**

Source: [Delay.vue](../../examples/QScrollArea/Delay.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn-group class="q-mb-md">
      <q-btn color="primary" @click="less">Less</q-btn>
      <q-btn color="secondary" @click="more">More</q-btn>
    </q-btn-group>

    <q-scroll-area :delay="1200" style="height: 200px; max-width: 300px">
      <div v-for="n in number" :key="n">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </div>
    </q-scroll-area>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const number = ref(4)

function less() {
  if (number.value > 1) {
    number.value--
  }
}

function more() {
  number.value++
}
</script>
````

### Scroll position

**Example: Scroll Position**

Source: [ScrollPosition.vue](../../examples/QScrollArea/ScrollPosition.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="row q-gutter-md q-mb-md">
      <q-btn
        :label="`Scroll to ${position}px`"
        color="primary"
        @click="scroll"
      />
      <q-btn
        :label="`Animate to ${position}px`"
        color="primary"
        @click="animateScroll"
      />
    </div>

    <q-scroll-area ref="scrollAreaRef" style="height: 150px; max-width: 300px">
      <ol>
        <li v-for="n in 1000" :key="n">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        </li>
      </ol>
    </q-scroll-area>
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'

const position = ref(300)
const scrollAreaRef = useTemplateRef('scrollAreaRef')

function scroll() {
  scrollAreaRef.value.setScrollPosition('vertical', position.value)
  position.value = Math.floor(Math.random() * 1001) * 20
}

function animateScroll() {
  scrollAreaRef.value.setScrollPosition('vertical', position.value, 300)
  position.value = Math.floor(Math.random() * 1001) * 20
}
</script>
````

### Scroll event

Below is an example of using the `@scroll` event to synchronize the scrolling between two containers.

**Example: Synchronized**

Source: [Synchronized.vue](../../examples/QScrollArea/Synchronized.vue)

````vue
<template>
  <div class="q-ma-md row no-wrap">
    <q-scroll-area
      visible
      :horizontal-offset="[0, 2]"
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
      style="height: 200px"
      class="col"
      ref="firstRef"
      @scroll="onScrollFirst"
    >
      <div v-for="n in 100" :key="n" class="q-pa-sm">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </div>
    </q-scroll-area>

    <q-scroll-area
      visible
      :horizontal-offset="[0, 2]"
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
      style="height: 200px"
      class="col"
      ref="secondRef"
      @scroll="onScrollSecond"
    >
      <div v-for="n in 100" :key="n" class="q-pa-sm">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </div>
    </q-scroll-area>
  </div>
</template>

<script setup>
import { useTemplateRef } from 'vue'

const firstRef = useTemplateRef('firstRef')
const secondRef = useTemplateRef('secondRef')

let ignoreSource

function scroll(source, position) {
  // if we previously just updated
  // the scroll position, then ignore
  // this update as otherwise we'll flicker
  // the position from one scroll area to
  // the other in an infinite loop
  if (ignoreSource === source) {
    ignoreSource = null
    return
  }

  // we'll now update the other scroll area,
  // which will also trigger a @scroll event...
  // and we need to ignore that one
  ignoreSource = source === 'first' ? 'second' : 'first'

  const areaRef = source === 'first' ? secondRef : firstRef

  areaRef.value.setScrollPosition('vertical', position)
}

const thumbStyle = {
  borderRadius: '7px',
  backgroundColor: '#027be3',
  width: '4px',
  opacity: 0.75
}

const barStyle = {
  borderRadius: '9px',
  backgroundColor: '#027be3',
  width: '8px',
  opacity: 0.2
}

function onScrollFirst({ verticalPosition }) {
  scroll('first', verticalPosition)
}

function onScrollSecond({ verticalPosition }) {
  scroll('second', verticalPosition)
}
</script>
````
