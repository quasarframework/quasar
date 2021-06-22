---
title: Browser compatibility
desc: How to handle the browser support with Quasar CLI.
related:
  - /quasar-cli/quasar-conf-js
---

## Configuring compatibility
Your `/package.json` file should contain a `browserslist` field. This will tell Quasar App the range of browsers that the project is targeting. Babel and Autoprefixer will use this field to determine how to transpile JS code (if transpiling is left enabled) and what CSS vendor prefixes it needs to add your CSS code.

Babel will look for exactly the JS features that need transpiling (based on the configured browsers) and apply them. Be mindful about it though, as it is sufficient to add one "bad apple" in the options list and that will dumb down your code back to ES5.

The following is the default "browserslist" when you create a Quasar project:

```js
// package.json

"browserslist": [
  "last 10 Chrome versions",
  "last 10 Firefox versions",
  "last 4 Edge versions",
  "last 7 Safari versions",
  "last 8 Android versions",
  "last 8 ChromeAndroid versions",
  "last 8 FirefoxAndroid versions",
  "last 10 iOS versions",
  "last 5 Opera versions"
]
```

More info on how to specify browser ranges: [browserslist](https://github.com/browserslist/browserslist).
