---
title: Browser compatibility
desc: How to handle the browser support with Quasar CLI.
badge: "@quasar/app v2+"
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

## IE 11 Support
In order to support Internet Explorer 11, you'll need to edit browserslist from `/package.json`:

```js
"browserslist": [
  "ie 11", // <<-- add it
  ...
]
```

That's it. This will inject the Promise polyfill, along with some other smaller polyfills, adding an extra ~6k worth of code (minified) to your bundle. Check [GitHub](https://github.com/quasarframework/quasar/tree/dev/ui/src/ie-compat) to see it.

::: tip IE Polyfills
Quasar CLI is smart enough to include the IE polyfills only if it is really needed. An Electron app for example doesn't need it and as a result, even if you leave `ie 11` in your package.json > browserslist it won't add the polyfills.
:::

::: warning
Running dev server on a Windows machine and consuming the output in IE11 might result in an error (ansi-strip package related used by webpack-dev-server). This is why you might need to keep the strict dependency `"strip-ansi": "=3.0.1"` in your package.json (use yarn and pin this version).
:::
