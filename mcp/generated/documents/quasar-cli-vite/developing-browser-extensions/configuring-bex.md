---
title: Configuring BEX
description: (@quasar/app-vite) How to manage your Browser Extensions with Quasar CLI.
canonical: https://quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

Before we can configure anything, we need to understand how the BEX is structured. A BEX can be one (or more) of the following:

1. Runs in its own tab in the browser
2. Runs in the [Developer Tools](https://developer.chrome.com/docs/extensions/how-to/devtools/extend-devtools) window.
3. Runs in a [Popup](https://developer.chrome.com/docs/extensions/develop/ui#popups) window.
4. Runs as [Options](https://developer.chrome.com/docs/extensions/develop/ui/options-page) window.
5. Runs in the context of a web page (injected into a website)

You do not need a new Quasar App per BEX type above as a single Quasar Application can run in **all** of the instances above. You can find out more about these in the [types section](/quasar-cli-vite/developing-browser-extensions/types-of-bex).

## quasar.config file

```ts /quasar.config file > sourceFiles
// should you wish to change default files
sourceFiles: {
  bexManifestFile?: 'src-bex/manifest.json',
}
```

```ts /quasar.config file > bex
bex: {
  /**
   * Minify the browser extension build.
   *
   * @default false
   */
  minify?: boolean;

  /**
   * The list of extra scripts (js/ts) not in your bex manifest that you want to
   * compile and use dynamically in your browser extension.
   *
   * Each entry in the list should be a relative filename to /src-bex/
   *
   * @example [ 'my-script.ts', 'sub-folder/my-other-script.js' ]
   */
  extraScripts?: string[];

  /**
   * Extend the Rolldown config that is used for the bex scripts
   * (background, content scripts, dom script).
   *
   * Can be async. Can directly modify the "config" parameter or
   * return a new one that will be merged with the default one.
   */
  extendBexScriptsConf?: (
    config: RolldownOptions
  ) => void | RolldownOptions | Promise<void | RolldownOptions>;

  /**
   * Should you need some dynamic changes to the Browser Extension manifest file
   * (/src-bex/manifest.json) then use this method to do it.
   *
   * Can be async. Can directly modify the "json" parameter or
   * return a new one that will be merged with the default one.
   */
  extendBexManifestJson?: (
    json: object
  ) => void | object | Promise<void | object>;
}
```

## UI in /src

Should you want to tamper with the Vite config for UI in /src:

```js /quasar.config file
export default defineConfig(ctx => {
  return {
    build: {
      extendViteConf(viteConf) {
        if (ctx.mode.bex) {
          // do something with viteConf
          // or return an object to deeply merge with current viteConf
        }
      }
    }
  }
})
```

The UI files will be injected and available as `www` folder when you build (or develop) the browser extension.

## Manifest.json

The most important config file for your BEX is `/src-bex/manifest.json`. It is recommended that you [read up on this file](https://developer.chrome.com/extensions/manifest) before starting your project.

When you first add the BEX mode, you will notice that the manifest file contains three root props: `all`, `chrome` & `firefox`. The manifest for chrome is deeply merged from all+chrome, while the firefox one is generated from all+firefox. You could even have different manifest versions for each target:

```json /src-bex/manifest.json
{
  "all": {
    "manifest_version": 3,

    "icons": {
      "16": "icons/icon-16x16.png",
      "48": "icons/icon-48x48.png",
      "128": "icons/icon-128x128.png"
    },

    "permissions": ["storage", "tabs"],

    "host_permissions": ["*://*/*"],
    "content_security_policy": {
      "extension_pages": "script-src 'self'; object-src 'self';"
    },
    "web_accessible_resources": [
      {
        "resources": ["*"],
        "matches": ["*://*/*"]
      }
    ],

    "action": {
      "default_popup": "www/index.html"
    },

    "content_scripts": [
      {
        "matches": ["<all_urls>"],
        "css": ["assets/content.css"],
        "js": ["my-content-script.ts"]
      }
    ]
  },

  "chrome": {
    "background": {
      "service_worker": "background.ts"
    }
  },

  "firefox": {
    "background": {
      "scripts": ["background.ts"]
    }
  }
}
```

::: warning For TS devs
Your background and content scripts have the `.ts` extension. Use that extension in the manifest.json file as well! Examples: "background.ts", "my-content-script.ts". While the browser vendors do support only the `.js` extension, Quasar CLI will convert the file extensions automatically.
:::

### Least-privilege example

The starter manifest requests broad access because it demonstrates a content script that can operate on arbitrary pages. The browser store does not itself require access to all sites; the extension's functionality determines whether that access is necessary.

When an extension supports only known sites, narrow its permissions and match patterns. Also expose only the packaged resources that web pages must be able to load:

```json /src-bex/manifest.json
{
  "all": {
    "permissions": ["storage"],
    "host_permissions": ["https://*.example.com/*"],
    "web_accessible_resources": [
      {
        "resources": ["assets/*.png"],
        "matches": ["https://*.example.com/*"]
      }
    ],
    "content_scripts": [
      {
        "matches": ["https://*.example.com/*"],
        "css": ["assets/content.css"],
        "js": ["my-content-script.ts"]
      }
    ]
  }
}
```

Replace `example.com` with the narrowest origins your extension needs. Keep `<all_urls>`, `*://*/*`, the `tabs` permission, or broad web-accessible resources only when the corresponding feature genuinely requires them. Broader access increases both the extension's authority and the permission warning presented to users.

## Background And Content Scripts

A BEX can use [content scripts](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts) and a background page or service worker. Which background mechanism is available depends on the browser and manifest version.

In summary:

- **Background Script** - runs in the context of the BEX itself and can listen to all available browser extension events.
- **Content Script** - runs in the context of the web page. There will be a new content script instance per tab running the extension.

::: tip
Given content scripts run in the web page context, this means that only BEX's that interact with a web page can use content scripts. Popups, Options and Devtools **will not** have a _content script_ running behind them. They will all however have the _background script_.
:::

::: warning
In Chrome with [Manifest v3](https://developer.chrome.com/docs/extensions/mv3/intro/) your background script is actually a Service Worker. This does not currently apply to Firefox with Manifest v3 (yet).
:::

## CSS

Any styles you want to be made available to your web page (not your Quasar App) should be included as a file in `src-bex/assets/<name>.css`. When adding such a file, please make sure that you reference it from your `/src-bex/manifest.json` around the content scripts that need it:

```json /src-bex/manifest.json
// example linking /src-bex/assets/content.css
"content_scripts": [
  {
    "matches": [ "<all_urls>" ],
    "css": [ "assets/content.css" ],
    "js": [ /*...*/ ]
  }
]
```

::: warning
This must be native CSS as it's not preprocessed via Sass.
:::

## Dynamic/other scripts

Should you need other scripts to be dynamically loaded or compiled for your BEX, you can add them by editing your quasar.config file:

```js /quasar.config file
bex: {
  minify: true,

  /**
   * The list of extra scripts (js/ts) not in your bex manifest that you want to
   * compile and use dynamically in your browser extension.
   *
   * Each entry in the list should be a relative filename to /src-bex/
   *
   * @example [ 'my-script.ts', 'sub-folder/my-other-script.js' ]
   */
  extraScripts?: string[];
}
```
