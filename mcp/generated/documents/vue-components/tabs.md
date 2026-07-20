---
title: Tabs
description: The QTabs, QTab and QRouteTab Vue components are a way of helping the user navigate between pages or tab panels.
canonical: https://quasar.dev/vue-components/tabs
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QRouteTab](../../api/QRouteTab.md)
- [QTab](../../api/QTab.md)
- [QTabs](../../api/QTabs.md)

Tabs are a way of displaying more information using less window real estate. This page describes the tab selection part through QTabs, QTab and QRouteTab.

One common use case for this component is in Layout’s header/footer. Please refer to [Layouts](/layout/layout) and [Header & Footer](/layout/header-and-footer#example--playing-with-qtabs) for references.

::: tip
Works great along with [QTabPanels](/vue-components/tab-panels), a component which refers strictly to the panels (tab content) themselves.
:::

**API reference:** [QTabs](../../api/QTabs.md)

**API reference:** [QTab](../../api/QTab.md)

**API reference:** [QRouteTab](../../api/QRouteTab.md)

## Usage

::: tip TIPS

- QTabs can be scrolled horizontally when the width is longer than the container width. Adjust your browser accordingly to see this in action.
- On a desktop you will see chevrons on either side that can be clicked.
- On a mobile, you can pan the tabs with your finger.
- If you want to force arrows to be visible on mobile use `mobile-arrows` prop.

:::

::: warning
QRouteTab won't and cannot work with the UMD version if you don't also install Vue Router.
:::

### Basic

**Example: Basic**

Source: [Basic.vue](../../examples/QTabs/Basic.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
      <q-tabs v-model="tab" class="text-teal">
        <q-tab name="mails" icon="mail" label="Mails" />
        <q-tab name="alarms" icon="alarm" label="Alarms" />
        <q-tab name="movies" icon="movie" label="Movies" />
      </q-tabs>

      <q-tabs v-model="tab" inline-label class="bg-purple text-white shadow-2">
        <q-tab name="mails" icon="mail" label="Mails" />
        <q-tab name="alarms" icon="alarm" label="Alarms" />
        <q-tab name="movies" icon="movie" label="Movies" />
      </q-tabs>

      <q-tabs v-model="tab" no-caps class="bg-orange text-white shadow-2">
        <q-tab name="mails" label="Mails" />
        <q-tab name="alarms" label="Alarms" />
        <q-tab name="movies" label="Movies" />
      </q-tabs>

      <q-tabs v-model="tab" class="bg-teal text-yellow shadow-2">
        <q-tab name="mails" icon="mail" />
        <q-tab name="alarms" icon="alarm" />
        <q-tab name="movies" icon="movie" />
      </q-tabs>

      <q-tabs v-model="tab" inline-label class="bg-primary text-white shadow-2">
        <q-tab name="mails" icon="mail" label="Mails" />
        <q-tab name="alarms" icon="alarm" label="Alarms" />
        <q-tab name="movies" icon="movie" label="Movies" />
        <q-tab name="photos" icon="photo" label="Photos" />
        <q-tab name="videos" icon="slow_motion_video" label="Videos" />
        <q-tab name="addressbook" icon="people" label="Address Book" />
      </q-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tab = ref('mails')
</script>
````

### Outside, inside and visible on mobile arrows

**Example: Outside, inside and visible on mobile arrows**

Source: [ArrowsModifiers.vue](../../examples/QTabs/ArrowsModifiers.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 300px">
      <q-tabs
        v-model="tab"
        inline-label
        outside-arrows
        mobile-arrows
        class="bg-primary text-white shadow-2"
      >
        <q-tab name="mails" icon="mail" label="Mails" />
        <q-tab name="alarms" icon="alarm" label="Alarms" />
        <q-tab name="movies" icon="movie" label="Movies" />
        <q-tab name="photos" icon="photo" label="Photos" />
        <q-tab name="videos" icon="slow_motion_video" label="Videos" />
        <q-tab name="addressbook" icon="people" label="Address Book" />
      </q-tabs>

      <q-tabs
        v-model="tab"
        inline-label
        mobile-arrows
        class="bg-purple text-white shadow-2"
      >
        <q-tab name="mails" icon="mail" label="Mails" />
        <q-tab name="alarms" icon="alarm" label="Alarms" />
        <q-tab name="movies" icon="movie" label="Movies" />
        <q-tab name="photos" icon="photo" label="Photos" />
        <q-tab name="videos" icon="slow_motion_video" label="Videos" />
        <q-tab name="addressbook" icon="people" label="Address Book" />
      </q-tabs>

      <q-tabs
        v-model="tab"
        no-caps
        outside-arrows
        mobile-arrows
        class="bg-orange text-white shadow-2"
      >
        <q-tab name="mails" label="Mails" />
        <q-tab name="alarms" label="Alarms" />
        <q-tab name="movies" label="Movies" />
      </q-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tab = ref('mails')
</script>
````

### Vertical

**Example: Vertical (example with QSplitter)**

Source: [Vertical.vue](../../examples/QTabs/Vertical.vue)

````vue
<template>
  <div>
    <q-splitter v-model="splitterModel" style="height: 250px">
      <template v-slot:before>
        <q-tabs v-model="tab" vertical class="text-teal">
          <q-tab name="mails" icon="mail" label="Mails" />
          <q-tab name="alarms" icon="alarm" label="Alarms" />
          <q-tab name="movies" icon="movie" label="Movies" />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="mails">
            <div class="text-h4 q-mb-md">Mails</div>
            <p
              >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
              praesentium cumque magnam odio iure quidem, quod illum numquam
              possimus obcaecati commodi minima assumenda consectetur culpa fuga
              nulla ullam. In, libero.</p
            >
            <p
              >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
              praesentium cumque magnam odio iure quidem, quod illum numquam
              possimus obcaecati commodi minima assumenda consectetur culpa fuga
              nulla ullam. In, libero.</p
            >
          </q-tab-panel>

          <!-- #region -->
          <q-tab-panel name="alarms">
            <div class="text-h4 q-mb-md">Alarms</div>
            <p
              >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
              praesentium cumque magnam odio iure quidem, quod illum numquam
              possimus obcaecati commodi minima assumenda consectetur culpa fuga
              nulla ullam. In, libero.</p
            >
            <p
              >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
              praesentium cumque magnam odio iure quidem, quod illum numquam
              possimus obcaecati commodi minima assumenda consectetur culpa fuga
              nulla ullam. In, libero.</p
            >
          </q-tab-panel>

          <q-tab-panel name="movies">
            <div class="text-h4 q-mb-md">Movies</div>
            <p
              >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
              praesentium cumque magnam odio iure quidem, quod illum numquam
              possimus obcaecati commodi minima assumenda consectetur culpa fuga
              nulla ullam. In, libero.</p
            >
            <p
              >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
              praesentium cumque magnam odio iure quidem, quod illum numquam
              possimus obcaecati commodi minima assumenda consectetur culpa fuga
              nulla ullam. In, libero.</p
            >
            <p
              >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
              praesentium cumque magnam odio iure quidem, quod illum numquam
              possimus obcaecati commodi minima assumenda consectetur culpa fuga
              nulla ullam. In, libero.</p
            >
          </q-tab-panel>
          <!-- #endregion -->
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tab = ref('mails')
const splitterModel = ref(20)
</script>
````

### Dense

**Example: Dense**

Source: [Dense.vue](../../examples/QTabs/Dense.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
      <q-tabs v-model="tab" dense class="bg-indigo text-white">
        <q-tab name="mails" icon="mail" label="Mails" />
        <q-tab name="alarms" icon="alarm" label="Alarms" />
        <q-tab name="movies" icon="movie" label="Movies" />
      </q-tabs>

      <q-tabs
        v-model="tab"
        dense
        no-caps
        inline-label
        class="bg-purple text-white shadow-2"
      >
        <q-tab name="mails" icon="mail" label="Mails" />
        <q-tab name="alarms" icon="alarm" label="Alarms" />
        <q-tab name="movies" icon="movie" label="Movies" />
      </q-tabs>

      <q-tabs v-model="tab" dense class="bg-orange text-white shadow-2">
        <q-tab name="mails" label="Mails" />
        <q-tab name="alarms" label="Alarms" />
        <q-tab name="movies" label="Movies" />
      </q-tabs>

      <q-tabs v-model="tab" dense class="bg-teal text-yellow shadow-2">
        <q-tab name="mails" icon="mail" />
        <q-tab name="alarms" icon="alarm" />
        <q-tab name="movies" icon="movie" />
      </q-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tab = ref('mails')
</script>
````

### Individual colors

**Example: Individual colors**

Source: [IndividualColor.vue](../../examples/QTabs/IndividualColor.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 400px">
      <q-tabs v-model="tab" narrow-indicator dense align="justify">
        <q-tab class="text-purple" name="mails" icon="mail" label="Mails" />
        <q-tab class="text-orange" name="alarms" icon="alarm" label="Alarms" />
        <q-tab class="text-teal" name="movies" icon="movie" label="Movies" />
      </q-tabs>

      <q-tabs v-model="tab" class="bg-grey-9" dense align="justify">
        <q-tab class="text-orange" name="mails" icon="mail" label="Mails" />
        <q-tab class="text-cyan" name="alarms" icon="alarm" label="Alarms" />
        <q-tab class="text-red" name="movies" icon="movie" label="Movies" />
      </q-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tab = ref('mails')
</script>
````

### Ripple

**Example: No ripple and custom ripple color**

Source: [Ripples.vue](../../examples/QTabs/Ripples.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 400px">
      <q-tabs
        v-model="tab"
        narrow-indicator
        dense
        align="justify"
        class="text-primary"
      >
        <q-tab :ripple="false" name="mails" icon="mail" label="Mails" />
        <q-tab :ripple="false" name="alarms" icon="alarm" label="Alarms" />
        <q-tab :ripple="false" name="movies" icon="movie" label="Movies" />
      </q-tabs>

      <q-tabs
        v-model="tab"
        narrow-indicator
        dense
        align="justify"
        class="text-secondary"
      >
        <q-tab
          :ripple="{ color: 'orange' }"
          name="mails"
          icon="mail"
          label="Mails"
        />
        <q-tab
          :ripple="{ color: 'orange' }"
          name="alarms"
          icon="alarm"
          label="Alarms"
        />
        <q-tab
          :ripple="{ color: 'orange' }"
          name="movies"
          icon="movie"
          label="Movies"
        />
      </q-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tab = ref('mails')
</script>
````

### Custom indicator

In the examples below, please notice the last two QTabs: indicator at top and no indicator.

**Example: Custom indicator**

Source: [CustomIndicator.vue](../../examples/QTabs/CustomIndicator.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
      <q-tabs v-model="tab" indicator-color="purple" class="text-teal">
        <q-tab name="mails" icon="mail" />
        <q-tab name="alarms" icon="alarm" />
        <q-tab name="movies" icon="movie" />
      </q-tabs>

      <q-tabs
        v-model="tab"
        indicator-color="yellow"
        class="bg-primary text-white shadow-2"
      >
        <q-tab name="mails" icon="mail" label="Mails" />
        <q-tab name="alarms" icon="alarm" label="Alarms" />
        <q-tab name="movies" icon="movie" label="Movies" />
      </q-tabs>

      <q-tabs
        v-model="tab"
        narrow-indicator
        class="bg-purple text-white shadow-2"
      >
        <q-tab name="mails" icon="mail" label="Mails" />
        <q-tab name="alarms" icon="alarm" label="Alarms" />
        <q-tab name="movies" icon="movie" label="Movies" />
      </q-tabs>

      <q-tabs
        v-model="tab"
        inline-label
        switch-indicator
        indicator-color="primary"
        class="bg-lime text-dark shadow-2"
      >
        <q-tab name="mails" icon="mail" label="Mails" />
        <q-tab name="alarms" icon="alarm" label="Alarms" />
        <q-tab name="movies" icon="movie" label="Movies" />
      </q-tabs>

      <q-tabs
        v-model="tab"
        indicator-color="transparent"
        active-color="white"
        class="bg-teal text-grey-5 shadow-2"
      >
        <q-tab name="mails" icon="mail" label="Mails" />
        <q-tab name="alarms" icon="alarm" label="Alarms" />
        <q-tab name="movies" icon="movie" label="Movies" />
      </q-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tab = ref('mails')
</script>
````

### Tab notifications

There are multiple ways to display tab notifications: with a QBadge, through an alert dot or an alert icon (can be any).

**Example: Tab notifications**

Source: [Notifying.vue](../../examples/QTabs/Notifying.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
      <q-tabs v-model="tab" class="bg-primary text-white shadow-2">
        <q-tab name="mails" icon="mail" label="Mails">
          <q-badge color="red" floating>2</q-badge>
        </q-tab>
        <q-tab name="alarms" icon="alarm" label="Alarms">
          <q-badge color="red" floating>10+</q-badge>
        </q-tab>
        <q-tab alert name="movies" icon="movie" label="Movies" />
      </q-tabs>

      <q-tabs v-model="tab" class="bg-purple text-white shadow-2">
        <q-tab alert="yellow" alert-icon="warning" name="mails" label="Mails" />
        <q-tab alert alert-icon="event" label="Alarms" name="alarms" />
        <q-tab
          alert="orange"
          alert-icon="announcement"
          name="movies"
          label="Movies"
        />
      </q-tabs>

      <q-tabs v-model="tab" class="bg-yellow text-dark">
        <q-tab name="mails" icon="mail" label="Mails">
          <q-badge color="primary" text-color="white" floating>2</q-badge>
        </q-tab>
        <q-tab name="alarms" icon="alarm" label="Alarms">
          <q-badge color="purple" text-color="white" floating>10+</q-badge>
        </q-tab>
        <q-tab alert name="movies" icon="movie" label="Movies" />
      </q-tabs>

      <q-tabs
        v-model="tab"
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
      >
        <q-tab alert="red" name="mails" icon="mail" label="Mails" />
        <q-tab alert="purple" name="alarms" icon="alarm" label="Alarms" />
        <q-tab alert="orange" name="movies" icon="movie" label="Movies" />
      </q-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tab = ref('mails')
</script>
````

### Alignment

QTabs are responsive and the `align` prop (see below) becomes active when the container width (not window width) is bigger than the configured breakpoint. For demoing purposes, the tabs below have breakpoint disabled.

**Example: Alignment**

Source: [Alignment.vue](../../examples/QTabs/Alignment.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
      <q-tabs
        v-model="tab"
        dense
        align="left"
        class="bg-primary text-white shadow-2"
        :breakpoint="0"
      >
        <q-tab name="mails" icon="mail" />
        <q-tab name="alarms" icon="alarm" />
      </q-tabs>

      <q-tabs
        v-model="tab"
        dense
        align="center"
        class="bg-primary text-white shadow-2"
        :breakpoint="0"
      >
        <q-tab name="mails" icon="mail" />
        <q-tab name="alarms" icon="alarm" />
      </q-tabs>

      <q-tabs
        v-model="tab"
        dense
        align="right"
        class="bg-primary text-white shadow-2"
        :breakpoint="0"
      >
        <q-tab name="mails" icon="mail" />
        <q-tab name="alarms" icon="alarm" />
      </q-tabs>

      <q-tabs
        v-model="tab"
        dense
        align="justify"
        class="bg-primary text-white shadow-2"
        :breakpoint="0"
      >
        <q-tab name="mails" icon="mail" />
        <q-tab name="alarms" icon="alarm" />
      </q-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tab = ref('mails')
</script>
````

In the second QTabs from the example below, if window width is below 1024px then the "Movies" and "Photos" tabs will be replaced by a "More..." dropdown.

### With dropdown

**Example: With a dropdown**

Source: [Dropdown.vue](../../examples/QTabs/Dropdown.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
      <q-tabs v-model="tab" inline-label class="bg-teal text-white shadow-2">
        <q-tab name="mails" label="Mails" />
        <q-tab name="alarms" label="Alarms" />
        <q-btn-dropdown auto-close stretch flat label="More...">
          <q-list>
            <q-item clickable @click="tab = 'movies'">
              <q-item-section>Movies</q-item-section>
            </q-item>

            <q-item clickable @click="tab = 'photos'">
              <q-item-section>Photos</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-tabs>

      <q-tabs v-model="tab" inline-label class="bg-yellow text-dark shadow-2">
        <q-tab name="mails" label="Mails" icon="mail" />
        <q-tab name="alarms" label="Alarms" icon="alarm" />
        <q-btn-dropdown auto-close stretch flat icon="more" label="More...">
          <q-list>
            <q-item clickable @click="tab = 'movies'">
              <q-item-section>Movies</q-item-section>
            </q-item>

            <q-item clickable @click="tab = 'photos'">
              <q-item-section>Photos</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-tabs>

      <q-tabs v-model="tab" class="bg-primary text-white shadow-2">
        <q-tab name="mails" label="Mails" icon="mail" />
        <q-tab name="alarms" label="Alarms" icon="alarm" />
        <q-btn-dropdown auto-close stretch flat>
          <template v-slot:label>
            <div>
              <div class="row justify-around items-center no-wrap">
                <q-icon name="more" />
              </div>
              <div class="row items-center no-wrap"> More... </div>
            </div>
          </template>

          <q-list>
            <q-item clickable @click="tab = 'movies'">
              <q-item-section>Movies</q-item-section>
            </q-item>

            <q-item clickable @click="tab = 'photos'">
              <q-item-section>Photos</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-tabs>

      <q-tabs
        v-model="tab"
        inline-label
        :breakpoint="0"
        align="justify"
        class="bg-purple text-white shadow-2"
      >
        <q-tab name="mails" label="Mails" />
        <q-tab name="alarms" label="Alarms" />
        <q-tab v-if="$q.screen.gt.sm" name="movies" label="Movies" />
        <q-tab v-if="$q.screen.gt.sm" name="photos" label="Photos" />
        <q-btn-dropdown
          v-if="$q.screen.lt.md"
          auto-close
          stretch
          flat
          label="More..."
        >
          <q-list>
            <q-item clickable @click="tab = 'movies'">
              <q-item-section>Movies</q-item-section>
            </q-item>

            <q-item clickable @click="tab = 'photos'">
              <q-item-section>Photos</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tab = ref('mails')
</script>
````

### On QToolbar

Notice we need to specify the `shrink` prop. By default, QTabs tries to expand to all the available horizontal space, but in this case we are using it as a child of QToolbar so we don't want that.

**Example: Tabs in a QToolbar**

Source: [TabsInToolbar.vue](../../examples/QTabs/TabsInToolbar.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-toolbar class="bg-purple text-white shadow-2 rounded-borders">
      <q-btn flat label="Homepage" />
      <q-space />

      <!--
        notice shrink property since we are placing it
        as child of QToolbar
      -->
      <q-tabs v-model="tab" shrink stretch>
        <q-tab name="tab1" label="Tab 1" />
        <q-tab name="tab2" label="Tab 2" />
        <q-tab name="tab3" label="Tab 3" />
      </q-tabs>
    </q-toolbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tab = ref('')
</script>
````

### Dynamic update

**Example: Dynamic tabs**

Source: [DynamicTabs.vue](../../examples/QTabs/DynamicTabs.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
      <q-list>
        <q-item
          v-for="item in allTabs"
          :key="item.tab.name"
          tag="label"
          dense
          v-ripple
        >
          <q-item-section side>
            <q-checkbox
              :model-value="item.selected"
              @update:model-value="
                status => {
                  setTabSelected(item.tab, status)
                }
              "
            />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ item.tab.label }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon :name="item.tab.icon" />
          </q-item-section>
        </q-item>
      </q-list>

      <q-toolbar class="bg-purple text-white shadow-2 rounded-borders">
        <q-btn flat label="Homepage" />
        <q-space />

        <!--
          notice shrink property since we are placing it
          as child of QToolbar
        -->
        <q-tabs v-model="tab" inline-label shrink stretch>
          <q-tab v-for="tab in tabs" :key="tab.name" v-bind="tab" />
        </q-tabs>
      </q-toolbar>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const tabsDefinition = [
  // #region
  { name: 'mails', icon: 'mail', label: 'Mails' },
  { name: 'alarms', icon: 'alarm', label: 'Alarms' },
  { name: 'movies', icon: 'movie', label: 'Movies' },
  { name: 'photos', icon: 'photo', label: 'Photos' },
  { name: 'videos', icon: 'slow_motion_video', label: 'Videos' },
  { name: 'addressbook', icon: 'people', label: 'Address Book' }
  // #endregion
]

const tab = ref('mails')
const tabs = ref(tabsDefinition.slice(0, 1))

const allTabs = computed(() =>
  tabsDefinition.map(tabItem => ({
    tab: tabItem,
    selected: tabs.value.includes(tabItem)
  }))
)

function setTabSelected(tabItem, status) {
  if (status) {
    tabs.value.push(tabItem)
  } else {
    const index = tabs.value.indexOf(tabItem)

    if (index !== -1) {
      tabs.value.splice(index, 1)
    }
  }
}
</script>
````

### Along with QTabsPanel

::: tip
QTabPanels can be used as standalone too. They do not depend on the presence of a QTabs. Also, they can be placed anywhere within a page, not just near a QTabs.
:::

**Example: Tabs with tab panels**

Source: [TabsWithTabpanels.vue](../../examples/QTabs/TabsWithTabpanels.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="mails" label="Mails" />
          <q-tab name="alarms" label="Alarms" />
          <q-tab name="movies" label="Movies" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="mails">
            <div class="text-h6">Mails</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="alarms">
            <div class="text-h6">Alarms</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="movies">
            <div class="text-h6">Movies</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
        </q-tab-panels>
      </q-card>

      <q-card>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="mails">
            <div class="text-h6">Mails</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="alarms">
            <div class="text-h6">Alarms</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="movies">
            <div class="text-h6">Movies</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
        </q-tab-panels>

        <q-separator />

        <q-tabs
          v-model="tab"
          dense
          :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
          align="justify"
          narrow-indicator
        >
          <q-tab name="mails" label="Mails" />
          <q-tab name="alarms" label="Alarms" />
          <q-tab name="movies" label="Movies" />
        </q-tabs>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tab = ref('mails')
</script>
````

More info: [Tab Panels](/vue-components/tab-panels).

## Connecting to Vue Router

You can use tabs together with Vue Router through `QRouteTab` component.
This component inherits everything from QTab, however it also has `router-link` properties bound to it. These allow for listening to the current app route and also triggering a route when clicked/tapped.

```html
<q-tabs>
  <q-route-tab icon="mail" to="/mails" exact />
  <q-route-tab icon="alarm" to="/alarms" exact />
</q-tabs>
```

::: warning
When using QTabs with QRouteTab, it is not recommended to also use a v-model (though you still can), because the source of truth for the current active tab is determined by the current route instead of the v-model. Each QRouteTab becomes "active" depending on your app's route and not due to the v-model. So the initial value of v-model or changing the v-model directly will not also change the route of your app.
:::

### Matching QRouteTab to current route <q-badge label="updated for v2.9+" />

- If it is set to `exact` matching:
  1. The route that it points to must be considered "exact-active" by Vue Router (exactly matches route, disregards hash & query).
  2. Assuming Vue Router on history mode, it must match the configured route hash (if any)
  3. It must match the configured route query (if any) - any extra query params in the current route query will not make the tab active (should you want that, do not use `exact`)
- Else, if it is NOT set to `exact` matching:
  1. The route that it points to must be considered "active" by Vue Router (loosely matches route, disregards hash & query).
  2. Assuming Vue Router on history mode, is it configured with a hash? If so, it must match exactly.
  3. Is it configured with a query? If so, then the configured query must be included in the current route query.
  4. If multiple QRouteTab still match the current route (ex: route is /cars/brands/tesla and we have QRouteTabs pointing to non-exact /cars, non-exact /cars/brands, non-exact /cars/brands/tesla), then the most specific one that matches current route wins (in this case /cars/brands/tesla)
  5. If there are still multiple QRouteTabs matching the criteria above, then the one with the query that is closest to the current route query wins (has the configured query and the current route query has the least number of extra params).
  6. If there are still multiple QRouteTabs matching the criteria above, then the one with the resulting href that is the lengthier one wins.

The `exact` configured QRouteTabs always win over loose-matching (non-exact) ones.

### Handling custom navigation <q-badge label="updated for v2.9+" />

::: tip
Please refer to the QRouteTab API card at the top of the page for a more in-depth description of the `@click` event being used below.
:::

```html
<template>
  <q-tabs no-caps class="bg-orange text-white shadow-2">
    <q-route-tab
      :to="{ query: { tab: '1' } }"
      exact
      replace
      label="Activate in 2s"
      @click="navDelay"
    />
    <q-route-tab
      :to="{ query: { tab: '2' } }"
      exact
      replace
      label="Do nothing"
      @click="navCancel"
    />
    <q-route-tab
      :to="{ query: { tab: '3' } }"
      exact
      replace
      label="Navigate to the second tab"
      @click="navRedirect"
    />
    <q-route-tab
      :to="{ query: { tab: '4' } }"
      exact
      replace
      label="Navigate immediately"
      @click="navPass"
    />
  </q-tabs>
</template>

<script setup>
  function navDelay(e, go) {
    e.preventDefault() // we cancel the default navigation

    // console.log('triggering navigation in 2s')
    setTimeout(() => {
      // console.log('navigating as promised 2s ago')
      go()
    }, 2000)
  }

  function navCancel(e) {
    e.preventDefault() // we cancel the default navigation
  }

  function navRedirect(e, go) {
    e.preventDefault() // we cancel the default navigation

    // call this at your convenience
    go({
      to: { query: { tab: '2', noScroll: true } }
      // replace: boolean; default is what the tab is configured with
      // returnRouterError: boolean; default is false
    })
      .then(vueRouterResult => {
        /* ... */
      })
      .catch(vueRouterError => {
        /* ...will not reach here unless returnRouterError === true */
      })
  }

  function navPass() {}
</script>
```
