---
title: Upgrade Guide for Quasar CLI with Vite
desc: (@quasar/app-webpack) How to upgrade Quasar CLI with Webpack from older versions to the latest one.
scope:
  oldBexTree:
    l: src-bex
    c:
    - l: css
      e: CSS to use in the Browser Context
      c:
      - l: content-css.css
        e: CSS file which is auto injected into the consuming webpage via the manifest.json
    - l: icons
      e: Icons of your app for all platforms
      c:
      - l: 'icon-16x16.png '
        e: Icon file at 16px x 16px
      - l: icon-48x48.png
        e: Icon file at 48px x 48px
      - l: icon-128x128.png
        e: Icon file at 128px x 128px
    - l: js
      e: Javascript files used within the context of the BEX.
      c:
      - l: background.js
        e: Standard background script BEX file - auto injected via manifest.json
      - l: background-hooks.js
        e: Background script with a hook into the BEX communication layer
      - l: content-hooks.js
        e: Content script script with a hook into the BEX communication layer
      - l: content-script.js
        e: Standard content script BEX file - auto injected via manifest.json
      - l: dom-hooks.js
        e: JS file which is injected into the DOM with a hook into the BEX communication
          layer
    - l: www/
      e: Compiled BEX source - compiled from /src (Quasar app)
    - l: manifest.json
      e: Main thread code for production
  newBexTree:
    l: src-bex
    c:
    - l: assets
      c:
      - l: content.css
        e: CSS file which is auto injected into the consuming webpage via the manifest.json
    - l: background.js
      e: Standard background script BEX file (auto injected via manifest.json)
    - l: dom.js
      e: JS file which is injected into the DOM with a hook into the BEX communication
        layer
    - l: icons
      e: Icons of your app for all platforms
      c:
      - l: 'icon-128x128.png '
        e: Icon file at 128px x 128px
      - l: icon-16x16.png
        e: Icon file at 16px x 16px
      - l: icon-48x48.png
        e: Icon file at 48px x 48px
    - l: _locales/
      e: Optional BEX locales files that you might define in manifest
    - l: manifest.json
      e: The browser extension manifest file
    - l: my-content-script.js
      e: Standard content script BEX file - auto injected via manifest.json (you can
        have multiple scripts)
---

## @quasar/app-webpack v4 (beta)

::: warning CLI is currently in beta
* Please help test the CLI so we can get it out of the `beta` status. We thank you in advance for your help!
* Although we do not plan on adding any further breaking changes, there is still a slight change that we will be forced to do one, based on your feedback.
:::

::: danger
All other docs pages will refer to the old @quasar/app-webpack version (v3) specs. Only this page mentions (for now) about how to use the v4 beta.
:::

### A note to App Extensions owners
You might want to release new versions of your Quasar App Extensions with support for the new @quasar/app-webpack. If you are not touching the quasar.config configuration, then it will be as easy as just changing the following:

```diff
api.compatibleWith(
  '@quasar/app-webpack',
- '^3.0.0'
+ '^3.0.0 || ^4.0.0-beta.1'
)
```

### Notable breaking changes
* Minimum Node.js version is now 18.12
* We have shifted towards an ESM style for the whole Quasar project folder, so many default project files now require ESM code (although using `.cjs` as an extension for these files is supported, but you will most likely need to rename the extension should you not wish to change anything). One example is the `/quasar.config.js` file which now it's assumed to be ESM too (so change from `.js` to `.cjs` should you still want a CommonJs file).
* Ported and adapted the superior devserver implementation from @quasar/app-vite for all Quasar modes. The benefits are huge.
* Ported the superior implementation of SSR, PWA, Electron & BEX modes from @quasar/app-vite. We will detail each Quasar mode changes on this docs page.
  * SSR - some of the noticeable improvements:
    * Improved reliability: same server code runs in dev and prod
    * More target webserver options: you can replace express() with whatever else you are using
    * Perf: client-side code no longer re-compiles from scratch when changing code in /src-ssr
    * Faster & better compilation for files in /src-ssr (now built with Esbuild instead of Webpack)
  * PWA - some of the noticeable improvements:
    * Many new configuration options (while removing a lot of the old ones)
    * Faster & better compilation for files in /src-pwa (now built with Esbuild instead of Webpack)
  * Electron
    * Now compiles to ESM (thus also taking advantage of the Electron in ESM format)
    * Faster & better compilation for files in /src-electron (now built with Esbuild instead of Webpack)
    * Support for multiple preload scripts
  * BEX - some of the noticeable improvements:
    * Ported the superior implementation from @quasar/app-vite, which also means that when you spawn the mode you can choose between extension Manifest v2 and Manifest v3
    * The manifest is now held in a file of its own (/src-pwa/manifest.json) instead of inside the /quasar.config file
