---
title: Avatar
description: The QAvatar Vue component creates an element that can embed a letter, an icon or an image within its shape.
canonical: https://quasar.dev/vue-components/avatar
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QAvatar](../../api/QAvatar.md)

The QAvatar component creates a scalable, color-able element that can have text, icon or image within its shape. By default it is circular, but it can also be square or have a border-radius applied to give rounded corners to the square shape.

It is often used with other components in their slots.

**API reference:** [QAvatar](../../api/QAvatar.md)

## Usage

::: tip
The `size` property will determine the height and the width of the Avatar. The `font-size` property will set the size of the font used within the Avatar, which will have an effect on the size of letters and icons.
:::

**Example: Basic**

Source: [Basic.vue](../../examples/QAvatar/Basic.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-avatar color="red" text-color="white" icon="directions" />
    <q-avatar color="primary" text-color="white">J</q-avatar>
    <q-avatar
      size="100px"
      font-size="52px"
      color="teal"
      text-color="white"
      icon="directions"
    />
    <q-avatar size="24px" color="orange">J</q-avatar>
    <q-avatar>
      <img src="https://cdn.quasar.dev/img/avatar.png" />
    </q-avatar>
  </div>
</template>
````

**Example: Standard sizes**

Source: [StandardSizes.vue](../../examples/QAvatar/StandardSizes.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-avatar
      v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']"
      :key="size"
      :size="size"
      color="primary"
      text-color="white"
      icon="directions"
    />
  </div>
</template>
````

**Example: Square**

Source: [Square.vue](../../examples/QAvatar/Square.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-avatar square color="red" text-color="white" icon="directions" />
    <q-avatar square color="primary" text-color="white">J</q-avatar>
    <q-avatar
      square
      size="100px"
      font-size="82px"
      color="teal"
      text-color="white"
      icon="directions"
    />
    <q-avatar square size="24px" color="orange">J</q-avatar>
    <q-avatar square>
      <img src="https://cdn.quasar.dev/img/avatar.png" />
    </q-avatar>
  </div>
</template>
````

**Example: Rounded**

Source: [Rounded.vue](../../examples/QAvatar/Rounded.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-avatar rounded color="red" text-color="white" icon="directions" />
    <q-avatar rounded color="primary" text-color="white">J</q-avatar>
    <q-avatar
      rounded
      size="100px"
      font-size="82px"
      color="teal"
      text-color="white"
      icon="directions"
    />
    <q-avatar rounded size="24px" color="orange">J</q-avatar>
    <q-avatar rounded>
      <img src="https://cdn.quasar.dev/img/avatar.png" />
    </q-avatar>
  </div>
</template>
````

**Example: With other components**

Source: [Integrated.vue](../../examples/QAvatar/Integrated.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-y-md">
    <div class="q-gutter-sm">
      <q-chip>
        <q-avatar color="red" text-color="white">50</q-avatar>
        Emails
      </q-chip>
      <q-chip>
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
        </q-avatar>
        John
      </q-chip>
    </div>

    <div class="q-gutter-x-sm">
      <q-btn round color="white">
        <q-avatar size="28px">
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
        </q-avatar>
      </q-btn>
      <!-- #region -->
      <q-btn round color="white">
        <q-avatar size="32px">
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
        </q-avatar>
      </q-btn>
      <!-- #endregion -->
      <q-btn round color="white">
        <q-avatar size="40px">
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
        </q-avatar>
      </q-btn>
    </div>

    <q-item clickable v-ripple>
      <q-item-section side>
        <q-avatar rounded size="48px">
          <img src="https://cdn.quasar.dev/img/avatar.png" />
          <q-badge floating color="teal">new</q-badge>
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>Mary</q-item-label>
        <q-item-label caption>2 new messages</q-item-label>
      </q-item-section>
      <q-item-section side> 3 min ago </q-item-section>
    </q-item>

    <q-banner rounded class="bg-primary text-white">
      <template v-slot:avatar>
        <q-avatar icon="signal_wifi_off" color="white" text-color="primary" />
      </template>

      You have lost connection to the internet. This app is offline.

      <template v-slot:action>
        <q-btn flat color="white" label="Turn ON Wifi" />
      </template>
    </q-banner>
  </div>
</template>
````

**Example: Overlapping avatars**

Source: [Overlapping.vue](../../examples/QAvatar/Overlapping.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm" style="height: 80px">
    <q-avatar
      v-for="n in 5"
      :key="n"
      size="40px"
      class="overlapping"
      :style="`left: ${n * 25}px`"
    >
      <img :src="`https://cdn.quasar.dev/img/avatar${n + 1}.jpg`" />
    </q-avatar>
  </div>
</template>

<style lang="sass" scoped>
.overlapping
  border: 2px solid white
  position: absolute
</style>
````
