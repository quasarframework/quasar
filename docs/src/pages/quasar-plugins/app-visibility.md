---
title: App Visibility
desc: A Quasar plugin that wraps the Page Visibility API, letting you know when your app is visible or in focus.
---
Quasar makes use of the Web [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) which lets you know when a website/app is visible or in focus.

## AppVisibility API
<doc-api file="AppVisibility" />

## Installation
<doc-installation plugins="AppVisibility" scrollable />

## Usage
``` js
// outside of a Vue file
import { AppVisibility } from 'quasar'

(Boolean) AppVisibility.appVisible

// inside of a Vue file
(Boolean) this.$q.appVisible
```

<doc-example title="AppVisibility" file="AppVisibility/Basic" />

## Watching for status change

``` vue
<template>...</template>

<script>
export default {
  watch: {
    '$q.appVisible' (val) {
      console.log(val ? 'App became visible' : 'App went in the background')
    }
  }
}
</script>
```
