---
title: Notify
desc: A Quasar plugin to display animated messages to users like notifications, toasts and snackbars.
keys: Notify
---
Notify is a Quasar plugin that can display animated messages (floating above everything in your pages) to users in the form of a notification. They are useful for alerting the user of an event and can even engage the user through actions. Also known as a toast or snackbar.

## Notify API

<doc-api file="Notify" />

## Installation

<doc-installation plugins="Notify" config="notify" />

## Usage

### Basic

```js
// outside of a Vue file
import { Notify } from 'quasar'

Notify.create('Danger, Will Robinson! Danger!')
// or with a config object:
Notify.create({
  message: 'Danger, Will Robinson! Danger!'
})

// inside of a Vue file
import { useQuasar } from 'quasar'

setup () {
  const $q = useQuasar()

  $q.notify('Message')
  // or with a config object:
  $q.notify({...})
}
```

<doc-example title="Basic" file="Notify/Basic" />

::: tip
If you define any actions, the notification will automatically be dismissed when the user picks it.
:::

### With caption

<doc-example title="Caption" file="Notify/Caption" />

### With icon, avatar or spinner

<doc-example title="With icon" file="Notify/Icon" />

<doc-example title="With avatar" file="Notify/Avatar" />

<doc-example title="With spinner" file="Notify/Spinner" />

### With actions

<doc-example title="With actions" file="Notify/Actions" />

### Multiline

<doc-example title="Multiline" file="Notify/Multiline" />

### Positioning

<doc-example title="Positioning & different options" file="Notify/Positioning" />

::: tip
For a full list of options, check the API section.
:::

### Grouping

Each notification has an underlying unique group which is computed out of the message + caption + multiLine + actions labels + position. When multiple notifications get triggered with the same group, instead of showing all of them and flooding the view, only the first one remains on screen along with a badge. The badge content represents the number of times that the same notification has been triggered (and with same position) since the first one appeared on screen.

However, if you wish to disable this behavior, specify `group: false`. In the example below, the first button triggers the same notification twice each time is clicked. The second button has grouping disabled. The third button, however, has a custom group name so each subsequent notification replaces the old one and increments the badge number.

<doc-example title="Grouping" file="Notify/Grouping" />

<doc-example title="Custom badge" file="Notify/GroupingCustomBadge" />

### Timeout progress

Should you wish, there is a way to tell the user when the notification will disappear from the screen. That's for the cases when timeout is not set to 0.

<doc-example title="Timeout progress" file="Notify/TimeoutProgress" />

### Updatable notifications

Should you have an ongoing process and you want to inform the user of its progress without blocking what he is currently doing, then you can generate an updatable notification. It's useful to also show a spinner while at it.

Please note in the example below that we are explicitly setting "group: false" (because only non-grouped notifications can be updated) and "timeout: 0" (because we want to be in full control when the notification will be dismissed).

<doc-example title="Updatable" file="Notify/Updatable" />

### Predefined types

There are four predefined types out of the box that you can use: "positive", "negative", "warning" and "info":

<doc-example title="Out of the box types" file="Notify/PredefinedTypesDefault" />

Furthermore, you can register your own types or even override the predefined ones. The best place to do this would be in a [boot file](/quasar-cli/boot-files).

<doc-example title="Custom type" file="Notify/PredefinedTypesCustom" />

```js
// How to register in a boot file:

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

<doc-example title="Unsafe HTML message" file="Notify/UnsafeHtml" />

### Setting attributes
You can set custom HTML attributes on the notification itself or on individual notification actions by setting the `attrs` Object property.

```js
import { useQuasar } from 'quasar'

setup () {
  const $q = useQuasar()

  $q.notify({
    ...

    attrs: {
      // for the notification itself:
      role: 'alertdialog'
    },

    actions: [
      {
        icon: 'close',
        // for individual action (button):
        attrs: {
          'aria-label': 'Dismiss'
        }
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
There are two ways of setting default configuration that will apply to all Notifications: through quasar.conf.js > framework > config > notify Object (see Installation section) or programmatically (see below).

We'll describe setting the defaults through a [boot file](/quasar-cli/boot-files) (works the same anywhere in your code, but a boot file ensures this is run before your app starts):

First we create the boot file. Let's name it "notify-defaults.js".

```bash
$ quasar new boot notify-defaults [--format ts]
```

Add the created notify-defaults.js file to the boot array in `quasar.conf.js`:

```js
module.exports = function(ctx) {
  return {
    // ...
    boot: ['notify-defaults'],
    // ...
  }
```

We then edit the newly created `/src/boot/notify-defaults.js`:

```js
import { Notify } from 'quasar'

Notify.setDefaults({
  position: 'top-right',
  timeout: 2500,
  textColor: 'white',
  actions: [{ icon: 'close', color: 'white' }]
})
```

::: warning
You can only set default `actions` through this method. Specifying `actions` with handlers in quasar.conf.js cannot and will NOT work.
:::

We could also set the defaults in some Vue file:

```js
// inside of a Vue component
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
