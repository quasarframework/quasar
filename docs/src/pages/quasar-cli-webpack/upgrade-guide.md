---
title: Upgrade Guide for Quasar CLI with Webpack
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
    - l: background.js
      e: (or .ts) Standard background script BEX file (auto injected via manifest.json)
    - l: manifest.json
      e: The browser extension manifest file
    - l: my-content-script.js
      e: (or .ts) Standard content script BEX file - auto injected via manifest.json (you can
        have multiple scripts)
---

## @quasar/app-webpack v4

### A note to App Extensions owners
You might want to release new versions of your Quasar App Extensions with support for the new @quasar/app-webpack. If you are not touching the quasar.config configuration, then it will be as easy as just changing the following:

```diff
api.compatibleWith(
  '@quasar/app-webpack',
- '^3.0.0'
+ '^3.0.0 || ^4.0.0'
)
```

### Notable breaking changes
* Minimum Node.js version is now 20
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
* Typescript detection is based on the presence of /tsconfig.json and typescript & ts-loader being installed.
* Dropped support for Vuex. [Pinia](https://pinia.vuejs.org/) has been the official store for Vue 3 for a while now. Vuex was deprecated in app-webpack v3 and it had problems with the new structure, so it's now removed. You can still use Vuex as any Vue plugin, but you will have to manage everything(installing the store, hydration, no `store` parameter in boot files, etc.) yourself and will not receive any support from Quasar CLI. You will likely have to patch Vuex in order to get it working with TypeScript. We recommend migrating to Pinia.
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
* feat(app-webpack): The shorthand CLI command "quasar dev/build -m ios/android" is now targeting Capacitor mode instead of Cordova (4.0.0-beta.13+)
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

::: tip
If you are unsure that you won't skip by mistake any of the recommended changes, you can scaffold a new project folder with the @quasar/app-webpack v4 at any time and then easily start porting your app from there. The bulk of the changes refer to the different project folder config files and mostly NOT to your /src files.
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
When asked to "Pick Quasar App CLI variant", answer with: "Quasar App CLI with Webpack".
:::

Preparations:

* If using the global installation of Quasar CLI (`@quasar/cli`), make sure that you have the latest one. This is due to the support of quasar.config file in multiple formats.
* Again, we highlight that the minimum supported version of Node.js is now v20 (always use the LTS versions of Node.js - the higher the version the better).

* Edit your `/package.json` on the `@quasar/app-webpack` entry and assign it `^4.0.0`:
  ```diff /package.json
  "devDependencies": {
  - "@quasar/app-webpack": "^3.0.0",
  + "@quasar/app-webpack": "^4.0.0"
  }
  ```
  <br>
  Then yarn/npm/pnpm/bun install.
  <br><br>

* Manually install `autoprefixer`. It is no longer supplied out of the box.

* If you've installed the `dotenv` package and are using it in your quasar.config file then uninstall it and use our CLIs native [dotenv support](#the-env-dotfiles-support).

  ```diff /quasar.config file
  - build: {
  -  env: require('dotenv').config().parsed
  - }
  ```
  <br>

* Make sure to update your `/quasar.config` file with the newest specs in order to satisfy the types. Check all following sections.

* If you have linting, please review your setup by going to [Linter page](/quasar-cli-webpack/linter). You will need to:
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

* Convert your `/quasar.config.js` file to the ESM format (which is recommended, otherwise rename the file extension to `.cjs` and use CommonJs format). Also notice the wrappers import change, more on that later.
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

  ::: tip Tip on Typescript
  You can now write this file in TS too should you wish (rename `/quasar.config.js` to `/quasar.config.ts` -- notice the `.ts` file extension).
  :::

* Set `type` to `module` in your `/package.json`. Do not overlook this step!
  ```diff /package.json
  {
  + "type": "module"
  }
  ```
  <br>

  ::: warning
  After setting type=module you might encounter "File not found" errors when using imports without specifying the file extension. Example: `Could not find "./routes"`. Should be `import routes from './routes.js'`. You will need to add the extension for all your imports.
  :::

  Convert `postcss.config.cjs` to ESM format and rename to `.js` extension:

  ```js /postcss.config.js
  // https://github.com/michael-ciniawsky/postcss-load-config
  import autoprefixer from 'autoprefixer'

  export default {
    plugins: [
      // to edit target browsers: use "browserslist" field in package.json
      autoprefixer
    ]
  }
  ```
  <br>

  Convert `babel.config.cjs` to ESM format and rename to `.js` extension:

  ```js /babel.config.js
  export default api => {
    return {
      presets: [
        [
          '@quasar/babel-preset-app',
          api.caller(caller => caller && caller.target === 'node')
            ? { targets: { node: 'current' } }
            : {}
        ]
      ]
    }
  }
  ```
  <br>

* For consistency with `@quasar/app-vite` (and easy switch between `@quasar/app-webpack` and it) move `/src/index.template.html` to `/index.html` and do the following changes:
  ```diff /index.html
  <body>
  - <!-- DO NOT touch the following DIV -->
  - <div id="q-app"></div>
  + <!-- quasar:entry-point -->
  </body>
  ```

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

* The types feature flag files will now be auto-generated in the `.quasar` folder. So, you must delete them:

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

* We have deprecated all the imports coming from `quasar/wrappers`. You can still use them, but we highly recommend switching to the new `#q-app/wrappers`, as shown below:

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
  + import { defineSsrMiddleware }from '#q-app/wrappers'

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

* For **non-TS projects**, update your `/jsconfig.json` file. Yes, it contains `tsconfig` in it and it's correct.

  ```json /jsconfig.json
  {
    "extends": "./.quasar/tsconfig.json"
  }
  ```

  <br>

* For **TypeScript projects**: `@quasar/app-webpack/tsconfig-preset` has been dropped, so update your `/tsconfig.json` file to extend the new auto-generated `.quasar/tsconfig.json` file. Unless you really know what you are doing, drop any other configuration and just keep `extends` as the only option in the file.

  ```diff /tsconfig.json
  {
  +  "extends": "./.quasar/tsconfig.json"
  -  "extends": "@quasar/app-webpack/tsconfig-preset",
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

  Another benefit of this change is that folder aliases(`quasar.config file > build > alias`) are automatically recognized by TypeScript. So, you can remove `tsconfig.json > compilerOptions > paths`. If you were using a plugin like `tsconfig-paths-webpack-plugin`, you can uninstall it and use `quasar.config file > build > alias` as the source of truth.

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

```tabs /src-pwa/custom-service-worker.js
<<| js New way |>>
import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'

self.skipWaiting()
clientsClaim()

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST)

