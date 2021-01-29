---
title: Upgrade Guide
desc: How to upgrade Quasar from older versions to the latest one.
---

::: danger Quasar v2 beta
* Until the final stable version is released, some aspects of the framework may change. We're not planning for additional changes, but unforeseen reported issues may require us to do breaking changes (unlikely, but keep this in mind). So please make sure that you read each v2 beta version's release notes carefully before upgrading.
* Considering the above, we still recommend starting a new project with Quasar v2.
:::

## Older v2 to latest v2

### With UMD
Simply replace the version string in all the CSS and JS tags that refer to Quasar to the newer version.

### With Quasar CLI

```bash
# run these commands inside
# of a Quasar UI v2 project

# check for upgradable packages
$ quasar upgrade

# do the actual upgrade
$ quasar upgrade --install
```

::: warning Note for code editor terminals
If you're using a code editor terminal instead of the real one, you run `quasar upgrade` and get an error *Command not found* or *@quasar/cli* version appears to be *undefined*, you will need to go to the settings of your code editor terminal and untick the option (or its equivalent) *Add 'node_modules/.bin' from the project root to %PATH%* then restart your code editor.
:::

### With Vue CLI

```bash
$ yarn upgrade quasar@next
```

Optionally, you may also want to make sure that you have the latest `vue-cli-plugin-quasar` package.

It's a good idea to keep `@quasar/extras` package to its latest version too:

```bash
# optional, but recommended
$ yarn add @quasar/extras@latest
```

## Migrate to v2 from v1

### Intro

We did our best so that this transition from Quasar v1 to v2 to be as painless as possible. Don't be afraid by the length of this page as it doesn't reflects the effort that you need to put into this (we just tried to make it as complete as possible). The API of Quasar components, directives and plugins has minor changes as we kept the breaking changes to the bare minimum. We also added some new cool features for some components.

Quasar UI v2 is based on Vue 3, as opposed to previous version which was based on Vue 2. This means that your app code (Vue components, directives, etc) should be Vue 3 compliant too, not just the Quasar UI source-code. If you are using additional libraries in your app, please make sure that you have their Vue 3 versions.

Quasar UI v2 is not just a port to Vue 3 and Composition API. __There are lots of significant performance enhancements in Quasar's algorithms too!__ You'll love it!

::: warning IMPORTANT!
* No IE11 support - Vue 3 does not supports it either; if IE11 support is mandatory for your project(s), then continue using Quasar UI v1.
* Quasar Stylus variables are no longer available (only Sass/SCSS ones); this does NOT mean that you can't use Stylus anymore though.
* SSR build mode is NOT **yet** supported; if your project relies on SSR, you might want to hold off on upgrading for now.
:::

Before you start down this journey of upgrading a project from v1 to v2 you should know a few things:
1) Read the documentation before asking questions on Discord server or forums.
2) Prepare a CodePen so staff can help you.
3) Dig into the [Quasar source code](https://github.com/quasarframework/quasar/tree/vue3-work) (it'll help you understand the framework as well as teach you best practices for programming with Vue).
4) Don't use framework components as mixins unless absolutely necessary (wrap them if you need).
5) Don't target inner component stuff with CSS selectors unless absolutely necessary.
6) We recommend `yarn` whenever possible because of its speed and efficient use. However, when using globals, we still recommend using `npm`, especially if you use `nvm` (Node Version Manager).
7) Use `git` for repository management and make regular commits, it is like taking notes on the process and lets you revert to a previous state in case you get stuck.
8) Use Quasar boot files for any pre-mounting app routines.
9) Finally, become a [backer/sponsor](https://donate.quasar.dev) and get access to the special Discord support chat room for priority support. This also helps the project survive.

If you get stuck, check out the forums and visit Discord server for help. Not just from staff, but from the community as well.

::: warning Info
It should be noted that we have tried our hardest to make sure everything in the Upgrade documentation is correct. However, because this has been a manual process there are likely errors. If you find any, don't be afraid to make a PR and propose a change to that which needs to be corrected.
:::

### Initial Steps

There are two paths that you can follow and they are described below. Choose what best fit your needs. We do recommend the first option.

#### Option 1: Convert a project

::: danger Important!
This guide assumes that you are currently using a `@quasar/app` v2 project.
:::

Before starting, it might be wise to work on this on a new git branch or on a copy of your current working project.

1) **Stylus related**: Are you using Stylus and Quasar Stylus variables? Then before anything, convert all those files to Sass/SCSS (including src/css/app.styl -> src/css/app.sass or app.scss). If you will still want to use Stylus in your project (without Quasar Stylus variables), then you'll also need to install the stylus related packages (which are no longer supplied by "@quasar/app" out of the box):
  ```bash
  # only if you still want to use Stylus (but without Quasar Stylus variables)
  $ yarn add --dev stylus stylus-loader
  ```
