---
title: Design Elements
desc: The elements for doc design.
examples: QAvatar
overline: Title overline
badge: title badge
related:
  - /style/spacing
  - /style/visibility
  - /layout/grid/column
  - /layout/grid/gutter
  - /layout/grid/flex-playground
scope:
  tree:
    l: "."
    c:
    - l: public
      e: Pure static assets (directly copied)
      url: "/quasar-cli-vite/handling-assets#static-assets-public"
    - l: src
      c:
      - l: assets/
        e: Dynamic assets (processed by Vite)
        url: "/quasar-cli-vite/handling-assets#regular-assets-src-assets"
      - l: components/
        e: ".vue components used in pages & layouts"
        url: "/start/how-to-use-vue#vue-single-file-components-sfc-"
      - l: css
        e: CSS/Sass/... files for your app
        c:
        - l: app.sass
        - l: quasar.variables.sass
          e: Quasar Sass variables for you to tweak
          url: "/style/sass-scss-variables"
      - l: layouts/
        e: Layout .vue files
        url: "/layout/layout"
      - l: pages/
        e: Page .vue files
      - l: boot/
        e: Boot files (app initialization code)
        url: "/quasar-cli-vite/boot-files"
      - l: router
        e: Vue Router
        url: "/quasar-cli-vite/routing"
        c:
        - l: index.js
          e: Vue Router definition
        - l: routes.js
          e: App Routes definitions
      - l: stores
        e: Pinia Stores (if not using Vuex)
        url: "/quasar-cli-vite/state-management-with-pinia"
        c:
        - l: index.js
          e: Pinia initialization
        - l: "<store>"
          e: Pinia stores...
        - l: "<store>..."
      - l: App.vue
        e: Root Vue component of your App
    - l: index.html
      e: Template for index.html
    - l: src-ssr/
      e: SSR specific code (like production Node webserver)
      url: "/quasar-cli-vite/developing-ssr/introduction"
    - l: src-electron/
      e: Electron specific code (like "main" thread)
      url: "/quasar-cli-vite/developing-electron-apps/introduction"
    - l: src-bex/
      e: BEX (browser extension) specific code (like "main" thread)
      url: "/quasar-cli-vite/developing-browser-extensions/introduction"
---

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do *eiusmod* tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu `fugiat nulla` pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa [qui officia](/vue-components/badge) deserunt mollit anim id est laborum.

## Heading H2

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do *eiusmod* tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu `fugiat nulla` pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa [qui officia](/vue-components/badge) deserunt mollit anim id est laborum.

### Heading H3

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do *eiusmod* tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu `fugiat nulla` pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa [qui officia](/vue-components/badge) deserunt mollit anim id est laborum.

#### Heading H4

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do *eiusmod* tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu `fugiat nulla` pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa [qui officia](/vue-components/badge) deserunt mollit anim id est laborum.

##### Heading H5

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do *eiusmod* tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu `fugiat nulla` pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa [qui officia](/vue-components/badge) deserunt mollit anim id est laborum.

###### Heading H6

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do *eiusmod* tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu `fugiat nulla` pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa [qui officia](/vue-components/badge) deserunt mollit anim id est laborum.

### Heading with badge <q-badge label="badge" />

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do *eiusmod* tempor incididunt ut labore et dolore magna aliqua.

## Containers

