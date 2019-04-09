---
title: Notify
---
Notify is a Quasar plugin that can display animated messages (floating above everything in your pages) to users in the form of a notification. They are useful for alerting the user of an event and can even engage the user through actions. Also known as a toast.

## Installation
<doc-installation plugins="Notify" :config="{ notify: 'Notify' }" />

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

### Programmatically Closing Alert
Notifications are meant to be dismissed only by the user, however for exceptional cases you can do it programmatically. Especially useful when you set indefinite timeout (0).

```js
const dismiss = this.$q.notify({...})
...
dismiss()
```

## Notify API
<doc-api file="Notify" />
