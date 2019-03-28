---
title: Notify
---
Notify is a Quasar plugin that can display animated messages (floating above everything in your pages) to users in the form of a notification. They are useful for alerting the user of an event and can even engage the user through actions. Also known as a toast.

## Installation
<doc-installation plugins="Notify" :config="{ notify: 'Notify' }" />

::: warning
You cannot define `actions` with handlers as defaults. If you define `actions` in defaults all of them will close the notification. If you specify `actions` when creating the notification the **default ones will be ignored**. You cannot set default `onDismiss` handler.
:::

## Usage
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

<doc-example title="Positioning & different options" file="Notify/Positioning" />

::: tip
For a full list of options, check the API section.
:::

### Setting Defaults from Code
Similar to how you can define Notify defaults in the configuration you can also define defaults in code, using `setDefaults` method. Create a boot file (`$ quasar new boot notify-defaults`):

``` js
// outside of a Vue file, in a boot plugin
import { Notify } from 'quasar'

Notify.setDefaults({
  position: 'top-right',
  timeout: 2500,
  textColor: 'white',
  actions: [{ icon: 'close', color: 'white' }]
})

// inside of a Vue file
this.$q.setDefaults({
  position: 'top-right',
  timeout: 2500,
  textColor: 'white',
  actions: [{ icon: 'close', color: 'white' }]
})
```

::: warning
The defaults are not specific to a component, so changing them using `this.$q.setDefaults({...})` **will be global**.
:::

::: warning
You cannot define `actions` with handlers as defaults. If you define `actions` in defaults all of them will close the notification. If you specify `actions` when creating the notification the **default ones will be ignored**. You cannot set default `onDismiss` handler.
:::

### Programmatically Closing Alert
Notifications are meant to be dismissed only by the user, however for exceptional cases you can do it programmatically. Especially useful when you set indefinite timeout (0).

```js
const dismiss = this.$q.notify({...})
...
dismiss()
```

## Notify API
<doc-api file="Notify" />
