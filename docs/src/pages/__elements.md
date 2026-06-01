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
    l: '.'
    c:
      - l: public
        e: Pure static assets (directly copied)
        url: '/quasar-cli-vite/handling-assets#static-assets-public'
      - l: src
        c:
          - l: assets/
            e: Dynamic assets (processed by Vite)
            url: '/quasar-cli-vite/handling-assets#regular-assets-src-assets'
          - l: components/
            e: '.vue components used in pages & layouts'
            url: '/start/how-to-use-vue#vue-single-file-components-sfc-'
          - l: css
            e: CSS/Sass/... files for your app
            c:
              - l: app.sass
              - l: quasar.variables.sass
                e: Quasar Sass variables for you to tweak
                url: '/style/sass-scss-variables'
          - l: layouts/
            e: Layout .vue files
            url: '/layout/layout'
          - l: pages/
            e: Page .vue files
          - l: boot/
            e: Boot files (app initialization code)
            url: '/quasar-cli-vite/boot-files'
          - l: router
            e: Vue Router
            url: '/quasar-cli-vite/page-routing-with-vue-router'
            c:
              - l: index.js
                e: Vue Router definition
              - l: routes.js
                e: App Routes definitions
          - l: stores
            e: Pinia Stores
            url: '/quasar-cli-vite/state-management-with-pinia'
            c:
              - l: index.js
                e: Pinia initialization
              - l: '<store>'
                e: Pinia stores...
              - l: '<store>...'
          - l: App.vue
            e: Root Vue component of your App
      - l: index.html
        e: Template for index.html
      - l: src-ssr/
        e: SSR specific code (like production Node.js webserver)
        url: '/quasar-cli-vite/developing-ssr/introduction'
      - l: src-electron/
        e: Electron specific code (like "main" thread)
        url: '/quasar-cli-vite/developing-electron-apps/introduction'
      - l: src-bex/
        e: BEX (browser extension) specific code (like "main" thread)
        url: '/quasar-cli-vite/developing-browser-extensions/introduction'
---

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do _eiusmod_ tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu `fugiat nulla` pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa [qui officia](/vue-components/badge) deserunt mollit anim id est laborum.

## Heading H2

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do _eiusmod_ tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu `fugiat nulla` pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa [qui officia](/vue-components/badge) deserunt mollit anim id est laborum.

### Heading H3

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do _eiusmod_ tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu `fugiat nulla` pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa [qui officia](/vue-components/badge) deserunt mollit anim id est laborum.

#### Heading H4

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do _eiusmod_ tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu `fugiat nulla` pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa [qui officia](/vue-components/badge) deserunt mollit anim id est laborum.

##### Heading H5

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do _eiusmod_ tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu `fugiat nulla` pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa [qui officia](/vue-components/badge) deserunt mollit anim id est laborum.

###### Heading H6

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do _eiusmod_ tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu `fugiat nulla` pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa [qui officia](/vue-components/badge) deserunt mollit anim id est laborum.

### Heading with badge <q-badge label="badge" />

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do _eiusmod_ tempor incididunt ut labore et dolore magna aliqua.

## Containers

