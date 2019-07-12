---
title: Notify
desc: A Quasar plugin to display animated messages to users like notifications, toasts and snackbars.
---
Notify is a Quasar plugin that can display animated messages (floating above everything in your pages) to users in the form of a notification. They are useful for alerting the user of an event and can even engage the user through actions. Also known as a toast or snackbar.

## Installation
<doc-installation plugins="Notify" :config="{ notify: 'Notify' }" />

## Usage

### Basic

``` js
// outside of a Vue file
import { Notify } from 'quasar'

Notify.create('Danger, Will Robinson! Danger!')
// or with a config object:
Notify.create({
  message: 'Danger, Will Robinson! Danger!'
})

// inside of a Vue file
this.$q.notify('Message')
// or with a config object:
this.$q.notify({...})
```

<doc-example title="Basic" file="Notify/Basic" />

::: tip
If you define any actions, the notification will automatically be dismissed when the user picks it.
:::

### Positioning

<doc-example title="Positioning & different options" file="Notify/Positioning" />

::: tip
For a full list of options, check the API section.
:::

### Using HTML
You can use HTML on message if you specify the `html: true` prop. **Please note that this can lead to XSS attacks**, so make sure that you sanitize the message by yourself.

<doc-example title="Unsafe HTML message" file="Notify/UnsafeHtml" />

### Programmatically closing
Notifications are meant to be dismissed only by the user, however for exceptional cases you can do it programmatically. Especially useful when you set indefinite timeout (0).

```js
const dismiss = this.$q.notify({...})
...
dismiss()
```

### Setting defaults
There are two ways of setting default configuration that will apply to all Notifications: through quasar.conf.js > framework > config > notify Object (see Installation section) or programmatically (see below).

We'll describe setting the defaults through a [boot file](/quasar-cli/cli-documentation/boot-files) (works the same anywhere in your code, but a boot file ensures this is run before your app starts):

First we create the boot file. Let's name it "notify-defaults.js".

```bash
$ quasar new boot notify-defaults
# we then add 'notify-defaults' to quasar.conf.js > boot Array
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
this.$q.notify.setDefaults({
  position: 'top-right',
  timeout: 2500,
  textColor: 'white',
  actions: [{ icon: 'close', color: 'white' }]
})
```

## Notify API
<doc-api file="Notify" />
