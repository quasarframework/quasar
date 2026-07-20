---
title: Tree
description: The QTree is a highly configurable Vue component which displays hierarchical data, such as a table of contents in a tree structure.
canonical: https://quasar.dev/vue-components/tree
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QTree](../../api/QTree.md)

Quasar Tree represents a highly configurable component that displays hierarchical data, such as a table of contents in a tree structure.

**API reference:** [QTree](../../api/QTree.md)

## Usage

### Basic

**Example: Basic**

Source: [Basic.vue](../../examples/QTree/Basic.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-tree :nodes="simple" node-key="label" />
  </div>
</template>

<script setup>
const simple = [
  {
    label: 'Satisfied customers (with avatar)',
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    children: [
      {
        label: 'Good food (with icon)',
        icon: 'restaurant_menu',
        children: [{ label: 'Quality ingredients' }, { label: 'Good recipe' }]
      },
      {
        label: 'Good service (disabled node with icon)',
        icon: 'room_service',
        disabled: true,
        children: [
          { label: 'Prompt attention' },
          { label: 'Professional waiter' }
        ]
      },
      {
        label: 'Pleasant surroundings (with icon)',
        icon: 'photo',
        children: [
          {
            label: 'Happy atmosphere (with image)',
            img: 'https://cdn.quasar.dev/img/logo_calendar_128px.png'
          },
          { label: 'Good table presentation' },
          { label: 'Pleasing decor' }
        ]
      }
    ]
  }
]
</script>
````

### Keyboard navigation

When a tree node has focus:

- `Arrow Up` and `Arrow Down` move focus through the visible nodes.
- `Arrow Right` expands a collapsed parent or moves focus to its first visible child.
- `Arrow Left` collapses an expanded parent or moves focus to its parent.
- `Home` and `End` move focus to the first and last visible nodes.
- `Enter` performs the node's default action; `Space` toggles its expansion.

### No connector lines

**Example: No connectors**

Source: [NoConnectors.vue](../../examples/QTree/NoConnectors.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-tree
      :nodes="simple"
      node-key="label"
      no-connectors
      v-model:expanded="expanded"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const expanded = ref([
  'Satisfied customers (with avatar)',
  'Good food (with icon)'
])

const simple = [
  {
    label: 'Satisfied customers (with avatar)',
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    children: [
      {
        label: 'Good food (with icon)',
        icon: 'restaurant_menu',
        children: [{ label: 'Quality ingredients' }, { label: 'Good recipe' }]
      },
      {
        label: 'Good service (disabled node with icon)',
        icon: 'room_service',
        disabled: true,
        children: [
          { label: 'Prompt attention' },
          { label: 'Professional waiter' }
        ]
      },
      {
        label: 'Pleasant surroundings (with icon)',
        icon: 'photo',
        children: [
          {
            label: 'Happy atmosphere (with image)',
            img: 'https://cdn.quasar.dev/img/logo_calendar_128px.png'
          },
          { label: 'Good table presentation' },
          { label: 'Pleasing decor' }
        ]
      }
    ]
  }
]
</script>
````

### Dense <q-badge label="v2.2.4+" />

**Example: Dense**

Source: [DenseTree.vue](../../examples/QTree/DenseTree.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-tree
      :nodes="simple"
      dense
      node-key="label"
      v-model:expanded="expanded"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const expanded = ref([
  'Satisfied customers (with avatar)',
  'Good food (with icon)'
])

const simple = [
  {
    label: 'Satisfied customers (with avatar)',
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    children: [
      {
        label: 'Good food (with icon)',
        icon: 'restaurant_menu',
        children: [{ label: 'Quality ingredients' }, { label: 'Good recipe' }]
      },
      {
        label: 'Good service (disabled node with icon)',
        icon: 'room_service',
        disabled: true,
        children: [
          { label: 'Prompt attention' },
          { label: 'Professional waiter' }
        ]
      },
      {
        label: 'Pleasant surroundings (with icon)',
        icon: 'photo',
        children: [
          {
            label: 'Happy atmosphere (with image)',
            img: 'https://cdn.quasar.dev/img/logo_calendar_128px.png'
          },
          { label: 'Good table presentation' },
          { label: 'Pleasing decor' }
        ]
      }
    ]
  }
]
</script>
````

### Force dark mode

**Example: Force dark mode**

Source: [Dark.vue](../../examples/QTree/Dark.vue)

````vue
<template>
  <div class="q-pa-md bg-grey-9 text-white">
    <q-tree :nodes="simple" node-key="label" v-model:expanded="expanded" dark />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const expanded = ref([
  'Satisfied customers (with avatar)',
  'Good food (with icon)'
])

const simple = [
  {
    label: 'Satisfied customers (with avatar)',
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    children: [
      {
        label: 'Good food (with icon)',
        icon: 'restaurant_menu',
        children: [{ label: 'Quality ingredients' }, { label: 'Good recipe' }]
      },
      {
        label: 'Good service (disabled node with icon)',
        icon: 'room_service',
        disabled: true,
        children: [
          { label: 'Prompt attention' },
          { label: 'Professional waiter' }
        ]
      },
      {
        label: 'Pleasant surroundings (with icon)',
        icon: 'photo',
        children: [
          {
            label: 'Happy atmosphere (with image)',
            img: 'https://cdn.quasar.dev/img/logo_calendar_128px.png'
          },
          { label: 'Good table presentation' },
          { label: 'Pleasing decor' }
        ]
      }
    ]
  }
]
</script>
````

### Perf considerations <q-badge label="v2.9.2+" />

When using relatively large data, for performance we recommend using the `no-transition` Boolean prop which will account for a significant runtime speed improvement.

```html
<q-tree no-transition ...
```

### Integrated example

**Example: With QSplitter and QTabPanels**

Source: [Splitter.vue](../../examples/QTree/Splitter.vue)

````vue
<template>
  <div>
    <q-splitter v-model="splitterModel" style="height: 400px">
      <template v-slot:before>
        <div class="q-pa-md">
          <q-tree
            :nodes="simple"
            node-key="label"
            selected-color="primary"
            v-model:selected="selected"
            default-expand-all
          />
        </div>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="selected"
          animated
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="Relax Hotel">
            <div class="text-h4 q-mb-md">Welcome</div>
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

          <q-tab-panel name="Food">
            <div class="text-h4 q-mb-md">Food</div>
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

          <q-tab-panel name="Room service">
            <div class="text-h4 q-mb-md">Room service</div>
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

          <q-tab-panel name="Room view">
            <div class="text-h4 q-mb-md">Room view</div>
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
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const splitterModel = ref(50)
const selected = ref('Food')
const simple = [
  {
    label: 'Relax Hotel',
    children: [
      {
        label: 'Food',
        icon: 'restaurant_menu'
      },
      {
        label: 'Room service',
        icon: 'room_service'
      },
      {
        label: 'Room view',
        icon: 'photo'
      }
    ]
  }
]
</script>
````

More info: [QSplitter](/vue-components/splitter), [QTabPanels](/vue-components/tab-panels).

### Customize content

Notice (in the example below) the default header and body slot customization.

**Example: Default header and body slots**

Source: [SlotsDefault.vue](../../examples/QTree/SlotsDefault.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-tree :nodes="customize" node-key="label" default-expand-all>
      <template v-slot:default-header="prop">
        <div class="row items-center">
          <q-icon
            :name="prop.node.icon || 'share'"
            color="orange"
            size="28px"
            class="q-mr-sm"
          />
          <div class="text-weight-bold text-primary">{{ prop.node.label }}</div>
        </div>
      </template>

      <template v-slot:default-body="prop">
        <div v-if="prop.node.story">
          <span class="text-weight-bold">This node has a story</span>:
          {{ prop.node.story }}
        </div>
        <span v-else class="text-weight-light text-black"
          >This is some default content.</span
        >
      </template>
    </q-tree>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const customize = ref([
  {
    label: 'Satisfied customers',
    header: 'root',
    children: [
      {
        label: 'Good food',
        icon: 'restaurant_menu',
        header: 'generic',
        children: [
          {
            label: 'Quality ingredients',
            header: 'generic',
            body: 'story',
            story: 'Lorem ipsum dolor sit amet.'
          },
          {
            label: 'Good recipe',
            body: 'story',
            story:
              'A Congressman works with his equally conniving wife to exact revenge on the people who betrayed him.'
          }
        ]
      },
      {
        label: 'Good service',
        header: 'generic',
        body: 'toggle',
        caption:
          'Why are we as consumers so captivated by stories of great customer service? Perhaps it is because...',
        enabled: false,
        children: [
          { label: 'Prompt attention' },
          { label: 'Professional waiter' }
        ]
      },
      {
        label: 'Pleasant surroundings',
        children: [
          { label: 'Happy atmosphere' },
          { label: 'Good table presentation', header: 'generic' },
          { label: 'Pleasing decor' }
        ]
      }
    ]
  }
])
</script>
````

Notice (in the example below) the custom header and body slots.

**Example: Customizing nodes**

Source: [SlotsCustomized.vue](../../examples/QTree/SlotsCustomized.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-tree :nodes="customize" node-key="label" default-expand-all>
      <template v-slot:header-root="prop">
        <div class="row items-center">
          <img
            src="https://cdn.quasar.dev/logo-v2/svg/logo.svg"
            class="q-mr-sm"
            style="width: 50px; height: 50px"
          />
          <div>
            {{ prop.node.label }}
            <q-badge color="orange" class="q-ml-sm">New!</q-badge>
          </div>
        </div>
      </template>

      <template v-slot:header-generic="prop">
        <div class="row items-center">
          <q-icon
            :name="prop.node.icon || 'star'"
            color="orange"
            size="28px"
            class="q-mr-sm"
          />
          <div class="text-weight-bold text-primary">{{ prop.node.label }}</div>
        </div>
      </template>

      <template v-slot:body-story="prop">
        <span class="text-weight-thin">The story is:</span>
        {{ prop.node.story }}
      </template>

      <template v-slot:body-toggle="prop">
        <p class="text-caption">{{ prop.node.caption }}</p>
        <q-toggle
          v-model="prop.node.enabled"
          label="I agree to the terms and conditions"
        />
      </template>
    </q-tree>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const customize = ref([
  {
    label: 'Satisfied customers',
    header: 'root',
    children: [
      {
        label: 'Good food',
        icon: 'restaurant_menu',
        header: 'generic',
        children: [
          {
            label: 'Quality ingredients',
            header: 'generic',
            body: 'story',
            story: 'Lorem ipsum dolor sit amet.'
          },
          {
            label: 'Good recipe',
            body: 'story',
            story:
              'A Congressman works with his equally conniving wife to exact revenge on the people who betrayed him.'
          }
        ]
      },
      {
        label: 'Good service',
        header: 'generic',
        body: 'toggle',
        caption:
          'Why are we as consumers so captivated by stories of great customer service? Perhaps it is because...',
        enabled: false,
        children: [
          { label: 'Prompt attention' },
          { label: 'Professional waiter' }
        ]
      },
      {
        label: 'Pleasant surroundings',
        children: [
          { label: 'Happy atmosphere' },
          { label: 'Good table presentation', header: 'generic' },
          { label: 'Pleasing decor' }
        ]
      }
    ]
  }
])
</script>
````

::: warning
Clicking or pressing `ENTER` on the custom header selects the tree item (and the custom header is blurred). Pressing `SPACE` toggles its expansion.

If you don't want this to happen just wrap the content of the custom header in a `<div @click.stop @keydown.stop>` (or add the listeners to the respective component/element that is emitting them).
:::

### Accordion, filtering and selectable

In the example below, sibling nodes get contracted when one gets expanded.

**Example: Accordion mode**

Source: [Accordion.vue](../../examples/QTree/Accordion.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-tree
      :nodes="simple"
      accordion
      node-key="label"
      v-model:expanded="expanded"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const expanded = ref([
  'Satisfied customers (with avatar)',
  'Good food (with icon)'
])

const simple = [
  {
    label: 'Satisfied customers (with avatar)',
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    children: [
      {
        label: 'Good food (with icon)',
        icon: 'restaurant_menu',
        children: [{ label: 'Quality ingredients' }, { label: 'Good recipe' }]
      },
      {
        label: 'Good service (disabled node with icon)',
        icon: 'room_service',
        children: [
          { label: 'Prompt attention' },
          { label: 'Professional waiter' }
        ]
      },
      {
        label: 'Pleasant surroundings (with icon)',
        icon: 'photo',
        children: [
          {
            label: 'Happy atmosphere (with image)',
            img: 'https://cdn.quasar.dev/img/logo_calendar_128px.png'
          },
          { label: 'Good table presentation' },
          { label: 'Pleasing decor' }
        ]
      }
    ]
  }
]
</script>
````

**Example: Filtering nodes**

Source: [FilterDefault.vue](../../examples/QTree/FilterDefault.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-input ref="filterRef" filled v-model="filter" label="Filter">
      <template v-slot:append>
        <q-icon
          v-if="filter !== ''"
          name="clear"
          class="cursor-pointer"
          @click="resetFilter"
        />
      </template>
    </q-input>

    <q-tree
      :nodes="simple"
      node-key="label"
      :filter="filter"
      default-expand-all
    />
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'

const filter = ref('')
const filterRef = useTemplateRef('filterRef')

const simple = [
  {
    label: 'Satisfied customers',
    children: [
      {
        label: 'Good food',
        children: [{ label: 'Quality ingredients' }, { label: 'Good recipe' }]
      },
      {
        label: 'Good service (disabled node)',
        disabled: true,
        children: [
          { label: 'Prompt attention' },
          { label: 'Professional waiter' }
        ]
      },
      {
        label: 'Pleasant surroundings',
        children: [
          { label: 'Happy atmosphere' },
          { label: 'Good table presentation' },
          { label: 'Pleasing decor' }
        ]
      }
    ]
  }
]

function resetFilter() {
  filter.value = ''
  filterRef.value.focus()
}
</script>
````

**Example: Selectable nodes**

Source: [Selectable.vue](../../examples/QTree/Selectable.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <div>
      <div class="q-gutter-sm">
        <q-btn
          size="sm"
          color="primary"
          @click="selectGoodService"
          label="Select 'Good service'"
        />
        <q-btn
          v-if="selected"
          size="sm"
          color="red"
          @click="unselectNode"
          label="Unselect node"
        />
      </div>
    </div>
    <q-tree
      :nodes="props"
      default-expand-all
      v-model:selected="selected"
      node-key="label"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selected = ref(null)

function selectGoodService() {
  if (selected.value !== 'Good service') {
    selected.value = 'Good service'
  }
}

function unselectNode() {
  selected.value = null
}

const props = [
  {
    label: 'Satisfied customers',
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    children: [
      {
        label: 'Good food',
        icon: 'restaurant_menu',
        children: [{ label: 'Quality ingredients' }, { label: 'Good recipe' }]
      },
      {
        label: 'Good service',
        icon: 'room_service',
        children: [
          { label: 'Prompt attention' },
          { label: 'Professional waiter' }
        ]
      },
      {
        label: 'Pleasant surroundings',
        icon: 'photo',
        children: [
          {
            label: 'Happy atmosphere'
          },
          {
            label: 'Good table presentation'
          },
          {
            label: 'Pleasing decor'
          }
        ]
      }
    ]
  }
]
</script>
````

### Lazy loading

**Example: Lazy loading nodes**

Source: [LazyLoad.vue](../../examples/QTree/LazyLoad.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-tree
      :nodes="lazy"
      default-expand-all
      node-key="label"
      @lazy-load="onLazyLoad"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const nodes = [
  {
    label: 'Node 1',
    children: [
      { label: 'Node 1.1', lazy: true },
      { label: 'Node 1.2', lazy: true }
    ]
  },
  {
    label: 'Node 2',
    lazy: true
  },
  {
    label: 'Lazy load empty',
    lazy: true
  },
  {
    label: 'Node is not expandable',
    expandable: false,
    children: [{ label: 'Some node' }]
  }
]

const lazy = ref(nodes)

function onLazyLoad({ node, key, done, fail }) {
  // call fail() if any error occurs

  setTimeout(() => {
    // simulate loading and setting an empty node
    if (key.includes('Lazy load empty')) {
      done([])
      return
    }

    const label = node.label
    done([
      { label: `${label}.1` },
      { label: `${label}.2`, lazy: true },
      {
        label: `${label}.3`,
        children: [
          { label: `${label}.3.1`, lazy: true },
          { label: `${label}.3.2`, lazy: true }
        ]
      }
    ])
  }, 1000)
}
</script>
````

### Selection vs ticking, expansion

- Selection (through QTree `selected` prop) refers to the currently selected node (gets highlighted with different background).
- Ticking (through QTree `ticked` prop) refers to the checkbox associated with each node.
- Expansion (through QTree `expanded` prop) refers to the nodes that are expanded.

All properties above require to be dynamically bound using `v-model:<prop_name>` directive in order for them to work correctly (example: `v-model:expanded`).

**Example: Syncing node properties**

Source: [Sync.vue](../../examples/QTree/Sync.vue)

````vue
<template>
  <div class="q-pa-md row q-col-gutter-sm">
    <q-tree
      class="col-12 col-sm-6"
      :nodes="simple"
      node-key="label"
      tick-strategy="leaf"
      v-model:selected="selected"
      v-model:ticked="ticked"
      v-model:expanded="expanded"
    />
    <div class="col-12 col-sm-6 q-gutter-sm">
      <div class="text-h6">Selected</div>
      <div>{{ selected }}</div>

      <q-separator spaced />

      <div class="text-h6">Ticked</div>
      <div>
        <div v-for="tick in ticked" :key="`ticked-${tick}`">
          {{ tick }}
        </div>
      </div>

      <q-separator spaced />

      <div class="text-h6">Expanded</div>
      <div>
        <div v-for="expand in expanded" :key="`expanded-${expand}`">
          {{ expand }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selected = ref('Pleasant surroundings')
const ticked = ref(['Quality ingredients', 'Good table presentation'])

const expanded = ref([
  'Satisfied customers (with avatar)',
  'Good food (with icon)'
])

const simple = [
  {
    label: 'Satisfied customers (with avatar)',
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    children: [
      {
        label: 'Good food (with icon)',
        icon: 'restaurant_menu',
        children: [{ label: 'Quality ingredients' }, { label: 'Good recipe' }]
      },
      {
        label: 'Good service (disabled node with icon)',
        icon: 'room_service',
        disabled: true,
        children: [
          { label: 'Prompt attention' },
          { label: 'Professional waiter' }
        ]
      },
      {
        label: 'Pleasant surroundings (with icon)',
        icon: 'photo',
        children: [
          {
            label: 'Happy atmosphere (with image)',
            img: 'https://cdn.quasar.dev/img/logo_calendar_128px.png'
          },
          { label: 'Good table presentation' },
          { label: 'Pleasing decor' }
        ]
      }
    ]
  }
]
</script>
````

### Tick strategy

There are three ticking strategy: 'leaf', 'leaf-filtered', 'strict' with an additional (and default) 'none' which disables ticking.

| Strategy      | Description                                                                                                                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| leaf          | Ticked nodes are only the leaves. Ticking a node influences the parent's ticked state too (parent becomes partially ticked or ticked), as well as its children (all tickable children become ticked). |
| leaf-filtered | Same concept as `leaf`, only that this strategy applies only to filtered nodes (the nodes that remain visible after filtering).                                                                       |
| strict        | Ticked nodes are independent of parent or children tick state.                                                                                                                                        |

You can apply a global tick strategy for a QTree and locally change the ticking strategy for a certain node by specifying the `tickStrategy` in the `nodes` model.

**Example: Tick strategy**

Source: [TickStrategy.vue](../../examples/QTree/TickStrategy.vue)

````vue
<template>
  <div class="q-pa-md row q-col-gutter-sm">
    <q-tree
      class="col-12 col-sm-6"
      :nodes="simple"
      v-model:ticked="ticked"
      v-model:expanded="expanded"
      node-key="label"
      :tick-strategy="tickStrategy"
      default-expand-all
    />
    <div class="col-12 col-sm-6">
      <q-option-group v-model="tickStrategy" :options="tickStrategies" />

      <div class="text-h6 q-mt-md">Ticked</div>
      <div>
        <div v-for="tick in ticked" :key="`ticked-${tick}`">
          {{ tick }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const ticked = ref(['Pleasant surroundings'])
const expanded = ref(['Good service (disabled node)'])
const tickStrategy = ref('strict')
const tickStrategies = [
  { value: 'none', label: 'None' },
  { value: 'strict', label: 'Strict' },
  { value: 'leaf', label: 'Leaf' },
  { value: 'leaf-filtered', label: 'Leaf Filtered' }
]

const simple = [
  {
    label: 'Satisfied customers',
    children: [
      {
        label: 'Good food',
        children: [{ label: 'Quality ingredients' }, { label: 'Good recipe' }]
      },
      {
        label: 'Good service (disabled node)',
        disabled: true,
        children: [
          { label: 'Prompt attention' },
          { label: 'Professional waiter' }
        ]
      },
      {
        label: 'Pleasant surroundings',
        children: [
          { label: 'Happy atmosphere (*)' },
          { label: 'Good table presentation' },
          { label: 'Pleasing decor (*)' }
        ]
      }
    ]
  }
]
</script>
````

### Custom filter method

You can customize the filtering method by specifying the `filter-method` prop. The method below filters by input if it also has '(\*)':

**Example: Custom filter**

Source: [FilterCustom.vue](../../examples/QTree/FilterCustom.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-input
      ref="filterRef"
      filled
      v-model="filter"
      label="Search - only filters labels that have also '(*)'"
    >
      <template v-slot:append>
        <q-icon
          v-if="filter !== ''"
          name="clear"
          class="cursor-pointer"
          @click="resetFilter"
        />
      </template>
    </q-input>

    <q-tree
      :nodes="simple"
      node-key="label"
      :filter="filter"
      :filter-method="myFilterMethod"
      v-model:expanded="expanded"
      default-expand-all
    />
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'

const filter = ref('de')
const filterRef = useTemplateRef('filterRef')
const expanded = ref(['Good service (disabled node) (*)'])
const simple = [
  {
    label: 'Satisfied customers',
    children: [
      {
        label: 'Good food',
        children: [{ label: 'Quality ingredients' }, { label: 'Good recipe' }]
      },
      {
        label: 'Good service (disabled node) (*)',
        disabled: true,
        children: [
          { label: 'Prompt attention' },
          { label: 'Professional waiter' }
        ]
      },
      {
        label: 'Pleasant surroundings',
        children: [
          { label: 'Happy atmosphere (*)' },
          { label: 'Good table presentation' },
          { label: 'Pleasing decor (*)' }
        ]
      }
    ]
  }
]

function myFilterMethod(node, filterStr) {
  const filt = filterStr.toLowerCase()
  return (
    node.label &&
    node.label.toLowerCase().includes(filt) &&
    node.label.toLowerCase().includes('(*)')
  )
}

function resetFilter() {
  filter.value = ''
  filterRef.value.focus()
}
</script>
````

### Nodes model structure

The following describes a node's properties that are taken into account by QTree's v-model.

| Node Property | Type           | Behavior when not present                       | Description                                                                                                                 |
| ------------- | -------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| \<nodeKey\>   | String, Number | An error is generated                           | Node's key. The key is picked from the key specified in `nodeKey` property.                                                 |
| label         | String         | The item has no label                           | Node's label. When `labelKey` prop is set the label is picked from that key.                                                |
| icon          | String         | The default icon is used                        | Node's icon.                                                                                                                |
| iconColor     | String         | The inherited color is used                     | Node's icon color. One from Quasar Color Palette.                                                                           |
| img           | String         | No image is displayed                           | Node's image. Use /public folder. Example: 'mountains.png'                                                                  |
| avatar        | String         | No avatar is displayed                          | Node's avatar. Use /public folder. Example: 'boy-avatar.png'                                                                |
| children      | Array          | This node has no sub-nodes                      | Array of nodes as children.                                                                                                 |
| disabled      | Boolean        | The node is enabled                             | Is node disabled?                                                                                                           |
| expandable    | Boolean        | The node is expandable                          | Is node expandable?                                                                                                         |
| selectable    | Boolean        | The node is selectable                          | Is node selectable?                                                                                                         |
| handler       | Function       | No extra function is called                     | Custom function that should be called on click on node. Receives `node` as parameter.                                       |
| tickable      | Boolean        | The node is tickable according to tick strategy | When using a tick strategy, each node shows a checkbox. Should a node's checkbox be disabled?                               |
| noTick        | Boolean        | Node displays a checkbox                        | When using a tick strategy, should node display a checkbox?                                                                 |
| tickStrategy  | String         | Tick strategy 'none' is used                    | Override global tick strategy for this node only. One of 'leaf', 'leaf-filtered', 'strict', 'none'.                         |
| lazy          | Boolean        | Children are not lazy loaded                    | Should children be lazy loaded? In this case also don't specify 'children' prop.                                            |
| header        | String         | Slot 'default-header' is used                   | Node header scoped slot name, without the required 'header-' prefix. Example: 'story' refers to 'header-story' scoped slot. |
| body          | String         | Slot 'default-body' is used                     | Node body scoped slot name, without the required 'body-' prefix. Example: 'story' refers to 'body-story' scoped slot.       |
