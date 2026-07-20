---
title: Dropdown Button
description: The QBtnDropdown Vue component is used to display dropdown content on a button.
canonical: https://quasar.dev/vue-components/button-dropdown
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QBtnDropdown](../../api/QBtnDropdown.md)

QBtnDropdown is a very convenient dropdown button. Goes very well with [QList](/vue-components/list-and-list-items) as dropdown content, but it's by no means limited to it.

In case you are looking for a dropdown "input" instead of "button" use [Select](/vue-components/select) instead.

**API reference:** [QBtnDropdown](../../api/QBtnDropdown.md)

## Usage

**Example: Basic**

Source: [Basic.vue](../../examples/QBtnDropdown/Basic.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn-dropdown color="primary" label="Dropdown Button">
      <q-list>
        <q-item clickable v-close-popup @click="onItemClick">
          <q-item-section>
            <q-item-label>Photos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="onItemClick">
          <q-item-section>
            <q-item-label>Videos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="onItemClick">
          <q-item-section>
            <q-item-label>Articles</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script setup>
function onItemClick() {
  console.log('Clicked on an Item')
}
</script>
````

**Example: Various content**

Source: [VariousContent.vue](../../examples/QBtnDropdown/VariousContent.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn-dropdown class="glossy" color="purple" label="Account Settings">
      <div class="row no-wrap q-pa-md">
        <div class="column">
          <div class="text-h6 q-mb-md">Settings</div>
          <q-toggle v-model="mobileData" label="Use Mobile Data" />
          <q-toggle v-model="bluetooth" label="Bluetooth" />
        </div>

        <q-separator vertical inset class="q-mx-lg" />

        <div class="column items-center">
          <q-avatar size="72px">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>

          <div class="text-subtitle1 q-mt-md q-mb-xs">John Doe</div>

          <q-btn color="primary" label="Logout" push size="sm" v-close-popup />
        </div>
      </div>
    </q-btn-dropdown>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const mobileData = ref(false)
const bluetooth = ref(false)
</script>
````

**Example: Split**

Source: [Split.vue](../../examples/QBtnDropdown/Split.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn-dropdown
      split
      class="glossy"
      color="teal"
      label="Folders"
      @click="onMainClick"
    >
      <q-list>
        <q-item clickable v-close-popup @click="onItemClick">
          <q-item-section avatar>
            <q-avatar icon="folder" color="primary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Photos</q-item-label>
            <q-item-label caption>February 22, 2016</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="onItemClick">
          <q-item-section avatar>
            <q-avatar icon="assignment" color="secondary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Vacation</q-item-label>
            <q-item-label caption>February 22, 2016</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script setup>
function onMainClick() {
  console.log('Clicked on main button')
}

function onItemClick() {
  console.log('Clicked on an Item')
}
</script>
````

**Example: Custom button**

Source: [CustomButton.vue](../../examples/QBtnDropdown/CustomButton.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn-dropdown
      split
      color="orange"
      push
      glossy
      no-caps
      icon="folder"
      label="Dropdown Button"
      @click="onMainClick"
    >
      <q-list>
        <q-item clickable v-close-popup @click="onItemClick">
          <q-item-section avatar>
            <q-avatar icon="folder" color="primary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Photos</q-item-label>
            <q-item-label caption>February 22, 2016</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="onItemClick">
          <q-item-section avatar>
            <q-avatar icon="assignment" color="secondary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Vacation</q-item-label>
            <q-item-label caption>February 22, 2016</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script setup>
function onMainClick() {
  console.log('Clicked on main button')
}

function onItemClick() {
  console.log('Clicked on an Item')
}
</script>
````

**Example: Custom dropdown icon**

Source: [CustomDropdownIcon.vue](../../examples/QBtnDropdown/CustomDropdownIcon.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn-dropdown
      color="pink"
      label="Dropdown Button"
      dropdown-icon="change_history"
    >
      <q-list>
        <q-item clickable v-close-popup @click="onItemClick">
          <q-item-section>
            <q-item-label>Photos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="onItemClick">
          <q-item-section>
            <q-item-label>Videos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="onItemClick">
          <q-item-section>
            <q-item-label>Articles</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script setup>
function onItemClick() {
  console.log('Clicked on an Item')
}
</script>
````

**Example: Label slot**

Source: [LabelSlot.vue](../../examples/QBtnDropdown/LabelSlot.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn-dropdown split color="cyan" push no-caps @click="onMainClick">
      <template v-slot:label>
        <div class="row items-center no-wrap">
          <q-icon left name="map" />
          <div class="text-center"> Custom<br />Content </div>
        </div>
      </template>

      <q-list>
        <q-item clickable v-close-popup @click="onItemClick">
          <q-item-section avatar>
            <q-avatar icon="folder" color="primary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Photos</q-item-label>
            <q-item-label caption>February 22, 2016</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="onItemClick">
          <q-item-section avatar>
            <q-avatar icon="assignment" color="secondary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Vacation</q-item-label>
            <q-item-label caption>February 22, 2016</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script setup>
function onMainClick() {
  console.log('Clicked on main button')
}

function onItemClick() {
  console.log('Clicked on an Item')
}
</script>
````

**Example: Using v-model**

Source: [Model.vue](../../examples/QBtnDropdown/Model.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-toggle v-model="menu" label="Menu state" />

    <q-btn-dropdown
      v-model="menu"
      class="glossy q-ml-lg"
      color="primary"
      label="Dropdown"
    >
      <q-list>
        <q-item clickable v-close-popup @click="onItemClick">
          <q-item-section avatar>
            <q-avatar icon="folder" color="primary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Photos</q-item-label>
            <q-item-label caption>February 22, 2016</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="onItemClick">
          <q-item-section avatar>
            <q-avatar icon="assignment" color="secondary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Vacation</q-item-label>
            <q-item-label caption>February 22, 2016</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const menu = ref(false)
function onItemClick() {
  console.log('Clicked on an Item')
}
</script>
````

**Example: Disable**

Source: [Disable.vue](../../examples/QBtnDropdown/Disable.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="row q-gutter-sm">
      <q-btn-dropdown disable class="glossy" color="primary" label="Default">
        <q-list>
          <q-item clickable v-close-popup>
            <q-item-section avatar>
              <q-avatar icon="folder" color="primary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Photos</q-item-label>
              <q-item-label caption>February 22, 2016</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <q-btn-dropdown
        split
        disable-main-btn
        class="glossy"
        color="primary"
        label="Only main btn"
      >
        <q-list>
          <q-item clickable v-close-popup>
            <q-item-section avatar>
              <q-avatar icon="folder" color="primary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Photos</q-item-label>
              <q-item-label caption>February 22, 2016</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup>
            <q-item-section avatar>
              <q-avatar
                icon="assignment"
                color="secondary"
                text-color="white"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>Vacation</q-item-label>
              <q-item-label caption>February 22, 2016</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <q-btn-dropdown
        split
        disable-dropdown
        class="glossy"
        color="primary"
        label="Only dropdown"
      >
        <q-list>
          <q-item clickable v-close-popup>
            <q-item-section avatar>
              <q-avatar icon="folder" color="primary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Photos</q-item-label>
              <q-item-label caption>February 22, 2016</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
  </div>
</template>
````

The following example won't work with UMD version (so in Codepen/jsFiddle too) because it relies on the existence of Vue Router.

**Example: Split and router link on main**

Source: [Link.vue](../../examples/QBtnDropdown/Link.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn-dropdown
      split
      to="/start/pick-quasar-flavour"
      color="teal"
      rounded
      label="Go to Docs Index"
    >
      <q-list>
        <q-item clickable v-close-popup>
          <q-item-section>
            <q-item-label>Photos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup>
          <q-item-section>
            <q-item-label>Videos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup>
          <q-item-section>
            <q-item-label>Articles</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>
````
