---
title: Docs
---

[Internal Link](/docs), [External Link](https://vuejs.org)

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non laoreet eros. `token` Morbi non ipsum ac purus dignissim rutrum. Nulla nec ante congue, rutrum tortor facilisis, aliquet ligula. Fusce vitae odio elit. `/quasar.conf.js`

## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

```
const m = 'lala'
```

```html
<div>
  <q-btn @click="doSomething">Do something</q-btn>
  <q-icon name="alarm" />
</div>
```

```vue
<template>
  <!-- you define your Vue template here -->
</template>

<script>
// This is where your Javascript goes
// to define your Vue component, which
// can be a Layout, a Page or your own
// component used throughout the app.

export default {
  //
}
</script>

<style>
/* This is where your CSS goes */
</style>
```

| Table Example | Type | Description |
| --- | --- | --- |
| infinite | Boolean | Infinite slides scrolling |
| size | String | Thickness of loading bar. |

> Something...

::: tip
Some tip
:::

::: warning
Some tip
:::

::: danger
Some tip
:::

::: warning CUSTOM TITLE
Some tip
:::

* Something
  * something
  * else
* Back
  * wee

## Installation
<doc-installation components="QBtn" :plugins="['Meta', 'Cookies']" directives="Ripple" :config="{ notify: 'Notify' }" />

## Usage
<doc-example title="Standard" file="QBtn/Standard" />

## API
<doc-api file="QTh" />
