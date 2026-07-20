---
title: Select
description: The QSelect Vue component has two types of selection - single or multiple. This component opens up a menu for the selection list and action. A filter can also be used for longer lists.
canonical: https://quasar.dev/vue-components/select
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QSelect](../../api/QSelect.md)

The QSelect component has two types of selection: single or multiple. This component opens up a menu for the selection list and action. A filter can also be used for longer lists.

In case you are looking for a dropdown "button" instead of "input" use [Button Dropdown](/vue-components/button-dropdown) instead.

**API reference:** [QSelect](../../api/QSelect.md)

## Design

### Overview

::: warning
For your QSelect you can use only one of the main designs (`filled`, `outlined`, `standout`, `borderless`). You cannot use multiple as they are self-exclusive.
:::

**Example: Design Overview**

Source: [DesignOverview.vue](../../examples/QSelect/DesignOverview.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-select v-model="model" :options="options" label="Standard" />

      <q-select filled v-model="model" :options="options" label="Filled" />

      <q-select outlined v-model="model" :options="options" label="Outlined" />

      <q-select standout v-model="model" :options="options" label="Standout" />

      <q-select
        standout="bg-teal text-white"
        v-model="model"
        :options="options"
        label="Custom standout"
      />

      <q-select
        borderless
        v-model="model"
        :options="options"
        label="Borderless"
      />

      <q-select
        rounded
        filled
        v-model="model"
        :options="options"
        label="Rounded filled"
      />

      <q-select
        rounded
        outlined
        v-model="model"
        :options="options"
        label="Rounded outlined"
      />

      <q-select
        rounded
        standout
        v-model="model"
        :options="options"
        label="Rounded standout"
      />

      <q-select
        square
        filled
        v-model="model"
        :options="options"
        label="Square filled"
      />

      <q-select
        square
        outlined
        v-model="model"
        :options="options"
        label="Square outlined"
      />

      <q-select
        square
        standout
        v-model="model"
        :options="options"
        label="Square standout"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
const options = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']
</script>
````

### Decorators

**Example: Decorators**

Source: [Decorators.vue](../../examples/QSelect/Decorators.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-pb-lg">
      <q-toggle v-model="dense" label="Dense QSelect" />
      <q-toggle v-model="denseOpts" label="Dense options" />
    </div>

    <div class="q-gutter-md" style="max-width: 300px">
      <q-select
        filled
        v-model="model"
        :options="options"
        label="Label (stacked)"
        stack-label
        :dense="dense"
        :options-dense="denseOpts"
      />

      <q-select
        outlined
        v-model="model"
        :options="options"
        :dense="dense"
        :options-dense="denseOpts"
      >
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>
      </q-select>

      <q-select
        standout
        v-model="model"
        :options="options"
        :dense="dense"
        :options-dense="denseOpts"
      >
        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
          </q-avatar>
        </template>
      </q-select>

      <q-select
        filled
        bottom-slots
        v-model="model"
        :options="options"
        label="Label"
        counter
        :dense="dense"
        :options-dense="denseOpts"
      >
        <template v-slot:prepend>
          <q-icon name="place" @click.stop.prevent />
        </template>
        <template v-slot:append>
          <q-icon
            name="close"
            @click.stop.prevent="model = ''"
            class="cursor-pointer"
          />
        </template>

        <template v-slot:hint> Field hint </template>
      </q-select>

      <q-select
        rounded
        outlined
        bottom-slots
        v-model="model"
        :options="options"
        label="Label"
        counter
        maxlength="12"
        :dense="dense"
        :options-dense="denseOpts"
      >
        <template v-slot:before>
          <q-icon name="flight_takeoff" />
        </template>

        <template v-slot:append>
          <q-icon
            v-if="model !== ''"
            name="close"
            @click.stop.prevent="model = ''"
            class="cursor-pointer"
          />
          <q-icon name="search" @click.stop.prevent />
        </template>

        <template v-slot:hint> Field hint </template>
      </q-select>

      <q-select
        filled
        bottom-slots
        v-model="model"
        :options="options"
        label="Label"
        counter
        maxlength="12"
        :dense="dense"
        :options-dense="denseOpts"
      >
        <template v-slot:before>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
          </q-avatar>
        </template>

        <template v-slot:append>
          <q-icon
            v-if="model !== ''"
            name="close"
            @click.stop.prevent="model = ''"
            class="cursor-pointer"
          />
          <q-icon name="schedule" @click.stop.prevent />
        </template>

        <template v-slot:hint> Field hint </template>

        <template v-slot:after>
          <q-btn round dense flat icon="send" />
        </template>
      </q-select>

      <q-select
        filled
        bottom-slots
        v-model="model"
        :options="options"
        label="Label"
        counter
        maxlength="12"
        :dense="dense"
        :options-dense="denseOpts"
      >
        <template v-slot:before>
          <q-icon name="event" />
        </template>

        <template v-slot:hint> Field hint </template>

        <template v-slot:append>
          <q-btn round dense flat icon="add" @click.stop.prevent />
        </template>
      </q-select>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
const options = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']
const dense = ref(false)
const denseOpts = ref(false)
</script>
````

### Coloring

**Example: Coloring**

Source: [Coloring.vue](../../examples/QSelect/Coloring.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-select
        color="purple-12"
        v-model="model"
        :options="options"
        label="Label"
      >
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>
      </q-select>

      <q-select
        color="teal"
        filled
        v-model="model"
        :options="options"
        label="Label"
      >
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>
      </q-select>

      <q-select
        color="grey-3"
        outlined
        label-color="orange"
        v-model="model"
        :options="options"
        label="Label"
      >
        <template v-slot:append>
          <q-icon name="event" color="orange" />
        </template>
      </q-select>

      <q-select
        color="lime-11"
        bg-color="green"
        filled
        v-model="model"
        :options="options"
        label="Label"
      >
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>
      </q-select>

      <q-select
        color="teal"
        outlined
        v-model="model"
        :options="options"
        label="Label"
      >
        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
          </q-avatar>
        </template>
      </q-select>

      <q-select
        clearable
        color="orange"
        standout
        bottom-slots
        v-model="model"
        :options="options"
        label="Label"
        counter
      >
        <template v-slot:prepend>
          <q-icon name="place" />
        </template>
        <template v-slot:append>
          <q-icon name="favorite" />
        </template>

        <template v-slot:hint> Field hint </template>
      </q-select>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
const options = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']
</script>
````

### Clearable

As a helper, you can use `clearable` prop so user can reset model to `null` through an appended icon. The second QSelect in the example below is the equivalent of using `clearable`.

**Example: Clearable**

Source: [Clearable.vue](../../examples/QSelect/Clearable.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-select
        clearable
        filled
        color="purple-12"
        v-model="model"
        :options="options"
        label="Label"
      />

      <!-- equivalent -->
      <q-select
        color="orange"
        filled
        v-model="model"
        :options="options"
        label="Label"
      >
        <template v-if="model" v-slot:append>
          <q-icon
            name="cancel"
            @click.stop.prevent="model = null"
            class="cursor-pointer"
          />
        </template>
      </q-select>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref('Google')
const options = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']
</script>
````

### Disable and readonly

**Example: Disable and readonly**

Source: [DisableReadonly.vue](../../examples/QSelect/DisableReadonly.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <q-select
        disable
        filled
        v-model="model"
        :options="options"
        hint="Disable"
        style="width: 250px"
      />

      <q-select
        readonly
        filled
        v-model="model"
        :options="options"
        hint="Readonly"
        style="width: 250px"
      />

      <q-select
        disable
        readonly
        filled
        v-model="model"
        :options="options"
        hint="Disable and readonly"
        style="width: 250px"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref('Google')
const options = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']
</script>
````

### Slots with QBtn type "submit"

::: warning
When placing a QBtn with type "submit" in one of the "before", "after", "prepend", or "append" slots of a QField, QInput or QSelect, you should also add a `@click` listener on the QBtn in question. This listener should call the method that submits your form. All "click" events in such slots are not propagated to their parent elements.
:::

### Menu transitions

::: warning
Please note that transitions do not work when using `options-cover` prop.
:::

In the example below there's a few transitions showcased. For a full list of transitions available, go to [Transitions](/options/transitions).

**Example: Menu transitions**

Source: [MenuTransitions.vue](../../examples/QSelect/MenuTransitions.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <q-select
        label="Flip up/down"
        transition-show="flip-up"
        transition-hide="flip-down"
        filled
        v-model="model"
        :options="options"
        style="width: 250px"
      />

      <q-select
        label="Scale"
        transition-show="scale"
        transition-hide="scale"
        filled
        v-model="model"
        :options="options"
        style="width: 250px"
      />

      <q-select
        label="Jump up"
        transition-show="jump-up"
        transition-hide="jump-up"
        filled
        v-model="model"
        :options="options"
        style="width: 250px"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
const options = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']
</script>
````

### Options list display mode

By default QSelect shows the list of options as a menu on desktop and as a dialog on mobiles. You can force one behavior by using the `behavior` property.

::: warning
Please note that on iOS menu behavior might generate problems, especially when used in combination with `use-input` prop. You can use a conditional `behavior` prop like `:behavior="$q.platform.is.ios ? 'dialog' : 'menu'"` to use dialog mode only on iOS.
:::

**Example: Show options in menu**

Source: [BehaviorMenu.vue](../../examples/QSelect/BehaviorMenu.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <q-select
        filled
        v-model="model"
        label="Simple select"
        :options="stringOptions"
        style="width: 250px"
        behavior="menu"
      />

      <q-select
        filled
        v-model="model"
        use-input
        input-debounce="0"
        label="Simple filter"
        :options="options"
        @filter="filterFn"
        style="width: 250px"
        behavior="menu"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const stringOptions = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']

const model = ref(null)
const options = ref(stringOptions)

function filterFn(val, update) {
  if (val === '') {
    update(() => {
      options.value = stringOptions
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    options.value = stringOptions.filter(v => v.toLowerCase().includes(needle))
  })
}
</script>
````

**Example: Show options in dialog**

Source: [BehaviorDialog.vue](../../examples/QSelect/BehaviorDialog.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <q-select
        filled
        v-model="model"
        label="Simple select"
        :options="stringOptions"
        style="width: 250px"
        behavior="dialog"
      />

      <q-select
        filled
        v-model="model"
        use-input
        input-debounce="0"
        label="Simple filter"
        :options="options"
        @filter="filterFn"
        style="width: 250px"
        behavior="dialog"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const stringOptions = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']

const model = ref(null)
const options = ref(stringOptions)

function filterFn(val, update) {
  if (val === '') {
    update(() => {
      options.value = stringOptions
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    options.value = stringOptions.filter(v => v.toLowerCase().includes(needle))
  })
}
</script>
````

## The model

::: danger
The model for single selection can be anything (String, Object, ...) while the model for multiple selection must be an Array.
:::

**Example: Single vs multiple selection**

Source: [ModelSingleMultiple.vue](../../examples/QSelect/ModelSingleMultiple.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-select
        filled
        v-model="single"
        :options="options"
        label="Single"
        style="width: 250px"
      />

      <q-select
        filled
        v-model="multiple"
        multiple
        :options="options"
        label="Multiple"
        style="width: 250px"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const single = ref(null)
const multiple = ref(null)
const options = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']
</script>
````

**Example: Multiple selection, counter and max-values**

Source: [ModelMultipleCounter.vue](../../examples/QSelect/ModelMultipleCounter.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-select
        filled
        v-model="model"
        multiple
        :options="options"
        counter
        hint="With counter"
        style="width: 250px"
      />

      <q-select
        filled
        v-model="model2"
        multiple
        :options="options"
        counter
        max-values="2"
        hint="Max 2 selections"
        style="width: 250px"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
const model2 = ref(null)
const options = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']
</script>
````

The model content can be influenced by `emit-value` prop as you'll learn in "The options" section below.

## The options

### Options type

**Example: String options**

Source: [OptionString.vue](../../examples/QSelect/OptionString.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-badge color="secondary" multi-line> Model: "{{ model }}" </q-badge>

      <q-select filled v-model="model" :options="options" label="Standard" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
const options = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']
</script>
````

**Example: Object options**

Source: [OptionObject.vue](../../examples/QSelect/OptionObject.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-badge color="secondary" multi-line> Model: "{{ model }}" </q-badge>

      <q-select filled v-model="model" :options="options" label="Standard" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
const options = [
  {
    label: 'Google',
    value: 'Google',
    description: 'Search engine',
    category: '1'
  },
  // #region
  {
    label: 'Facebook',
    value: 'Facebook',
    description: 'Social media',
    category: '1'
  },
  {
    label: 'Twitter',
    value: 'Twitter',
    description: 'Quick updates',
    category: '2'
  },
  {
    label: 'Apple',
    value: 'Apple',
    description: 'iStuff',
    category: '2'
  },
  // #endregion
  {
    label: 'Oracle',
    value: 'Oracle',
    disable: true,
    description: 'Databases',
    category: '3'
  }
]
</script>
````

### Affecting model

When `emit-value` is used, the model becomes the determined `value` from the specified selected option. Default is to emit the whole option. It makes sense to use it only when the options are of Object form.

**Example: Emit-value**

Source: [OptionEmitValue.vue](../../examples/QSelect/OptionEmitValue.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-badge color="secondary" multi-line> Model: "{{ model }}" </q-badge>

      <q-select
        filled
        v-model="model"
        :options="options"
        label="Standard"
        emit-value
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
const options = [
  {
    label: 'Google',
    value: 'goog',
    description: 'Search engine',
    icon: 'mail'
  },
  // #region
  {
    label: 'Facebook',
    value: 'fb',
    description: 'Social media',
    icon: 'bluetooth'
  },
  {
    label: 'Twitter',
    value: 'twt',
    description: 'Quick updates',
    icon: 'map'
  },
  {
    label: 'Apple',
    value: 'app',
    description: 'iStuff',
    icon: 'golf_course'
  },
  // #endregion
  {
    label: 'Oracle',
    value: 'ora',
    disable: true,
    description: 'Databases',
    icon: 'casino'
  }
]
</script>
````

When `map-options` is used, the model can contain only the `value`, and it will be mapped against the options to determine its label. There is a performance penalty involved, so use it only if absolutely necessary. It's not needed, for example, if the model contains the whole Object (so contains the label prop).

**Example: Map options**

Source: [OptionMapOptions.vue](../../examples/QSelect/OptionMapOptions.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-badge color="secondary" multi-line> Model: "{{ model }}" </q-badge>

      <q-select
        filled
        v-model="model"
        :options="options"
        label="Standard"
        emit-value
        map-options
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
const options = [
  {
    label: 'Google',
    value: 'goog'
  },
  // #region
  {
    label: 'Facebook',
    value: 'fb'
  },
  {
    label: 'Twitter',
    value: 'twt'
  },
  {
    label: 'Apple',
    value: 'app'
  },
  // #endregion
  {
    label: 'Oracle',
    value: 'ora',
    disable: true
  }
]
</script>
````

### Custom prop names

By default, QSelect looks at `label`, `value`, `disable` and `sanitize` props of each option from the options array Objects. But you can override those:

::: warning
If you use functions for custom props always check if the option is null. These functions are used both for options in the list and for the selected options.
:::

**Example: Custom label, value and disable props**

Source: [OptionCustomProps.vue](../../examples/QSelect/OptionCustomProps.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <div class="col-12">
        <q-badge color="secondary" multi-line> Model: "{{ model }}" </q-badge>
      </div>

      <q-select
        filled
        v-model="model"
        :options="options"
        option-value="id"
        option-label="desc"
        option-disable="inactive"
        emit-value
        map-options
        style="min-width: 250px; max-width: 300px"
      />

      <q-select
        filled
        v-model="model"
        :options="options"
        :option-value="
          opt => (Object(opt) === opt && 'id' in opt ? opt.id : null)
        "
        :option-label="
          opt => (Object(opt) === opt && 'desc' in opt ? opt.desc : '- Null -')
        "
        :option-disable="
          opt => (Object(opt) === opt ? opt.inactive === true : true)
        "
        emit-value
        map-options
        style="min-width: 250px; max-width: 300px"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
const options = [
  {
    id: 'goog',
    desc: 'Google'
  },
  // #region
  {
    id: 'fb',
    desc: 'Facebook'
  },
  {
    id: 'twt',
    desc: 'Twitter'
  },
  {
    id: 'app',
    desc: 'Apple'
  },
  // #endregion
  {
    id: 'ora',
    desc: 'Oracle',
    inactive: true
  }
]
</script>
````

### Customizing menu options

::: warning
The list of options is rendered using virtual scroll, so if you render more than one element for an option you must set a `q-virtual-scroll--with-prev` class on all elements except the first one.
:::

**Example: Options slot**

Source: [OptionSlot.vue](../../examples/QSelect/OptionSlot.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-badge color="secondary" multi-line> Model: "{{ model }}" </q-badge>

      <q-select
        filled
        v-model="model"
        :options="options"
        label="Standard"
        color="teal"
        clearable
        options-selected-class="text-deep-orange"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section avatar>
              <q-icon :name="scope.opt.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ scope.opt.label }}</q-item-label>
              <q-item-label caption>{{ scope.opt.description }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
const options = [
  {
    label: 'Google',
    value: 'Google',
    description: 'Search engine',
    icon: 'mail'
  },
  // #region
  {
    label: 'Facebook',
    value: 'Facebook',
    description: 'Social media',
    icon: 'bluetooth'
  },
  {
    label: 'Twitter',
    value: 'Twitter',
    description: 'Quick updates',
    icon: 'map'
  },
  {
    label: 'Apple',
    value: 'Apple',
    description: 'iStuff',
    icon: 'golf_course'
  },
  // #endregion
  {
    label: 'Oracle',
    value: 'Oracle',
    disable: true,
    description: 'Databases',
    icon: 'casino'
  }
]
</script>
````

Here is another example where we add a QToggle to each option. The possibilities are endless.

**Example: Object options**

Source: [OptionQToggle.vue](../../examples/QSelect/OptionQToggle.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-badge color="secondary" multi-line> Model: "{{ model }}" </q-badge>

      <q-select
        filled
        v-model="model"
        :options="options"
        label="Multi with toggle"
        multiple
        emit-value
        map-options
      >
        <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
          <q-item v-bind="itemProps">
            <q-item-section>
              <q-item-label v-html="opt.label" />
            </q-item-section>
            <q-item-section side>
              <q-toggle
                :model-value="selected"
                @update:model-value="toggleOption(opt)"
              />
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref([])
const options = [
  {
    label: 'Google',
    value: 1
  },
  // #region
  {
    label: 'Facebook',
    value: 2
  },
  {
    label: 'Twitter',
    value: 3
  },
  {
    label: 'Apple',
    value: 4
  },
  {
    label: 'Oracle',
    value: 5
  }
  // #endregion
]
</script>
````

By default, when there are no options, the menu won't appear. But you can customize this scenario and specify what the menu should display.

**Example: No options slot**

Source: [OptionNoneSlot.vue](../../examples/QSelect/OptionNoneSlot.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-select filled v-model="model" :options="options" label="No options">
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-italic text-grey">
              No options slot
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
const options = []
</script>
````

### Lazy loading

The following example shows a glimpse of how you can play with lazy loading the options. This means, along with many other things, that `options` prop is not required on first render.

**Example: Lazy load options**

Source: [OptionLazyLoad.vue](../../examples/QSelect/OptionLazyLoad.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-select
        filled
        v-model="model"
        use-chips
        label="Lazy load opts"
        :options="options"
        @filter="filterFn"
        @filter-abort="abortFilterFn"
        style="width: 250px"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-btn
        v-if="options"
        label="Reset"
        color="primary"
        @click="options = null"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const stringOptions = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']

const model = ref(null)
const options = ref(null)

function filterFn(val, update, abort) {
  if (options.value !== null) {
    // already loaded
    update()
    return
  }

  setTimeout(() => {
    update(() => {
      options.value = stringOptions
    })
  }, 2000)
}

function abortFilterFn() {
  console.log('delayed filter aborted')
}
</script>
````

You can dynamically load new options when scroll reaches the end:

**Example: Dynamic loading options**

Source: [OptionsDynamic.vue](../../examples/QSelect/OptionsDynamic.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-select
      filled
      v-model="model"
      multiple
      :options="options"
      :loading="loading"
      @virtual-scroll="onScroll"
    />
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'

const allOptions = []
for (let i = 0; i <= 100_000; i++) {
  allOptions.push('Opt ' + i)
}

const pageSize = 50
const lastPage = Math.ceil(allOptions.length / pageSize)

const model = ref(null)
const loading = ref(false)

const nextPage = ref(2)
const options = computed(() =>
  allOptions.slice(0, pageSize * (nextPage.value - 1))
)

function onScroll({ to, ref: compRef }) {
  const lastIndex = options.value.length - 1

  if (loading.value !== true && nextPage.value < lastPage && to === lastIndex) {
    loading.value = true

    setTimeout(() => {
      nextPage.value++
      nextTick(() => {
        compRef.refresh()
        loading.value = false
      })
    }, 500)
  }
}
</script>
````

### Cover mode

**Example: Menu covering component**

Source: [OptionCover.vue](../../examples/QSelect/OptionCover.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-select
        filled
        v-model="model"
        :options="options"
        options-cover
        stack-label
        label="Standard"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
const options = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']
</script>
````

### Disable TAB selection

**Example: Disable Tab Selection**

Source: [DisableTabSelection.vue](../../examples/QSelect/DisableTabSelection.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-select
        disable-tab-selection
        filled
        v-model="model"
        :options="options"
        stack-label
        label="Standard"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
const options = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']
</script>
````

## The display value

**Example: Custom display value**

Source: [DisplayCustomValue.vue](../../examples/QSelect/DisplayCustomValue.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-badge color="secondary" multi-line> Model: "{{ model }}" </q-badge>

      <q-select
        filled
        v-model="model"
        :options="options"
        stack-label
        label="Standard"
        :display-value="`Company: ${model ? model : '*none*'}`"
      >
        <template v-slot:append>
          <q-icon
            v-if="model !== null"
            class="cursor-pointer"
            name="clear"
            @click.stop.prevent="model = null"
          />
        </template>
      </q-select>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref('Twitter')
const options = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']
</script>
````

**Example: Chips as display value**

Source: [DisplayChips.vue](../../examples/QSelect/DisplayChips.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <div style="min-width: 250px; max-width: 300px">
        <q-badge color="secondary" class="q-mb-md">
          Model: {{ modelSingle || '*none*' }}
        </q-badge>

        <q-select
          filled
          v-model="modelSingle"
          :options="options"
          use-chips
          stack-label
          label="Single selection"
        />
      </div>

      <div style="min-width: 250px; max-width: 300px">
        <q-badge color="secondary" class="q-mb-md">
          Model: {{ modelMultiple || '[]' }}
        </q-badge>

        <q-select
          filled
          v-model="modelMultiple"
          multiple
          :options="options"
          use-chips
          stack-label
          label="Multiple selection"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const modelSingle = ref('Apple')
const modelMultiple = ref(['Facebook'])
const options = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']
</script>
````

**Example: Selected-item slot**

Source: [DisplaySelectedItemSlot.vue](../../examples/QSelect/DisplaySelectedItemSlot.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-badge color="secondary" multi-line> Model: "{{ model }}" </q-badge>

      <q-select
        filled
        v-model="model"
        :options="options"
        stack-label
        label="Standard"
      >
        <template v-slot:selected>
          Company:
          <q-chip
            v-if="model"
            dense
            square
            color="white"
            text-color="primary"
            class="q-my-none q-ml-xs q-mr-none"
          >
            <q-avatar color="primary" text-color="white" :icon="model.icon" />
            {{ model.label }}
          </q-chip>
          <q-badge v-else>*none*</q-badge>
        </template>
      </q-select>

      <q-select
        filled
        v-model="model"
        :options="options"
        stack-label
        label="Standard"
        color="secondary"
      >
        <template v-slot:selected-item="scope">
          <q-chip
            removable
            dense
            @remove="scope.removeAtIndex(scope.index)"
            :tabindex="scope.tabindex"
            color="white"
            text-color="secondary"
            class="q-ma-none"
          >
            <q-avatar
              color="secondary"
              text-color="white"
              :icon="scope.opt.icon"
            />
            {{ scope.opt.label }}
          </q-chip>
        </template>
      </q-select>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref({
  label: 'Google',
  value: 'goog',
  icon: 'mail'
})

const options = [
  {
    label: 'Google',
    value: 'goog',
    icon: 'mail'
  },
  // #region
  {
    label: 'Facebook',
    value: 'fb',
    icon: 'bluetooth'
  },
  {
    label: 'Twitter',
    value: 'twt',
    icon: 'map'
  },
  {
    label: 'Apple',
    value: 'app',
    icon: 'golf_course'
  },
  // #endregion
  {
    label: 'Oracle',
    value: 'ora',
    disable: true,
    icon: 'casino'
  }
]
</script>
````

## Filtering and autocomplete

### Native attributes with "use-input"

All the attributes set on QSelect that are not in the list of props in the API will be passed to the native input field used (please check `use-input` prop description first to understand what it does) for filtering / autocomplete / adding new value. Some examples: autocomplete, placeholder.

More information: [native input attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input).

**Example: Filtering options**

Source: [InputFilterOptions.vue](../../examples/QSelect/InputFilterOptions.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <q-select
        filled
        v-model="model"
        use-input
        input-debounce="0"
        label="Simple filter"
        :options="options"
        @filter="filterFn"
        style="width: 250px"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select
        filled
        v-model="model"
        use-input
        hide-selected
        input-debounce="0"
        label="Hide selected"
        :options="options"
        @filter="filterFn"
        style="width: 250px"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const stringOptions = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']

const model = ref(null)
const options = ref(stringOptions)

function filterFn(val, update) {
  if (val === '') {
    update(() => {
      options.value = stringOptions

      // here you have access to "ref" which
      // is the Vue reference of the QSelect
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    options.value = stringOptions.filter(v => v.toLowerCase().includes(needle))
  })
}
</script>
````

**Example: Basic filtering**

Source: [BasicFiltering.vue](../../examples/QSelect/BasicFiltering.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <q-select
        filled
        v-model="model"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        :options="options"
        @filter="filterFn"
        hint="Basic filtering"
        style="width: 250px; padding-bottom: 32px"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const stringOptions = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']

const model = ref(null)
const options = ref(stringOptions)

function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase()
    options.value = stringOptions.filter(v => v.toLowerCase().includes(needle))
  })
}
</script>
````

**Example: Filtering on more than 2 chars**

Source: [InputFilterMin.vue](../../examples/QSelect/InputFilterMin.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <q-select
        filled
        v-model="model"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        :options="options"
        @filter="filterFn"
        hint="Minimum 2 characters to trigger filtering"
        style="width: 250px; padding-bottom: 32px"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const stringOptions = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']

const model = ref(null)
const options = ref(stringOptions)

function filterFn(val, update, abort) {
  if (val.length < 2) {
    abort()
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    options.value = stringOptions.filter(v => v.toLowerCase().includes(needle))
  })
}
</script>
````

**Example: Text autocomplete**

Source: [TextAutocomplete.vue](../../examples/QSelect/TextAutocomplete.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <q-select
        filled
        :model-value="model"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        :options="options"
        @filter="filterFn"
        @input-value="setModel"
        hint="Text autocomplete"
        style="width: 250px; padding-bottom: 32px"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const stringOptions = [
  // #region
  'Google',
  'Facebook',
  'Twitter',
  'Apple',
  'Oracle'
  // #endregion
].reduce((acc, opt) => {
  for (let i = 1; i <= 5; i++) {
    acc.push(opt + ' ' + i)
  }
  return acc
}, [])

const model = ref(null)
const options = ref(stringOptions)

function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLocaleLowerCase()
    options.value = stringOptions.filter(v =>
      v.toLocaleLowerCase().includes(needle)
    )
  })
}

function setModel(val) {
  model.value = val
}
</script>
````

**Example: Lazy filtering**

Source: [InputFilterLazy.vue](../../examples/QSelect/InputFilterLazy.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-select
        filled
        v-model="model"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        label="Lazy filter"
        :options="options"
        @filter="filterFn"
        @filter-abort="abortFilterFn"
        style="width: 250px"
        hint="With hide-selected and fill-input"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select
        filled
        v-model="model"
        use-input
        use-chips
        input-debounce="0"
        label="Lazy filter"
        :options="options"
        @filter="filterFn"
        @filter-abort="abortFilterFn"
        style="width: 250px"
        hint="With use-chips"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const stringOptions = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']

const model = ref(null)
const options = ref(stringOptions)

function filterFn(val, update, abort) {
  // call abort() at any time if you can't retrieve data somehow

  setTimeout(() => {
    update(() => {
      if (val === '') {
        options.value = stringOptions
      } else {
        const needle = val.toLowerCase()
        options.value = stringOptions.filter(v =>
          v.toLowerCase().includes(needle)
        )
      }
    })
  }, 1500)
}

function abortFilterFn() {
  console.log('delayed filter aborted')
}
</script>
````

**Example: Selecting option after filtering**

Source: [InputFilterAfter.vue](../../examples/QSelect/InputFilterAfter.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-select
        filled
        v-model="model"
        clearable
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        label="Focus after filtering"
        :options="options"
        @filter="filterFn"
        @filter-abort="abortFilterFn"
        style="width: 250px"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select
        filled
        v-model="model"
        clearable
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        label="Autoselect after filtering"
        :options="options"
        @filter="filterFnAutoselect"
        @filter-abort="abortFilterFn"
        style="width: 250px"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const stringOptions = [
  // #region
  'Google',
  'Facebook',
  'Twitter',
  'Apple',
  'Oracle'
  // #endregion
].reduce((acc, opt) => {
  for (let i = 1; i <= 5; i++) {
    acc.push(opt + ' ' + i)
  }
  return acc
}, [])

const model = ref(null)
const options = ref(stringOptions)

function filterFn(val, update, abort) {
  // call abort() at any time if you can't retrieve data somehow

  setTimeout(() => {
    update(
      () => {
        if (val === '') {
          options.value = stringOptions
        } else {
          const needle = val.toLowerCase()
          options.value = stringOptions.filter(v =>
            v.toLowerCase().includes(needle)
          )
        }
      },

      // "compRef" is the Vue reference to the QSelect
      compRef => {
        if (val !== '' && compRef.options.length !== 0) {
          compRef.setOptionIndex(-1) // reset optionIndex in case there is something selected
          compRef.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
        }
      }
    )
  }, 300)
}

function filterFnAutoselect(val, update, abort) {
  // call abort() at any time if you can't retrieve data somehow

  setTimeout(() => {
    update(
      () => {
        if (val === '') {
          options.value = stringOptions
        } else {
          const needle = val.toLowerCase()
          options.value = stringOptions.filter(v =>
            v.toLowerCase().includes(needle)
          )
        }
      },

      // "compRef" is the Vue reference to the QSelect
      compRef => {
        if (
          val !== '' &&
          compRef.options.length !== 0 &&
          compRef.getOptionIndex() === -1
        ) {
          compRef.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
          compRef.toggleOption(compRef.options[compRef.getOptionIndex()], true) // toggle the focused option
        }
      }
    )
  }, 300)
}

function abortFilterFn() {
  console.log('delayed filter aborted')
}
</script>
````

## Create new values

::: tip
The following are just a few examples to get you started into making your own QSelect behavior. This is not exhaustive list of possibilities that QSelect offers.

It makes sense to use this feature along with `use-input` prop.
:::

In order to enable the creation of new values, you need to **either specify** the `new-value-mode` prop **and/or** listen for `@new-value` event. If you use both, then the purpose of listening to `@new-value` would be only to override the `new-value-mode` in your custom scenarios.

### The new-value-mode prop

The `new-value-mode` prop value specifies how the value should be added: `add` (adds a value, even if duplicate), `add-unique` (add only if NOT duplicate) or `toggle` (adds value if it's not already in model, otherwise it removes it).

By using this prop you don't need to also listen for `@new-value` event, unless you have some specific scenarios for which you want to override the behavior.

**Example: New value mode**

Source: [CreateNewValueMode.vue](../../examples/QSelect/CreateNewValueMode.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <q-select
        label="Mode: 'add'"
        filled
        v-model="modelAdd"
        use-input
        use-chips
        multiple
        hide-dropdown-icon
        input-debounce="0"
        new-value-mode="add"
        style="width: 250px"
      />

      <q-select
        label="Mode: 'add-unique'"
        filled
        v-model="modelAddUnique"
        use-input
        use-chips
        multiple
        hide-dropdown-icon
        input-debounce="0"
        new-value-mode="add-unique"
        style="width: 250px"
      />

      <q-select
        label="Mode: 'toggle'"
        filled
        v-model="modelToggle"
        use-input
        use-chips
        multiple
        hide-dropdown-icon
        input-debounce="0"
        new-value-mode="toggle"
        style="width: 250px"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const modelAdd = ref(null)
const modelAddUnique = ref(null)
const modelToggle = ref(null)
</script>
````

### The @new-value event

The `@new-value` event is emitted with the value to be added and a `done` callback. The `done` callback has two **optional** parameters:

- the value to be added
- the behavior (same values of `new-value-mode` prop, and when it is specified it overrides that prop -- if it is used) -- default behavior (if not using `new-value-mode`) is to add the value even if it would be a duplicate

Calling `done()` with no parameters simply empties the input box value, without tampering with the model in any way.

**Example: Listening on @new-value**

Source: [CreateListener.vue](../../examples/QSelect/CreateListener.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-select
      label="Allows duplicates"
      filled
      v-model="model"
      use-input
      use-chips
      multiple
      hide-dropdown-icon
      input-debounce="0"
      @new-value="createValue"
      style="width: 250px"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)

function createValue(val, done) {
  // specific logic to eventually call done(...) -- or not
  done(val)

  // done callback has two optional parameters:
  //  - the value to be added
  //  - the behavior (same values of new-value-mode prop,
  //    and when it is specified it overrides that prop –
  //    if it is used); default behavior (if not using
  //    new-value-mode) is to add the value even if it would
  //    be a duplicate
}
</script>
````

**Example: Adding only unique values**

Source: [CreateListenerUnique.vue](../../examples/QSelect/CreateListenerUnique.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-select
      label="Unique values only"
      filled
      v-model="model"
      use-input
      use-chips
      multiple
      hide-dropdown-icon
      input-debounce="0"
      @new-value="createValue"
      style="width: 250px"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)

function createValue(val, done) {
  // specific logic to eventually call done(...) -- or not
  done(val, 'add-unique')

  // done callback has two optional parameters:
  //  - the value to be added
  //  - the behavior (same values of new-value-mode prop,
  //    and when it is specified it overrides that prop –
  //    if it is used); default behavior (if not using
  //    new-value-mode) is to add the value even if it would
  //    be a duplicate
}
</script>
````

### Using menu and filtering

Filtering and adding the new values to menu:

**Example: Filtering and adding to menu**

Source: [FilteringAddsToMenu.vue](../../examples/QSelect/FilteringAddsToMenu.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-select
      filled
      v-model="model"
      use-input
      use-chips
      multiple
      input-debounce="0"
      @new-value="createValue"
      :options="filterOptions"
      @filter="filterFn"
      style="width: 250px"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const stringOptions = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']

const model = ref(null)
const filterOptions = ref(stringOptions)

function createValue(val, done) {
  // Calling done(var) when new-value-mode is not set or "add", or done(var, "add") adds "var" content to the model
  // and it resets the input textbox to empty string
  // ----
  // Calling done(var) when new-value-mode is "add-unique", or done(var, "add-unique") adds "var" content to the model
  // only if is not already set
  // and it resets the input textbox to empty string
  // ----
  // Calling done(var) when new-value-mode is "toggle", or done(var, "toggle") toggles the model with "var" content
  // (adds to model if not already in the model, removes from model if already has it)
  // and it resets the input textbox to empty string
  // ----
  // If "var" content is undefined/null, then it doesn't tampers with the model
  // and only resets the input textbox to empty string

  if (val.length !== 0) {
    if (!stringOptions.includes(val)) {
      stringOptions.push(val)
    }
    done(val, 'toggle')
  }
}

function filterFn(val, update) {
  update(() => {
    if (val === '') {
      filterOptions.value = stringOptions
    } else {
      const needle = val.toLowerCase()
      filterOptions.value = stringOptions.filter(v =>
        v.toLowerCase().includes(needle)
      )
    }
  })
}
</script>
````

Filters new values (in the example below the value to be added requires at least 3 characters to pass), and does not add to menu:

**Example: Filtering without adding to menu**

Source: [FilteringNoAddToMenu.vue](../../examples/QSelect/FilteringNoAddToMenu.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-select
      filled
      v-model="model"
      use-input
      use-chips
      multiple
      input-debounce="0"
      @new-value="createValue"
      :options="filterOptions"
      @filter="filterFn"
      style="width: 250px"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const stringOptions = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']

const model = ref(null)
const filterOptions = ref(stringOptions)

function createValue(val, done) {
  // Calling done(var) when new-value-mode is not set or "add", or done(var, "add") adds "var" content to the model
  // and it resets the input textbox to empty string
  // ----
  // Calling done(var) when new-value-mode is "add-unique", or done(var, "add-unique") adds "var" content to the model
  // only if is not already set
  // and it resets the input textbox to empty string
  // ----
  // Calling done(var) when new-value-mode is "toggle", or done(var, "toggle") toggles the model with "var" content
  // (adds to model if not already in the model, removes from model if already has it)
  // and it resets the input textbox to empty string
  // ----
  // If "var" content is undefined/null, then it doesn't tampers with the model
  // and only resets the input textbox to empty string

  if (val.length > 2 && !stringOptions.includes(val)) {
    done(val, 'add-unique')
  }
}

function filterFn(val, update) {
  update(() => {
    if (val === '') {
      filterOptions.value = stringOptions
    } else {
      const needle = val.toLowerCase()
      filterOptions.value = stringOptions.filter(v =>
        v.toLowerCase().includes(needle)
      )
    }
  })
}
</script>
````

Generating multiple values from input:

**Example: Generating multiple values**

Source: [FilteringAddMultiple.vue](../../examples/QSelect/FilteringAddMultiple.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-select
      filled
      label="Select multiple values"
      hint="Separate multiple values by [,;|]"
      v-model="model"
      use-input
      use-chips
      multiple
      input-debounce="0"
      @new-value="createValue"
      :options="filterOptions"
      @filter="filterFn"
      style="width: 250px"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const stringOptions = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']

const model = ref(null)
const filterOptions = ref(stringOptions)

function createValue(val, done) {
  // Calling done(var) when new-value-mode is not set or is "add", or done(var, "add") adds "var" content to the model
  // and it resets the input textbox to empty string
  // ----
  // Calling done(var) when new-value-mode is "add-unique", or done(var, "add-unique") adds "var" content to the model
  // only if is not already set and it resets the input textbox to empty string
  // ----
  // Calling done(var) when new-value-mode is "toggle", or done(var, "toggle") toggles the model with "var" content
  // (adds to model if not already in the model, removes from model if already has it)
  // and it resets the input textbox to empty string
  // ----
  // If "var" content is undefined/null, then it doesn't tampers with the model
  // and only resets the input textbox to empty string

  if (val.length !== 0) {
    const modelValue = [...(model.value || [])]

    val
      .split(/[,;|]+/)
      .map(v => v.trim())
      .filter(v => v.length !== 0)
      .forEach(v => {
        if (!stringOptions.includes(v)) {
          stringOptions.push(v)
        }
        if (!modelValue.includes(v)) {
          modelValue.push(v)
        }
      })

    done(null)
    model.value = modelValue
  }
}

function filterFn(val, update) {
  update(() => {
    if (val === '') {
      filterOptions.value = stringOptions
    } else {
      const needle = val.toLowerCase()
      filterOptions.value = stringOptions.filter(v =>
        v.toLowerCase().includes(needle)
      )
    }
  })
}
</script>
````

## Sanitization

**By default, all options (included selected ones) are sanitized**. This means that displaying them in HTML format is disabled. However, if you require HTML on your options and you trust their content, then there are a few ways to do this.

You can force the HTML form of the menu options by:

- setting `html` key of the trusted option to `true` (for specific trusted options)
- or by setting `options-html` prop of QSelect (for all options)

The displayed value of QSelect is displayed as HTML if:

- the `display-value-html` prop of QSelect is set
- or you are not using `display-value` and
  - the `options-html` prop of QSelect is set
  - any selected option has `html` key set to `true`

::: warning
If you use `selected` or `selected-item` slots, then you are responsible for sanitization of the display value. The `display-value-html` prop will not apply.
:::

**Example: Options in HTML form**

Source: [HtmlOptions.vue](../../examples/QSelect/HtmlOptions.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-badge color="secondary" multi-line class="q-mb-md">
      Model: {{ model || 'empty' }}
    </q-badge>

    <div class="q-gutter-md">
      <q-toggle v-model="optionsHtml" label="Options in HTML form" />

      <q-select
        filled
        v-model="model"
        :options="options"
        label="Standard"
        :options-html="optionsHtml"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
const optionsHtml = ref(false)
const options = [
  {
    label: '<span class="text-primary text-bold text-underline">Goo</span>gle',
    value: 'Google'
  },
  {
    label:
      '<span class="text-primary">This is</span> in <span class="text-negative text-bold">HTML form</span> through an option prop',
    value: 'Facebook',
    html: true
  }
]
</script>
````

**Example: Display value in HTML form**

Source: [HtmlDisplayValue.vue](../../examples/QSelect/HtmlDisplayValue.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-badge color="secondary" multi-line class="q-mb-md">
      Model: {{ model || 'empty' }}
    </q-badge>

    <div class="q-gutter-md">
      <q-toggle v-model="displayHtml" label="Display value in HTML form" />

      <q-select
        filled
        v-model="model"
        :options="options"
        stack-label
        label="Standard"
        :display-value="`Company: ${model ? model.label : '*none*'}`"
        :display-value-html="displayHtml"
      >
        <template v-slot:append>
          <q-icon
            v-if="model !== null"
            class="cursor-pointer"
            name="clear"
            @click.stop.prevent="model = null"
          />
        </template>
      </q-select>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const options = [
  {
    label: '<span class="text-primary">G</span>oogle',
    value: 'Google'
  },
  {
    label: '<span class="text-red">Face</span>book',
    value: 'Facebook'
  }
]

const model = ref(options[0])
const displayHtml = ref(false)
</script>
````

## Render performance

The render performance is NOT affected much by the number of options, unless `map-options` is used on a large set.
Notice the infinite scroll in place which renders additional options as the user scrolls through the list.

::: tip

- (Composition API) To get the best performance while using lots of options, do not wrap the array that you are passing in the `options` prop with ref()/computed()/reactive()/etc. This allows Vue to skip making the list "responsive" to changes.
- (Options API) To get the best performance while using lots of options, freeze the array that you are passing in the `options` prop using `Object.freeze(items)`. This allows Vue to skip making the list "responsive" to changes.

:::

**Example: 100k options**

Source: [RenderPerf.vue](../../examples/QSelect/RenderPerf.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-select filled v-model="model" multiple :options="options" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const options = []
for (let i = 0; i <= 100_000; i++) {
  options.push('Opt ' + i)
}

const model = ref(null)
</script>
````

## Keyboard navigation

When QSelect is focused:

- pressing <kbd>ENTER</kbd>, <kbd>ARROW DOWN</kbd> (or <kbd>SPACE</kbd> if `use-input` is not set) will open the list of options
- if `use-chips` is set:
  - pressing <kbd>SHIFT</kbd> + <kbd>TAB</kbd> will navigate backwards through the QChips (if a QChip is selected <kbd>TAB</kbd> will navigate forward through the QChips)
  - pressing <kbd>ENTER</kbd> when a QChip is selected will remove that option from the selection
  - pressing <kbd>BACKSPACE</kbd> will remove the last option from the selection (when `use-input` is set the input should be empty)
- pressing <kbd>BACKSPACE</kbd> when `clearable` is set then:
  - it clears the model (with `null` value) for single selection
  - it removes the last added value for multiple selection
- pressing <kbd>TAB</kbd> (or <kbd>SHIFT</kbd> + <kbd>TAB</kbd> if `use-chips` is not set or the first QChip is selected) will navigate to the next or previous focusable element on page
- typing text (<kbd>0</kbd> - <kbd>9</kbd> or <kbd>A</kbd> - <kbd>Z</kbd>) if `use-input` is not set will:
  - create a search buffer (will be reset when a new key is not typed for 1.5 seconds) that will be used to search in the options labels
  - select the next option starting with that letter (after the current focused one) if the first key in buffer is typed multiple times
  - select the next option (starting with the current focused one) that matches the typed text (the match is fuzzy - the option label should start with the first letter and contain all the letters)

When the list of options is opened:

- pressing <kbd>ARROW UP</kbd> or <kbd>ARROW DOWN</kbd> will navigate up or down in the list of options
- pressing <kbd>PAGE UP</kbd> or <kbd>PAGE DOWN</kbd> will navigate one page up or down in the list of options
- pressing <kbd>HOME</kbd> or <kbd>END</kbd> will navigate to the start or end of the list of options (only if you are not using `use-input`, or the input is empty)
- when navigating using arrow keys, navigation will wrap when reaching the start or end of the list
- pressing <kbd>ENTER</kbd> (or <kbd>SPACE</kbd> when `use-input` is not set, or <kbd>TAB</kbd> when `multiple` and `disable-tab-selection` are not set) when an option is selected in the list will:
  - select the option and close the list of options if `multiple` and `disable-tab-selection` are not set
  - toggle the option if `multiple` is set

## Native form submit

When dealing with a native form which has an `action` and a `method` (eg. when using Quasar with ASP.NET controllers), you need to specify the `name` property on QSelect, otherwise formData will not contain it (if it should) - all value are converted to string (native behaviour, so do not use Object values):

**Example: Native form**

Source: [NativeForm.vue](../../examples/QSelect/NativeForm.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-select
        name="preferred_genre"
        v-model="preferred"
        :options="options"
        color="primary"
        filled
        clearable
        label="Preferred genre"
      />

      <q-select
        name="accepted_genres"
        v-model="accepted"
        multiple
        :options="options"
        color="primary"
        filled
        clearable
        label="Accepted genres"
      />

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
      </div>
    </q-form>

    <q-card
      v-if="submitted"
      flat
      bordered
      class="q-mt-md"
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'"
    >
      <template v-if="submitEmpty">
        <q-card-section>
          Submitted form contains empty formData.
        </q-card-section>
      </template>
      <template v-else>
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
      </template>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const preferred = ref('rock')
const accepted = ref([])
const options = [
  {
    label: 'Rock',
    value: 'rock'
  },
  {
    label: 'Funk',
    value: 'funk'
  },
  {
    label: 'Pop',
    value: 'pop'
  }
]

const submitted = ref(false)
const submitEmpty = ref(false)
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

  submitted.value = true
  submitResult.value = data
  submitEmpty.value = data.length === 0
}
</script>
````
