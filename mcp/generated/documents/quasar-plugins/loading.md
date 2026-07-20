---
title: Loading Plugin
description: A Quasar plugin which can display a loading state for your app through an overlay with a spinner and a message.
canonical: https://quasar.dev/quasar-plugins/loading
kinds: plugin
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [Loading](../../api/Loading.md)

Loading is a feature that you can use to display an overlay with a spinner on top of your App's content to inform the user that a background operation is taking place. No need to add complex logic within your Pages for global background operations.

**API reference:** [Loading](../../api/Loading.md)

**Configuration:** register Loading through `framework.plugins` in `quasar.config` and configure `framework.config.loading` in `quasar.config`.

## Usage

Loading uses a delay (500ms) to display itself so that quick operations won't make the screen flicker. This happens by showing and then quickly hiding the progress spinner without the user having a chance to see what happens. The delay before showing it eliminates confusion.

Inside a Vue component:

```js
import { useQuasar } from 'quasar'

setup () {
  const $q = useQuasar()

  $q.loading.show({
    delay: 400 // ms
  })

  $q.loading.hide()
}
```

Outside of a Vue component:

```js
import {
  Loading,

  // optional!, for example below
  // with custom spinner
  QSpinnerGears
} from 'quasar'

// default options
Loading.show()

// fully customizable
Loading.show({
  spinner: QSpinnerGears
  // other props
})

Loading.hide()
```

### Default options

**Example: Default options**

