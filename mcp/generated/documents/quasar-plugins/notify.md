---
title: Notify
description: A Quasar plugin to display animated messages to users like notifications, toasts and snackbars.
canonical: https://quasar.dev/quasar-plugins/notify
kinds: plugin
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [Notify](../../api/Notify.md)

Notify is a Quasar plugin that can display animated messages (floating above everything in your pages) to users in the form of a notification. They are useful for alerting the user of an event and can even engage the user through actions. Also known as a toast or snackbar.

**API reference:** [Notify](../../api/Notify.md)

**Configuration:** register Notify through `framework.plugins` in `quasar.config` and configure `framework.config.notify` in `quasar.config`.

## Usage

### Basic

```js Outside of a Vue file
import { Notify } from 'quasar'

Notify.create('Danger, Will Robinson! Danger!')
// or with a config object:
Notify.create({
  message: 'Danger, Will Robinson! Danger!'
})
```

```js Inside of a Vue file
import { useQuasar } from 'quasar'

setup () {
  const $q = useQuasar()

  $q.notify('Message')
  // or with a config object:
  $q.notify({...})
}
```

**Example: Basic**

Source: [Basic.vue](../../examples/Notify/Basic.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn color="purple" @click="showNotif" label="Show Notification" />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function showNotif() {
  $q.notify({
    message: 'Jim pinged you.',
    color: 'purple'
  })
}
</script>
````

::: tip
If you define any actions, the notification will automatically be dismissed when the user picks it.
:::

### With caption

**Example: Caption**

Source: [Caption.vue](../../examples/Notify/Caption.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn color="purple" @click="showNotif" label="Show with caption" />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function showNotif() {
  $q.notify({
    message: 'Jim pinged you.',
    caption: '5 minutes ago',
    color: 'secondary'
  })
}
</script>
````

### With icon, avatar or spinner

**Example: With icon**

Source: [Icon.vue](../../examples/Notify/Icon.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn color="purple" @click="showNotif" label="Show Notification" />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function showNotif() {
  $q.notify({
    message: 'Jim pinged you.',
    icon: 'announcement'
  })
}
</script>
````

**Example: With avatar**

Source: [Avatar.vue](../../examples/Notify/Avatar.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn color="purple" @click="showNotif" label="Show Notification" />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function showNotif() {
  $q.notify({
    message: 'Jim pinged you.',
    color: 'purple',
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png'
  })
}
</script>
````

**Example: With spinner**

Source: [Spinner.vue](../../examples/Notify/Spinner.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="row q-gutter-sm">
      <q-btn color="purple" @click="showDefault" label="Default spinner" />
      <q-btn color="purple" @click="showCustom" label="Custom spinner" />
    </div>
  </div>
</template>

<script setup>
import { QSpinnerGears, useQuasar } from 'quasar'

const $q = useQuasar()

function showDefault() {
  $q.notify({
    spinner: true,
    message: 'Please wait...',
    timeout: 2000
  })
}

function showCustom() {
  $q.notify({
    spinner: QSpinnerGears,
    message: 'Working...',
    timeout: 2000
  })
}
</script>
````

### With actions

**Example: With actions**

Source: [Actions.vue](../../examples/Notify/Actions.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn color="purple" @click="showNotif" label="Show Notifications" />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function showNotif() {
  $q.notify({
    message: 'Jim just pinged you.',
    color: 'primary',
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    actions: [
      {
        label: 'Dismiss',
        color: 'white',
        handler: () => {
          /* ... */
        }
      }
    ]
  })

  $q.notify({
    message: 'Jim just pinged you.',
    color: 'primary',
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    actions: [
      {
        label: 'Reply',
        color: 'yellow',
        handler: () => {
          /* ... */
        }
      },
      {
        label: 'Dismiss',
        color: 'white',
        handler: () => {
          /* ... */
        }
      }
    ]
  })

  $q.notify({
    message: 'Jim just pinged you.',
    color: 'primary',
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    actions: [
      {
        icon: 'close',
        color: 'white',
        round: true,
        handler: () => {
          /* ... */
        }
      }
    ]
  })
}
</script>
````

### Multiline

**Example: Multiline**

Source: [Multiline.vue](../../examples/Notify/Multiline.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn color="purple" @click="showNotif" label="Show Notification" />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function showNotif() {
  $q.notify({
    message:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic quisquam non ad sit assumenda consequuntur esse inventore officia. Corrupti reiciendis impedit vel, fugit odit quisquam quae porro exercitationem eveniet quasi.',
    color: 'primary',
    multiLine: true,
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    actions: [
      {
        label: 'Reply',
        color: 'yellow',
        handler: () => {
          /* ... */
        }
      }
    ]
  })
}
</script>
````

### Positioning

**Example: Positioning & different options**

Source: [Positioning.vue](../../examples/Notify/Positioning.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-y-sm column items-center">
    <div>
      <div class="row q-gutter-sm">
        <q-btn round size="sm" color="secondary" @click="showNotif('top-left')">
          <q-icon name="arrow_back" class="rotate-45" />
        </q-btn>
        <q-btn round size="sm" color="accent" @click="showNotif('top')">
          <q-icon name="arrow_upward" />
        </q-btn>
        <q-btn
          round
          size="sm"
          color="secondary"
          @click="showNotif('top-right')"
        >
          <q-icon name="arrow_upward" class="rotate-45" />
        </q-btn>
      </div>
    </div>

    <div>
      <div class="row q-gutter-sm">
        <div>
          <q-btn round size="sm" color="accent" @click="showNotif('left')">
            <q-icon name="arrow_back" />
          </q-btn>
        </div>
        <div>
          <q-btn round size="sm" color="accent" @click="showNotif('center')">
            <q-icon name="fullscreen_exit" />
          </q-btn>
        </div>
        <div>
          <q-btn round size="sm" color="accent" @click="showNotif('right')">
            <q-icon name="arrow_forward" />
          </q-btn>
        </div>
      </div>
    </div>

    <div>
      <div class="row q-gutter-sm">
        <div>
          <q-btn
            round
            size="sm"
            color="secondary"
            @click="showNotif('bottom-left')"
          >
            <q-icon name="arrow_forward" class="rotate-135" />
          </q-btn>
        </div>
        <div>
          <q-btn round size="sm" color="accent" @click="showNotif('bottom')">
            <q-icon name="arrow_downward" />
          </q-btn>
        </div>
        <div>
          <q-btn
            round
            size="sm"
            color="secondary"
            @click="showNotif('bottom-right')"
          >
            <q-icon name="arrow_forward" class="rotate-45" />
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const alerts = [
  // #region
  {
    color: 'negative',
    message: 'Woah! Danger! You are getting good at this!',
    icon: 'report_problem'
  },
  { message: 'You need to know about this!', icon: 'warning' },
  { message: 'Wow! Nice job!', icon: 'thumb_up' },
  { color: 'teal', message: 'Quasar is cool! Right?', icon: 'tag_faces' },
  {
    color: 'purple',
    message: 'Jim just pinged you',
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png'
  },
  {
    multiLine: true,
    message:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic quisquam non ad sit assumenda consequuntur esse inventore officia. Corrupti reiciendis impedit vel, fugit odit quisquam quae porro exercitationem eveniet quasi.'
  }
  // #endregion
]

const $q = useQuasar()

function showNotif(position) {
  const { color, textColor, multiLine, icon, message, avatar } =
    alerts[Math.floor(Math.random(alerts.length) * 10) % alerts.length]
  const random = Math.random() * 100

  const twoActions = random > 70
  const buttonColor = color ? 'white' : void 0

  $q.notify({
    color,
    textColor,
    icon: random > 30 ? icon : null,
    message,
    position,
    avatar,
    multiLine,
    actions: twoActions
      ? [
          {
            label: 'Reply',
            color: buttonColor,
            handler: () => {
              /* console.log('wooow') */
            }
          },
          {
            label: 'Dismiss',
            color: 'yellow',
            handler: () => {
              /* console.log('wooow') */
            }
          }
        ]
      : random > 40
        ? [
            {
              label: 'Reply',
              color: buttonColor,
              handler: () => {
                /* console.log('wooow') */
              }
            }
          ]
        : null,
    timeout: Math.random() * 5000 + 3000
  })
}
</script>
````

::: tip
For a full list of options, check the API section.
:::

### Grouping

Each notification has an underlying unique group which is computed out of the message + caption + multiLine + actions labels + position. When multiple notifications get triggered with the same group, instead of showing all of them and flooding the view, only the first one remains on screen along with a badge. The badge content represents the number of times that the same notification has been triggered (and with same position) since the first one appeared on screen.

However, if you wish to disable this behavior, specify `group: false`. In the example below, the first button triggers the same notification twice each time is clicked. The second button has grouping disabled. The third button, however, has a custom group name so each subsequent notification replaces the old one and increments the badge number.

**Example: Grouping**

Source: [Grouping.vue](../../examples/Notify/Grouping.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="row q-gutter-sm">
      <q-btn no-caps color="teal" @click="triggerTwice" label="Trigger twice" />
      <q-btn
        no-caps
        color="teal"
        @click="triggerNoGroupingTwice"
        label="Trigger twice (no grouping)"
      />
      <q-btn
        no-caps
        color="teal"
        @click="triggerTwiceCustomGroup"
        label="Trigger twice (custom group)"
      />
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function triggerTwice() {
  $q.notify({
    message: 'Jim pinged you.',
    color: 'purple'
  })

  $q.notify({
    message: 'Jim pinged you.',
    color: 'purple'
  })
}

function triggerNoGroupingTwice() {
  $q.notify({
    group: false,
    message: 'Jim pinged you.',
    color: 'purple'
  })

  $q.notify({
    group: false,
    message: 'Jim pinged you.',
    color: 'purple'
  })
}

function triggerTwiceCustomGroup() {
  $q.notify({
    group: 'my-group',
    message: 'Jim pinged you.',
    color: 'purple'
  })

  // same group as the previous one,
  // so it will replace it and
  // increment the badge number:
  $q.notify({
    group: 'my-group',
    message: 'Jack has messaged you.',
    color: 'primary'
  })
}
</script>
````

**Example: Custom badge**

Source: [GroupingCustomBadge.vue](../../examples/Notify/GroupingCustomBadge.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn
      no-caps
      color="primary"
      @click="triggerTwice"
      label="Trigger twice with custom badge"
    />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function triggerTwice() {
  $q.notify({
    message: 'Jim pinged you.',
    color: 'purple',
    badgeColor: 'yellow',
    badgeTextColor: 'dark',
    badgeClass: 'shadow-3 glossy my-badge-class'
  })

  $q.notify({
    message: 'Jim pinged you.',
    color: 'purple',
    badgeColor: 'yellow',
    badgeTextColor: 'dark',
    badgeClass: 'shadow-3 glossy my-badge-class'
  })
}
</script>

<style lang="sass">
.my-badge-class
  border: 1px solid #ccc
</style>
````

### Timeout progress

Should you wish, there is a way to tell the user when the notification will disappear from the screen. That's for the cases when timeout is not set to 0.

**Example: Timeout progress**

Source: [TimeoutProgress.vue](../../examples/Notify/TimeoutProgress.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn
      no-caps
      color="purple"
      @click="showNotifs"
      label="Show timeout progress"
    />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function showNotifs() {
  $q.notify({
    progress: true,
    message:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic quisquam non ad sit assumenda consequuntur esse inventore officia. Corrupti reiciendis impedit vel, fugit odit quisquam quae porro exercitationem eveniet quasi.',
    color: 'primary',
    multiLine: true,
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    actions: [
      {
        label: 'Reply',
        color: 'yellow',
        handler: () => {
          /* ... */
        }
      }
    ]
  })

  setTimeout(() => {
    $q.notify({
      progress: true,
      message: 'Jim emailed you.',
      icon: 'mail',
      color: 'white',
      textColor: 'primary'
    })
  }, 2000)

  setTimeout(() => {
    $q.notify({
      progress: true,
      message: 'Jim pinged you.',
      color: 'purple',
      avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
      actions: [
        {
          label: 'Reply',
          color: 'yellow',
          handler: () => {
            /* ... */
          }
        }
      ]
    })
  }, 3200)
}
</script>
````

### Updatable notifications

Should you have an ongoing process and you want to inform the user of its progress without blocking what he is currently doing, then you can generate an updatable notification. It's useful to also show a spinner while at it.

Please note in the example below that we are explicitly setting "group: false" (because only non-grouped notifications can be updated) and "timeout: 0" (because we want to be in full control when the notification will be dismissed).

**Example: Updatable**

Source: [Updatable.vue](../../examples/Notify/Updatable.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn
      no-caps
      color="purple"
      @click="showNotif"
      label="Show updatable notification"
    />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function showNotif() {
  const notif = $q.notify({
    group: false, // required to be updatable
    timeout: 0, // we want to be in control when it gets dismissed
    spinner: true,
    message: 'Uploading file...',
    caption: '0%'
  })

  // we simulate some progress here...
  let percentage = 0
  const interval = setInterval(() => {
    percentage = Math.min(100, percentage + Math.floor(Math.random() * 22))

    // we update the dialog
    notif({
      caption: `${percentage}%`
    })

    // if we are done...
    if (percentage === 100) {
      notif({
        icon: 'done', // we add an icon
        spinner: false, // we reset the spinner setting so the icon can be displayed
        message: 'Uploading done!',
        timeout: 2500 // we will timeout it in 2.5s
      })
      clearInterval(interval)
    }
  }, 500)
}
</script>
````

### Predefined types

There are four predefined types out of the box that you can use: "positive", "negative", "warning" and "info":

**Example: Out of the box types**

Source: [PredefinedTypesDefault.vue](../../examples/Notify/PredefinedTypesDefault.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="row q-gutter-sm">
      <q-btn
        no-caps
        unelevated
        color="positive"
        @click="triggerPositive"
        label="Trigger 'positive'"
      />
      <q-btn
        no-caps
        unelevated
        color="negative"
        @click="triggerNegative"
        label="Trigger 'negative'"
      />
      <q-btn
        no-caps
        unelevated
        color="warning"
        text-color="dark"
        @click="triggerWarning"
        label="Trigger 'warning'"
      />
      <q-btn
        no-caps
        unelevated
        color="info"
        @click="triggerInfo"
        label="Trigger 'info'"
      />
      <q-btn
        no-caps
        unelevated
        color="grey-8"
        @click="triggerOngoing"
        label="Trigger 'ongoing'"
      />
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function triggerPositive() {
  $q.notify({
    type: 'positive',
    message: 'This is a "positive" type notification.'
  })
}

function triggerNegative() {
  $q.notify({
    type: 'negative',
    message: 'This is a "negative" type notification.'
  })
}

function triggerWarning() {
  $q.notify({
    type: 'warning',
    message: 'This is a "warning" type notification.'
  })
}

function triggerInfo() {
  $q.notify({
    type: 'info',
    message: 'This is a "info" type notification.'
  })
}

function triggerOngoing() {
  // we need to get the notification reference
  // otherwise it will never get dismissed ('ongoing' type has timeout 0)
  const notif = $q.notify({
    type: 'ongoing',
    message: 'Looking up the search terms...'
  })

  // simulate delay
  setTimeout(() => {
    notif({
      type: 'positive',
      message: 'Found the results that you were looking for',
      timeout: 1000
    })
  }, 4000)
}
</script>
````

Furthermore, you can register your own types or even override the predefined ones. The best place to do this would be in a [@quasar/app-vite Boot File](/quasar-cli-vite/boot-files).

**Example: Custom type**

Source: [PredefinedTypesCustom.vue](../../examples/Notify/PredefinedTypesCustom.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="row q-gutter-sm">
      <q-btn
        no-caps
        color="brown"
        @click="triggerCustomRegisteredType1"
        label="Trigger 1"
      />
      <q-btn
        no-caps
        color="primary"
        @click="triggerCustomRegisteredType2"
        label="Trigger 2"
      />
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

/**
 * The reason we have this here
 * is that the type needs to be
 * registered before using it.
 *
 * The best place would be a boot file instead
 * of a .vue file, otherwise it'll keep on
 * registering it every time your component
 * gets to be used :)
 */

$q.notify.registerType('my-notif', {
  icon: 'announcement',
  progress: true,
  color: 'brown',
  textColor: 'white',
  classes: 'glossy'
})

function triggerCustomRegisteredType1() {
  $q.notify({
    type: 'my-notif',
    message: 'This notification is using a custom type.'
  })
}

function triggerCustomRegisteredType2() {
  // this one overrides some of the original
  // options of the "my-notif" registered type
  $q.notify({
    type: 'my-notif',
    icon: 'contactless',
    message: 'This notification is using a custom type.',
    caption: "It overrides the type's default icon and color.",
    color: 'primary'
  })
}
</script>
````

```js How to register in a boot file:
import { Notify } from 'quasar'

Notify.registerType('my-notif', {
  icon: 'announcement',
  progress: true,
  color: 'brown',
  textColor: 'white',
  classes: 'glossy'
})
```

### Using HTML

You can use HTML on message if you specify the `html: true` prop. **Please note that this can lead to XSS attacks**, so make sure that you sanitize the message by yourself.

**Example: Unsafe HTML message**

Source: [UnsafeHtml.vue](../../examples/Notify/UnsafeHtml.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn
      no-caps
      color="purple"
      @click="showNotif"
      label="Show HTML Notification"
    />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function showNotif() {
  $q.notify({
    message:
      '<em>I can</em> <span style="color: red">use</span> <strong>HTML</strong>',
    html: true
  })
}
</script>
````

### Setting attributes

You can set custom HTML attributes on the notification itself by setting the `attrs` Object property. For individual notification actions, you can directly pass them just like any other prop.

```js
import { useQuasar } from 'quasar'

setup () {
  const $q = useQuasar()

  $q.notify({
    // ...

    attrs: {
      // for the notification itself:
      role: 'alertdialog'
    },

    actions: [
      {
        icon: 'close',
        // for individual action (button):
        'aria-label': 'Dismiss'
      }
    ]
  })
}
```

### Programmatically closing

Notifications are meant to be dismissed only by the user, however for exceptional cases you can do it programmatically. Especially useful when you set indefinite timeout (0).

```js
const dismiss = $q.notify({...})
...
dismiss()
```

### Setting defaults

There are two ways of setting default configuration that will apply to all Notifications: through quasar.config file > framework > config > notify Object (see Installation section) or programmatically (see below).

We'll describe setting the defaults through a [@quasar/app-vite Boot File](/quasar-cli-vite/boot-files) (works the same anywhere in your code, but a boot file ensures this is run before your app starts):

First we create the boot file. Let's name it "notify-defaults.js".

```bash
quasar new boot notify-defaults [--format ts]
```

Add the created notify-defaults.js file to the boot array in the `/quasar.config` file:

```js
import { defineBoot } from '#q-app'

export default defineBoot(ctx => {
  return {
    // ...
    boot: ['notify-defaults']
    // ...
  }
})
```

We then edit the newly created `/src/boot/notify-defaults.js`:

```ts
import { Notify } from 'quasar'

Notify.setDefaults({
  timeout: 2500,
  textColor: 'white',
  actions: [{ icon: 'close', color: 'white' }],
  position: 'top-right'
})
```

::: warning
You can only set default `actions` through this method. Specifying `actions` with handlers in the `/quasar.config` file cannot and will NOT work.
:::

We could also set the defaults in some Vue file:

```js Inside of a Vue component
import { useQuasar } from 'quasar'

setup () {
  const $q = useQuasar()

  $q.notify.setDefaults({
    position: 'top-right',
    timeout: 2500,
    textColor: 'white',
    actions: [{ icon: 'close', color: 'white' }]
  })
}
```