* Webpack will now only compile the contents of `/src` folder, while the rest (/src-pwa, /src-electron, etc) are now handled by Esbuild. This translates to a superior build speed and handling of Node.js formats.
* The "test" cmd was removed due to latest updates for @quasar/testing-* packages. See [here](https://testing.quasar.dev/packages/testing/)
* The "clean" cmd has been re-designed. Type "quasar clean -h" in your upgraded Quasar project folder for more info.
* Typescript detection is based on the quasar.config file being in TS form (quasar.config.ts) and tsconfig.json file presence.
* **We will detail more breaking changes for each of the Quasar modes below**.

### Highlights on what's new
Some of the work below has already been backported to the old @quasar/app-webpack v3, but posting here for reader's awareness.

* feat(app-webpack): ability to run multiple quasar dev/build commands simultaneously (example: can run "quasar dev -m capacitor" and "quasar dev -m ssr" and "quasar dev -m capacitor -T ios" simultaneously)
* feat(app-webpack): support for quasar.config file in multiple formats (.js, .mjs, .ts, .cjs)
* feat(app-webpack): Better TS typings overall
* feat(app-webpack): upgrade to Typescript v5; drop fork-ts-checker
* feat(app-webpack): Improve quasarConfOptions, generate types for it, improve docs (fix: #14069) (#15945)
* feat(app-webpack): reload app if one of the imports from quasar.config file changes
* feat(app-webpack): TS detection should keep account of quasar.config file format too (quasar.config.ts)
* feat(app-webpack): env dotfiles support #15303
* feat(app-webpack): New quasar.config file props: build > envFolder (string) and envFiles (string[])
* feat(app-webpack): support for postcss config file in multiple formats: postcss.config.cjs, .postcssrc.js, postcss.config.js, postcss.config.mjs, .postcssrc.cjs, .postcssrc.mjs
* feat(app-webpack): support for babel config file in multiple formats: babel.config.cjs, babel.config.js, babel.config.mjs, .babelrc.js, .babelrc.cjs, .babelrc.mjs, .babelrc
* feat(app-webpack): reopen browser (if configured so) when changing app url through quasar.config file
* feat(app-webpack): port quasar.config file > electron > inspectPort prop from q/app-vite
* feat(app-webpack): port quasar.config file > build > rawDefine from q/app-vite
* feat&perf(app-webpack): faster & more accurate algorithm for determining node package manager to use
* feat(app-webpack): highly improve SSR perf + mem usage (especially for prod); major refactoring of ssr-helpers; also include renderPreloadTag() from q/app-vite
* feat(app-webpack): support for SSR development with HTTPS
* feat(app-webpack): SSR - ability to replace express() with any other connect-like webserver
* feat(app-webpack): SSR - no longer recompile everything when changing code in /src-ssr
* feat(app-webpack): upgrade deps
* feat(app-webpack): remove workaround for bug in Electron 6-8 in cli templates (#15845)
* feat(app-webpack): remove bundleWebRuntime config for Capacitor v5+
* feat(app-webpack): use workbox v7 by default
* feat(app-webpack): quasar.config > build > htmlMinifyOptions
* feat+refactor(app-webpack): ability to run multiple modes + dev/build simultaneously
* feat(app-webpack): lookup open port for vue devtools when being used; ability to run multiple cli instances with vue devtools
* perf(app-webpack): only verify quasar.conf server address for "dev" cmd
* feat(app-webpack): pick new electron inspect port for each instance
* refactor(app-webpack): AE support - better and more efficient algorithms
* feat(app-webpack): AE support for ESM format
* feat(app-webpack): AE support for TS format (through a build step)
* feat(app-webpack): AE API new methods -> hasTypescript() / hasLint() / getStorePackageName() / getNodePackagerName()
* feat(app-webpack): AE -> Prompts API (and ability for prompts default exported fn to be async)
* feat(app-webpack): smarter app files validation
* refactor(app-webpack): the "clean" cmd now works different, since the CLI can be run in multiple instances on the same project folder (multiple modes on dev or build)
* feat(app-webpack): Support for Bun as package manager #16335
* feat(app-webpack): for default /src-ssr template -> prod ssr -> on error, print err stack if built with debugging enabled
* fix(app-webpack): electron preload script triggering "module not found"
* feat(app-webpack): upgrade to webpack-dev-server v5

### Beginning of the upgrade process

::: tip Recommendation
If you are unsure that you won't skip by mistake any of the recommended changes, you can scaffold a new project folder with the @quasar/app-webpack v4 beta at any time and then easily start porting your app from there. The bulk of the changes refer to the different project folder config files and mostly NOT to your /src files.
<br><br>
```tabs
<<| bash Yarn |>>
$ yarn create quasar
<<| bash NPM |>>
$ npm init quasar
<<| bash PNPM |>>
# experimental support
$ pnpm create quasar
<<| bash Bun |>>
# experimental support
$ bun create quasar
```
<br>
When asked to "Pick Quasar App CLI variant", answer with: "Quasar App CLI with Webpack (BETA | next major version - v4)".
:::

Preparations:

* If using the global installation of Quasar CLI (`@quasar/cli`), make sure that you have the latest one. This is due to the support of quasar.config file in multiple formats.
* Again, we highlight that the minimum supported version of Node.js is now v16 (always use the LTS versions of Node.js - the higher the version the better).

* Edit your `/package.json` on the `@quasar/app-webpack` entry and assign it `^4.0.0-beta.1`:
  ```diff /package.json
  "devDependencies": {
  - "@quasar/app-webpack": "^3.0.0",
  + "@quasar/app-webpack": "^4.0.0-beta.1"
  }
  ```
  <br>
  Then yarn/npm/pnpm/bun install.
  <br><br>

* Convert your `/quasar.config.js` file to the ESM format (which is recommended, otherwise rename the file extension to `.cjs` and use CommonJs format).
  ```js /quasar.config.js file
  import { configure } from 'quasar/wrappers'
  export default configure((/* ctx */) => {
    return {
      // ...
    }
  })
  ```

  ::: tip Tip on Typescript
  You can now write this file in TS too should you wish (rename `/quasar.config.js` to `/quasar.config.ts` -- notice the `.ts` file extension).
  :::

* For consistency with @quasar/app-vite (and easy switch between @quasar/app-webpack and it) move `/src/index.template.html` to `/index.html` and do the following changes:
  ```diff /index.html
  <body>
  - <!-- DO NOT touch the following DIV -->
  - <div id="q-app"></div>
  + <!-- quasar:entry-point -->
  </body>
  ```
  <br>

* (Optional, but recommended) For future-proofing some tools config files, rename the following files (in the root project folder):
  | Old name | New name |
  | -------- | -------- |
  | postcss.config.js | postcss.config.cjs |
  | .eslintrc.js | .eslintrc.cjs |
  | babel.config.js | babel.config.cjs |

  <br>

* You might want to add the following to your `/.gitignore` file. These kind of files are left for inspection purposes when something fails with your `/quasar.config` file (and can be removed by the `quasar clean` command):

  ```bash [highlight=8,11] /.gitignore
  .DS_Store
  .thumbs.db
  node_modules

  # Quasar core related directories
  .quasar
  /dist
  /quasar.config.*.temporary.compiled*

  # local .env files
  .env.local*

  # Cordova related directories and files
  /src-cordova/node_modules
  /src-cordova/platforms
  /src-cordova/plugins
  /src-cordova/www

  # Capacitor related directories and files
  /src-capacitor/www
  /src-capacitor/node_modules

  # Log files
  npm-debug.log*
  yarn-debug.log*
  yarn-error.log*

  # Editor directories and files
  .idea
  *.suo
  *.ntvs*
  *.njsproj
  *.sln
  ```

  <br>

* If you have linting, please review your `/.eslintignore` file as well:

  ```bash [highlight=6-8] /.eslintignore
  /dist
  /src-capacitor
  /src-cordova
  /.quasar
  /node_modules
  .eslintrc.cjs
  babel.config.cjs
  /quasar.config.*.temporary.compiled*
  ```

  <br>

* If using Typescript, then ensure that your `/tsconfig.json` file looks like this:

  ```json [highlight=6-13]
  {
    "extends": "@quasar/app-vite/tsconfig-preset",
    "compilerOptions": {
      "baseUrl": "."
    },
    "exclude": [
      "./dist",
      "./.quasar",
      "./node_modules",
      "./src-capacitor",
      "./src-cordova",
      "./quasar.config.*.temporary.compiled*"
    ]
  }
  ```

### SPA / Capacitor / Cordova modes changes
* No need to change anything in the `/src`, `/src-capacitor` or `/src-cordova` folders.

### PWA mode changes

The `register-service-worker` dependency is no longer supplied by the CLI. You will have to install it yourself in your project folder.

```tabs
<<| bash Yarn |>>
$ yarn add register-service-worker@^1.0.0
<<| bash NPM |>>
$ npm install --save register-service-worker@^1.0.0
<<| bash PNPM |>>
$ pnpm add register-service-worker@^1.0.0
<<| bash Bun |>>
$ bun add register-service-worker@^1.0.0
```

Edit your `/src-pwa/custom-service-worker.js` file:

```diff /src-pwa/custom-service-worker.js
- import { precacheAndRoute } from 'workbox-precaching'

- // Use with precache injection
- precacheAndRoute(self.__WB_MANIFEST)

+ import { clientsClaim } from 'workbox-core'
+ import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching'
+ import { registerRoute, NavigationRoute } from 'workbox-routing'

+ self.skipWaiting()
+ clientsClaim()

+ // Use with precache injection
+ precacheAndRoute(self.__WB_MANIFEST)

+ cleanupOutdatedCaches()

+ // Non-SSR fallbacks to index.html
+ // Production SSR fallbacks to offline.html (except for dev)
+ if (process.env.MODE !== 'ssr' || process.env.PROD) {
+  registerRoute(
+    new NavigationRoute(
+      createHandlerBoundToURL(process.env.PWA_FALLBACK_HTML),
+      { denylist: [new RegExp(process.env.PWA_SERVICE_WORKER_REGEX), /workbox-(.)*\.js$/] }
+    )
+  )
+ }
```

Create the file `/src-pwa/manifest.json` and move /quasar.config file > pwa > manifest from there to this file. Here's an example of how it can look like:

```json
{
  "orientation": "portrait",
  "background_color": "#ffffff",
  "theme_color": "#027be3",
  "icons": [
    {
      "src": "icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icons/icon-256x256.png",
      "sizes": "256x256",
      "type": "image/png"
    },
    {
      "src": "icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

There are some subtle changes in `/quasar.config` file too:

```diff /quasar.config file
sourceFiles: {
- registerServiceWorker: 'src-pwa/register-service-worker',
- serviceWorker: 'src-pwa/custom-service-worker',
+ pwaRegisterServiceWorker: 'src-pwa/register-service-worker',
+ pwaServiceWorker: 'src-pwa/custom-service-worker',
+ pwaManifestFile: 'src-pwa/manifest.json',
  // ...
},

pwa: {
- workboxPluginMode?: "GenerateSW" | "InjectManifest";
+ workboxMode?: "GenerateSW" | "InjectManifest";

  /**
   * Full option list can be found
   *  [here](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#full_generatesw_config).
   */
- workboxOptions?: object;
  /**
   * Extend/configure the Workbox GenerateSW options
   */
+ extendGenerateSWOptions?: (config: GenerateSWOptions) => void;
  /**
   * Extend/configure the Workbox InjectManifest options
   */
+ extendInjectManifestOptions?: (config: InjectManifestOptions) => void;

- // Now the contents for this held in a new file: /src-pwa/manifest.json
- // and its replaced by extendManifestJson below:
- manifest?: PwaManifestOptions;
  /**
   * Should you need some dynamic changes to the /src-pwa/manifest.json,
   * use this method to do it.
   */
+ extendManifestJson?: (json: PwaManifestOptions) => void;

  /**
   * PWA manifest filename to use on your browser
   * @default manifest.json
   */
+ manifestFilename?: string;

  /**
   * Does the PWA manifest tag requires crossorigin auth?
   * @default false
   */
+ useCredentialsForManifestTag?: boolean;

  /**
   * Webpack config object for the custom service worker ONLY (`/src-pwa/custom-service-worker`)
   *  when pwa > workboxPluginMode is set to InjectManifest
   */
- extendWebpackCustomSW?: (config: WebpackConfiguration) => void;
  /**
   * Equivalent to `extendWebpackCustomSW()` but uses `webpack-chain` instead,
   *  for the custom service worker ONLY (`/src-pwa/custom-service-worker`)
   *  when pwa > workboxPluginMode is set to InjectManifest
   */
- chainWebpackCustomSW?: (chain: WebpackChain) => void;
  /**
   * Extend the Esbuild config that is used for the custom service worker
   * (if using it through workboxMode: 'InjectManifest')
   */
+ extendPWACustomSWConf?: (config: EsbuildConfiguration) => void;

- /**
-  * @default
-  * ```typescript
-  * {
-  *    appleMobileWebAppCapable: 'yes';
-  *    appleMobileWebAppStatusBarStyle: 'default';
-  *    appleTouchIcon120: 'icons/apple-icon-120x120.png';
-  *    appleTouchIcon180: 'icons/apple-icon-180x180.png';
-  *    appleTouchIcon152: 'icons/apple-icon-152x152.png';
-  *    appleTouchIcon167: 'icons/apple-icon-167x167.png';
-  *    appleSafariPinnedTab: 'icons/safari-pinned-tab.svg';
-  *    msapplicationTileImage: 'icons/ms-icon-144x144.png';
-  *    msapplicationTileColor: '#000000';
-  * }
-   * ```
-  */
- metaVariables?: {
-   appleMobileWebAppCapable: string;
-   appleMobileWebAppStatusBarStyle: string;
-   appleTouchIcon120: string;
-   appleTouchIcon180: string;
-   appleTouchIcon152: string;
-   appleTouchIcon167: string;
-   appleSafariPinnedTab: string;
-   msapplicationTileImage: string;
-   msapplicationTileColor: string;
- };
- metaVariablesFn?: (manifest?: PwaManifestOptions) => PwaMetaVariablesEntry[];
+ /**
+  * Auto inject the PWA meta tags?
+  * If using the function form, return HTML tags as one single string.
+  * @default true
+  */
+ injectPwaMetaTags?: boolean | ((injectParam: InjectPwaMetaTagsParams) => string);
+ // see below for the InjectPwaMetaTagsParams interface

  // ...
}

// additional types for injectPwaMetaTags
interface InjectPwaMetaTagsParams {
  pwaManifest: PwaManifestOptions;
  publicPath: string;
}
interface PwaManifestOptions {
  id?: string;
  background_color?: string;
  categories?: string[];
  description?: string;
  // ...
}
```

### Electron mode changes

::: warning
The distributables (your production code) will be compiled to ESM form, thus also taking advantage of Electron in ESM form.
:::

::: tip
You might want to upgrade the `electron` package to the latest so it can handle the ESM format.
:::

Most changes refer to editing your `/src-electron/electron-main.js` file:

```diff Icon path
+import { fileURLToPath } from 'node:url'

+const currentDir = fileURLToPath(new URL('.', import.meta.url))

function createWindow () {
  mainWindow = new BrowserWindow({
-   icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
+   icon: path.resolve(currentDir, 'icons/icon.png'), // tray icon
    // ...
  })
```

```diff Preload script
import { fileURLToPath } from 'node:url'

const currentDir = fileURLToPath(new URL('.', import.meta.url))

function createWindow () {
  mainWindow = new BrowserWindow({
    // ...
    webPreferences: {
-     preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
+     preload: path.resolve(
+       currentDir,
+       path.join(process.env.QUASAR_ELECTRON_PRELOAD_FOLDER, 'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION)
+     )
    }
  })
```

::: danger
Edit `/quasar.config.js` to specify your preload script:
<br><br>
```diff /quasar.config file
sourceFiles: {
- electronPreload?: string;
},

electron: {
+ // Electron preload scripts (if any) from /src-electron, WITHOUT file extension
+ preloadScripts: [ 'electron-preload' ],
}
```
<br>
As you can see, you can now specify multiple preload scripts should you need them.
:::

```diff
function createWindow () {
   // ...
-  mainWindow.loadURL(process.env.APP_URL)
+  if (process.env.DEV) {
+    mainWindow.loadURL(process.env.APP_URL)
+  } else {
+    mainWindow.loadFile('index.html')
+  }
```

Finally, the new file should look like this:

```js The new /src-electron/electron-main.js
import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

const currentDir = fileURLToPath(new URL('.', import.meta.url))

let mainWindow

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(currentDir, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(
        currentDir,
        path.join(process.env.QUASAR_ELECTRON_PRELOAD_FOLDER, 'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION)
      )
    }
  })

  if (process.env.DEV) {
    mainWindow.loadURL(process.env.APP_URL)
  } else {
    mainWindow.loadFile('index.html')
  }

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
```

There are also more `/quasar.config` file changes:

```diff /quasar.config file > electron
electron: {
  /** Webpack config object for the Main Process ONLY (`/src-electron/electron-main`) */
- extendWebpackMain?: (config: WebpackConfiguration) => void;
  /**
   * Equivalent to `extendWebpackMain()` but uses `webpack-chain` instead,
   *  for the Main Process ONLY (`/src-electron/electron-main`)
   */
- chainWebpackMain?: (chain: WebpackChain) => void;
  /**
   * Extend the Esbuild config that is used for the electron-main thread
   */
+ extendElectronMainConf?: (config: EsbuildConfiguration) => void;

  /** Webpack config object for the Preload Process ONLY (`/src-electron/electron-preload`) */
- extendWebpackPreload?: (config: WebpackConfiguration) => void;
  /**
   * Equivalent to `extendWebpackPreload()` but uses `webpack-chain` instead,
   *  for the Preload Process ONLY (`/src-electron/electron-preload`)
   */
- chainWebpackPreload?: (chain: WebpackChain) => void;
  /**
   * Extend the Esbuild config that is used for the electron-preload thread
   */
+ extendElectronPreloadConf?: (config: EsbuildConfiguration) => void;

  /**
   * The list of content scripts (js/ts) that you want embedded.
   * Each entry in the list should be a filename (WITHOUT its extension) from /src-electron/
   *
   * @default [ 'electron-preload' ]
   * @example [ 'my-other-preload-script' ]
   */
+ preloadScripts?: string[];

  /**
   * Specify the debugging port to use for the Electron app when running in development mode
   * @default 5858
   */
+ inspectPort?: number;

  /**
   * Specify additional parameters when yarn/npm installing
   * the UnPackaged folder, right before bundling with either
   * electron packager or electron builder;
-  * Example: [ '--ignore-optional', '--some-other-param' ]
+  * Example: [ 'install', '--production', '--ignore-optional', '--some-other-param' ]
   */
  unPackagedInstallParams?: string[];
}
```

### SSR mode changes

The support for `/src-ssr/production-export.js` has been dropped (delete it). The same SSR webserver now runs for both development and production, so create a `/src-ssr/server.js` with the following contents:

```js /src-ssr/server.js
/**
 * Make sure to yarn add / npm install (in your project root)
 * anything you import here (except for express and compression).
 */
import express from 'express'
import compression from 'compression'
import {
  ssrClose,
  ssrCreate,
  ssrListen,
  ssrServeStaticContent,
  ssrRenderPreloadTag
} from 'quasar/wrappers'

/**
 * Create your webserver and return its instance.
 * If needed, prepare your webserver to receive
 * connect-like middlewares.
 *
 * Should NOT be async!
 */
export const create = ssrCreate((/* { ... } */) => {
  const app = express()

  // attackers can use this header to detect apps running Express
  // and then launch specifically-targeted attacks
  app.disable('x-powered-by')

  // place here any middlewares that
  // absolutely need to run before anything else
  if (process.env.PROD) {
    app.use(compression())
  }

  return app
})

/**
 * You need to make the server listen to the indicated port
 * and return the listening instance or whatever you need to
 * close the server with.
 *
 * The "listenResult" param for the "close()" definition below
 * is what you return here.
 *
 * For production, you can instead export your
 * handler for serverless use or whatever else fits your needs.
 */
export const listen = ssrListen(async ({ app, devHttpsApp, port, isReady }) => {
  await isReady()
  const server = devHttpsApp || app
  return server.listen(port, () => {
    if (process.env.PROD) {
      console.log('Server listening at port ' + port)
    }
  })
})

/**
 * Should close the server and free up any resources.
 * Will be used on development only when the server needs
 * to be rebooted.
 *
 * Should you need the result of the "listen()" call above,
 * you can use the "listenResult" param.
 *
 * Can be async.
 */
export const close = ssrClose(({ listenResult }) => {
  return listenResult.close()
})

const maxAge = process.env.DEV
  ? 0
  : 1000 * 60 * 60 * 24 * 30

/**
 * Should return middleware that serves the indicated path
 * with static content.
 */
export const serveStaticContent = ssrServeStaticContent((path, opts) => {
  return express.static(path, {
    maxAge,
    ...opts
  })
})

const jsRE = /\.js$/
const cssRE = /\.css$/
const woffRE = /\.woff$/
const woff2RE = /\.woff2$/
const gifRE = /\.gif$/
const jpgRE = /\.jpe?g$/
const pngRE = /\.png$/

/**
 * Should return a String with HTML output
 * (if any) for preloading indicated file
 */
export const renderPreloadTag = ssrRenderPreloadTag((file/* , { ssrContext } */) => {
  if (jsRE.test(file) === true) {
    return `<script src="${file}" defer crossorigin></script>`
  }

  if (cssRE.test(file) === true) {
    return `<link rel="stylesheet" href="${file}" crossorigin>`
  }

  if (woffRE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
  }

  if (woff2RE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
  }

  if (gifRE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="image" type="image/gif" crossorigin>`
  }

  if (jpgRE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="image" type="image/jpeg" crossorigin>`
  }

  if (pngRE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="image" type="image/png" crossorigin>`
  }

  return ''
})
```

If you have `/src-ssr/middlewares/compression.js` file, delete it because this code is now embedded into `/src-ssr/server.js`. Then edit your `/quasar.config` file to remove the reference to the old file:

```diff /quasar.config file
ssr: {
  middlewares: [
-   ctx.prod ? 'compression' : '',
    'render' // keep this as last one
  ]
}
```

There are some additional changes to the `/quasar.config` file:

```diff /quasar.config file
ssr: {
  // ...

  /**
   * If a PWA should take over or just a SPA.
   * When used in object form, you can specify Workbox options
   *  which will be applied on top of `pwa > workboxOptions`.
   *
   * @default false
   */
- pwa?: boolean | object;
+ pwa?: boolean;

  /**
   * When using SSR+PWA, this is the name of the
   * PWA index html file that the client-side fallbacks to.
   * For production only.
   *
   * Do NOT use index.html as name as it will mess SSR up!
   *
   * @default 'offline.html'
   */
- ssrPwaHtmlFilename?: string;
+ pwaOfflineHtmlFilename?: string;

  /**
   * Tell browser when a file from the server should expire from cache
   * (the default value, in ms)
   * Has effect only when server.static() is used
   */
- maxAge?: number;
- // now part of the /src-ssr/server.js code

  /**
   * Extend/configure the Workbox GenerateSW options
   * Specify Workbox options which will be applied on top of
   *  `pwa > extendGenerateSWOptions()`.
   * More info: https://developer.chrome.com/docs/workbox/the-ways-of-workbox/
   */
+ pwaExtendGenerateSWOptions?: (config: object) => void;

  /**
   * Extend/configure the Workbox InjectManifest options
   * Specify Workbox options which will be applied on top of
   *  `pwa > extendInjectManifestOptions()`.
   * More info: https://developer.chrome.com/docs/workbox/the-ways-of-workbox/
   */
+ pwaExtendInjectManifestOptions?: (config: object) => void;

  /**
   * Webpack config object for the Webserver
   * which includes the SSR middleware
   */
- extendWebpackWebserver?: (config: WebpackConfiguration) => void;
  /**
   * Equivalent to `extendWebpackWebserver()` but uses `webpack-chain` instead.
   * Handles the Webserver webpack config ONLY which includes the SSR middleware
   */
- chainWebpackWebserver?: (chain: WebpackChain) => void;
  /**
   * Extend the Esbuild config that is used for the SSR webserver
   * (which includes the SSR middlewares)
   */
+ extendSSRWebserverConf?: (config: EsbuildConfiguration) => void;
}
```

### Bex mode changes
The implementation of the BEX mode has been ported from @quasar/app-vite, so when you spawn this Quasar mode it will now ask you what extension Manifest version you want (v2 or v3).

But this also means that your `/src-bex` folder has suffered significant files and folders structure changes. It would be best to temporarily copy your /src-bex folder to a safe place, then remove and add back the BEX mode:

```bash
$ quasar mode remove bex
$ quasar mode add bex
```

And then, try to understand the new structure and port your old /src-bex to it. There is unfortunately no other way to put it.

But first, there are some changes to the `/quasar.config` file that you should be aware of:

```diff /quasar.config file
sourceFiles: {
+ bexManifestFile: 'src-bex/manifest.json',
  // ...
},

bex: {
- builder: {
-   directories: {
-     input: cfg.build.distDir,
-     output: path.join(cfg.build.packagedDistDir, 'Packaged')
-   }
- }
}
```

Some of the changes, like moving the background script from `/js/background.js` directly to the root folder, were required by external factors in order for future-proofing the extension structure.

::: tip
**Temporarily**, until this version of @quasar/app-webpack gets out of beta status, it would be a good idea to check the Quasar CLI with Vite docs on BEX since they will now mostly match.
:::

Click on the blocks below to expand and see the old and the new folder structure:

::: details The *OLD* folder structure
<DocTree :def="scope.oldBexTree" />
:::

::: details The *NEW* folder structure
<DocTree :def="scope.newBexTree" />
:::

### Other /quasar.config file changes

The `ctx` from `/quasar.config` file has some additional props (`vueDevtools` and `appPaths`):

```js
import { configure } from 'quasar/wrappers'
export default configure((ctx) => ({
  // ctx.vueDevtools & ctx.appPaths is available
```

The definition for `ctx.vueDevtools` is:

```js
/** True if opening remote Vue Devtools in development mode. */
vueDevtools: boolean;
```

The definition for `ctx.appPaths` is defined with QuasarAppPaths TS type as below:

```diff
export interface IResolve {
  cli: (dir: string) => string;
  app: (dir: string) => string;
  src: (dir: string) => string;
+ public: (dir: string) => string;
  pwa: (dir: string) => string;
  ssr: (dir: string) => string;
  cordova: (dir: string) => string;
  capacitor: (dir: string) => string;
  electron: (dir: string) => string;
  bex: (dir: string) => string;
}

export interface QuasarAppPaths {
  cliDir: string;
  appDir: string;
  srcDir: string;
+ publicDir: string;
  pwaDir: string;
  ssrDir: string;
  cordovaDir: string;
  capacitorDir: string;
  electronDir: string;
  bexDir: string;

  quasarConfigFilename: string;
+ quasarConfigInputFormat: "esm" | "cjs" | "ts";
+ quasarConfigOutputFormat: "esm" | "cjs";

  resolve: IResolve;
}
```

The Typescript detection is based on the quasar.config file being in TS form (quasar.config.ts) and tsconfig.json file presence, so please remove the following:

```diff /quasar.config
- /**
-  * Add support for TypeScript.
-  *
-  * @default false
-  */
- supportTS?: boolean | { tsLoaderConfig: object; tsCheckerConfig: object };
```

The definition of `/quasar.config` file > sourceFiles has some changes:

```diff /quasar.config > sourceFiles
sourceFiles: {
  rootComponent?: string;
  router?: string;
  store?: string;
  indexHtmlTemplate?: string;

- registerServiceWorker?: string;
- serviceWorker?: string;
+ pwaRegisterServiceWorker?: string;
+ pwaServiceWorker?: string;
+ pwaManifestFile?: string;

  electronMain?: string;
- electronPreload?: string;
- ssrServerIndex?: string;

+ bexManifestFile?: string;
}
```

There is a new prop for linting:

```js /quasar.config > eslint (New!)
eslint: {
  /**
   * Should it report warnings?
   * @default false
   */
  warnings?: boolean;

  /**
   * Should it report errors?
   * @default false
   */
  errors?: boolean;

  /**
   * Fix on save.
   * @default false
   */
  fix?: boolean;

  /**
   * Raw options to send to ESLint for Esbuild
   */
  rawEsbuildEslintOptions?: Omit<
    ESLint.Options,
    "cache" | "cacheLocation" | "fix" | "errorOnUnmatchedPattern"
  >;

  /**
   * Raw options to send to ESLint Webpack plugin
   */
  rawWebpackEslintPluginOptions?: WebpackEslintOptions;

  /**
   * Files to include (can be in glob format; for Esbuild ESLint only)
   */
  include?: string[];

  /**
   * Files to exclude (can be in glob format).
   * Recommending to use .eslintignore file instead.
   * @default ['node_modules']
   */
  exclude?: string[];

  /**
   * Enable or disable caching of the linting results.
   * @default true
   */
  cache?: boolean;

  /**
   * Formatter to use
   * @default 'stylish'
   */
  formatter?: ESLint.Formatter;
}
```

```diff /quasar.config > build
build: {
  /**
   * Transpile JS code with Babel
   *
   * @default true
   */
- transpile?: boolean;
+ webpackTranspile?: boolean;

  /**
   * Add dependencies for transpiling with Babel (from node_modules, which are by default not transpiled).
   * It is ignored if "transpile" is not set to true.
   * @example [ /my-dependency/, 'my-dep', ...]
   */
- transpileDependencies?: (RegExp | string)[];
+ webpackTranspileDependencies?: (RegExp | string)[];

  /**
   * Add support for also referencing assets for custom tags props.
   *
   * @example { 'my-img-comp': 'src', 'my-avatar': [ 'src', 'placeholder-src' ]}
   */
- transformAssetsUrls?: Record<string, string | string[]>;
  // use vueLoaderOptions instead

  /** Show a progress bar while compiling. */
- showProgress?: boolean;
+ webpackShowProgress?: boolean;

  /**
   * Source map [strategy](https://webpack.js.org/configuration/devtool/) to use.
   */
- devtool?: WebpackConfiguration["devtool"];
+ webpackDevtool?: WebpackConfiguration["devtool"];

  /**
   * Sets [Vue Router mode](https://router.vuejs.org/guide/essentials/history-mode.html).
   * History mode requires configuration on your deployment web server too.
   *
   * @default 'hash'
   */
+ vueRouterMode?: "hash" | "history";
  /**
   * Sets Vue Router base.
   * Should not need to configure this, unless absolutely needed.
   */
+ vueRouterBase?: string;

  /**
   * When using SSR+PWA, this is the name of the
   * PWA index html file.
   *
   * Do NOT use index.html as name as it will mess SSR up!
   *
   * @default 'offline.html'
   */
- ssrPwaHtmlFilename?: string;
- // Moved to ssr > pwaOfflineHtmlFilename

  /** Options to supply to `ts-loader` */
+ tsLoaderOptions?: object;

  /**
   * Esbuild is used to build contents of /src-pwa, /src-ssr, /src-electron, /src-bex
   * @example
   *    {
   *      browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
   *      node: 'node20'
   *    }
   */
+ esbuildTarget?: EsbuildTargetOptions;
+ // please check below for the EsbuildTargetOptions interface

  /**
   * Defines constants that get replaced in your app.
   * Unlike `env`, you will need to use JSON.stringify() on the values yourself except for booleans.
   * Also, these will not be prefixed with `process.env.`.
   *
   * @example { SOMETHING: JSON.stringify('someValue') } -> console.log(SOMETHING) // console.log('someValue')
   */
+ rawDefine?: { [index: string]: string | boolean | undefined | null };

  /**
   * Folder where Quasar CLI should look for .env* files.
   * Can be an absolute path or a relative path to project root directory.
   *
   * @default project root directory
   */
+ envFolder?: string;
  /**
   * Additional .env* files to be loaded.
   * Each entry can be an absolute path or a relative path to quasar.config > build > envFolder.
   *
   * @example ['.env.somefile', '../.env.someotherfile']
   */
+ envFiles?: string[];
}

interface EsbuildTargetOptions {
  /**
   * @default ['es2022', 'firefox115', 'chrome115', 'safari14']
   */
  browser?: string[];
  /**
   * @example 'node20'
   */
  node?: string;
}
```

Due to the upgrade to `webpack-dev-server` v5 in `@quasar/app-webpack` v4.0.0-beta.3:

```diff /quasar.config > devServer
devServer: {
- proxy: {
-   "/api": {
-     target: "http://localhost:3000",
-     changeOrigin: true,
-   },
- }
+ proxy: [
+   {
+     context: ["/api"],
+     target: "http://localhost:3000",
+     changeOrigin: true,
+   },
+ ]
}
```

### The env dotfiles support
Expanding a bit on the env dotfiles support. These files will be detected and used (the order matters):

```
.env                                # loaded in all cases
.env.local                          # loaded in all cases, ignored by git
.env.[dev|prod]                     # loaded for dev or prod only
.env.local.[dev|prod]               # loaded for dev or prod only, ignored by git
.env.[quasarMode]                   # loaded for specific Quasar CLI mode only
.env.local.[quasarMode]             # loaded for specific Quasar CLI mode only, ignored by git
.env.[dev|prod].[quasarMode]        # loaded for specific Quasar CLI mode and dev|prod only
.env.local.[dev|prod].[quasarMode]  # loaded for specific Quasar CLI mode and dev|prod only, ignored by git
```

...where "ignored by git" assumes a default project folder created after releasing this package, otherwise add `.env.local*` to your `/.gitignore` file.

You can also configure the files above to be picked up from a different folder or even add more files to the list:

```js /quasar.config file
build: {
  envFolder: './' // absolute or relative path to root project folder
  envFiles: [
    // Path strings to your custom files --- absolute or relative path to root project folder
  ]
}
```