Source: [Default.vue](../../examples/Loading/Default.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn color="purple" @click="showLoading" label="Show Loading" />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { onBeforeUnmount } from 'vue'

const $q = useQuasar()
let timer

onBeforeUnmount(() => {
  if (timer !== void 0) {
    clearTimeout(timer)
    $q.loading.hide()
  }
})

function showLoading() {
  $q.loading.show()

  // hiding in 2s
  timer = setTimeout(() => {
    $q.loading.hide()
    timer = void 0
  }, 2000)
}
</script>
````

### Customization

**Example: With message**

Source: [WithMessage.vue](../../examples/Loading/WithMessage.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn color="teal" @click="showLoading" label="Show Loading" />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { onBeforeUnmount } from 'vue'

const $q = useQuasar()
let timer

onBeforeUnmount(() => {
  if (timer !== void 0) {
    clearTimeout(timer)
    $q.loading.hide()
  }
})

function showLoading() {
  $q.loading.show({
    message: 'Some important process  is in progress. Hang on...'
  })

  // hiding in 3s
  timer = setTimeout(() => {
    $q.loading.hide()
    timer = void 0
  }, 3000)
}
</script>
````

**Example: With customized box**

Source: [WithBox.vue](../../examples/Loading/WithBox.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn color="purple" @click="showLoading" label="Show Loading" />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { onBeforeUnmount } from 'vue'

const $q = useQuasar()
let timer

onBeforeUnmount(() => {
  if (timer !== void 0) {
    clearTimeout(timer)
    $q.loading.hide()
  }
})

function showLoading() {
  $q.loading.show({
    message: 'Doing something. Please wait...',
    boxClass: 'bg-grey-2 text-grey-9',
    spinnerColor: 'primary'
  })

  // hiding in 3s
  timer = setTimeout(() => {
    $q.loading.hide()
    timer = void 0
  }, 3000)
}
</script>
````

**Example: Customized**

Source: [Customized.vue](../../examples/Loading/Customized.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn color="red" @click="showLoading" label="Show Loading" />
  </div>
</template>

<script setup>
import { QSpinnerFacebook, useQuasar } from 'quasar'
import { onBeforeUnmount } from 'vue'

const $q = useQuasar()
let timer

onBeforeUnmount(() => {
  if (timer !== void 0) {
    clearTimeout(timer)
    $q.loading.hide()
  }
})

function showLoading() {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: 'yellow',
    spinnerSize: 140,
    backgroundColor: 'purple',
    message: 'Some important process is in progress. Hang on...',
    messageColor: 'black'
  })

  // hiding in 3s
  timer = setTimeout(() => {
    $q.loading.hide()
    timer = void 0
  }, 3000)
}
</script>
````

**Example: Show and Change**

Source: [ShowAndChange.vue](../../examples/Loading/ShowAndChange.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn color="primary" @click="showLoading" label="Show Loading" />
  </div>
</template>

<script setup>
import { QSpinnerGears, useQuasar } from 'quasar'
import { onBeforeUnmount } from 'vue'

const $q = useQuasar()
let timer

onBeforeUnmount(() => {
  if (timer !== void 0) {
    clearTimeout(timer)
    $q.loading.hide()
  }
})

function showLoading() {
  $q.loading.show({
    message: 'First message. Gonna change it in 3 seconds...'
  })

  timer = setTimeout(() => {
    $q.loading.show({
      spinner: QSpinnerGears,
      spinnerColor: 'red',
      messageColor: 'black',
      backgroundColor: 'yellow',
      message: 'Updated message'
    })

    timer = setTimeout(() => {
      $q.loading.hide()
      timer = void 0
    }, 2000)
  }, 2000)
}
</script>
````

### Content sanitization

**Example: With unsafe message, but sanitized**

Source: [WithMessageSanitized.vue](../../examples/Loading/WithMessageSanitized.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn color="teal" @click="showLoading" label="Show Loading (Sanitized)" />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { onBeforeUnmount } from 'vue'

const $q = useQuasar()
let timer

onBeforeUnmount(() => {
  if (timer !== void 0) {
    clearTimeout(timer)
    $q.loading.hide()
  }
})

function showLoading() {
  $q.loading.show({
    message:
      'Some important <b>process</b> is in progress.<br><span class="text-amber text-italic">Please wait...</span>',
    html: true
  })

  // hiding in 3s
  timer = setTimeout(() => {
    $q.loading.hide()
    timer = void 0
  }, 3000)
}
</script>
````

### Multiple groups in parallel <q-badge label="v2.8+" />

::: tip
When you have multiple processes that occur in parallel then you can group Loading instances so that you can manage the Loading state per group (individually).
:::

Specify the `group` property when spawning each of your Loading instances and you can update or hide them by using the returned function.

Obviously, we can only display one group at a time, so the order in which they are spawned determines the priority in which they are shown (the last one has priority over the previous ones; LIFO).

**Example: Multiple groups**

Source: [MultipleGroups.vue](../../examples/Loading/MultipleGroups.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn
      color="purple"
      @click="showMultipleGroups"
      label="Show Multiple Groups"
    />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { onBeforeUnmount } from 'vue'

const $q = useQuasar()
let timer

onBeforeUnmount(() => {
  if (timer !== void 0) {
    clearTimeout(timer)
    $q.loading.hide()
  }
})

function showMultipleGroups() {
  const first = $q.loading.show({
    group: 'first',
    message: 'This is first group',
    spinnerColor: 'amber',
    messageColor: 'amber'
  })

  // hiding in 2s
  timer = setTimeout(() => {
    const second = $q.loading.show({
      group: 'second',
      message: 'This is second group'
    })

    timer = setTimeout(() => {
      // we hide second one (only); but we will still have the first one active
      second()

      // we update 'first' group message (just highlighting how it can be done);
      // note that updating here is not required to show the remaining 'first' group
      first({
        message: 'We hid the second group and updated the first group message'
      })

      timer = setTimeout(() => {
        // we hide all that may be showing
        $q.loading.hide()
        timer = void 0
      }, 2000)
    }, 2000)
  }, 1500)
}
</script>
````

You can play with the returning function to show/update/hide the group or just call `Loading.show({ group: '..group_name..', ... })` or `Loading.hide('..group_name..')`.

The following two ways are perfectly equivalent (and you can even mix the calls between them):

```js
/**
 * First way
 */

// we spawn the group
const myLoadingGroup = Loading.show({
  group: 'my-group',
  message: 'Some message'
})

// with params, so we update this group
myLoadingGroup({ message: 'Second message' })

// no params, so we instruct Quasar to hide the group
myLoadingGroup()

/**
 * Second, equivalent way
 */

// we spawn the group
Loading.show({
  group: 'my-group',
  message: 'Some message'
})

// we update the group (in this case we need to specify the group name)
Loading.show({
  group: 'my-group'
  message: 'Second message'
})

// we hide this specific group
Loading.hide('my-group')
```

::: warning
Please remember that calling `Loading.hide()` with no parameters will hide all the groups. So if you use groups, you may want to always call the hide() method with a group name.
:::

### Setting Up Defaults

Should you wish to set up some defaults, rather than specifying them each time, you can do so by using quasar.config file > framework > config > loading: {...} or by calling `Loading.setDefaults({...})` or `$q.loading.setDefaults({...})`.