cleanupOutdatedCaches()

// Non-SSR fallbacks to index.html
// Production SSR fallbacks to offline.html (except for dev)
if (process.env.MODE !== 'ssr' || process.env.PROD) {
  registerRoute(
    new NavigationRoute(
      createHandlerBoundToURL(process.env.PWA_FALLBACK_HTML),
      { denylist: [new RegExp(process.env.PWA_SERVICE_WORKER_REGEX), /workbox-(.)*\.js$/] }
    )
  )
}
<<| js Old way |>>
import { precacheAndRoute } from 'workbox-precaching'

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST)
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

async function createWindow () {
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
      // More info: https://v2.quasar.dev/quasar-cli-webpack/developing-electron-apps/electron-preload-script
      preload: path.resolve(
        currentDir,
        path.join(process.env.QUASAR_ELECTRON_PRELOAD_FOLDER, 'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION)
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
 * More info about this file:
 * https://v2.quasar.dev/quasar-cli-webpack/developing-ssr/ssr-webserver
 *
 * Runs in Node.js context.
 */

/**
 * Make sure to yarn add / npm install (in your project root)
 * anything you import here (except for express and compression).
 */
import express from 'express'
import compression from 'compression'
import {
  defineSsrCreate,
  defineSsrListen,
  defineSsrClose,
  defineSsrServeStaticContent,
  defineSsrRenderPreloadTag
} from '#q-app/wrappers'

/**
 * Create your webserver and return its instance.
 * If needed, prepare your webserver to receive
 * connect-like middlewares.
 *
 * Can be async: defineSsrCreate(async ({ ... }) => { ... })
 */
export const create = defineSsrCreate((/* { ... } */) => {
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
 *
 * Can be async: defineSsrListen(async ({ app, devHttpsApp, port }) => { ... })
 */
export const listen = defineSsrListen(({ app, devHttpsApp, port }) => {
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
 * Can be async: defineSsrClose(async ({ listenResult }) => { ... })
 */
export const close = defineSsrClose(({ listenResult }) => {
  return listenResult.close()
})

const maxAge = process.env.DEV
  ? 0
  : 1000 * 60 * 60 * 24 * 30

/**
 * Should return a function that will be used to configure the webserver
 * to serve static content at "urlPath" from "pathToServe" folder/file.
 *
 * Notice resolve.urlPath(urlPath) and resolve.public(pathToServe) usages.
 *
 * Can be async: defineSsrServeStaticContent(async ({ app, resolve }) => {
 * Can return an async function: return async ({ urlPath = '/', pathToServe = '.', opts = {} }) => {
 */
export const serveStaticContent = defineSsrServeStaticContent(({ app, resolve }) => {
  return ({ urlPath = '/', pathToServe = '.', opts = {} }) => {
    const serveFn = express.static(resolve.public(pathToServe), { maxAge, ...opts })
    app.use(resolve.urlPath(urlPath), serveFn)
  }
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
export const renderPreloadTag = defineSsrRenderPreloadTag((file/* , { ssrContext } */) => {
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

If you have `/src-ssr/middlewares/compression.js` file, delete it because this code is now embedded into `/src-ssr/server.js`. Then edit your `/quasar.config` file to remove the reference to the old file:

```diff /quasar.config file
ssr: {
  middlewares: [
-   ctx.prod ? 'compression' : '',
    'render' // keep this as last one
  ]
}
```

Example of `/src-ssr/middlewares/render.js` file content:

```js /src-ssr/middlewares/render.js
import { defineSsrMiddleware } from '#q-app/wrappers'

// This middleware should execute as last one
// since it captures everything and tries to
// render the page with Vue

export default defineSsrMiddleware(({ app, resolve, render, serve }) => {
  // we capture any other Express route and hand it
  // over to Vue and Vue Router to render our page
  app.get(resolve.urlPath('{*path}'), (req, res) => {
    res.setHeader('Content-Type', 'text/html')

    render(/* the ssrContext: */ { req, res })
      .then(html => {
        // now let's send the rendered html to the client
        res.send(html)
      })
      .catch(err => {
        // oops, we had an error while rendering the page

        // we were told to redirect to another URL
        if (err.url) {
          if (err.code) {
            res.redirect(err.code, err.url)
          } else {
            res.redirect(err.url)
          }
        } else if (err.code === 404) {
          // hmm, Vue Router could not find the requested route

          // Should reach here only if no "catch-all" route
          // is defined in /src/routes
          res.status(404).send('404 | Page Not Found')
        } else if (process.env.DEV) {
          // well, we treat any other code as error;
          // if we're in dev mode, then we can use Quasar CLI
          // to display a nice error page that contains the stack
          // and other useful information

          // serve.error is available on dev only
          serve.error({ err, req, res })
        } else {
          // we're in production, so we should have another method
          // to display something to the client when we encounter an error
          // (for security reasons, it's not ok to display the same wealth
          // of information as we do in development)

          // Render Error Page on production or
          // create a route (/src/routes) for an error page and redirect to it
          res.status(500).send('500 | Internal Server Error')

          if (process.env.DEBUGGING) {
            console.error(err.stack)
          }
        }
      })
  })
})
```

For TS devs, you should also make a small change to your /src-ssr/middlewares files, like this:

```diff For TS devs
+ import { type Request, type Response } from 'express';
// ...
- app.get(resolve.urlPath('*'), (req, res) => {
+ app.get(resolve.urlPath('{*path}'), (req: Request, res: Response) => {
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

The implementation of the BEX mode has been matched with the superior implementation from `@quasar/app-vite`. But this also means that your `/src-bex` folder has suffered significant files and folders structure changes. It would be best to temporarily copy your /src-bex folder to a safe place, then remove and add back the BEX mode:

```bash
$ quasar mode remove bex
$ quasar mode add bex
```

And then, try to understand the new structure and port your old /src-bex to it. There is unfortunately no other way to put it. Click on the blocks below to expand and see the old and the new folder structure:

::: details The *OLD* folder structure
<DocTree :def="scope.oldBexTree" />
:::

::: details The *NEW* folder structure
<DocTree :def="scope.newBexTree" />
:::

#### Improvements

There are quite a few improvements:
* **The BEX mode now has HMR (hot module reload)!!!** (Chrome only)
* Completely rewrote & redesigned the Quasar Bridge to allow for:
  * Sending/receiving messages directly between any part of your bex (app, content scripts, background)
  * Ability to skip using the bridge altogether
  * Error handling for sending & receiving messages through the bridge
  * Better handling of internal resources to avoid memory leaks (there were some edge cases in the previous implementation)
  * Debug mode (where all the bridge communication will be outputted to the browser console)
  * Breaking changes highlights: background & content scripts initialization of the bridge; bride.on() calls when responding; bridge.send() calls
  * The bridge is now available throughout the App in `/src/` (regardless of the file used: boot files, router init, App.vue, any Vue component, ...) by accessing the `$q object` or `window.QBexBridge`
* One single manifest file from which both chrome & firefox ones can be extracted.
* Automatically infer the background script file & the content script files from the BEX manifest file.
* Ability to compile other js/ts files as well that you might need to dynamically load/inject.
* No more 3s delay when opening the popup.
* The "dom" script support was removed. Simply move your logic from there into one of your content scripts.
* New, easier API for the background/content scripts.

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
* Full HMR for devtools/options/popup page
* When changing the background script, the extension will automatically reload.
* When changing a content script, the extension will automatically reload & the tabs using those content scripts will auto-refresh.

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

    "permissions": [
      "storage",
      "tabs",
      "activeTab"
    ],

    "host_permissions": [ "*://*/*" ],
    "content_security_policy": {
      "extension_pages": "script-src 'self'; object-src 'self';"
    },
    "web_accessible_resources": [
      {
        "resources": [ "*" ],
        "matches": [ "*://*/*" ]
      }
    ],

    "action": {
      "default_popup": "www/index.html"
    },

    "content_scripts": [
      {
        "matches": [ "<all_urls>" ],
        "css": [ "assets/content.css" ],
        "js": [ "my-content-script.js" ]
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
      "scripts": [ "background.js" ]
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
  payload: [ chunk1, chunk2, ...chunkN ]
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
    myArray: [ /*...*/ ]
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

The `ctx` from `/quasar.config` file has some additional props (`vueDevtools` and `appPaths`):

```js
import { defineConfig } from '#q-app/wrappers'
export default defineConfig((ctx) => ({
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

The Typescript detection is based on the tsconfig.json file presence and typescript & ts-loader being installed, so please remove the following:

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
  browser?: string | string[];
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
   * Requires @quasar/app-webpack v4.0.3+
   */
  envFilter?:
    (env: { [index: string]: string | boolean | undefined | null })
      => { [index: string]: string | boolean | undefined | null };
}
```

Remember that you can filter out unwanted keys, or even change values for keys by using `build > envFilter`:

```js /quasar.config file
build: {
  // @quasar/app-webpack v4.0.3+
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
