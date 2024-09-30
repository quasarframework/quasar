---
title: Upgrade Guide for Quasar CLI with Vite
desc: (@quasar/app-vite) How to upgrade Quasar CLI with Vite from older versions to the latest one.
---

## @quasar/app-vite v2 (beta)

::: warning CLI is currently in beta
* Please help test the CLI so we can get it out of the `beta` status. We thank you in advance for your help!
* Although we do not plan on adding any further breaking changes, there is still a slight chance that we will be forced to do one, based on your feedback.
:::

::: danger
All other docs pages will refer to the old @quasar/app-vite version (v1) specs. Only this page mentions (for now) about how to use the v2 beta.
:::

### A note to App Extensions owners

You might want to release new versions of your Quasar App Extensions with support for the new @quasar/app-vite. If you are not touching the quasar.config configuration, then it will be as easy as just changing the following:

```diff
api.compatibleWith(
  '@quasar/app-vite',
- '^1.0.0'
+ '^1.0.0 || ^2.0.0-beta.1'
)
```

### Notable breaking changes

* Minimum Node.js version is now 18 (mainly due to Vite 5)
* We have shifted towards an ESM style for the whole Quasar project folder, so many default project files now require ESM code (although using `.cjs` as an extension for these files is supported, but you will most likely need to rename the extension should you not wish to change anything). One example is the `/quasar.config.js` file which now it's assumed to be ESM too (so change from `.js` to `.cjs` should you still want a CommonJs file).
* The "test" cmd was removed due to latest updates for @quasar/testing-* packages. See [here](https://testing.quasar.dev/packages/testing/)
* The "clean" cmd has been re-designed. Type "quasar clean -h" in your upgraded Quasar project folder for more info.
* TypeScript detection is based on the quasar.config file being in TS form (quasar.config.ts) and tsconfig.json file presence.
* TypeScript `tsconfig.json` presets have been replaced by an auto-generated `.quasar/tsconfig.json` file. This is more flexible and brings new features, more on this below.
* feat+refactor(app-vite): ability to run multiple modes + dev/build simultaneously (huge effort!)
* SSR and Electron modes now build in ESM format.
* Dropped support for our internal linting system (quasar.config file > eslint). Should use [vite-plugin-checker](https://vite-plugin-checker.netlify.app/) instead.
* **We will detail more breaking changes for each of the Quasar modes below**.

### Highlights on what's new

Some of the work below has already been backported to the old @quasar/app-vite v1, but posting here for reader's awareness.

* feat(app-vite): upgrade to Vite 5
* feat(app-vite): ability to run multiple quasar dev/build commands simultaneously (example: can run "quasar dev -m capacitor" and "quasar dev -m ssr" and "quasar dev -m capacitor -T ios" simultaneously)
* feat(app-vite): Better TS typings overall
* refactor(app-vite): port CLI to ESM format (major effort! especially to support Vite 5 and SSR)
* feat(app-vite): support for quasar.config file in multiple formats (.js, .mjs, .ts, .cjs)
* feat(app-vite): Improve quasarConfOptions, generate types for it, improve docs (fix: #14069) (#15945)
* feat(app-vite): reload app if one of the imports from quasar.config file changes
* feat(app-vite): TS detection should keep account of quasar.config file format too (quasar.config.ts)
* feat(app-vite): The shorthand CLI command "quasar dev/build -m ios/android" is now targeting Capacitor mode instead of Cordova (2.0.0-beta.12+)
* feat(app-vite): support for SSR development with HTTPS
* feat(app-vite): env dotfiles support #15303
* feat(app-vite): New quasar.config file props: build > envFolder (string) and envFiles (string[])
* feat(app-vite): reopen browser (if configured so) when changing app url through quasar.config file
* feat&perf(app-vite): faster & more accurate algorithm for determining node package manager to use
* feat(app-vite): upgrade deps
* feat(app-vite): remove workaround for bug in Electron 6-8 in cli templates (#15845)
* feat(app-vite): remove bundleWebRuntime config for Capacitor v5+
* feat(app-vite): use workbox v7 by default
* feat(app-vite): quasar.config > pwa > injectPwaMetaTags can now also be a function: (({ pwaManifest, publicPath }) => string);
* feat(app-vite): quasar.config > build > htmlMinifyOptions
* feat(app-vite): lookup open port for vue devtools when being used; ability to run multiple cli instances with vue devtools
* perf(app-vite): SSR render-template in specific esm or cjs form, according to host project; interpolation by variable
* perf(app-vite): only verify quasar.conf server address for "dev" cmd
* feat(app-vite): pick new electron inspect port for each instance
* feat(app-vite): Electron - can now load multiple preload scripts
* refactor(app-vite): AE support - better and more efficient algorithms
* feat(app-vite): AE support for ESM format
* feat(app-vite): AE support for TS format (through a build step)
* feat(app-vite): AE API new methods -> hasTypescript() / hasLint() / getStorePackageName() / getNodePackagerName()
* feat(app-vite): AE -> Prompts API (and ability for prompts default exported fn to be async)
* refactor(app-vite): the "clean" cmd now works different, since the CLI can be run in multiple instances on the same project folder (multiple modes on dev or build)
* feat(app-vite): Support for Bun as package manager #16335
* feat(app-vite): for default /src-ssr template -> prod ssr -> on error, print err stack if built with debugging enabled
* feat(app-vite): extend build > vitePlugins form (additional { server?: boolean, client?: boolean } param

### Beginning of the upgrade process

::: tip Recommendation
If you are unsure that you won't skip by mistake any of the recommended changes, you can scaffold a new project folder with the @quasar/app-vite v2 beta at any time and then easily start porting your app from there. The bulk of the changes refer to the different project folder config files and mostly NOT to your /src files.
<br><br>
```tabs
<<| bash Yarn |>>
$ yarn create quasar
<<| bash NPM |>>
$ npm init quasar
<<| bash PNPM |>>
$ pnpm create quasar
<<| bash Bun |>>
# experimental support
$ bun create quasar
```
<br>
When asked to "Pick Quasar App CLI variant", answer with: "Quasar App CLI with Vite 5 (BETA | next major version - v2)".
:::

Preparations:

* If using the global installation of Quasar CLI (`@quasar/cli`), make sure that you have the latest one. This is due to the support of quasar.config file in multiple formats.
* Again, we highlight that the minimum supported version of Node.js is now v18 (always use the LTS versions of Node.js - the higher the version the better).

* Edit your `/package.json` on the `@quasar/app-vite` entry and assign it `^2.0.0-beta.1`:
  ```diff /package.json
  "devDependencies": {
  - "@quasar/app-vite": "^1.0.0",
  + "@quasar/app-vite": "^2.0.0-beta.1"
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

  ::: tip Tip on TypeScript
  You can now write this file in TS too should you wish (rename `/quasar.config.js` to `/quasar.config.ts` -- notice the `.ts` file extension).
  :::

* We **highly recommend** setting `type` to `module` in your `/package.json`. Based on it, the Quasar CLI will make decisions on the distributables that it builds (example: Electron in ESM or CJS form).
  ```diff /package.json
  {
  + "type": "module"
  }
  ```
  <br>
  Remember to convert to ESM the `postcss.config.js` file should you use it. Also, rename `.eslintrc.js` to `.eslintrc.cjs` (with no change to its content).
  <br><br>

* You might want to add the following to your `/.gitignore` file. The `/quasar.config.*.temporary.compiled*` entry refers to files that are left for inspection purposes when something fails with your `/quasar.config` file (and can be removed by the `quasar clean` command):

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

* If using TypeScript: `@quasar/app-vite/tsconfig-preset` has been dropped, so update your `/tsconfig.json` file to extend the new auto-generated `.quasar/tsconfig.json` file. The underlying configuration is different, so also review the new options in the generated file to see if you need to adjust the rest of your `tsconfig.json` file.

  ```json /tsconfig.json
  {
    "extends": "./.quasar/tsconfig.json"
  }
  ```

  You can use `quasar.config file > build > typescript` to control the TypeScript-related behavior:

  ```ts /quasar.config.ts
  build: {
    typescript: {
      strict: true, // (recommended) enables strict settings for TypeScript
      extendTsConfig(tsConfig) {
        // You can use this hook to extend tsConfig dynamically
        // For basic use cases, you can still update the usual tsconfig.json file to override some settings
      },
      vueShim: true, // required when using ESLint with type-checked rules, will generate a shim file for `*.vue` files
    }
  }
  ```

  You should be able to set the `strict` option to `true` without facing much trouble as it's close the the previous preset. But, if you face any issues, you can either update your code to satisfy the stricter rules or set the "problematic" options to `false` in your `tsconfig.json` file, at least until you can fix them.

  `src/quasar.d.ts` and `src/shims-vue.d.ts` files will now be auto-generated in the `.quasar` folder. So, you must delete those files. If you are using ESLint with type-check rules, enable the `vueShim` option to preserve the previous behavior with the shim file. If your project is working fine without that option, you don't need to enable it.

  The types feature flag files will now be auto-generated in the `.quasar` folder. So, you must delete them:

  ```tabs
  <<| bash rimraf through npx |>>
  # in project folder root:
  $ npx rimraf -g ./**/*-flag.d.ts
  $ quasar build # or dev
  <<| bash Unix-like (Linux, macOS) |>>
  # in project folder root:
  $ rm ./**/*-flag.d.ts
  $ quasar build # or dev
  <<| bash Windows (CMD) |>>
  # in project folder root:
  $ del /s *-flag.d.ts
  $ quasar build &:: or dev
  <<| bash Windows (PowerShell) |>>
  # in project folder root:
  $ Remove-Item -Recurse -Filter *-flag.d.ts
  $ quasar build # or dev
  ```

  Properly running typechecking and linting requires the `.quasar/tsconfig.json` to be present. The file will be auto-generated when running `quasar dev` or `quasar build` commands. But, as a lightweight alternative, there is a new CLI command `quasar prepare` that will generate the `.quasar/tsconfig.json` file and some types files. It is especially useful for CI/CD pipelines.

  ```bash
  $ quasar prepare
  ```

  You can add it as a `postinstall` script to make sure it's run after installing the dependencies. This would be helpful when pulling the project for the first time or when upgrading the Quasar CLI which may have new TypeScript features.

  ```json /package.json
  {
    "scripts": {
      "postinstall": "quasar prepare"
    }
  }
  ```

### Linting (TS or JS)

We dropped support for our internal linting (quasar.config file > eslint) in favor of the [vite-plugin-checker](https://vite-plugin-checker.netlify.app/) package. We will detail below the changes that you need to make based on if you use TS or not.

#### TypeScript projects linting

```tabs
<<| bash Yarn |>>
$ yarn add --dev vite-plugin-checker vue-tsc@2 typescript
<<| bash NPM |>>
$ npm install --save-dev vite-plugin-checker vue-tsc@2 typescript
<<| bash PNPM |>>
$ pnpm add -D vite-plugin-checker vue-tsc@2 typescript
<<| bash Bun |>>
$ bun add --dev vite-plugin-checker vue-tsc@2 typescript
```

```bash [highlight=6,7] /.eslintignore
/dist
/src-capacitor
/src-cordova
/.quasar
/node_modules
.eslintrc.cjs
/quasar.config.*.temporary.compiled*
```

```diff /quasar.config file
- eslint: {
-   // ...
- },

  build: {
    vitePlugins: [
+    ['vite-plugin-checker', {
+       vueTsc: true,
+       eslint: {
+         lintCommand: 'eslint "./**/*.{js,ts,mjs,cjs,vue}"'
+       }
+     }, { server: false }]
    ]
  }
```

#### JavaScript projects linting

```tabs
<<| bash Yarn |>>
$ yarn add --dev vite-plugin-checker
<<| bash NPM |>>
$ npm install --save-dev vite-plugin-checker
<<| bash PNPM |>>
$ pnpm add -D vite-plugin-checker
<<| bash Bun |>>
$ bun add --dev vite-plugin-checker
```

```bash [highlight=6,7] /.eslintignore
/dist
/src-capacitor
/src-cordova
/.quasar
/node_modules
.eslintrc.cjs
/quasar.config.*.temporary.compiled*
```

```diff /quasar.config file
- eslint: {
-   // ...
- },

  build: {
    vitePlugins: [
+    ['vite-plugin-checker', {
+       eslint: {
+         lintCommand: 'eslint "./**/*.{js,mjs,cjs,vue}"'
+       }
+     }, { server: false }]
    ]
  }
```

### SPA / Capacitor / Cordova modes changes

No need to change anything in the `/src`, `/src-capacitor` or `/src-cordova` folders.

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
if (process.env.MODE !== 'ssr' || process.env.PROD) {
  registerRoute(
    new NavigationRoute(
      createHandlerBoundToURL(process.env.PWA_FALLBACK_HTML),
-     { denylist: [/sw\.js$/, /workbox-(.)*\.js$/] }
+     { denylist: [new RegExp(process.env.PWA_SERVICE_WORKER_REGEX), /workbox-(.)*\.js$/] }
    )
  )
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
- workboxMode?: "generateSW" | "injectManifest";
+ workboxMode?: "GenerateSW" | "InjectManifest";

- // useFilenameHashes: false,
+ // Moved to quasar.config > build > useFilenameHashes

  /**
   * Auto inject the PWA meta tags?
   * If using the function form, return HTML tags as one single string.
   * @default true
   */
- injectPwaMetaTags?: boolean;
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

### SSR mode changes

::: warning
The distributables (your production code) will be compiled to ESM form.
:::

Most changes refer to editing your `/src-ssr/server.js` file. Since you can now use HTTPS while developing your app too, you need to make the following changes to the file:

```diff /src-ssr/server.js > listen
- export const listen = ssrListen(async ({ app, port, isReady }) => {
+ // notice: devHttpsApp param which will be a Node httpsServer (on DEV only) and if https is enabled
+ // notice: no "isReady" param (starting with 2.0.0-beta.16+)
+ // notice: ssrListen() param can still be async (below it isn't)
+ export const listen = ssrListen(({ app, devHttpsApp, port }) => {
-   await isReady()
-   return app.listen(port, () => {
+   const server = devHttpsApp || app
+   return server.listen(port, () => {
      if (process.env.PROD) {
        console.log('Server listening at port ' + port)
      }
    })
  })
```

Finally, this is how it should look like now:

```js /src-ssr/server.js > listen
export const listen = ssrListen(({ app, devHttpsApp, port }) => {
  const server = devHttpsApp || app
  return server.listen(port, () => {
    if (process.env.PROD) {
      console.log('Server listening at port ' + port)
    }
  })
})
```

For a serverless approach, this is how the "listen" part should look like:

```js /src-ssr/server.js > listen
export const listen = ssrListen(({ app, devHttpsApp, port }) => {
  if (process.env.DEV) {
    const server = devHttpsApp || app;
    return server.listen(port, () => {
      console.log('Server listening at port ' + port)
    })
  }
  else { // in production
    // return an object with a "handler" property
    // that the server script will named-export
    return { handler: app }
  }
})
```

Next, the `serveStaticContent` function has changed:

```diff /src-ssr/server.js > serveStaticContent
- export const serveStaticContent = ssrServeStaticContent((path, opts) => {
-  return express.static(path, { maxAge, ...opts })
- })

+ /**
+ * Should return a function that will be used to configure the webserver
+ * to serve static content at "urlPath" from "pathToServe" folder/file.
+ *
+ * Notice resolve.urlPath(urlPath) and resolve.public(pathToServe) usages.
+ *
+ * Can be async: ssrServeStaticContent(async ({ app, resolve }) => {
+ * Can return an async function: return async ({ urlPath = '/', pathToServe = '.', opts = {} }) => {
+ */
+ export const serveStaticContent = ssrServeStaticContent(({ app, resolve }) => {
+  return ({ urlPath = '/', pathToServe = '.', opts = {} }) => {
+    const serveFn = express.static(resolve.public(pathToServe), { maxAge, ...opts })
+    app.use(resolve.urlPath(urlPath), serveFn)
+  }
+ })
```

Also, the `renderPreloadTag()` function can now take an additional parameter (`ssrContext`):

```js /src-ssr/server.js
export const renderPreloadTag = ssrRenderPreloadTag((file, { ssrContext }) => {
  // ...
})
```

For TS devs, you should also make a small change to your /src-ssr/middlewares files, like this:

```diff For TS devs
+ import { Request, Response } from 'express';
// ...
- app.get(resolve.urlPath('*'), (req, res) => {
+ app.get(resolve.urlPath('*'), (req: Request, res: Response) => {
```

There are some additions to the `/quasar.config` file too:

```diff /quasar.config file
ssr: {
  // ...

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
}
```

### Bex mode changes

No need to change anything, however we are highlighting here an addition to the `/quasar.conf` file:

```diff /quasar.config file
sourceFiles: {
+ bexManifestFile: 'src-bex/manifest.json',
  // ...
},
```

### Other /quasar.config file changes

The `ctx` from `/quasar.config` file has an additional prop (`appPaths`):

```js
import { configure } from 'quasar/wrappers'
export default configure((ctx) => ({
  // ctx.appPaths is available
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

```diff /quasar.config > eslint
eslint: {
  /**
   * Enable or disable caching of the linting results.
   * @default true
   */
+ cache?: boolean;

  /**
   * Formatter to use
   * @default 'stylish'
   */
+ formatter?: ESLint.Formatter;
}
```

```diff /quasar.config > sourceFiles
sourceFiles: {
+ bexManifestFile?: string;
}
```

```diff /quasar.config > framework
framework: {
  /**
   * Auto import - how to detect components in your vue files
   *   "kebab": q-carousel q-page
   *   "pascal": QCarousel QPage
   *   "combined": q-carousel QPage
   * @default 'kebab'
   */
  autoImportComponentCase?: "kebab" | "pascal" | "combined";

  /**
   * Auto import - which file extensions should be interpreted as referring to Vue SFC?
   * @default [ 'vue' ]
   */
+ autoImportVueExtensions?: string[];

  /**
   * Auto import - which file extensions should be interpreted as referring to script files?
   * @default [ 'js', 'jsx', 'ts', 'tsx' ]
   */
+ autoImportScriptExtensions?: string[];

  /**
   * Treeshake Quasar's UI on dev too?
   * Recommended to leave this as false for performance reasons.
   * @default false
   */
+ devTreeshaking?: boolean;
+ // was previously under /quasar.conf > build
}
```

```diff /quasar.config > build
build: {
  /**
   * Treeshake Quasar's UI on dev too?
   * Recommended to leave this as false for performance reasons.
   * @default false
   */
- devTreeshaking?: boolean;
- // moved under /quasar.conf > framework

  /**
   * Should we invalidate the Vite and ESLint cache on startup?
   * @default false
   */
- rebuildCache?: boolean;

  /**
   * Automatically open remote Vue Devtools when running in development mode.
   */
+ vueDevtools?: boolean;

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
```

### Other considerations

You might want to upgrade/switch from `@intlify/vite-plugin-vue-i18n` to the newer `@intlify/unplugin-vue-i18n`.

After removing the old package and installing the new one then update your `/quasar.config` file as follows:

```diff /quasar.config
- import path from 'node:path'
+ import { fileURLToPath } from 'node:url'

export default configure((ctx) => {
  return {
    build: {
      vitePlugins: [
-       ['@intlify/vite-plugin-vue-i18n', {
+       ['@intlify/unplugin-vue-i18n/vite', {
-         include: path.resolve(__dirname, './src/i18n/**')
+         include: [ fileURLToPath(new URL('./src/i18n', import.meta.url)) ],
+         ssr: ctx.modeName === 'ssr'
        }]
      ]
    }
  }
})
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