> For a full list of our `wonderful` people who make Quasar happen, visit the [Backers](https://github.com/quasarframework/quasar/blob/dev/backers.md) page.
> <br><br>
>
> - It is important that you specify all sections of a QLayout, even if you don't use them. For example, even if you don't use footer or right side drawer, still specify them within your QLayout's `view` prop.
> - When QDrawer is set into overlay mode, **it will force it to go into fixed position**, regardless if QLayout's "view" prop is configured with "l/r" or "L/R". Also, **if on iOS platform and QLayout is containerized**, the fixed position will > also be forced upon QDrawer due to platform limitations that cannot be overcome.

::: tip Tip container title
For a full list of our `wonderful` people who make Quasar happen, visit the [Backers](https://github.com/quasarframework/quasar/blob/dev/backers.md) page.
<br><br>

- It is important that you specify all sections of a QLayout, even if you don't use them. For example, even if you don't use footer or right side drawer, still specify them within your QLayout's `view` prop.
- When QDrawer is set into overlay mode, **it will force it to go into fixed position**, regardless if QLayout's "view" prop is configured with "l/r" or "L/R". Also, **if on iOS platform and QLayout is containerized**, the fixed position will also be forced upon QDrawer due to platform limitations that cannot be overcome.

:::

::: warning Warning container title
For a full list of our `wonderful` people who make Quasar happen, visit the [Backers](https://github.com/quasarframework/quasar/blob/dev/backers.md) page.
<br><br>

- It is important that you specify all sections of a QLayout, even if you don't use them. For example, even if you don't use footer or right side drawer, still specify them within your QLayout's `view` prop.
- When QDrawer is set into overlay mode, **it will force it to go into fixed position**, regardless if QLayout's "view" prop is configured with "l/r" or "L/R". Also, **if on iOS platform and QLayout is containerized**, the fixed position will also be forced upon QDrawer due to platform limitations that cannot be overcome.

:::

::: danger Danger container title
For a full list of our `wonderful` people who make Quasar happen, visit the [Backers](https://github.com/quasarframework/quasar/blob/dev/backers.md) page.
<br><br>

- It is important that you specify all sections of a QLayout, even if you don't use them. For example, even if you don't use footer or right side drawer, still specify them within your QLayout's `view` prop.
- When QDrawer is set into overlay mode, **it will force it to go into fixed position**, regardless if QLayout's "view" prop is configured with "l/r" or "L/R". Also, **if on iOS platform and QLayout is containerized**, the fixed position will also be forced upon QDrawer due to platform limitations that cannot be overcome.

:::

::: details Details container title
For a full list of our `wonderful` people who make Quasar happen, visit the [Backers](https://github.com/quasarframework/quasar/blob/dev/backers.md) page.
<br><br>

- It is important that you specify all sections of a QLayout, even if you don't use them. For example, even if you don't use footer or right side drawer, still specify them within your QLayout's `view` prop.
- When QDrawer is set into overlay mode, **it will force it to go into fixed position**, regardless if QLayout's "view" prop is configured with "l/r" or "L/R". Also, **if on iOS platform and QLayout is containerized**, the fixed position will also be forced upon QDrawer due to platform limitations that cannot be overcome.

:::

## Call to action button

<q-btn icon-right="launch" label="Layout Builder" href="/layout-builder" target="_blank" />

## Keyboard tokens

- macOS: <kbd>Cmd</kbd> <kbd>Alt</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Linux: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Windows: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>

## Code containers

```js
export default function (ctx) { // can be async too
  console.log(ctx)

  // Example output on console:
  {
    dev: true,
    prod: false // [!code highlight]
  }

  const { FOO } = process.env // ❌ It doesn't allow destructuring or similar
  process.env.FOO             // ✅ It can only replace direct usage like this

  // context gets generated based on the parameters
  // with which you run "quasar dev" or "quasar build"
}
```

```js [highlight=2,5]
export default function (ctx) { // can be async too
  console.log(ctx)

  // Example output on console:
  {
    dev: true,
    prod: false
  }

  const { FOO } = process.env // ❌ It doesn't allow destructuring or similar
  process.env.FOO             // ✅ It can only replace direct usage like this

  // context gets generated based on the parameters
  // with which you run "quasar dev" or "quasar build"
}
```

```js [highlight=2,5,9,10 numbered add=3,6-7]
export default function (ctx) { // can be async too
  console.log(ctx)

  // Example output on console:
  {
    dev: true,
    prod: false
  }

  const { FOO } = process.env // ❌ It doesn't allow destructuring or similar
  process.env.FOO             // ✅ It can only replace direct usage like this

  // context gets generated based on the parameters
  // with which you run "quasar dev" or "quasar build"
}
```

```js Titled code
export default function (ctx) { // can be async too
  console.log(ctx)

  // Example output on console:
  {
    dev: true,
    prod: false
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

```js [numbered]
export default function (ctx) { // can be async too
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

```json
{
  "min": 0,
  "super": false,
  "max": 100
}
```

```json [rem=1,3 add=4]
{
  "min": 0,
  "super": false,
  "super": true,
  "max": 100
}
```

```json [numbered rem=3 add=4]
{
  "min": 0,
  "super": false,
  "super": true,
  "max": 100
}
```

```json [numbered highlight=3]
{
  "min": 0,
  "super": false,
  "max": 100
}
```

```diff
@@ -13,6 +13,8 @@ const langList = [
   { name: 'xml' },
   { name: 'nginx' },
   { name: 'html' },
+
+  // special grammars:
   { name: 'diff' }
 ]

@@ -20,6 +22,12 @@ loadLanguages(langList.map(l => l.name))

 const langMatch = langList.map(l => l.aliases || l.name).join('|')

+/**
+ * lang -> one of the supported languages (langList)
+ * attrs -> optional attributes:
+ *    * numbered - lines are numbered
+ * title -> optional card title
+ */
 const definitionLineRE = new RegExp(
   '^' +
   `(?<lang>(tabs|${ langMatch }))` + // then a language name
@@ -28,6 +36,10 @@ const definitionLineRE = new RegExp(
   '$'
 )

+/**
+ * <<| lang [attrs] [title] |>>
+ * ...content...
+ */
 const tabsLineRE = new RegExp(
   '^<<\\|\\s+' + // starts with "<<|" + at least one space char
   `(?<lang>${ langMatch })` + // then a language name
@@ -72,29 +84,65 @@ function extractTabs (content) {
       const props = tabMap[ tabName ]
       return (
         `<q-tab-panel class="q-pa-none" name="${ tabName }">` +
-        `<pre v-pre class="doc-code">${ highlight(props.content.join('\n'), props.attrs) }</pre>` +
-        '<copy-button />' +
+        highlight(props.content.join('\n'), props.attrs) +
         '</q-tab-panel>'
       )
     }).join('\n')
   }
 }

-function highlight (content, attrs) {
-  const { lang, numbered } = attrs
-  const highlightedText = prism.highlight(content, prism.languages[ lang ], lang)
+const magicCommentRE = / *\/\/\[! (?<klass>[\w-]+)\] */
+const magicCommentGlobalRE = new RegExp(magicCommentRE, 'g')

-  if (numbered === true) {
-    const lines = highlightedText.split('\n')
-    const lineCount = ('' + highlightedText.length).length
+function getLineClasses (content, highlightedLines) {
+  const lines = content.split('\n')
```

```tabs
<<| js [numbered] Config file |>>
export default function (ctx) { // can be async too
  console.log(ctx)

  // Example output on console:
  {
    dev: true,
    prod: false
  }

  const { FOO } = process.env // ❌ It doesn't allow destructuring or similar
  process.env.FOO             // ✅ It can only replace direct usage like this

  // context gets generated based on the parameters
  // with which you run "quasar dev" or "quasar build"
}
<<| js Other file |>>
const x = {
  dev: true,
  prod: false
}
```

```tabs quasar.config file
<<| js One |>>
export default function (ctx) { // can be async too
  console.log(ctx)

  // Example output on console:
  {
    dev: true,
    prod: false
  }

  const { FOO } = process.env // ❌ It doesn't allow destructuring or similar
  process.env.FOO             // ✅ It can only replace direct usage like this

  // context gets generated based on the parameters
  // with which you run "quasar dev" or "quasar build"
}
<<| js [numbered] Two (numbered) |>>
const x = {
  dev: true,
  prod: false
}
<<| diff Three (with diff) |>>
{
  min: 0
- super: false
+ super: true
  max: 100
}
```

### Collapsible regions

Wrap a block in `// #region <label>` and `// #endregion` markers and it renders folded by default. Users can expand it on demand. This is useful for hiding repetitive scaffolding (data arrays, boilerplate) that are needed to make the example run, but not so important when understanding the code. This way, the interesting parts are easier to spot. Supports all languages which uses `//`, `/* */` or `<!-- -->` as comment markers, e.g., JavaScript, CSS, HTML, etc.

```js
function heavySetup() {
  // #region boilerplate
  const a = 1
  const b = 2
  const c = 3
  // #endregion

  return a + b + c
}
```

### Twoslash (TypeScript intelligence)

Tag a fence with `ts [twoslash]` to run it through the TypeScript compiler at build time. Readers can then **hover any token** for its type and JSDoc. Use it only when it teaches something (a typed union, an inferred shape, a caught mistake). Here are the special markers:

- `// ^?` on the line below a token shows its inferred type.
- `// ^|` (caret under the cursor column) previews IDE autocompletion for a typed union at the given place.
- `// @errors: <code>` acknowledges a deliberate compile error so it renders inline instead of failing the build.
- `// @noErrors` silences all errors (handy when a `^|` value is intentionally partial).

Using `^?` and `^|` will create an overlay. It can cover important code below, or cause a scrollbar to appear if used near the bottom. To avoid this, add a few comment lines with enough leading spaces under it so that the `//` part gets behind the overlay and is not visible. Pair it with a `<!-- prettier-ignore -->` comment before the fence to prevent the formatter from removing the leading spaces.

Imports from `quasar` and `#q-app` resolve. Bare Vue `setup () {}` won't compile, wrap it in `defineComponent({ setup() {} })`.

<!-- prettier-ignore -->
```ts [twoslash]
// @errors: 2561
import { Notify } from 'quasar'

// '^?' pins an inferred type below the marked token:
const handle = Notify.create({ message: 'Hello' })
//    ^?
           //

// '@errors' renders a deliberate compile error inline:
Notify.create({ mesage: 'typo' })

// '^|' previews autocompletion. The indented `//` lines sit behind the
// dropdown and reserve room for it (placed last so it covers nothing else):
Notify.setDefaults({
  position: 'top-right'
  //         ^|
})
                  //
                  //
                  //
                  //
                  //
```

## Tree

<DocTree :def="scope.tree" />

## Table

| Prop name    | Description                                                                                                       |
| ------------ | ----------------------------------------------------------------------------------------------------------------- |
| `app`        | Vue app instance                                                                                                  |
| `router`     | Instance of Vue Router from '/src/router/index.js'                                                                |
| `store`      | Instance of Pinia - **store only will be passed if your project uses Pinia (you have /src/stores)**               |
| `ssrContext` | Available only on server-side, if building for SSR. [More info](/quasar-cli-vite/developing-ssr/ssr-context)      |
| `urlPath`    | The pathname (path + search) part of the URL. It also contains the hash on client-side.                           |
| `publicPath` | The configured public path.                                                                                       |
| `redirect`   | Function to call to redirect to another URL. Accepts String (full URL) or a Vue Router location String or Object. |

## List

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do _eiusmod_ tempor incididunt ut labore et dolore magna aliqua.

1. Quasar is initialized (components, directives, plugins, Quasar i18n, Quasar icon sets)
2. Quasar Extras get imported (Roboto font -- if used, icons, animations, ...)
3. Quasar CSS & your app's global CSS are imported
4. App.vue is loaded (not yet being used)
5. Store is imported (if using Pinia in /src/stores)
6. Pinia (if using) is injected into the Vue app instance
7. Router is imported (in /src/router)

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do _eiusmod_ tempor incididunt ut labore et dolore magna aliqua.

- It is important that you specify all sections of a QLayout, even if you don't use them. For example, even if you don't use footer or right side drawer, still specify them within your QLayout's `view` prop.
- When QDrawer is set into overlay mode, **it will force it to go into fixed position**, regardless if QLayout's "view" prop is configured with "l/r" or "L/R". Also, **if on iOS platform and QLayout is containerized**, the fixed position will also be forced upon QDrawer due to platform limitations that cannot be overcome.

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do _eiusmod_ tempor incididunt ut labore et dolore magna aliqua.

<DocInstallation plugins="AppFullscreen" />

<DocApi file="QSelect" />

<DocApi file="TouchSwipe" />

<DocApi file="Loading" />

<DocExample title="Title for example card" file="StandardSizes" />
