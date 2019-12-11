---
title: Supporting IE
desc: How to enable support for IE 11 in a Quasar app.
related:
  - /quasar-cli/quasar-conf-js
---
If you are building a website, you might want to support IE 11+. This support is not added by default to your website. Quasar CLI provides it on demand only.

::: danger Attention Windows Developer
It is strongly recommended to use Yarn instead of NPM when developing on a Windows machine, to avoid many problems.
:::

## Installation of IE Support
In order to support IE, you'll need to edit `/quasar.conf.js`:
```js
module.exports = function (ctx) {
  return {
    supportIE: true,
    ....
  }
}
```

That's it. This will inject the Promise polyfill, along with some other smaller polyfills, adding an extra ~6k worth of code (minified) to your bundle.

::: tip IE Polyfills
Quasar CLI is smart enough to include the IE polyfills only if it is really needed. An Electron app for example doesn't need it and as a result, even if you leave `supportIE` set to "true" in quasar.conf.js it won't be bundled.
:::

::: warning
Running dev server on a Windows machine and consuming the output in IE11 might result in an error (ansi-strip package related used by webpack-dev-server). This is why you might need to keep the strict dependency `"strip-ansi": "=3.0.1"` in your package.json (use yarn and pin this version).
:::

### UMD IE11 support

If you are developing for UMD and want IE 11 support you will need to add the following HTML tag before the Vue and Quasar tags:

```
<!-- replace "1.0.0" with your version of Quasar -->
<script src="https://cdn.jsdelivr.net/npm/quasar@1.0.0/dist/quasar.ie.polyfills.umd.min.js"></script>
```

## What does it do?

You can check out what enabling the IE11 support means on [Github](https://github.com/quasarframework/quasar/tree/dev/ui/src/ie-compat) (what polyfills are injected and the needed CSS fixes).
