---
title: Upgrade Guide for Quasar CLI with Vite
desc: (@quasar/app-vite) How to upgrade Quasar CLI with Vite from older versions to the latest one.
---

## @quasar/app-vite v2

### A note to App Extensions owners

You might want to release new versions of your Quasar App Extensions with support for the new @quasar/app-vite. If you are not touching the quasar.config configuration, then it will be as easy as just changing the following:

```diff
api.compatibleWith(
  '@quasar/app-vite',
- '^1.0.0'
+ '^1.0.0 || ^2.0.0'
)
```

### Notable breaking changes

- Minimum Node.js version is now 22 (mainly due to Vite 8)
- We have shifted towards an ESM style for the whole Quasar project folder, so many default project files now require ESM code (although using `.cjs` as an extension for these files is supported, but you will most likely need to rename the extension should you not wish to change anything). One example is the `/quasar.config.js` file which now it's assumed to be ESM too (so change from `.js` to `.cjs` should you still want a CommonJs file).
- The "test" cmd was removed due to latest updates for @quasar/testing-\* packages. See [here](https://testing.quasar.dev/packages/testing/)
- The "clean" cmd has been re-designed. Type "quasar clean -h" in your upgraded Quasar project folder for more info.
- TypeScript detection is based on the quasar.config file being in TS form (quasar.config.ts) and tsconfig.json file presence.
- TypeScript `tsconfig.json` presets have been replaced by an auto-generated `.quasar/tsconfig.json` file. This is more flexible and brings new features, more on this below.
- feat+refactor(app-vite): ability to run multiple modes + dev/build simultaneously (huge effort!)
- SSR and Electron modes now build in ESM format.
- New BEX mode with significant new capabilities and ease of use (includes HMR for Chrome now!).
- Dropped support for our internal linting system (quasar.config file > eslint). Should use [vite-plugin-checker](https://vite-plugin-checker.netlify.app/) instead.
- Dropped support for Vuex. [Pinia](https://pinia.vuejs.org/) has been the official store for Vue 3 for a while now. Vuex was deprecated in app-vite v1 and it had problems with the new structure, so it's now removed. You can still use Vuex as any Vue plugin, but you will have to manage everything(installing the store, hydration, no `store` parameter in boot files, etc.) yourself and will not receive any support from Quasar CLI. You will likely have to patch Vuex in order to get it working with TypeScript. We recommend migrating to Pinia.
- **We will detail more breaking changes for each of the Quasar modes below**.

### Highlights on what's new

Some of the work below has already been backported to the old @quasar/app-vite v1, but posting here for reader's awareness.

- feat(app-vite): upgrade to Vite 8
- feat(app-vite): ability to run multiple quasar dev/build commands simultaneously (example: can run "quasar dev -m capacitor" and "quasar dev -m ssr" and "quasar dev -m capacitor -T ios" simultaneously)
- feat(app-vite): Better TS typings overall
- refactor(app-vite): port CLI to ESM format (major effort! especially to support Vite 8 and SSR)
- feat(app-vite): support for quasar.config file in multiple formats (.js, .mjs, .ts, .cjs)
- feat(app-vite): Improve quasarConfOptions, generate types for it, improve docs (fix: #14069) (#15945)
- feat(app-vite): reload app if one of the imports from quasar.config file changes
- feat(app-vite): TS detection should keep account of quasar.config file format too (quasar.config.ts)
- feat(app-vite): The shorthand CLI command "quasar dev/build -m ios/android" is now targeting Capacitor mode instead of Cordova (2.0.0-beta.12+)
- feat(app-vite): support for SSR development with HTTPS
- feat(app-vite): env dotfiles support #15303
- feat(app-vite): New quasar.config file props: build > envFolder (string) and envFiles (string[])
- feat(app-vite): reopen browser (if configured so) when changing app url through quasar.config file
- feat&perf(app-vite): faster & more accurate algorithm for determining node package manager to use
- feat(app-vite): upgrade deps
- feat(app-vite): remove workaround for bug in Electron 6-8 in cli templates (#15845)
- feat(app-vite): remove bundleWebRuntime config for Capacitor v5+
- feat(app-vite): use workbox v7 by default
- feat(app-vite): quasar.config > pwa > injectPwaMetaTags can now also be a function: (({ pwaManifest, publicPath }) => string);
- feat(app-vite): quasar.config > build > htmlMinifyOptions
- feat(app-vite): lookup open port for vue devtools when being used; ability to run multiple cli instances with vue devtools
- perf(app-vite): SSR render-template in specific esm or cjs form, according to host project; interpolation by variable
- perf(app-vite): only verify quasar.conf server address for "dev" cmd
- feat(app-vite): pick new electron inspect port for each instance
- feat(app-vite): Electron - can now load multiple preload scripts
- refactor(app-vite): AE support - better and more efficient algorithms
- feat(app-vite): AE support for ESM format
- feat(app-vite): AE support for TS format (through a build step)
- feat(app-vite): AE API new methods -> hasTypescript() / hasLint() / getStorePackageName() / getNodePackagerName()
- feat(app-vite): AE -> Prompts API (and ability for prompts default exported fn to be async)
- refactor(app-vite): the "clean" cmd now works different, since the CLI can be run in multiple instances on the same project folder (multiple modes on dev or build)
- feat(app-vite): Support for Bun as package manager #16335
- feat(app-vite): for default /src-ssr template -> prod ssr -> on error, print err stack if built with debugging enabled
- feat(app-vite): extend build > vitePlugins form (additional { server?: boolean, client?: boolean } param
- feat+refactor(app-vite): BEX -> Completely rewrote & redesigned the Quasar Bridge (with a ton of new features); Automatically infer the background script file & the content script files from the bex manifest itself; Ability to compile other js/ts files as well that you might need to dynamically load/inject; No more 3s delay when opening the popup; No more "dom" script (use content script directly); The bridge is available globally in App (/src) through the $q object or window.QBexBridge
- feat(app-vite): BEX with HMR (hot module reload) for Chrome
- feat(app-vite): support returning overrides from build > extendViteConf

### Beginning of the upgrade process

::: tip
If you are unsure that you won't skip by mistake any of the recommended changes, you can scaffold a new project folder with the @quasar/app-vite v2 at any time and then easily start porting your app from there. The bulk of the changes refer to the different project folder config files and mostly NOT to your /src files.
<br><br>

```tabs
<<| bash Yarn |>>
$ yarn create quasar
<<| bash NPM |>>
$ npm init quasar@latest
<<| bash PNPM |>>
$ pnpm create quasar@latest
<<| bash Bun |>>
$ bun create quasar@latest
```

<br>
When asked to "Pick Quasar App CLI variant", answer with: "Quasar App CLI with Vite".
:::

Preparations:

- If using the global installation of Quasar CLI (`@quasar/cli`), make sure that you have the latest one. This is due to the support of quasar.config file in multiple formats.
- Again, we highlight that the minimum supported version of Node.js is now v22 (always use the LTS versions of Node.js - the higher the version the better).

- Edit your `/package.json` on the `@quasar/app-vite` entry and assign it `^2.0.0`:

  ```diff /package.json
  "devDependencies": {
  - "@quasar/app-vite": "^1.0.0",
  + "@quasar/app-vite": "^2.0.0"
  }
  ```

  <br>
  Then yarn/npm/pnpm/bun install.
  <br><br>

- Convert your `/quasar.config.js` file to the ESM format (which is recommended, otherwise rename the file extension to `.cjs` and use CommonJs format). Also notice the wrappers import change, more on that later.

  ```diff /quasar.config.js file
  - const { configure } = require('quasar/wrappers')
  + import { defineConfig } from '#q-app/wrappers'

  - module.export = configure((ctx) => {
  + export default defineConfig((ctx) => {
      return {
        // ...
      }
    })
  ```

  ::: tip Tip on TypeScript
  You can now write this file in TS too should you wish (rename `/quasar.config.js` to `/quasar.config.ts` -- notice the `.ts` file extension).
  :::

- Set `type` to `module` in your `/package.json`. Do not overlook this step!

  ```diff /package.json
  {
  + "type": "module"
  }
  ```

  <br>

  Convert `postcss.config.js` to ESM, if it's not already in ESM format.

  ```js /postcss.config.js
  import autoprefixer from 'autoprefixer'
  // import rtlcss from 'postcss-rtlcss'

  export default {
    plugins: [
      // https://github.com/postcss/autoprefixer
      autoprefixer({
        overrideBrowserslist: [
          'last 4 Chrome versions',
          'last 4 Firefox versions',
          'last 4 Edge versions',
          'last 4 Safari versions',
          'last 4 Android versions',
          'last 4 ChromeAndroid versions',
          'last 4 FirefoxAndroid versions',
          'last 4 iOS versions'
        ]
      })

      // https://github.com/elchininet/postcss-rtlcss
      // If you want to support RTL css, then
      // 1. yarn/pnpm/bun/npm install postcss-rtlcss
      // 2. optionally set quasar.config.js > framework > lang to an RTL language
      // 3. uncomment the following line (and its import statement above):
      // rtlcss()
    ]
  }
  ```

  <br>

- You might want to add the following to your `/.gitignore` file. The `/quasar.config.*.temporary.compiled*` entry refers to files that are left for inspection purposes when something fails with your `/quasar.config` file (and can be removed by the `quasar clean` command):

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

- Make sure to update your `/quasar.config` file with the newest specs in order to satisfy the types. Check all following sections.

- If you've installed the `dotenv` package and are using it in your quasar.config file then uninstall it and use our CLIs native [dotenv support](#the-env-dotfiles-support).

  ```diff /quasar.config file
  - build: {
  -  env: require('dotenv').config().parsed
  - }
  ```

  <br>

- If you have linting, please review your setup by going to [Linter page](/quasar-cli-vite/linter). You will need to:
  1. Uninstall all your current linting packages
  2. Rename `/.eslintrc.cjs` to `/eslint.config.js` (check link above on how the new file should look)
  3. Port `/.eslintignore` to the new `/eslint.config.js`
  4. Delete `/.eslintignore`
  5. Install the new dependencies (check the link above).
  6. Edit your `/package.json` > scripts > lint:
     <br><br>

  ```diff /package.json
  "scripts": {
  -  "lint": "eslint --ext .js,.ts,.vue ./"

  // for non-TS projects:
  +  "lint": "eslint -c ./eslint.config.js \"./src*/**/*.{js,cjs,mjs,vue}\""
  // for TS projects:
  +  "lint": "eslint -c ./eslint.config.js \"./src*/**/*.{ts,js,cjs,mjs,vue}\""
  }
  ```

  <br>

- The types feature flag files will now be auto-generated in the `.quasar` folder. So, you must delete them:

  ```tabs
  <<| bash rimraf through npx (cross-platform) |>>
  # in project folder root:
  $ npx rimraf -g ./src*/*-flag.d.ts
  $ quasar prepare
  <<| bash Unix-like (Linux, macOS) |>>
  # in project folder root:
  $ rm ./src*/*-flag.d.ts
  $ quasar prepare
  ```

  <br>

- We have deprecated all the imports coming from `quasar/wrappers`. You can still use them, but we highly recommend switching to the new `#q-app/wrappers`, as shown below:

  ```diff The wrapper functions
  - import { configure } from 'quasar/wrappers'
  + import { defineConfig } from '#q-app/wrappers'

  - import { boot } from 'quasar/wrappers'
  + import { defineBoot } from '#q-app/wrappers'

  - import { preFetch } from 'quasar/wrappers'
  + import { definePreFetch } from '#q-app/wrappers'

  - import { route } from 'quasar/wrappers'
  + import { defineRouter } from '#q-app/wrappers'

  - import { store } from 'quasar/wrappers'
  + import { defineStore } from '#q-app/wrappers'

  - import { ssrMiddleware } from 'quasar/wrappers'
  + import { defineSsrMiddleware } from '#q-app/wrappers'

  - import { ssrCreate } from 'quasar/wrappers'
  + import { defineSsrCreate } from '#q-app/wrappers'

  - import { ssrListen } from 'quasar/wrappers'
  + import { defineSsrListen } from '#q-app/wrappers'

  - import { ssrClose } from 'quasar/wrappers'
  + import { defineSsrClose } from '#q-app/wrappers'

  - import { ssrServeStaticContent } from 'quasar/wrappers'
  + import { defineSsrServeStaticContent } from '#q-app/wrappers'

  - import { ssrRenderPreloadTag } from 'quasar/wrappers'
  + import { defineSsrRenderPreloadTag } from '#q-app/wrappers'
  ```

  <br>

- For **non-TS projects**, update your `/jsconfig.json` file. Yes, it contains `tsconfig` in it and it's correct.

  ```json /jsconfig.json
  {
    "extends": "./.quasar/tsconfig.json"
  }
  ```

  <br>

- For **TypeScript projects**: `@quasar/app-vite/tsconfig-preset` has been dropped, so update your `/tsconfig.json` file to extend the new auto-generated `.quasar/tsconfig.json` file. Unless you really know what you are doing, drop any other configuration and just keep `extends` as the only option in the file.

  ```diff /tsconfig.json
  {
  +  "extends": "./.quasar/tsconfig.json"
  -  "extends": "@quasar/app-vite/tsconfig-preset",
  -  "compilerOptions": {
  -    "baseUrl": "."
  -  },
  - "include": [ ... ],
  - "exclude": [ ... ]
  }
  ```

  <br>

  The underlying configuration is different now, so please review the new options in the generated file to see if you need further adjustments to your `tsconfig.json` file. Here is an example of the generated tsconfig (non strict) for reviewing purposes:
  <br>

  ```json /.quasar/tsconfig.json
  {
    "compilerOptions": {
      "esModuleInterop": true,
      "skipLibCheck": true,
      "target": "esnext",
      "allowJs": true,
      "resolveJsonModule": true,
      "moduleDetection": "force",
      "isolatedModules": true,
      "module": "preserve",
      "noEmit": true,
      "lib": [
        "esnext",
        "dom",
        "dom.iterable"
      ],
      "paths": { ... }
    },
    "exclude": [ ... ]
  }
  ```

  <br>

  If you are using ESLint, we recommend enabling `@typescript-eslint/consistent-type-imports` rules in your ESLint configuration. If you don't have linting set up, we recommend using `verbatimModuleSyntax` in your `tsconfig.json` file as an alternative (_unlike ESLint rules, it's not auto-fixable_). These changes will help you unify your imports regarding regular and type-only imports. Please read [typescript-eslint Blog - Consistent Type Imports and Exports: Why and How](https://typescript-eslint.io/blog/consistent-type-imports-and-exports-why-and-how) for more information about this and how to set it up. Here is an example:

  ```js /eslint.config.js
  rules: {
    // ...
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports' },
    ],
    // ...
  }
  ```

  <br>

  You can use `quasar.config file > build > typescript` to control the TypeScript-related behavior. Add this section into your configuration:
  <br>

  ```diff /quasar.config.ts
   build: {
  +  typescript: {
  +    strict: true, // (recommended) enables strict settings for TypeScript
  +    vueShim: true, // required when using ESLint with type-checked rules, will generate a shim file for `*.vue` files
  +    extendTsConfig (tsConfig) {
  +      // You can use this hook to extend tsConfig dynamically
  +      // For basic use cases, you can still update the usual tsconfig.json file to override some settings
  +    },
  +  }
  }
  ```

  <br>

  Most of the strict options were already enabled in the previous preset. So,
  you should be able to set the `strict` option to `true` without facing much trouble. But, if you face any issues, you can either update your code to satisfy the stricter rules or set the "problematic" options to `false` in your `tsconfig.json` file, at least until you can fix them.

  `src/quasar.d.ts` and `src/shims-vue.d.ts` files will now be auto-generated in the `.quasar` folder. So, you must delete those files:
  <br>

  ```tabs
  <<| bash rimraf through npx (cross-platform) |>>
  # in project folder root:
  $ npx rimraf src/quasar.d.ts src/shims-vue.d.ts
  <<| bash Unix-like (Linux, macOS) |>>
  # in project folder root:
  $ rm src/quasar.d.ts src/shims-vue.d.ts
  ```

  <br>

  If you are using ESLint with type-check rules, enable the `vueShim` option to preserve the previous behavior with the shim file. If your project is working fine without that option, you don't need to enable it.
  <br>

  ```diff /quasar.config.ts
  build: {
    typescript: {
  +    vueShim: true // required when using ESLint with type-checked rules, will generate a shim file for `*.vue` files
    }
  }
  ```

  <br>

  Thanks to this change, Capacitor dependencies are now properly linked to the project's TypeScript configuration. That means you won't have to install dependencies twice, once in `/src-capacitor` and once in the root folder. So, you can remove the Capacitor dependencies from the root `package.json` file. From now on, installing Capacitor dependencies only in the `/src-capacitor` folder will be enough.

  Another benefit of this change is that folder aliases(`quasar.config file > build > alias`) are automatically recognized by TypeScript. So, you can remove `tsconfig.json > compilerOptions > paths`. If you were using a plugin like `vite-tsconfig-paths`, you can uninstall it and use `quasar.config file > build > alias` as the source of truth.

  Properly running typechecking and linting requires the `.quasar/tsconfig.json` to be present. The file will be auto-generated when running `quasar dev` or `quasar build` commands. But, as a lightweight alternative, there is a new CLI command `quasar prepare` that will generate the `.quasar/tsconfig.json` file and some types files. It is especially useful for CI/CD pipelines.
  <br>

  ```bash
  $ quasar prepare
  ```

  <br>

  You can add it as a `postinstall` script to make sure it's run after installing the dependencies. This would be helpful when someone is pulling the project for the first time.
  <br>

  ```json /package.json
  {
    "scripts": {
      "postinstall": "quasar prepare"
    }
  }
  ```

  <br>

  If you are using Pinia, we are now augmenting the `router` property inside `.quasar/pinia.d.ts` automatically. So, you can remove the `router` property from the `PiniaCustomProperties` interface in the `src/stores/index.ts` file. It will continue to work as before, but it's recommended to remove it to avoid confusion.

  ```diff /src/stores/index.ts
  import { defineStore } from '#q-app/wrappers'
  import { createPinia } from 'pinia'
  - import { type Router } from 'vue-router';

  /*
   * When adding new properties to stores, you should also
   * extend the `PiniaCustomProperties` interface.
  - * @see https://pinia.vuejs.org/core-concepts/plugins.html#typing-new-store-properties
  + * @see https://pinia.vuejs.org/core-concepts/plugins.html#Typing-new-store-properties
   */
  declare module 'pinia' {
    export interface PiniaCustomProperties {
  -    readonly router: Router;
  +    // add your custom properties here, if any
    }
  }
  ```

### Capacitor / Cordova modes changes

The UI code (`/src`) can now use `process.env.TARGET` (which will be "ios" or "android").

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
- if (process.env.MODE !== 'ssr' || process.env.PROD) {
+ if (process.env.PROD) {
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
- function createWindow () {
+ async function createWindow () {
   // ...
-  mainWindow.loadURL(process.env.APP_URL)
+  if (process.env.DEV) {
+    await mainWindow.loadURL(process.env.APP_URL)
+  } else {
+    await mainWindow.loadFile('index.html')
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

async function createWindow() {
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
        path.join(
          process.env.QUASAR_ELECTRON_PRELOAD_FOLDER,
          'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION
        )
      )
    }
  })

  if (process.env.DEV) {
    await mainWindow.loadURL(process.env.APP_URL)
  } else {
    await mainWindow.loadFile('index.html')
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

```diff /src-ssr/middlewares/*
- import { ssrMiddleware } from 'quasar/wrappers'
+ import { defineSsrMiddleware } from '#q-app/wrappers'

- export default ssrMiddleware({
+ export default defineSsrMiddleware(({
  app,
  port,
  resolve,
  publicPath,
  folders,
  render,
  serve
}) => {
  // something to do with the server "app"
})
```

The other changes refer to editing your `/src-ssr/server.js` file. Since you can now use HTTPS while developing your app too, you need to make the following changes to the file:

```diff /src-ssr/server.js > listen
- import { ssrListen } from 'quasar/wrappers'
+ import { defineSsrListen } from '#q-app/wrappers'

- export const listen = ssrListen(async ({ app, port, isReady }) => {
+ // notice: devHttpsApp param which will be a Node.js httpsServer (on DEV only) and if https is enabled
+ // notice: no "isReady" param (starting with 2.0.0-beta.16+)
+ // notice: defineSsrListen() param can still be async (below it isn't)
+ export const listen = defineSsrListen(({ app, devHttpsApp, port }) => {
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
import { defineSsrListen } from '#q-app/wrappers'
export const listen = defineSsrListen(({ app, devHttpsApp, port }) => {
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
export const listen = defineSsrListen(({ app, devHttpsApp, port }) => {
  if (process.env.DEV) {
    const server = devHttpsApp || app
    return server.listen(port, () => {
      console.log('Server listening at port ' + port)
    })
  } else {
    // in production
    // return an object with a "handler" property
    // that the server script will named-export
    return { handler: app }
  }
})
```

Next, the `serveStaticContent` function has changed:

```diff /src-ssr/server.js > serveStaticContent
- import { serveStaticContent }
+ import { defineSsrServeStaticContent } from '#q-app/wrappers'

- export const serveStaticContent = ssrServeStaticContent((path, opts) => {
-  return express.static(path, { maxAge, ...opts })
- })

+ /**
+ * Should return a function that will be used to configure the webserver
+ * to serve static content at "urlPath" from "pathToServe" folder/file.
+ *
+ * Notice resolve.urlPath(urlPath) and resolve.public(pathToServe) usages.
+ *
+ * Can be async: defineSsrServeStaticContent(async ({ app, resolve }) => {
+ * Can return an async function: return async ({ urlPath = '/', pathToServe = '.', opts = {} }) => {
+ */
+ export const serveStaticContent = defineSsrServeStaticContent(({ app, resolve }) => {
+  return ({ urlPath = '/', pathToServe = '.', opts = {} }) => {
+    const serveFn = express.static(resolve.public(pathToServe), { maxAge, ...opts })
+    app.use(resolve.urlPath(urlPath), serveFn)
+  }
+ })
```

Also, the `renderPreloadTag()` function can now take an additional parameter (`ssrContext`):

```diff /src-ssr/server.js
- import { ssrRenderPreloadTag } from 'quasar/wrappers'
+ import { defineSsrRenderPreloadTag } from '#q-app/wrappers'

+ export const renderPreloadTag = defineSsrRenderPreloadTag((file, { ssrContext }) => {
+  // ...
+ })
```

For TS devs, you should also make a small change to your /src-ssr/middlewares files, like this:

```diff For TS devs
+ import { type Request, type Response } from 'express';
// ...
- app.get(resolve.urlPath('*'), (req, res) => {
+ app.get(resolve.urlPath('{*path}'), (req: Request, res: Response) => {
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

There are quite a few improvements:

- **The BEX mode now has HMR (hot module reload)!!!** (Chrome only)
- Completely rewrote & redesigned the Quasar Bridge to allow for:
  - Sending/receiving messages directly between any part of your bex (app, content scripts, background)
  - Ability to skip using the bridge altogether
  - Error handling for sending & receiving messages through the bridge
  - Better handling of internal resources to avoid memory leaks (there were some edge cases in the previous implementation)
  - Debug mode (where all the bridge communication will be outputted to the browser console)
  - Breaking changes highlights: background & content scripts initialization of the bridge; bride.on() calls when responding; bridge.send() calls
  - The bridge is now available throughout the App in `/src/` (regardless of the file used: boot files, router init, App.vue, any Vue component, ...) by accessing the `$q object` or `window.QBexBridge`
- One single manifest file from which both chrome & firefox ones can be extracted.
- Automatically infer the background script file & the content script files from the BEX manifest file.
- Ability to compile other js/ts files as well that you might need to dynamically load/inject.
- No more 3s delay when opening the popup.
- The "dom" script support was removed. Simply move your logic from there into one of your content scripts.
- New, easier API for the background/content scripts.

#### Dependencies

The `events` dependency is no longer required. If you have it installed, uninstall it:

```tabs
<<| bash Yarn |>>
$ yarn remove events
<<| bash NPM |>>
$ npm uninstall --save events
<<| bash PNPM |>>
$ pnpm remove events
<<| bash Bun |>>
$ bun remove events
```

#### CLI commands

The `quasar dev` and `quasar build` commands now require an explicit target (chrome or firefox). Should you wish to develop for both simultaneously, then you can spawn two quasar dev commands.

```bash
$ quasar dev -m bex -T <chrome|firefox>
$ quasar dev -m bex --target <chrome|firefox>

$ quasar build -m bex -T <chrome|firefox>
$ quasar build -m bex --target <chrome|firefox>
```

Note that the code in `/src` and `/src-bex` can now use `process.env.TARGET` (which will be "chrome" or "firefox").

#### HMR for Chrome

Significant improvements to the DX:

- Full HMR for devtools/options/popup page
- When changing the background script, the extension will automatically reload.
- When changing a content script, the extension will automatically reload & the tabs using those content scripts will auto-refresh.

#### The quasar.config file

```diff /quasar.config file
sourceFiles: {
+ bexManifestFile: 'src-bex/manifest.json',
  // ...
},
bex: {
- contentScripts: [] // no longer needed as scripts are
-                    // now extracted from the manifest file
+ extraScripts: []
}
```

#### The BEX manifest file

We are now supplying a way to differentiate the manifest for each target (chrome and firefox).

Notice that the manifest file now contains three root props: `all`, `chrome` & `firefox`. The manifest for chrome is deeply merged from all+chrome, while the firefox one is generated from all+firefox. You could even have different manifest versions for each target.

```json
{
  "all": {
    "manifest_version": 3,

    "icons": {
      "16": "icons/icon-16x16.png",
      "48": "icons/icon-48x48.png",
      "128": "icons/icon-128x128.png"
    },

    "permissions": ["storage", "tabs", "activeTab"],

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
        "js": ["my-content-script.js"]
      }
    ]
  },

  "chrome": {
    "background": {
      "service_worker": "background.js"
    }
  },

  "firefox": {
    "background": {
      "scripts": ["background.js"]
    }
  }
}
```

::: warning For TS devs
Your background and content scripts have the `.ts` extension. Use that extension in the manifest.json file as well! Examples: "background.ts", "my-content-script.ts". While the browser vendors do support only the `.js` extension, Quasar CLI will convert the file extensions automatically.
:::

#### The script files

```tabs Background script
<<| js New way |>>
/**
 * Importing the file below initializes the extension background.
 *
 * Warnings:
 * 1. Do NOT remove the import statement below. It is required for the extension to work.
 *    If you don't need createBridge(), leave it as "import '#q-app/bex/background'".
 * 2. Do NOT import this file in multiple background scripts. Only in one!
 * 3. Import it in your background service worker (if available for your target browser).
 */
import { createBridge } from '#q-app/bex/background'

/**
 * Call useBridge() to enable communication with the app & content scripts
 * (and between the app & content scripts), otherwise skip calling
 * useBridge() and use no bridge.
 */
const bridge = createBridge({ debug: false })
<<| js Old way |>>
import { bexBackground } from 'quasar/wrappers'

export default bexBackground((bridge /* , allActiveConnections */) => {
  // ...
})
```

```tabs Content script
<<| js New way |>>
/**
 * Importing the file below initializes the content script.
 *
 * Warning:
 *   Do not remove the import statement below. It is required for the extension to work.
 *   If you don't need createBridge(), leave it as "import '#q-app/bex/content'".
 */
import { createBridge } from '#q-app/bex/content'

// The use of the bridge is optional.
const bridge = createBridge({ debug: false })
/**
 * bridge.portName is 'content@<path>-<number>'
 *   where <path> is the relative path of this content script
 *   filename (without extension) from /src-bex
 *   (eg. 'my-content-script', 'subdir/my-script')
 *   and <number> is a unique instance number (1-10000).
 */

// Attach initial bridge listeners...

/**
 * Leave this AFTER you attach your initial listeners
 * so that the bridge can properly handle them.
 *
 * You can also disconnect from the background script
 * later on by calling bridge.disconnectFromBackground().
 *
 * To check connection status, access bridge.isConnected
 */
bridge.connectToBackground()
  .then(() => {
    console.log('Connected to background')
  })
  .catch(err => {
    console.error('Failed to connect to background:', err)
  })
<<| js Old way |>>
import { bexContent } from 'quasar/wrappers'

export default bexContent((/* bridge */) => {
  // ...
})
```

```tabs App (/src/...) vue components
<<| html Composition API + script setup |>>
<template>
  <div />
</template>

<script setup>
import { useQuasar } from 'quasar'
const $q = useQuasar()

// Use $q.bex (the bridge)
// $q.bex.portName is "app"
</script>
<<| html Composition API + script |>>
<template>
  <div />
</template>

<script>
import { useQuasar } from 'quasar'

export default {
  setup () {
    const $q = useQuasar()
    // Use $q.bex (the bridge)
    // $q.bex.portName is "app"
  }
}
</script>
<<| html Options API |>>
<template>
  <div />
</template>

<script>
export default {
  // Use this.$q.bex (the bridge)
  // this.$q.bex.portName is "app"
}
</script>
```

Please note that the devtools/popup/options page portName will be `app`.

#### The new BEX bridge

```js Bex Bridge messaging
// Listen to a message from the client
bridge.on('test', message => {
  console.log(message)
  console.log(message.payload)
  console.log(message.from)
})

// Send a message and split payload into chunks
// to avoid max size limit of BEX messages.
// Warning! This happens automatically when the payload is an array.
// If you actually want to send an Array, wrap it in an object.
bridge.send({
  event: 'test',
  to: 'app',
  payload: [ 'chunk1', 'chunk2', 'chunk3', ... ]
}).then(responsePayload => { ... }).catch(err => { ... })

// Send a message and wait for a response
bridge.send({
  event: 'test',
  to: 'background',
  payload: { banner: 'Hello from content-script' }
}).then(responsePayload => { ... }).catch(err => { ... })

// Listen to a message from the client and respond synchronously
bridge.on('test', message => {
  console.log(message)
  return { banner: 'Hello from a content-script!' }
})

// Listen to a message from the client and respond asynchronously
bridge.on('test', async message => {
  console.log(message)
  const result = await someAsyncFunction()
  return result
})
bridge.on('test', message => {
  console.log(message)
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ banner: 'Hello from a content-script!' })
    }, 1000)
  })
})

// Broadcast a message to app & content scripts
bridge.portList.forEach(portName => {
  bridge.send({ event: 'test', to: portName, payload: 'Hello from background!' })
})

// Find any connected content script and send a message to it
const contentPort = bridge.portList.find(portName => portName.startsWith('content@'))
if (contentPort) {
  bridge.send({ event: 'test', to: contentPort, payload: 'Hello from background!' })
}

// Send a message to a certain content script
bridge
  .send({ event: 'test', to: 'content@my-content-script-2345', payload: 'Hello from a content-script!' })
  .then(responsePayload => { ... })
  .catch(err => { ... })

// Listen for connection events
// (the "@quasar:ports" is an internal event name registered automatically by the bridge)
// --> ({ portList: string[], added?: string } | { portList: string[], removed?: string })
bridge.on('@quasar:ports', ({ portList, added, removed }) => {
  console.log('Ports:', portList)
  if (added) {
    console.log('New connection:', added)
  } else if (removed) {
    console.log('Connection removed:', removed)
  }
})

// Current bridge port name (can be 'background', 'app', or 'content@<name>-<xxxxx>')
console.log(bridge.portName)
```

::: warning Warning! Sending large amounts of data
All browser extensions have a hard limit on the amount of data that can be passed as communication messages (example: 50MB). If you exceed that amount on your payload, you can send chunks (**`payload` param should be an Array**).

<br>

```js
bridge.send({
  event: 'some.event',
  to: 'app',
  payload: [chunk1, chunk2, ...chunkN]
})
```

<br>

When calculating the payload size, have in mind that the payload is wrapped in a message built by the Bridge that contains some other properties too. That takes a few bytes as well. So your chunks' size should be with a few bytes below the browser's threshold.
:::

::: warning Warning! Performance on sending an Array
Like we've seen on the warning above, if `payload` is Array then the bridge will send a message for each of the Array's elements.
When you actually want to send an Array (not split the payload into chunks), this will be **VERY** inefficient.

<br>

The solution is to wrap your Array in an Object (so only one message will be sent):

<br>

```js
bridge.send({
  event: 'some.event',
  to: 'background',
  payload: {
    myArray: [
      /*...*/
    ]
  }
})
```

:::

If you encounter problems with sending messages between the BEX parts, you could enable the debug mode for the bridges that interest you. In doing so, the communication will also be outputted to the browser console:

```js Bridge debug mode
// Dynamically set debug mode
bridge.setDebug(true) // boolean

// Log a message on the console (if debug is enabled)
bridge.log('Hello world!')
bridge.log('Hello', 'world!')
bridge.log('Hello world!', { some: 'data' })
bridge.log('Hello', 'world', '!', { some: 'object' })
// Log a warning on the console (regardless of the debug setting)
bridge.warn('Hello world!')
bridge.warn('Hello', 'world!')
bridge.warn('Hello world!', { some: 'data' })
bridge.warn('Hello', 'world', '!', { some: 'object' })
```

### Other /quasar.config file changes

The `ctx` from `/quasar.config` file has an additional prop (`appPaths`):

```js
import { defineConfig } from '#q-app/wrappers'
export default defineConfig((ctx) => ({
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

export default defineConfig((ctx) => {
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
  /**
   * Folder where Quasar CLI should look for .env* files.
   * Can be an absolute path or a relative path to project root directory.
   *
   * @default project root directory
   */
  envFolder?: string;

  /**
   * Additional .env* files to be loaded.
   * Each entry can be an absolute path or a relative path to quasar.config > build > envFolder.
   *
   * @example ['.env.somefile', '../.env.someotherfile']
   */
  envFiles?: string[];

  /**
   * Filter the env variables that are exposed to the client
   * through the env files. This does not account also for the definitions
   * assigned directly to quasar.config > build > env prop.
   *
   * Requires @quasar/app-vite v2.0.3+
   */
  envFilter?:
    (env: { [index: string]: string | boolean | undefined | null })
      => { [index: string]: string | boolean | undefined | null };
}
```

Remember that you can filter out unwanted keys, or even change values for keys by using `build > envFilter`:

```js /quasar.config file
build: {
  // @quasar/app-vite v2.0.3+
  envFilter (originalEnv) {
    const newEnv = {}
    for (const key in originalEnv) {
      if (/* ...decide if it goes in or not... */) {
        newEnv[ key ] = originalEnv[ key ]
      }
    }

    // remember to return your processed env
    return newEnv
  }
}
```
