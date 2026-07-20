---
title: Badge
description: The QBadge Vue component allows you to display information like contextual data that needs to stand out and get noticed.
canonical: https://quasar.dev/vue-components/badge
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QBadge](../../api/QBadge.md)

The QBadge component allows you to create a small badge for adding information like contextual data that needs to stand out and get noticed. It is also often useful in combination with other elements like a user avatar to show a number of new messages.

**API reference:** [QBadge](../../api/QBadge.md)

## Usage

**Example: Basic**

Source: [Basic.vue](../../examples/QBadge/Basic.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-md">
    <q-badge color="blue"> #4D96F2 </q-badge>

    <q-badge color="orange" text-color="black" label="2" />

    <q-badge color="purple">
      <q-icon name="bluetooth" color="white" />
    </q-badge>

    <q-badge color="red">
      12 <q-icon name="warning" color="white" class="q-ml-xs" />
    </q-badge>

    <div class="text-h6">
      Badge <q-badge color="primary">v1.0.0+</q-badge>
    </div>

    <div> Feature <q-badge color="primary">v1.0.0+</q-badge> </div>

    <q-item
      clickable
      v-ripple
      class="rounded-borders"
      :class="$q.dark.isActive ? 'bg-grey-9 text-white' : 'bg-grey-2'"
    >
      <q-item-section avatar>
        <q-avatar rounded>
          <img src="https://cdn.quasar.dev/img/chaosmonkey.png" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label> Ganglia </q-item-label>
        <q-item-label caption>
          <q-badge color="yellow-6" text-color="black">
            3
            <q-icon name="warning" size="14px" class="q-ml-xs" />
          </q-badge>
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <span>2 min ago</span>
      </q-item-section>
    </q-item>
  </div>
</template>
````

**Example: Aligned**

Source: [Align.vue](../../examples/QBadge/Align.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <div class="text-h4">
      Title
      <q-badge align="top">cli v1.0.0</q-badge>
    </div>

    <q-separator />

    <div class="text-h4">
      Title
      <q-badge align="middle">app v1.0.0</q-badge>
    </div>

    <q-separator />

    <div class="text-h4">
      Title
      <q-badge align="bottom">docs v1.0.0</q-badge>
    </div>
  </div>
</template>
````

**Example: Floating**

Source: [Floating.vue](../../examples/QBadge/Floating.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn push color="white" text-color="primary" label="Unread Mails">
      <q-badge color="orange" floating>22</q-badge>
    </q-btn>

    <q-btn dense color="purple" round icon="email" class="q-ml-md">
      <q-badge color="red" floating>4</q-badge>
    </q-btn>
  </div>
</template>
````

**Example: Transparent**

Source: [Transparent.vue](../../examples/QBadge/Transparent.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-md">
    <q-btn color="teal" size="sm" label="Unread Mails">
      <q-badge color="orange" floating transparent> ∞ </q-badge>
    </q-btn>

    <q-btn dense round flat icon="email">
      <q-badge color="red" floating transparent> 4 </q-badge>
    </q-btn>

    <div class="text-h4">
      Title
      <q-badge transparent align="middle" color="orange"> app v3.0.0 </q-badge>
    </div>
  </div>
</template>
````

**Example: Outline design**

Source: [Outline.vue](../../examples/QBadge/Outline.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-md">
    <q-badge outline color="primary" label="Outline" />
    <q-badge outline color="orange" label="Outline" />
    <q-badge outline color="secondary" label="Outline" />

    <div class="text-h4">
      Text
      <q-badge outline align="middle" color="teal"> v2.0.0 </q-badge>
    </div>
  </div>
</template>
````

**Example: Rounded**

Source: [Rounded.vue](../../examples/QBadge/Rounded.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-md">
    <q-badge rounded color="red" label="1" />
    <q-badge rounded color="primary" label="999+" />
    <q-badge rounded color="orange" label="Round" />
  </div>
</template>
````

**Example: Indicators**

Source: [Indicators.vue](../../examples/QBadge/Indicators.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-md">
    <q-badge rounded color="yellow" />
    <q-badge rounded color="green" />
    <q-badge rounded color="red" />
    <div class="q-gutter-md q-ml-none">
      <q-btn round icon="notifications">
        <q-badge floating color="red" rounded />
      </q-btn>
      <q-btn color="blue">
        Notifications
        <q-badge color="red" rounded floating />
      </q-btn>
    </div>
    <div> <q-badge color="blue" rounded class="q-mr-sm" />Status </div>
  </div>
</template>
````
