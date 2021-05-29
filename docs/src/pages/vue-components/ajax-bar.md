---
title: Ajax Bar
desc: The QAjaxBar Vue component displays a loading bar whenever an Ajax call is in progress.
related:
  - /quasar-plugins/loading
  - /quasar-plugins/loading-bar
  - /quasar-cli/ajax-requests
---

In most mobile apps and even some desktop apps, you will most likely have some API communication to a server via an [Ajax call](https://en.wikipedia.org/wiki/Ajax_(programming)). Since these calls can take more than a second or two, it is good UX to offer the user feedback, when such an API call is being made. Which is where QAjaxBar comes into helping you out.

QAjaxBar is a component which displays a loading bar (like Youtube) whenever an Ajax call (regardless of Ajax library used) is in progress. It can be manually triggered as well.

::: tip
If you'd like **a simpler and more convenient way** to offer an Ajax Bar to your users, have a look at the [Loading Bar Plugin](/quasar-plugins/loading-bar), which is actually **the recommended way**.
:::

## QAjaxBar API
<doc-api file="QAjaxBar" />

## Usage
The QAjaxBar component captures Ajax calls automatically (unless told not to).

The example below triggers events manually for demonstrating purposes only. This one is set to appear at bottom (multiple positions available!) of the page, with a 10px size (default is different) and uses a custom color.

<doc-example title="Basic" file="QAjaxBar/Basic" />

Please check out the API section for all properties that you can use.

## Tips
* If multiple events are captured by Ajax Bar simultaneously, `@start` and `@stop` will still be triggered only once: when bar starts showing up and when it becomes hidden.

* Each Ajax call makes a `start()` call when it is triggered. When it ends, it calls `stop()`. So yes, if you also manually trigger QAjaxBar you must call `start()` each time a new event is starting and `stop()` each time an event finished. QAjaxBar knows to handle multiple events simultaneously.
