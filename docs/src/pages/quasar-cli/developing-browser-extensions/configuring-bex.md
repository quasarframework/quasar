---
title: Configuring BEX
desc: How to manage your Browser Extensions with Quasar CLI.
---

Before we can configure anything, we need to understand how the BEX is structured. A BEX can be one (or more) of the following:

1. Runs in its own tab in the browser
2. Runs in the [Developer Tools](https://developer.chrome.com/extensions/devtools) window.
3. Runs in a [Popup](https://developer.chrome.com/extensions/user_interface#popup) window.
4. Runs as [Options](https://developer.chrome.com/extensions/options) window.
5. Runs in the context of a web page (injected into a website)

You do not need a new Quasar App per BEX type above as a single Quasar Application can run in **all** of the instances above. You can find out more about these in the [types section](/quasar-cli/developing-browser-extensions/types-of-bex).

## Manifest.json

The most important config file for your BEX is `/src-bex/manifest.json`. It is recommended that you [read up on this file](https://developer.chrome.com/extensions/manifest) before starting your project.

When you create your Quasar BEX, the manifest file is already configured to add the basic properties you will need in order to run your BEX. This includes default background scripts, content scripts and a css file which is injected in the context of the web page the BEX is running on.

:::tip
Be aware that the manifest.json file is modified on build so as to auto inject required javascript files.
:::

## Background And Content Scripts

Behind every BEX is a [content script](https://developer.chrome.com/extensions/content_scripts) and a [background script](https://developer.chrome.com/extensions/background_pages). It's a good idea to understand what each of these are before writing your first BEX.

In summary:

* **Background Script** - runs in the context of the BEX itself and can listen to all available browser extension events. There will only ever be one instance of each background script *per BEX*.
* **Content Script** - runs in the context of the web page. There will be a new content script instance per tab running the extension.

:::tip
Given content scripts run in the web page context, this means that only BEX's that interact with a web page can use content scripts. Popups, Options and Devtools **will not** have a *content script* running behind them. They will all however have a *background script*.
:::

## CSS

Any styles you want to be made available to your web page (not your Quasar App) should be included in `src-bex/css/content-css.css` as this file ia automatically injected into the `manifest.json` file.

:::warning
This must be native CSS as it's not preprocessed via Sass.
:::

## Hook Files

In a Quasar BEX, you are provided with `background-hook.js`, `content-hook.js` and `dom-hook.js`. These files are designed to give you access to a bridge which closes the gap in communication with each layer of a BEX. We will explore them in more detail in the [next section](/quasar-cli/developing-browser-extensions/bex-communication).