2) **Remove** folders `.quasar`, `node_modules` and `package-lock.json` or `yarn.lock` file; this generally is not really needed, but in some cases it will avoid trouble with yarn/npm upgrading the packages for the purpose of this guide
3) **Install**: `quasar` v2 and `@quasar/app` v3 beta packages from the npm tag named "next":
  ```bash
  $ yarn add quasar@next
  $ yarn add --dev @quasar/app@next
  ```
4) If you are using ESLint, then edit `/.eslintrc.js`:
  ```js
  // old way
  extends: {
    'plugin:vue/essential' // or equivalent
  }

  // NEW way
  extends: {
    'plugin:vue/vue3-essential' // or equivalent
  }
  ```

  Also upgrade ESLint deps. Example:

  ```js
  "eslint": "^7.14.0",
  "eslint-config-standard": "^16.0.2",
  "eslint-plugin-import": "^2.19.1",
  "eslint-plugin-node": "^11.0.0",
  "eslint-plugin-promise": "^4.2.1",
  "eslint-plugin-vue": "^7.0.0",
  "eslint-webpack-plugin": "^2.4.0"
  ```
5) Follow the rest of the guide. You'll need to adapt to the breaking changes of the new versions of Vue 3, Vue Router 4, Vuex 4, Vue-i18n 9 and any other vue plugin that you are using.
6) Upgrade your other project dependencies (especially ESLint related ones).

#### Option 2: Create a project

Second option is to create a fresh project and port it to it bit by bit. We see this option as a worst case scenario (where you encounter problems with Vue 3 and Vue Router v4 rather than with Quasar itself) and we wrote about it for the completeness of this guide.

You can generate a new Quasar v2 project like below and then you can port your app bit by bit to it.

```bash
$ quasar create <folder_name> --branch next
# NOTE: the above will change when v2 is released as stable
```

### App.vue

You'll need to edit src/App.vue and remove the wrapper `<div id="q-app">`. You don't (and should NOT) need it anymore.

```html
<!-- old way -->
<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<!-- NEW way -->
<template>
  <router-view />
</template>
```

### Quasar components

#### Vue 3 and v-model

The `v-model` is now an alias to `model-value` + `@update:modelValue` combo instead of `value` + `@input`. This has impact on all Quasar components using v-model. If you're writing your components in .vue files then you don't need to worry about it as vue-loader correctly translates it for you.

Suggestion: you may want to do a search and replace for `:value` and `@input`. Please be careful on replacing the `:value` as some components (QLinearProgress, QCircularProgress) are not tied to v-model and still use `value` as property.

#### Vue 3 and scoped slots

All slots are now acting in the same manner as the scoped slots in Vue 2. If you're using Options API, then you can do a search and replace for `this.$scopedSlots` (and replace it with `this.$slots`).

#### QDrawer/QDialog/QMenu/QTooltip

Use "class" and "style" attributes instead of "content-class" / "content-style" props for the above mentioned Quasar components.

#### QBreadcrumbsEl