> For a full list of our `wonderful` people who make Quasar happen, visit the [Backers](https://github.com/quasarframework/quasar/blob/dev/backers.md) page.
> <br><br>
> * It is important that you specify all sections of a QLayout, even if you don't use them. For example, even if you don't use footer or right side drawer, still specify them within your QLayout's `view` prop.
> * When QDrawer is set into overlay mode, **it will force it to go into fixed position**, regardless if QLayout's "view" prop is configured with  "l/r" or "L/R". Also, **if on iOS platform and QLayout is containerized**, the fixed position will > also be forced upon QDrawer due to platform limitations that cannot be overcome.

::: tip Tip container title
For a full list of our `wonderful` people who make Quasar happen, visit the [Backers](https://github.com/quasarframework/quasar/blob/dev/backers.md) page.
<br><br>
* It is important that you specify all sections of a QLayout, even if you don't use them. For example, even if you don't use footer or right side drawer, still specify them within your QLayout's `view` prop.
* When QDrawer is set into overlay mode, **it will force it to go into fixed position**, regardless if QLayout's "view" prop is configured with  "l/r" or "L/R". Also, **if on iOS platform and QLayout is containerized**, the fixed position will also be forced upon QDrawer due to platform limitations that cannot be overcome.
:::

::: warning Warning container title
For a full list of our `wonderful` people who make Quasar happen, visit the [Backers](https://github.com/quasarframework/quasar/blob/dev/backers.md) page.
<br><br>
* It is important that you specify all sections of a QLayout, even if you don't use them. For example, even if you don't use footer or right side drawer, still specify them within your QLayout's `view` prop.
* When QDrawer is set into overlay mode, **it will force it to go into fixed position**, regardless if QLayout's "view" prop is configured with  "l/r" or "L/R". Also, **if on iOS platform and QLayout is containerized**, the fixed position will also be forced upon QDrawer due to platform limitations that cannot be overcome.
:::

::: danger Danger container title
For a full list of our `wonderful` people who make Quasar happen, visit the [Backers](https://github.com/quasarframework/quasar/blob/dev/backers.md) page.
<br><br>
* It is important that you specify all sections of a QLayout, even if you don't use them. For example, even if you don't use footer or right side drawer, still specify them within your QLayout's `view` prop.
* When QDrawer is set into overlay mode, **it will force it to go into fixed position**, regardless if QLayout's "view" prop is configured with  "l/r" or "L/R". Also, **if on iOS platform and QLayout is containerized**, the fixed position will also be forced upon QDrawer due to platform limitations that cannot be overcome.
:::

## Call to action button

<q-btn icon-right="launch" label="Layout Builder" href="/layout-builder" target="_blank" />

## Keyboard tokens

- macOS: <kbd>Cmd</kbd> <kbd>Alt</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Linux: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Windows: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>

## Inline example

```js
module.exports = function (ctx) { // can be async too
  console.log(ctx)

  // Example output on console:
  {
    dev: true,
    prod: false,
    mode: { spa: true },
    modeName: 'spa',
    target: {},
    targetName: undefined,
    arch: {},
    archName: undefined,
    debug: undefined
  }

  const { FOO } = process.env // ❌ It doesn't allow destructuring or similar
  process.env.FOO             // ✅ It can only replace direct usage like this

  // context gets generated based on the parameters
  // with which you run "quasar dev" or "quasar build"
}
```

```bash
/home/your_user/bin:/home/your_user/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/home/your_user/Android/Sdk/tools:/home/your_user/Android/Sdk/platform-tools
```

## Tree

<doc-tree :def="scope.tree" />

## Table

| Prop name | Description |
| --- | --- |
| `app` | Vue app instance |
| `router` | Instance of Vue Router from 'src/router/index.js' |
| `store` | Instance of the Pinia or the Vuex store - **store only will be passed if your project uses Pinia (you have src/stores) or Vuex (you have src/store)** |
| `ssrContext` | Available only on server-side, if building for SSR. [More info](/quasar-cli-vite/developing-ssr/ssr-context) |
| `urlPath` | The pathname (path + search) part of the URL. It also contains the hash on client-side. |
| `publicPath` | The configured public path. |
| `redirect` | Function to call to redirect to another URL. Accepts String (full URL) or a Vue Router location String or Object. |

## List

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do *eiusmod* tempor incididunt ut labore et dolore magna aliqua.

1. Quasar is initialized (components, directives, plugins, Quasar i18n, Quasar icon sets)
2. Quasar Extras get imported (Roboto font -- if used, icons, animations, ...)
3. Quasar CSS & your app's global CSS are imported
4. App.vue is loaded (not yet being used)
5. Store is imported (if using Pinia in src/stores or Vuex in src/store)
6. Pinia (if using) is injected into the Vue app instance
6. Router is imported (in src/router)

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do *eiusmod* tempor incididunt ut labore et dolore magna aliqua.

* It is important that you specify all sections of a QLayout, even if you don't use them. For example, even if you don't use footer or right side drawer, still specify them within your QLayout's `view` prop.
* When QDrawer is set into overlay mode, **it will force it to go into fixed position**, regardless if QLayout's "view" prop is configured with  "l/r" or "L/R". Also, **if on iOS platform and QLayout is containerized**, the fixed position will also be forced upon QDrawer due to platform limitations that cannot be overcome.

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do *eiusmod* tempor incididunt ut labore et dolore magna aliqua.

<doc-installation plugins="AppFullscreen" />

<doc-api file="QSelect" />

<doc-api file="TouchSwipe" />

<doc-api file="Loading" />

<doc-example title="Title for example card" file="StandardSizes" />
