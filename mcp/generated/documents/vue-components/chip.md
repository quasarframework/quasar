---
title: Chip
description: The QChip Vue component is a simple UI block entity, representing for example more advanced underlying data, such as a contact, but in a compact way.
canonical: https://quasar.dev/vue-components/chip
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QChip](../../api/QChip.md)

The QChip component is basically a simple UI block entity, representing for example more advanced underlying data, such as a contact, in a compact way.

Chips can contain entities such as an avatar, text or an icon, optionally having a pointer too. They can also be closed or removed if configured so.

::: tip
Also check out [QBadge](/vue-components/badge).
:::

**API reference:** [QChip](../../api/QChip.md)

## Usage

**Example: Basic**

Source: [Basic.vue](../../examples/QChip/Basic.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-md">
    <div>
      <q-chip icon="event">Add to calendar</q-chip>
      <q-chip icon="bookmark">Bookmark</q-chip>
      <q-chip icon="alarm" label="Set alarm" />
      <q-chip class="glossy" icon="directions">Get directions</q-chip>
    </div>
    <div>
      <q-chip color="primary" text-color="white" icon="event">
        Add to calendar
      </q-chip>
      <q-chip color="teal" text-color="white" icon="bookmark">
        Bookmark
      </q-chip>
      <q-chip
        class="glossy"
        color="orange"
        text-color="white"
        icon-right="star"
      >
        Star
      </q-chip>
      <q-chip color="red" text-color="white" icon="alarm" label="Set alarm" />
      <q-chip color="deep-orange" text-color="white" icon="directions">
        Get directions
      </q-chip>
      <q-chip>
        <q-avatar icon="bookmark" color="red" text-color="white" />
        Bookmark
      </q-chip>
      <q-chip>
        <q-avatar color="red" text-color="white">50</q-avatar>
        Emails
      </q-chip>
      <q-chip>
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
        </q-avatar>
        John
      </q-chip>
    </div>
  </div>
</template>
````

**Example: Dense**

Source: [Dense.vue](../../examples/QChip/Dense.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-md">
    <div>
      <q-chip dense icon="event">Add to calendar</q-chip>
      <q-chip dense icon="bookmark">Bookmark</q-chip>
      <q-chip dense icon="alarm" label="Set alarm" />
      <q-chip dense icon="directions">Get directions</q-chip>
    </div>
    <div>
      <q-chip dense color="primary" text-color="white" icon="event">
        Add to calendar
      </q-chip>
      <q-chip dense color="teal" text-color="white" icon="bookmark">
        Bookmark
      </q-chip>
      <q-chip dense color="orange" text-color="white" icon-right="star">
        Star
      </q-chip>
      <q-chip
        dense
        color="red"
        text-color="white"
        icon="alarm"
        label="Set alarm"
      />
      <q-chip dense color="deep-orange" text-color="white" icon="directions">
        Get directions
      </q-chip>
      <q-chip dense>
        <q-avatar icon="bookmark" color="red" text-color="white" />
        Bookmark
      </q-chip>
      <q-chip dense>
        <q-avatar color="red" text-color="white">50</q-avatar>
        Emails
      </q-chip>
      <q-chip dense>
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/avatar3.jpg" />
        </q-avatar>
        Mary
      </q-chip>
    </div>
  </div>
</template>
````

**Example: Custom size**

Source: [Sizes.vue](../../examples/QChip/Sizes.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-md">
    <div>
      <q-chip size="18px" icon="bookmark"> Bookmark </q-chip>
    </div>

    <div>
      <q-chip size="xs" icon="bookmark"> Bookmark </q-chip>

      <q-chip size="sm" icon="bookmark"> Bookmark </q-chip>

      <q-chip size="md" icon="bookmark"> Bookmark </q-chip>

      <q-chip size="lg" icon="bookmark"> Bookmark </q-chip>

      <q-chip size="xl" icon="bookmark"> Bookmark </q-chip>
    </div>

    <div>
      <q-chip dense size="xs" icon="bookmark"> Bookmark </q-chip>

      <q-chip dense size="sm" icon="bookmark"> Bookmark </q-chip>

      <q-chip dense size="md" icon="bookmark"> Bookmark </q-chip>

      <q-chip dense size="lg" icon="bookmark"> Bookmark </q-chip>

      <q-chip dense size="xl" icon="bookmark"> Bookmark </q-chip>
    </div>
  </div>
</template>
````

**Example: Square**

Source: [Square.vue](../../examples/QChip/Square.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-md">
    <div>
      <q-chip square icon="event">Add to calendar</q-chip>
      <q-chip class="glossy" square icon="bookmark">Bookmark</q-chip>
      <q-chip square icon="alarm" label="Set alarm" />
      <q-chip square icon="directions">Get directions</q-chip>
    </div>
    <div>
      <q-chip square color="primary" text-color="white" icon="event">
        Add to calendar
      </q-chip>
      <q-chip
        class="glossy"
        square
        color="teal"
        text-color="white"
        icon="bookmark"
      >
        Bookmark
      </q-chip>
      <q-chip square color="orange" text-color="white" icon-right="star">
        Star
      </q-chip>
      <q-chip
        square
        color="red"
        text-color="white"
        icon="alarm"
        label="Set alarm"
      />
      <q-chip square color="deep-orange" text-color="white" icon="directions">
        Get directions
      </q-chip>
      <q-chip square>
        <q-avatar icon="bookmark" color="red" text-color="white" />
        Bookmark
      </q-chip>
      <q-chip square>
        <q-avatar color="red" text-color="white">50</q-avatar>
        Emails
      </q-chip>
      <q-chip square>
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
        </q-avatar>
        John
      </q-chip>
    </div>
  </div>
</template>
````

**Example: Outline**

Source: [Outline.vue](../../examples/QChip/Outline.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-chip outline color="primary" text-color="white" icon="event">
      Add to calendar
    </q-chip>
    <q-chip outline color="teal" text-color="white" icon="bookmark">
      Bookmark
    </q-chip>
    <q-chip outline color="orange" text-color="white" icon-right="star">
      Star
    </q-chip>
    <q-chip
      outline
      square
      color="red"
      text-color="white"
      icon="alarm"
      label="Set alarm"
    />
    <q-chip
      outline
      square
      color="deep-orange"
      text-color="white"
      icon="directions"
    >
      Get directions
    </q-chip>
  </div>
</template>
````

**Example: Clickable**

Source: [Clickable.vue](../../examples/QChip/Clickable.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-chip
      clickable
      @click="onClick"
      color="primary"
      text-color="white"
      icon="event"
    >
      Add to calendar
    </q-chip>
    <q-chip clickable @click="onClick" icon="bookmark"> Bookmark </q-chip>
    <q-chip
      clickable
      @click="onClick"
      color="teal"
      text-color="white"
      icon="bookmark"
    >
      Bookmark
    </q-chip>
    <q-chip
      clickable
      @click="onClick"
      color="red"
      text-color="white"
      icon="alarm"
      label="Set alarm"
    />
    <q-chip
      clickable
      @click="onClick"
      color="orange"
      text-color="white"
      icon="directions"
    >
      Get directions
    </q-chip>
  </div>
</template>

<script setup>
function onClick() {
  console.log('Clicked on a QChip')
}
</script>
````

**Example: Selected**

Source: [Selected.vue](../../examples/QChip/Selected.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-xs">
      <q-chip
        v-model:selected="desert.Icecream"
        color="primary"
        text-color="white"
        icon="cake"
      >
        Ice cream
      </q-chip>
      <!-- #region -->
      <q-chip
        v-model:selected="desert.Eclair"
        color="teal"
        text-color="white"
        icon="cake"
      >
        Eclair
      </q-chip>
      <q-chip
        v-model:selected="desert.Cupcake"
        color="orange"
        text-color="white"
        icon="cake"
      >
        Cupcake
      </q-chip>
      <q-chip
        v-model:selected="desert.Gingerbread"
        color="red"
        text-color="white"
        icon="cake"
      >
        Gingerbread
      </q-chip>
      <!-- #endregion -->
    </div>

    <div class="q-mt-sm"> Your pick: {{ selection }} </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'

const desert = reactive({
  Icecream: false,
  Eclair: true,
  Cupcake: false,
  Gingerbread: false
})

const selection = computed(() =>
  Object.keys(desert)
    .filter(type => desert[type])
    .join(', ')
)
</script>
````

**Example: Removable**

Source: [Removable.vue](../../examples/QChip/Removable.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-xs">
      <q-chip
        removable
        v-model="icecream"
        @remove="log('Icecream')"
        color="primary"
        text-color="white"
        icon="cake"
      >
        Ice cream
      </q-chip>
      <!-- #region -->
      <q-chip
        removable
        v-model="eclair"
        @remove="log('Icecream')"
        color="teal"
        text-color="white"
        icon="cake"
      >
        Eclair
      </q-chip>
      <q-chip
        removable
        v-model="cupcake"
        @remove="log('Icecream')"
        color="orange"
        text-color="white"
        icon="cake"
      >
        Cupcake
      </q-chip>
      <!-- #endregion -->
      <q-chip
        disable
        removable
        v-model="gingerbread"
        @remove="log('Icecream')"
        color="red"
        text-color="white"
        icon="cake"
      >
        Gingerbread (disable)
      </q-chip>
    </div>

    <q-btn
      color="primary"
      label="Reset"
      @click="onResetClick"
      class="q-mt-sm"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const icecream = ref(true)
const eclair = ref(true)
const cupcake = ref(true)
const gingerbread = ref(true)

function onResetClick() {
  icecream.value = true
  eclair.value = true
  cupcake.value = true
  gingerbread.value = true
}

function log(desert) {
  console.log(`${desert} has been removed`)
}
</script>
````

**Example: Long label truncation**

Source: [LongLabel.vue](../../examples/QChip/LongLabel.vue)

````vue
<template>
  <div class="q-pa-md">
    <div
      class="q-gutter-xs row"
      style="max-width: 300px"
      :class="{ 'truncate-chip-labels': truncate }"
    >
      <q-chip
        removable
        v-model="vanilla"
        color="primary"
        text-color="white"
        icon="cake"
        :label="vanillaLabel"
        :title="vanillaLabel"
      />
      <q-chip
        removable
        v-model="chocolate"
        color="teal"
        text-color="white"
        icon="cake"
        :label="chocolateLabel"
      >
        <q-tooltip>{{ chocolateLabel }}</q-tooltip>
      </q-chip>
      <q-chip
        removable
        v-model="strawberry"
        color="orange"
        text-color="white"
        icon="cake"
      >
        <div class="ellipsis">
          {{ strawberryLabel }}
          <q-tooltip>{{ strawberryLabel }}</q-tooltip>
        </div>
      </q-chip>
      <q-chip removable v-model="cookies" color="red" text-color="white">
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
        </q-avatar>
        <div class="ellipsis">
          {{ cookiesLabel }}
          <q-tooltip>{{ cookiesLabel }}</q-tooltip>
        </div>
      </q-chip>
    </div>

    <div class="row items-center q-mt-sm">
      <q-btn
        color="primary"
        label="Reset"
        @click="onResetClick"
        class="q-mr-sm"
      />
      <q-toggle v-model="truncate" label="Truncate labels" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const vanilla = ref(true)
const chocolate = ref(true)
const strawberry = ref(true)
const cookies = ref(true)

const truncate = ref(true)

const vanillaLabel = 'I want vanilla flavoured ice cream'
const chocolateLabel = 'I want chocolate flavoured ice cream'
const strawberryLabel = 'I want strawberry flavoured ice cream'
const cookiesLabel = 'I want cookies flavoured ice cream'

function onResetClick() {
  vanilla.value = true
  chocolate.value = true
  strawberry.value = true
  cookies.value = true
}
</script>

<style lang="sass" scoped>
.truncate-chip-labels > .q-chip
  max-width: 140px
</style>
````