Removed "append" prop due to Vue Router v4 also [dropping it](https://next.router.vuejs.org/guide/migration/index.html#removal-of-append-prop-in-router-link).
Added "tag" and "ripple" properties.

#### QChatMessage

By default, the "label", "name", "text" and "stamp" are protected by XSS attacks now. This means that all of the `*-sanitize` props have been dropped as this behavior is the standard in Quasar now. Should you wish to display HTML as content for these props you now need to explicitly specify them through new Boolean props (`*-html`).

| Removed Boolean prop | New opposite equivalent Boolean prop |
| --- | --- |
| label-sanitize | label-html |
| name-sanitize | name-html |
| text-sanitize | text-html |
| stamp-sanitize | stamp-html |

#### QDate

When `@update:modelValue` event (equivalent of the old `@input`) is triggered, the contents of the first parameter no longer contains the (deprecated) `changed` prop.

#### QExpansionItem

Removed the "append" property due to Vue Router v4 also [dropping it](https://next.router.vuejs.org/guide/migration/index.html#removal-of-append-prop-in-router-link).

#### (New) Connecting to QForm

Should you wish to create your own Vue components that need to connect to a parent QForm (for validation purposes), we made it easier for you:

```js
// Composition API variant

import { useFormChild } from 'quasar'

useFormChild ({
  validate,     // Function returning a Boolean
  requiresQForm // Boolean -> if "true" and your component
                //   is not wrapped by QForm it then displays
                //   an error message
})

// some component
export default {
  setup () {
    // required! should return a Boolean
    function validate () {
      console.log('called my-comp.validate()')
      return true
    }

    useFormChild({ validate, requiresQForm: true })
  }
}
```

```js
// Options API variant

import { QFormChildBase } from 'quasar'

// some component
export default {
  mixins: [ QFormChildBase ],

  methods: {
    // required! should return a Boolean
    validate () {
      console.log('called my-comp.validate()')
      return true
    }
  },

  // ...
}
```

#### QImg

This component has been redesigned from the ground up. It now makes use of more modern API. The immediate effects are that it uses less RAM memory and runtime is much faster.

Added properties: "loading", "crossorigin", "fit", "no-spinner", "no-native-menu", "no-transition".
Removed properties: "transition", "basic" (now equivalent to "no-spinner" + "no-transition")
Changed property "no-default-spinner" to "no-spinner".

For the detailed changes, please view the API Card on [QImg](/vue-components/img#QImg-API) page.

#### QPopupEdit

Some performance improvements have been made on this component and as a result you will need to now use the default slot.

```html
<!-- old way -->
<q-popup-edit
  content-class="bg-primary text-white"
  buttons
  color="white"
  v-model="myModel"
>
  <q-input
    type="textarea"
    dark
    color="white"
    v-model="myModel"
    autofocus
  />
</q-popup-edit>
```

NEW way is below. Notice `v-slot="scope"` applied directly on `<q-popup-edit>` and using `scope.value` instead of `myModel` for the inner `<q-input>` component:

```html
<q-popup-edit
  class="bg-primary text-white"
  buttons
  color="white"
  v-model="myModel"
  v-slot="scope"
>
  <q-input
    type="textarea"
    dark
    color="white"
    v-model="scope.value"
    autofocus
    @keyup.enter="scope.set"
  />
</q-popup-edit>
```

For more details information on the usage, please read [QPopupEdit](/vue-components/popup-edit)'s page.

#### QLayout/QScrollObserver

The `@scroll` event parameter now has a slightly different content:

```js
{
  position: {
    top, left // Numbers (pixels)
  },
  direction, // String ("top", "right", "bottom" or "left")
  directionChanged, // Boolean
  inflectionPoint: { // last position when direction changed
    top, left // Numbers (pixels)
  },
  delta: { // difference since last @scroll update
    top, left // Numbers (pixels)
  }
}
```

#### QRouteTab

Added "ripple" property.

#### QScrollArea

QScrollArea has been redesigned so that it now supports both vertical and horizontal scrolling simultaneously.

* Added props: "vertical-bar-style" and "horizontal-bar-style" (that come on top of "bar-style" which is applied to both vertical and horizontal scrolling bars)
* Added props: "vertical-thumb-style" and "horizontal-thumb-style" (that come on top of "thumb-style" which is applied to both vertical and horizontal scrolling bar thumbs)
* Removed prop: "horizontal" (now obsolete as QScrollArea support both vertical and horizontal scrolling simultaneously)
* The "getScrollPosition" method now returns an Object of the form `{ top, left }` (example: `{ top: 5, left: 0 }`)
* The "setScrollPosition" and "setScrollPercentage" methods now require a new first param (named "axis" with values either "horizontal" or "vertical"): (axis, offset[, duration])

#### QScrollObserver

Replaced property "horizontal" with "axis" (String: "vertical", "horizontal", "both"; default value: "vertical").

The `@scroll` event parameter now has a slightly different content:

```js
{
  position: {
    top, left // Numbers (pixels)
  },
  direction, // String ("top", "right", "bottom" or "left")
  directionChanged, // Boolean
  inflectionPoint: { // last position when direction changed
    top, left // Numbers (pixels)
  },
  delta: { // difference since last @scroll update
    top, left // Numbers (pixels)
  }
}
```

#### QSelect

* The "option" slot params has dropped "itemEvents" prop and that information is now contained within the "itemProps". This comes naturally as a result of Vue 3 flattening the rendering function's second parameter ("on", "props" etc merged together into a single Object).
* New method: "blur()"

#### QTable

Renamed "data" property to "rows" (to solve TS conflict issue with "data" incorrectly inferred as the "data()" method of a Vue component)

#### QTable/QTree

Due to the new v-model feature of Vue 3 which replaces ".sync" modifier, the following properties need to be used differently:

| Old way | New way |
| --- | --- |
| pagination.sync="varName" | v-model:pagination="varName" |
| selected.sync="varName" | v-model:selected="varName" |
| expanded.sync="varName" | v-model:expanded="varName" |

#### QTooltip/QMenu

Added "transition-duration" property.

#### QUploader

The QUploaderBase component has been removed in favor of the "useUploader" and "useUploaderXhr" composables.

### Quasar directives

The only breaking change in this section is that **we've removed the GoBack directive**. Use the router reference instead to push/replace/go(-1).

```js
// Composition API variant
import { useRouter } from 'vue-router'

setup () {
  const $router = useRouter()

  // go back by one record, the same as $router.back()
  $router.go(-1)
}
```

```js
// Options API variant inside your component
this.$router.go(-1)
}
```

### Quasar plugins

#### Loading plugin

* Added "boxClass" property
* By default, the message is protected by XSS attacks. Should you wish to display HTML content with the "message" prop you should also specify "html: true". This is the total opposite behavior from v1, where you had prop "sanitize" (not available anymore; enabled now by default) to NOT display HTML.

#### Dialog plugin
Two things changed:

1. If you are using the Dialog plugin with a custom component, then you must now supply the component properties under "componentProps":

  ```js
  // OLD, DEPRECATED v1 way
  const dialog = this.$q.dialog({ // or Dialog.create({...})
    component: MyVueComponent,
    someProp: someValue,
    // ...
  })

  // New v2 way (Composition API)
  import { useQuasar } from 'quasar'

  setup () {
    const $q = useQuasar()
    // ...
    const dialog = $q.dialog({ // or Dialog.create({...})
      component: MyVueComponent,
      componentProps: {
        someProp: someValue,
        // ...
      }
    })
  }

  // New v2 way (Options API)
  const dialog = this.$q.dialog({ // or Dialog.create({...})
    // same as above
  })
  ```
2. The "parent" / "root" prop has been removed. Due to the Vue 3 architecture, we can no longer use a "parent" component for the provide/inject functionality. But you'll still be able to use Vue Router/Vuex/etc inside of your custom component.

#### Meta plugin

```js
// v1 way (OLD, DEPRECATED)
// some .vue file
export default {
  meta: {
    // ...definition
  }
}
```

The new way (Composition API or Options API):

```js
// Composition API variant
// for some .vue file
import { useMeta } from 'quasar'

export default {
  setup () {
    // Needs to be called directly under the setup() method!
    useMeta({
      // ...definition
    })
  }
}
```

```js
// Options API variant
// for some .vue file
import { createMetaMixin } from 'quasar'

export default {
  mixins: [
    createMetaMixin({
      // ...definition
    })
  ]
}
```

### Quasar utils

#### date utils
The object literal property names provided for methods "addToDate" and "subtractFromDate" have been normalized: [#7414](https://github.com/quasarframework/quasar/issues/7414).

| Old | New | Changed? |
| --- | --- | --- |
| year | years | **Yes** |
| month | months | **Yes** |
| days | days | - |
| hours | hours | - |
| minutes | minutes | - |
| seconds | seconds | - |
| milliseconds | milliseconds | - |

#### scroll utils

| Old method name | NEW method name |
| --- | --- |
| getScrollPosition | getVerticalScrollPosition |
| animScrollTo | animVerticalScrollTo |
| setScrollPosition | setVerticalScrollPosition |

#### color utils

Removed "getBrand" and "setBrand" from color utils. They are replaced by "getCssVar" and "setCssVar":

```js
// OLD, DEPRECATED v1 way:
import { colors } from 'quasar'

const { getBrand, setBrand } = colors
const primaryColor = getBrand('primary')
setBrand('primary', '#f3c')

// NEW v2 way:
import { getCssVar, setCssVar } from 'quasar'

const primaryColor = getCssVar('primary')
setCssVar('primary', '#f3c')
```

### Quasar language packs
We have changed the language pack filenames to reflect the standard naming used by browsers. This will allow you to use `$q.lang.getLocale()` when you want to dynamically import the Quasar language pack file.

Full list of changes: "en-us" -> "en-US", "en-gb" -> "en-GB", "az-latn" -> "az-Latn", "fa-ir" -> "fa-IR", "ko-kr" -> "ko-KR", "kur-ckb" -> "kur-CKB", "nb-no" -> "nb-NO", "pt-br" -> "pt-BR", "zh-hans" -> "zh-CN", "zh-hant" -> "zh-TW".

### Quasar UMD
* Due to the new Vue 3 architecture, the code for bootstrapping the app has changed and you will need to adapt [accordingly](/start/umd).
* There have been changes to the naming scheme of script and css tags to include. For example, the minified resources filenames now end in `.prod.js`/`.prod.css`. This is as a way to match Vue 3's own file naming.

::: tip
For an in-depth look at the necessary UMD scripts and tags, please use our [generator tool](/start/umd#Installation).
:::

### Quasar App CLI

This section refers to "@quasar/app" v3 package.

* Dropped support for `src/css/quasar.variables.styl`. Also, if you still want to use Stylus as preprocessor (but without the Quasar Stylus variables) then you need to manually yarn/npm install `stylus` and `stylus-loader` as dev dependencies into your project ("@quasar/app" does not supply them anymore).
* New quasar.conf.js > build > vueLoaderOptions prop
* The url-loader configuration has been enhanced so it now also supports "ico" files out of the box
* Removed support for quasar.conf.js > framework > `importStrategy: 'all'` since the auto import feature has become so good anyways (so it's now enabled by default).
* if you use TypeScript, update `supportTs.tsCheckerConfig.eslint` property value with `{ enabled: true, files: './src/**/*.{ts,tsx,js,jsx,vue}' }`. This is due to upstream breaking changes of `fork-ts-checker-webpack-plugin`.

Nothing changed in regards to how App Extensions work.

### Quasar Extras
Nothing changed. You can use it as for Quasar UI v1.

### Quasar Icon Genie
Nothing changed. You can use it the same way as for "@quasar/app" v1 or v2 projects.

### Vue 3

Since you will also switch to [Vue 3](https://v3.vuejs.org), it's best that you also take a look at its [migration guide](https://v3.vuejs.org/guide/migration/introduction.html) **after**  finishing reading this migration guide.

If you're using .vue files, you'll most likely have a fairly easy transition since 1) vue-loader (supplied by `@quasar/app`) is the one parsing the [SFC syntax](https://v3.vuejs.org/guide/single-file-component.html) and instructing Vue 3 what to do and 2) you can still use the Options API (although we recommend that you convert to the newer and better [Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html)).

We suggest that you first convert your project to Quasar v2 while maintaining Options API (because your components are already in Options API form and you probably want to ensure everything is working first). After this transition you can convert all your Vue components to Composition API, but in no way is this a requirement.

Vue 3 is to be used along with a new major version of [Vue Router v4](https://next.router.vuejs.org), which comes with its own [breaking changes](https://next.router.vuejs.org/guide/migration/) that you should be aware of. There's also the new [Vuex v4]().

As an example of one of the most important breaking changes when dealing with Vue 3 is how v-model works. It is now an alias to `model-value` + `@update:modelValue` combo instead of `value` + `@input`. This has impact on all Quasar components using v-model. If you're writing your components in .vue files then you don't need to worry about it as vue-loader correctly translates it for you.

### Vue Router v4

This is a Vue 3 ecosystem upstream breaking change. Update src/router files to match Vue Router v4's API. Vue Router v4 comes with its own [breaking changes](https://next.router.vuejs.org/guide/migration/index.html). Especially note below how we are dealing with the 404 error.

```js
// default src/router/index.js content:

import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'

export default function (/* { store, ssrContext } */) {
  const createHistory = process.env.MODE === 'ssr'
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })

  return Router
}
```

```js
// default src/router/routes.js content:
export default [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: Error404
  }
]

export default routes
```

If you use TypeScript, you must replace `RouteConfig` interface occurrences with `RouteRecordRaw`.

### Vuex v4

This is a Vue 3 ecosystem upstream breaking change. You'll need to update src/store files to match Vuex v4's API. Notice the "createStore" import from vuex and its usage in an example below. For informative purposes: [Vuex migration to 4.0 from 3.x](https://next.vuex.vuejs.org/guide/migrating-to-4-0-from-3-x.html)

```js
// default src/router/routes.js content:
import { createStore } from 'vuex'
// import example from './module-example'

export default function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      // example
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  return Store
}
```

### Vue-i18n v9

This is a Vue 3 ecosystem upstream breaking change. Update src/boot/i18n.js file to match Vue-i18n v9's API. Vue-i18n comes with its own [breaking changes](https://vue-i18n-next.intlify.dev/guide/migration/breaking.html).

Since this package isn't provided by `@quasar/app`, you must update the dependency in your project via `yarn add vue-i18n@rc`

```js
// default src/boot/i18n.js content:

import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'
// you'll need to create the src/i18n/index.js file too

const i18n = createI18n({
  locale: 'en-US',
  messages
})

export default ({ app }) => {
  // Set i18n instance on app
  app.use(i18n)
})

export { i18n }
```

If you use TypeScript, remove the existing augmentation of 'vue/types/vue' as it has been integrated into the upstream package.

### @vue/composition-api

If you've been using Composition API package for Vue 2, you shall now change all imports to point towards the Vue package.

  ```js
  // OLD, @vue/composition-api way
  import { defineComponent } from '@vue/composition-api'

  // New Vue 3 way
  import { defineComponent } from 'vue'
  ```

If you were using the deprecated `context.root` object, you must refactor your code to avoid using it, as it's not available anymore.

Delete `src/boot/composition-api` boot file and the corresponding entry into `quasar.conf.js`. Then uninstall the `@vue/composition-api` package:

```bash
$ yarn remove @vue/composition-api
```

If you use TypeScript, prepare to reload VSCode many times, as all upgrades will cause typings cache problems.
