---
title: BEX Build Commands
desc: (@quasar/app-webpack) The Quasar CLI list of commands when developing or building a Browser Extension (BEX).
scope:
  devTree:
    l: '.'
    c:
      - l: dist/bex-[chrome|firefox]--dev
        c:
          - l: '...files'
            e: Built code from /src-bex
          - l: www/
            e: Built code from /src
  prodTree:
    l: '.'
    c:
      - l: dist/bex-[chrome|firefox]
        c:
          - l: '...files'
            e: Built code from /src-bex
          - l: www/
            e: Built code from /src
          - l: Packaged.your-project-name.zip
            e:
              A zip file ready for submission to the Chrome Browser Extension Store /
              Other Chromium based stores.
---

## Developing

Start developing a Browser Extension with just one command.

```bash
$ quasar dev -m bex -T [chrome|firefox]

# ..or the longer form:
$ quasar dev --mode bex -T [chrome|firefox]
```

You may or may not have already had a `src-bex` folder, but you will definitely have one now. Now that we've created a development environment, we need to load generated browser extension into your browser.

While you develop your BEX, you will notice that Quasar CLI builds the actual extension in the dist folder (normally in `/dist/bex-chrome--dev/` or `/dist/bex-firefox--dev` based on the dev target in "quasar dev" command):

<DocTree :def="scope.devTree" />

### Chrome

![Installing a Quasar Browser Extension in Chrome](https://cdn.quasar.dev/img/adding-bex-to-chrome-with-debug.png)

In line with the screenshot above, the following steps must be taken:

1. In Chrome, navigate to `chrome://extensions`
2. Toggle "Developer Mode".
3. Click "Load unpacked". This will present you with the _folder_ selection dialog. Navigate to and select your `/dist/bex-chrome--dev/` folder.
4. You should now see your BEX mounted in Chrome.

More information about debugging Chrome Browser Extensions can be found in the [official documentation](https://developer.chrome.com/extensions/tut_debugging).

### Other Chromium Browsers

Although we haven't tested all the various Chromium based browsers, BEX mode should be compatible with them. Please refer to the appropriate browser documentation on how to add a browser extension to that particular browser.

### Firefox

![Installing a Quasar Browser Extension in Firefox](https://cdn.quasar.dev/img/adding-bex-to-firefox.png)

In line with the screenshot above, the following steps must be taken:

1. In Firefox, navigate to `about:debugging`
2. Click on "This Firefox"
3. Click "Load Temporary Add-on...". This will present you with the _file_ selection dialog. Navigate to and select your `/dist/bex-firefox--dev/manifest.json` file. **Note:** Firefox requires the manifest file, not the `/dist/bex-firefox--dev` folder like Chromium browsers.
4. You should now see your BEX mounted in Firefox.

More information about debugging Firefox temporary addons can be found in the [Firefox Extension Workshop](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/).

### Hot Module Reloading (HMR)

The best developer experience that you will have is with Chrome. We've managed to make HMR fully work for it:

- Full HMR for devtools/options/popup page
- When changing the background script, the extension will automatically reload.
- When changing a content script, the extension will automatically reload & the tabs using those content scripts will auto-refresh.
- The popup/page will not need to be compiled in its entirety. Instead, you will be able to benefit from on-the-fly compilation only for the browser requested files, which is VERY fast.

On the other hand, we cannot offer the same experience for Firefox too. However, Firefox watches for file changes and tries to auto-reload the extension on changes, but none of the HMR features above (specified for Chrome) will work.

## Debugging

Browser extensions runs in three different environments (more on upcoming pages) and it requires various environments for debugging.

### With Chrome

You can find following places to investigate the errors and outputs from the console in DevTools:

1. Popup - right click on the page or on the extension icon and choose `Inspect popup` for DevTools.
2. Background scripts (e.g.: background-hooks.js) - open DevTools from `Manage extensions - background page`.
3. Content scripts - page where your script is injected.
4. Extension Errors - list of errors related to the extension (e.g. manifest configuration) are available in `Manage extension - Errors`.

![Popup](https://cdn.quasar.dev/img/bex-debug-popup.png)

![Background scripts, Content scripts and Extension Errors](https://cdn.quasar.dev/img/bex-debug-bg.png)

If your code changes are not propagated to the browser you can try to: - Update or Reload extension - from the Extensions list (screenshots) - Restart browser - Restart dev process

For more information, please visit [Debugging extensions](https://developer.chrome.com/docs/extensions/mv2/tut_debugging/).

## Building for Production

```bash
$ quasar build -m bex -T [chrome|firefox]

# ..or the longer form:
$ quasar build --mode bex -T [chrome|firefox]
```

You will be instructed which is the output folder. Normally, it's `/dist/bex-chrome/` and `/dist/bex-firefox`, based on the target specified for the "quasar build" command.

<DocTree :def="scope.prodTree" />

::: tip
If you want to test out the `your-project-name.zip` file, you can do this by dragging the file into the same place you load the Extension in development mode; for Chrome `chrome://extensions` and Firefox `about:debugging`. See the development screenshots above for more information.
:::

### A Note on Minification

Part of the review process for Browser Extensions in both Chrome and Firefox must allow the relative teams to examine the code being deployed as a live extension. With this in mind, minified code is not allowed. So, to allow for the review process, Quasar will not obfuscate and minify the built code for Browser Extensions.

Given any extension will be ran directly on the user's computer, upload speed isn't a factor to worry about here, so minifying the code isn't necessary.

## Publishing to the Stores

Since Quasar removes the burden of building and packaging your Browser Extension, once you are finished developing your extension, it is ready to be published. The publishing process differs between browsers, but the official documentation will guide you through the process.

**Chrome** - [Publishing a Chrome Browser Extension](https://developer.chrome.com/webstore/publish)

**Firefox** - [Publishing a Firefox Add On (Browser Extension)](https://extensionworkshop.com/documentation/publish/)

::: tip
BEX mode should be compatible with all chromium based browsers. Please refer to their relative documentation on publishing extensions.
:::
