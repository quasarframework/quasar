---
title: Loading Plugin
desc: A Quasar plugin which can display a loading state for your app through an overlay with a spinner and a message.
keys: Loading
examples: Loading
related:
  - /vue-components/linear-progress
  - /vue-components/circular-progress
  - /vue-components/inner-loading
  - /vue-components/spinners
  - /vue-components/skeleton
  - /quasar-plugins/loading-bar
  - /vue-components/ajax-bar
---
Loading is a feature that you can use to display an overlay with a spinner on top of your App's content to inform the user that a background operation is taking place. No need to add complex logic within your Pages for global background operations.

<doc-api file="Loading" />

<doc-installation plugins="Loading" config="loading" />

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
  spinner: QSpinnerGears,
  // other props
})

Loading.hide()
```

### Default options

<doc-example title="Default options" file="Default" />

### Customization

<doc-example title="With message" file="WithMessage" />

<doc-example title="With customized box" file="WithBox" />

<doc-example title="Customized" file="Customized" />

<doc-example title="Show and Change" file="ShowAndChange" />

### Content sanitization

<doc-example title="With unsafe message, but sanitized" file="WithMessageSanitized" />

### Multiple groups in parallel <q-badge label="v2.8+" />

::: tip
When you have multiple processes that occur in parallel then you can group Loading instances so that you can manage the Loading state per group (individually).
:::

Specify the `group` property when spawning each of your Loading instances and you can update or hide them by using the returned function.

Obviously, we can only display one group at a time, so the order in which they are spawned determines the priority in which they are shown (the last one has priority over the previous ones; LIFO).

<doc-example title="Multiple groups" file="MultipleGroups" />

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
Should you wish to set up some defaults, rather than specifying them each time, you can do so by using quasar.config.js > framework > config > loading: {...} or by calling `Loading.setDefaults({...})` or `$q.loading.setDefaults({...})`.
