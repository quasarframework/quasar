---
title: Ajax Bar
desc: The QAjaxBar Vue component displays a loading bar whenever an Ajax call is in progress.
keys: QAjaxBar
examples: QAjaxBar
related:
  - /quasar-plugins/loading
  - /quasar-plugins/loading-bar
  - /quasar-cli-vite/ajax-requests
  - /quasar-cli-webpack/ajax-requests
---

In most mobile apps and even some desktop apps, you will most likely have some API communication to a server via an [Ajax call](https://en.wikipedia.org/wiki/Ajax_(programming)). Since these calls can take more than a second or two, it is good UX to offer the user feedback, when such an API call is being made. Which is where QAjaxBar comes into helping you out.

QAjaxBar is a component which displays a loading bar (like Youtube) whenever an Ajax call (regardless of Ajax library used) is in progress. It can be manually triggered as well.

::: tip
If you'd like **a simpler and more convenient way** to offer an Ajax Bar to your users, have a look at the [Loading Bar Plugin](/quasar-plugins/loading-bar), which is actually **the recommended way**.
:::

<doc-api file="QAjaxBar" />

## Usage
The QAjaxBar component captures Ajax calls automatically (unless told not to).

The example below triggers events manually for demonstrating purposes only. This one is set to appear at bottom (multiple positions available!) of the page, with a 10px size (default is different) and uses a custom color.

### Basic

<doc-example title="Basic" file="Basic" />

Please check out the API section for all properties that you can use.

### Ajax filter <q-badge label="v2.4.5+" />

Should you want QAjaxBar to trigger only for some URLs (and not for all, like in the default behavior), then you can use the `hijackFilter` property:

```html
<template>
  <q-ajax-bar :hijack-filter="myFilterFn" />
</template>

<script>
export default {
  setup () {
    return {
      myFilterFn (url) {
        // example (only https://my-service.com/* should trigger)
        return /^https:\/\/my-service\.com/.test(url)
      }
    }
  }
}
</script>
```

## Tips

* If multiple events are captured by Ajax Bar simultaneously, `@start` and `@stop` will still be triggered only once: when bar starts showing up and when it becomes hidden.
* Each Ajax call makes a `start()` call when it is triggered. When it ends, it calls `stop()`. So yes, if you also manually trigger QAjaxBar you must call `start()` each time a new event is starting and `stop()` each time an event finished. QAjaxBar knows to handle multiple events simultaneously.
