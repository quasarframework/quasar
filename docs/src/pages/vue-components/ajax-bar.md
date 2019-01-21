---
title: Ajax Bar
---

In most mobile apps and even some desktop apps, you will most likely have some API communication to a server via an [Ajax call](https://en.wikipedia.org/wiki/Ajax_(programming)). Since these calls can take more than a second or two, it is good UX to offer the user feedback, when such an API call is being made. QAjaxBar is the Material Design component for that particular scenario.

If you'd like a simpler way to offer an Ajax Bar to your users, have a look at the [Loading Bar Plugin](/quasar-plugins/loading-bar).

## Installation
<doc-installation components="QAjaxBar" />

## Usage
The Ajax Bar component captures Ajax calls automatically. This example triggers events manually for demonstrating purposes only.

<doc-example title="Ajax Bar Simulator" file="QAjaxBar/Example" />

## API
<doc-api file="QAjaxBar" />

### Related Plugins
- [Loading Plugin](/quasar-plugins/loading)
- [Loading Bar Plugin](/quasar-plugins/loading-bar)
