---
title: Loading Plugin
---
Loading is a feature that you can use to display an overlay with a spinner on top of your App's content to inform the user that a background operation is taking place. No need to add complex logic within your Pages for global background operations.

## Installation
<doc-installation plugins="Loading" :config="{ loading: 'Loading' }" />

## Usage
Loading uses a delay (500ms) to display itself so that quick operations won't make the screen flicker. This happens by showing and then quickly hiding the progress spinner without the user having a chance to see what happens. The delay before showing it eliminates confusion.

Inside a Vue component:
```
this.$q.loading.show({
  delay: 400 // ms
})

this.$q.loading.hide()
```

Outside of a Vue component:
``` js
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

<doc-example title="Default options" file="Loading/Default" />

<doc-example title="With message" file="Loading/WithMessage" />

<doc-example title="Customized" file="Loading/Customized" />

<doc-example title="Show and Change" file="Loading/ShowAndChange" />

### Setting Up Defaults
Should you wish to set up some defaults, rather than specifying them each time, you can do so by using quasar.conf > framework > config > loading: {...} or by calling `Loading.setDefaults({...})` or `this.$q.loading.setDefaults({...})`.

## API
<doc-api file="Loading" />
