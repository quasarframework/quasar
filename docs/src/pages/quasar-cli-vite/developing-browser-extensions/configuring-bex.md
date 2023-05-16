---
title: Configuring BEX
desc: (@quasar/app-vite) How to manage your Browser Extensions with Quasar CLI.
---

Before we can configure anything, we need to understand how the BEX is structured. A BEX can be one (or more) of the following:

1. Runs in its own tab in the browser
2. Runs in the [Developer Tools](https://developer.chrome.com/extensions/devtools) window.
3. Runs in a [Popup](https://developer.chrome.com/extensions/user_interface#popup) window.
4. Runs as [Options](https://developer.chrome.com/extensions/options) window.
5. Runs in the context of a web page (injected into a website)

You do not need a new Quasar App per BEX type above as a single Quasar Application can run in **all** of the instances above. You can find out more about these in the [types section](/quasar-cli-vite/developing-browser-extensions/types-of-bex).

## UI in /src

Should you want to tamper with the Vite config for UI in /src:

```js
// quasar.config file
export default function (ctx) {
  return {
    build: {
      extendViteConf (viteConf) {
        if (ctx.mode.cordova) {
          // do something with ViteConf
        }
      }
    }
  }
}
```

The UI files will be injected and available as `www` folder when you build (or develop) the browser extension.

## Manifest.json

The most important config file for your BEX is `/src-bex/manifest.json`. It is recommended that you [read up on this file](https://developer.chrome.com/extensions/manifest) before starting your project.

When you first add the BEX mode, you will get asked which Browser Extension Manifest version you like:

```
? What version of manifest would you like? (Use arrow keys)
❯ Manifest v2 (works with both Chrome and FF)
  Manifest v3 (works with Chrome only currently)
```

## Background And Content Scripts

Behind every BEX is a [content script](https://developer.chrome.com/extensions/content_scripts) and a background script / service-worker. It's a good idea to understand what each of these are before writing your first BEX.

In summary:

* **Background Script** - runs in the context of the BEX itself and can listen to all available browser extension events. There will only ever be one instance of each background script *per BEX*.
* **Content Script** - runs in the context of the web page. There will be a new content script instance per tab running the extension.

::: tip
Given content scripts run in the web page context, this means that only BEX's that interact with a web page can use content scripts. Popups, Options and Devtools **will not** have a *content script* running behind them. They will all however have a *background script*.
:::

::: warning
Service worker which is available in [Manifest v3](https://developer.chrome.com/docs/extensions/mv3/intro/), is implemented in Quasar CLI with Vite only. More details [here](https://github.com/quasarframework/quasar/discussions/8844).
:::

## CSS

Any styles you want to be made available to your web page (not your Quasar App) should be included in `src-bex/assets/content.css` as this file ia automatically injected into the `manifest.json` file.

::: warning
This must be native CSS as it's not preprocessed via Sass.
:::
