---
title: Upgrade Guide
desc: How to upgrade Quasar from older versions to the latest one.
---

:::tip
Quasar's v1 version is now on a stable API.
:::

## Upgrading from older v1 to latest v1

### With UMD
Simply replace the version string in all the CSS and JS tags that refer to Quasar to the newer version.

### With Quasar CLI

```bash
# run these commands inside
# of a Quasar v1 project

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
$ yarn upgrade quasar@latest
```

You may also want to make sure you have the latest of `@quasar/extras` package too:

```bash
$ yarn add @quasar/extras@latest
```

## Upgrading from 0.x to v1

Before you start down this journey of upgrading Quasar Legacy to Quasar v1 you should know a few things:
1) Read the documentation before asking questions on Discord server or forums.
2) Prepare a CodePen so staff can help you.
3) Dig into the Quasar source code (it'll help you understand the framework as well as teach you best practices for programming with Vue).
4) Don't use framework components as mixins unless absolutely necessary (wrap them if you need).
5) Don't target inner component stuff with CSS selectors unless absolutely necessary.
6) We recommend `yarn` whenever possible because of its speed and efficient use. However, when using globals, we still recommend using `npm`, especially if you use `nvm` (Node Version Manager).
7) Use `git` for repository management and make regular commits, it is like taking notes on the process and lets you revert to a previous state in case you get stuck.
8) Use Quasar boot files for any pre-mounting app routines.
9) Be very cautious when using other libraries - Quasar can't ensure they will be fully compatible
10) Finally, become a [backer/sponsor](https://donate.quasar.dev) and get access to the special Discord support chat room for priority support.

### Introduction to Upgrading

While upgrading Legacy Quasar projects appears like a reasonable choice, it may not always present itself as the best solution. Just be aware that there are alternative measures that may be faster and more efficient. For instance, sometimes it is best to create a new project and port your old project. In this manner, if you do it slowly and methodologically you can see issues and resolve them quickly. This is the opposite of upgrading a project in-place, which can break everything simultaneously. Should you go with the upgrade, we have assembled the steps needed below. However, you will still need to update any Quasar components that went through a revision to get to v1.

In either case, when you build out your project as you go through this process, you may get a build error that gives no valid information and you will have no idea what might be causing it. Should this happen to you, we recommend running `quasar build` instead of `quasar dev` as the production build will sometimes give different information (from webpack) than the dev build.

If you get stuck, check out the forums and visit Discord server for help. Not just from staff, but from the community as well.

Whichever path you take, good luck!

::: warning Info
It should be noted that we have tried our hardest to make sure everything in the Upgrade documentation is correct. However, because this has been a manual process there are likely errors. If you find any, don't be afraid to make a PR and propose a change to that which needs to be corrected.
:::

### Initial Steps

The best way to start upgrading your project is to follow these steps:

1) First, **verify** your current info with `quasar info`:
  ```bash
  Global packages
    quasar-cli                    0.17.23

  Important local packages
    quasar-cli                    0.17.23 (Quasar Framework CLI)
    quasar-framework              0.17.19 (Build responsive SPA, SSR, PWA, Hybrid Mobile Apps and Electron apps, all simultaneously using the same codebase)
    quasar-extras                 2.0.9   (Quasar Framework fonts, icons and animations)
  ```
  This shows the Legacy Quasar versions (we'll do this again at end of the steps to verify upgrade)

2) **Remove** local `quasar-cli` package
  ```bash
  $ yarn remove quasar-cli
  ```

3) **Remove** folders `.quasar`, `node_modules` and `package-lock.json` or `yarn.lock` file

4) **Install**: `quasar` and `@quasar/extras` as dependency
  ```bash
  $ yarn add quasar @quasar/extras
  ```

5) **Install**: `@quasar/app` as development dependency
  ```bash
  $ yarn add --dev @quasar/app
  ```

6) **Re-install** all the npm packages
  ```bash
  $ yarn
  ```

7) **Babel Upgrade**

  Start by **removing** the old `.babelrc` and **creating** a new `babel.config.js`

  Then update your `babel.config.js` to

  ```js
  module.exports = {
    presets: [
      '@quasar/babel-preset-app'
    ]
  }
  ```

8) **Rename** the folder `src/plugins` to `src/boot`

9) In `quasar.conf.js`: **rename** the key section `plugins` to `boot`

  ```js
  module.exports = function (ctx) {
    return {
      // app plugins (/src/plugins)
      plugins: [
      ],

  ```

  should look like this:

  ```js
  module.exports = function (ctx) {
    return {
      // app boot (/src/boot)
      boot: [
      ],

  ```

  Do not get the Quasar plugins mixed up. _Do not_ change this:

  ```js
  // Quasar plugins
  framework: {
    plugins: [ // do NOT edit here
      'Notify'
    ]
  }
  ```

10) In `quasar.conf.js`: **rename** the value `fontawesome` to `fontawesome-v5`, `mdi` to `mdi-v5` and `ionicons` to `ionicons-v4` inside the `extras` section, if you use them. Even if you don't use them it is still good practice to rename them in case you do use them in the future.

11) In `quasar.conf.js` > `framework` > `iconSet` do same **rename** replacements as above to its value (`fontawesome` to `fontawesome-v5`, `mdi` to `mdi-v5` and `ionicons` to `ionicons-v4`)

12) In `quasar.conf.js`: **rename** in `framework` > `i18n` to `lang`

13) In `quasar.conf.js`: **remove** all references to `ctx.theme`

14) **Create** the file `quasar.variables.styl` (or .sass, .scss -- recommended!) in the folder `~/src/css`, if does not already exist. Add the following to it (or move the contents from `~/src/css/themes/common.variables.styl`):

  ```stylus
  // Quasar Stylus Variables
  // --------------------------------------------------
  // To customize the look and feel of this app, you can override
  // the Stylus variables found in Quasar's source Stylus files.

  // Check documentation for full list of Quasar variables

  // It's highly recommended to change the default colors
  // to match your app's branding.
  // Tip: Use the "Theme Builder" on Quasar's documentation website.

  $primary   = #1976d2
  $secondary = #26A69A
  $accent    = #9C27B0

  $positive  = #21BA45
  $negative  = #C10015
  $info      = #31CCEC
  $warning   = #F2C037
  ```

15) In the folder `~/src/css`, **remove** the `themes` folder.

16) **Remove** the global Legacy Quasar `quasar-cli` and **install** the new `@quasar/cli`. (You will still be able to run legacy 0.17 projects with it)

**Remove** global Quasar CLI (use Yarn or NPM, depending with which you've installed it in the first place):

```bash
$ yarn global remove quasar-cli
# or (depending on what you've installed it with)
$ npm remove -g quasar-cli
```

**Install** global Quasar CLI

```bash
$ yarn global add @quasar/cli
# or
$ npm install -g @quasar/cli
```

::: tip
If you are using Yarn, make sure that the Yarn [global install location](https://yarnpkg.com/lang/en/docs/cli/global/) is in your PATH:

```bash
# in ~/.bashrc or equivalent
export PATH="$(yarn global bin):$PATH"
```
:::

17) Last, but not least, do a sanity check with `quasar info`:

  ```bash
  Global packages
    @quasar/cli - 1.0.5

  Important local packages
    quasar - 1.9.0 -- High performance, Material Design 2, full front end stack with Vue.js -- build SPA, SSR, PWA, Hybrid Mobile Apps and Electron apps, all simultaneously using the same codebase
    @quasar/app - 1.5.4 -- Quasar Framework App CLI
    @quasar/extras - 1.5.1 -- Quasar Framework fonts, icons and animations
  ```

  Notice the versions that are different from step 1.

---

> All that remains now, is fixing your pages and components for correctness.
The information below can be used as a reference.

### Build Themes

The iOS theme is no longer available, BUT as you will see, it's also not necessary anymore:
* There are examples in the docs of how to make different components look and feel like iOS
* You can hook into `$q.platform.is.ios` to help you in setting component props differently
* The new components are very easy to customize (much easier than in Legacy Quasar)

### Quasar CLI

- To create a new project use `quasar create` instead of `quasar init`
- The `--theme, -t` option is no longer available as a build option.
- `quasar describe` was added for command-line help with Quasar components, etc.
- `quasar inspect` is a new option to see generated Webpack config.
- `quasar ext` is a new option for management of Quasar App Extensions.
- `quasar new plugin ...` is now `quasar new boot ...`

### Build Output

The dist folder now strips out the `-mat` and `-ios` suffixes because there's only one theme now. As a result, `dist/spa-mat`, `dist/electron-ios`, `dist/pwa-mat` etc now become `dist/spa`, `dist/electron`, `dist/pwa`.

### Animation

- The JS and CSS animations were removed for v1. If you need them, you can add them manually to your quasar project by pulling them directly out of the v0.17 repository and adding them to your project.
- [motion.styl](https://github.com/quasarframework/quasar/blob/v0.17/src/css/core/motion.styl)
- [animate.js](https://github.com/quasarframework/quasar/blob/v0.17/src/utils/animate.js)

### Misc

- `this.$q.i18n` was changed to `this.$q.lang`
- ```import('quasar-framework/i18n/' + lang)``` was changed to ```import('quasar/lang/' + lang)``` where `lang` would be `en-us` etc.
- The language pack `en-uk` was changed to `en-gb`
- `this.$q.icons` was changed to `this.$q.iconSet`
- In previous versions you would access an imported language packs isoName with:

```js
 import('quasar/lang/' + locale).then(lang => {
   // Access the isoName with - lang.default.lang
 })
```

This now needs changing to

```js
 import('quasar/lang/' + locale).then(lang => {
   // Access the isoName with - lang.default.isoName
 })
```

### Color Palette

The colors `faded`, `dark`, `light` were removed. If you need those, re-add them in a new Stylus file.

   ```stylus
   // Variables
   $light = #bdbdbd
   $dark = #424242
   $faded = #777

   // CSS3 Root Variables
   :root
     --q-color-light $light
     --q-color-light-d darken($light, 10%)
     --q-color-faded $faded
     --q-color-dark $dark

   // CSS Classes
   .text-faded
     color $faded !important
     color var(--q-color-faded) !important
   .bg-faded
     background $faded !important
     background var(--q-color-faded) !important

   .text-light
     color $light !important
     color var(--q-color-light) !important
   .bg-light
     background $light !important
     background var(--q-color-light) !important

   .text-dark
     color $dark !important
     color var(--q-color-dark) !important
   .bg-dark
     background $dark !important
     background var(--q-color-dark) !important

   .text-faded
     color $faded !important
     color var(--q-color-faded) !important
   .bg-faded
     background $faded !important
     background var(--q-color-faded) !important
   ```

### CSS

#### Color

- The `tertiary` color was renamed to `accent`. This applies to *Brand Colors* as well as *Color List*.

<div class="row">
  <div class="inline-block q-pa-md">

|Legacy|v1|
|-|-|
|`$tertiary`|`$accent`|
|`.bg-tertiary`| `.bg-accent` |
|`.text-tertiary`|`.text-accent`|

  </div>
</div>

### Style & Identity

<div class="row">
  <div class="inline-block q-pa-md">

#### Headings

||Legacy|v1|
|-|-|-|
|h1|`.q-display-4`|`.text-h1`|
|h2|`.q-display-3`|`.text-h2`|
|h3|`.q-display-2`|`.text-h3` |
|h4|`.q-display-1`|`.text-h4` |
|h5|`.q-headline`|`.text-h5` |
|h6|`.q-title`|`.text-h6` |
||`.q-subheading`|`.text-subtitle1` or `.text-subtitle2` |
||`.q-body-1`|`.text-body1` |
||`.q-body-2`|`.text-body2` |
||`.q-caption`|`.text-caption` |
|||`.text-overline` |

  </div>
  <div class="inline-block q-pa-md">

#### Text Types

|Legacy|v1|
|-|-|
|`.quote`||

  </div>
  <div class="inline-block q-pa-md">

#### CSS Helper Classes

|Legacy|v1|
|-|-|
|`.capitalize`|`.text-capitalize`|
|`.lowercase`|`.text-lowercase`|
|`.uppercase`|`.text-uppercase`|

  </div>
  <div class="inline-block q-pa-md">

#### CSS Visibility

|Legacy|v1|
|-|-|
|`.highlight-and-fade`||
|`.mat-only`||
|`.ios-only`||
|`.mat-hide`||
|`.ios-hide`||

  </div>
  <div class="inline-block q-pa-md">

#### Mouse Related

|Legacy|v1|
|-|-|
||`.cursor-inherit`|
||`.cursor-none`|
||`.cursor-not-allowed`|

  </div>
  <div class="inline-block q-pa-md">

#### Border Related

|Legacy|v1|
|-|-|
|`.round-borders`|`.rounded-borders`|
||`.no-border`|
||`.no-border-radius`|
||`.no-box-shadow`|

  </div>
</div>

### Layout & Grid

<div class="row">
  <div class="inline-block q-pa-md">

#### Grid Row

|Legacy|v1|
|-|-|
||`.order-first`|
||`.order-none`|
||`.order-last`|
||`.offset-<size>-<columns>`|

<br>

**`size`** is one of `xs`, `sm`, `md`, `lg` or `xl`.<br>
**`columns`** is 1 through 12

  </div>
  <div class="inline-block q-pa-md">

#### Grid Column

|Legacy|v1|
|-|-|
||`.col-auto`|
||`.col-xs-auto`|
||`.col-sm-auto`|
||`.col-md-auto`|
||`.col-lg-auto`|
||`.col-xl-auto`|
||`.col-shrink`|

  </div>
  <div class="inline-block q-pa-md">

#### Grid Gutter

|Legacy|v1|
|-|-|
|`.gutter-xs`|`.q-gutter-xs`|
|`.gutter-sm`|`.q-gutter-sm`|
|`.gutter-md`|`.q-gutter-md`|
|`.gutter-lg`|`.q-gutter-lg`|
|`.gutter-xl`|`.q-gutter-xl`|
||`.q-gutter-none`|
||`.q-col-gutter-xs`|
||`.q-col-gutter-sm`|
||`.q-col-gutter-md`|
||`.q-col-gutter-lg`|
||`.q-col-gutter-xl`|

  </div>
</div>

### Directives

- BackToTop **was dropped** in favor of [Page Scroller](/layout/page-scroller).

<div class="row">
  <div class="inline-block q-pa-md">

|Legacy|v1|
|-|-|
|`v-close-overlay`|`v-close-popup`|
|`v-back-to-top`||

  </div>
</div>

If you are using the new [QMenu](/vue-components/menu) component, you can alternatively use the `auto-close` property.

### Plugins

#### Action Sheet

- renamed to [**Bottom Sheet**](/quasar-plugins/bottom-sheet)

#### Local/Session Storage

The structure looks the same, but some functions have been renamed.

<div class="row">
  <div class="inline-block q-pa-md">

|Legacy|v1|
|-|-|
|`LocalStorage.get.item(key)`|`LocalStorage.getItem(key)`|
|`SessionStorage.get.item(key)`|`SessionStorage.getItem(key)`|
|`this.$q.localStorage.get.item(key)`|`this.$q.localStorage.getItem(key)`|
|`this.$q.sessionStorage.get.item(key)`|`this.$q.sessionStorage.getItem(key)`|

  </div>
</div>

### Components

- The components below are in alphabetical order for easier access.

#### QActionSheet

- **was dropped** in favor of [BottomSheet](/quasar-plugins/bottom-sheet) (from code) or using a [QDialog](/vue-components/dialog) with `position="bottom"` (from the template).

#### QAlert

- **replaced** by [QBanner](/vue-components/banner)
- The properties `type` and `color` are now managed by a [background css class](/style/color-palette#using-as-css-classes).

<div class="row">
  <div class="inline-block q-pa-md">

**QBanner Properties**

|Legacy|v1|
|-|-|
|`actions`||
|`avatar`||
|`color`||
|`detail`||
|`icon`||
|`message`||
|`text-color`||
|`type`||
||`dense`|
||`inline-actions`|
||`rounded`|

  </div>
  <div class="inline-block q-pa-md">

**QBanner Slots**

|Legacy|v1|
|-|-|
||`default`|
||`avatar`|
||`action`|

  </div>
</div>

#### QAutocomplete

- **removed**, built into [QSelect](/vue-components/select#filtering-and-autocomplete), which is far more powerfull and offers a lot more options for your autocomplete needs; make sure you get accustomed to all the features of QSelect

#### QBreadcrumbs

<div class="row">
  <div class="inline-block q-pa-md">

**QBreadcrumbs Properties**

|Legacy|v1|
|-|-|
|`color`||
||`gutter`|
||`separator-color`|

  </div>
</div>

#### QBreadcrumbsEl

<div class="row">
  <div class="inline-block q-pa-md">

**QBreadcrumbsEl Properties**

|Legacy|v1|
|-|-|
|`color`||
|`event`||

  </div>
</div>

#### QBtn

- Type of `align` was changed from `string` to `any`
- Type of `tabindex` was changed from `number` to `number|string`

<div class="row">
  <div class="inline-block q-pa-md">

**QBtn Properties**

|Legacy|v1|
|-|-|
|`no-ripple`||
|`repeat-timeout`||
|`wait-for-ripple`||
||`ripple`|
||`stack`|
||`stretch`|
||`unelevated`|

  </div>
</div>

#### QBtnDropdown

- Type of `align` was changed from `string` to `any`
- Type of `tabindex` was changed from `number` to `number|string`

<div class="row">
  <div class="inline-block q-pa-md">

**QBtnDropdown Properties**

|Legacy|v1|
|-|-|
|`dark-percentage`||
|`no-ripple`||
|`percentage`||
|`popover-anchor`||
|`popover-self`||
|`repeat-timeout`||
|`wait-for-ripple`||
||`auto-close`|
||`cover`|
||`menu-anchor`|
||`menu-self`|
||`persistent`|
||`ripple`|
||`stack`|
||`stretch`|
||`unelevated`|

  </div>
  <div class="inline-block q-pa-md">

**QBtnDropdown Events**

|Legacy|v1|
|-|-|
||`@before-hide(evt)`|
||`@before-show(evt)`|
||`@hide(evt)`|
||`@show(evt)`|

  </div>
  <div class="inline-block q-pa-md">

**QBtnDropdown Methods**

|Legacy|v1|
|-|-|
||`hide(evt)`|
||`show(evt)`|
||`toggle(evt)`|

  </div>
</div>

#### QBtnGroup

<div class="row">
  <div class="inline-block q-pa-md">

**QBtnGroup Properties**

|Legacy|v1|
|-|-|
||`glossy`|
||`stretch`|
||`unelevated`|

  </div>
  <div class="inline-block q-pa-md">

  </div>
</div>

#### QBtnToggle

<div class="row">
  <div class="inline-block q-pa-md">

**QBtnToggle Properties**

|Legacy|v1|
|-|-|
|`no-ripple`||
|`wait-for-ripple`||
||`ripple`|
||`stack`|
||`stretch`|
||`unelevated`|

  </div>
</div>

#### QCard

<div class="row">
  <div class="inline-block q-pa-md">

**QCard Properties**

|Legacy|v1|
|-|-|
|`color`||
|`inline`||
|`text-color`||
||`bordered`|

  </div>
  <div class="inline-block q-pa-md">

**QCard Slots**

|Legacy|v1|
|-|-|
|`overlay`||

  </div>
</div>

#### QCardTitle

- **removed**, use QCardSection of [QCard](/vue-components/card)

#### QCardMain

- **removed**, use QCardSection of [QCard](/vue-components/card)

#### QCardMedia

- **removed**, use QCardSection of [QCard](/vue-components/card) or directly place an `<img>` or QParallax.

#### QCardSeparator

- **removed**, use [QSeparator](/vue-components/separator)

#### QCarousel

- Type of `thumbnails` was changed from `array` to `boolean`

<div class="row">
  <div class="inline-block q-pa-md">

**QCarousel Properties**

|Legacy|v1|
|-|-|
|`animation`||
|`color`||
|`easing`||
|`handle-arrow-keys`||
|`no-swipe`||
|`quick-nav`||
|`quick-nav-icon`||
|`quick-nav-position`||
|`swipe-easing`||
|`thumbnails-horizontal`||
|`thumbnails-icon`||
||`animated`|
||`control-color`|
||`navigation`|
||`navigation-icon`|
||`next-icon`|
||`padding`|
||`prev-icon`|
||`swipeable`|
||`transition-next`|
||`transition-prev`|

  </div>
  <div class="inline-block q-pa-md">

**QCarousel Events**

|Legacy|v1|
|-|-|
|`@input(index)`|`@input(value)`|
|`@slide`||
|`@slide-trigger`||
||`@before-transition`|
||`transition`|

  </div>
  <div class="inline-block q-pa-md">

**QCarousel Methods**

|Legacy|v1|
|-|-|
|`goToSlide(slideNum)`|`goTo(panelName)`|

  </div>
  <div class="inline-block q-pa-md">

**QCarousel Slots**

|Legacy|v1|
|-|-|
|`control-button`||
|`control-full`||
|`control-nav`||
|`control-progress`||
|`quick-nav`||

  </div>
</div>

#### QCarouselControl

- Type of `offset` was changed from `array of 2 numbers` to `array`

#### QCarouselSlide

<div class="row">
  <div class="inline-block q-pa-md">

**QCarouselSlide Properties**

|Legacy|v1|
|-|-|
||`disable`|
||`name`|

  </div>
</div>

#### QChatMessage

- Type of `size` was changed from `array` to `string`
- Type of `text` was changed from `array` to `string`


#### QCheckbox

- Type of `val` was changed from `object` to `any`

<div class="row">
  <div class="inline-block q-pa-md">

**QCheckbox Properties**

|Legacy|v1|
|-|-|
|`checked-icon`||
|`indeterminate-icon`||
|`no-focus`||
|`readonly`||
|`unchecked-icon`||
||`dense`|
||`tabindex`|

  </div>
  <div class="inline-block q-pa-md">

**QCheckbox Methods**

|Legacy|v1|
|-|-|
||`toggle()`|

  </div>
</div>

#### QChip

<div class="row">
  <div class="inline-block q-pa-md">

**QChip Properties**

|Legacy|v1|
|-|-|
|`avatar`||
|`closable`||
|`detail`||
|`floating`||
|`pointing`||
|`small`||
|`tag`||
||`clickable`|
||`disable`|
||`label`|
||`outline`|
||`removable`|
||`ripple`|
||`selected`|
||`tabindex`|

  </div>
  <div class="inline-block q-pa-md">

**QChip Events**

|Legacy|v1|
|-|-|
|`@hide()`||
||`@update:selected(state)`|
||`@remove(state)`|

  </div>
</div>

#### QChipsInput

- **removed**, built into [QSelect](/vue-components/select)

#### QCollapsible

- **replaced** by [QExpansionItem](/vue-components/expansion-item)

<div class="row">
  <div class="inline-block q-pa-md">

**QExpansionItem Properties**

|Legacy|v1|
|-|-|
||`active-class`|
||`append`|
||`caption`|
||`content-inset-level`|
||`dark`|
||`default-opened`|
||`dense`|
||`dense-toggle`|
||`disable`|
||`duration`|
||`exact`|
||`exact-active-class`|
||`expand-icon`|
||`expand-icon-class`|
||`expand-icon-toggle`|
||`expand-separator`|
||`group`|
||`header-class`|
||`header-inset-level`|
||`header-style`|
||`icon`|
||`label`|
||`popup`|
||`switch-toggle-side`|
||`to`|
||`replace`|

  </div>
  <div class="inline-block q-pa-md">

**QExpansionItem Events**

|Legacy|v1|
|-|-|
||`@before-hide(evt)`|
||`@before-show(evt)`|
||`@hide(evt)`|
||`@input(value)`|
||`@show(evt)`|

  </div>
  <div class="inline-block q-pa-md">

**QExpansionItem Methods**

|Legacy|v1|
|-|-|
||`show(evt)`|
||`toggle(evt)`|
||`hide(evt)`|

  </div>
  <div class="inline-block q-pa-md">

**QExpansionItem Slots**

|Legacy|v1|
|-|-|
||`header`|

  </div>
</div>

#### QColorPicker

- **replaced** by [QColor](/vue-components/color)
- Type of `default-value` was changed from `string|object` to `string`

<div class="row">
  <div class="inline-block q-pa-md">

**QColor Properties**

|Legacy|v1|
|-|-|
|`after`||
|`align`||
|`before`||
|`cancel-label`||
|`clear-value`||
|`clearable`||
|`color`||
|`display-value`||
|`error`||
|`float-label`||
|`hide-underline`||
|`inverted`||
|`inverted-light`||
|`modal`||
|`no-parent-value`||
|`ok-label`||
|`placeholder`||
|`popover`||
|`prefix`||
|`stack-label`||
|`suffix`||
|`warning`||

  </div>
  <div class="inline-block q-pa-md">

**QColor Events**

|Legacy|v1|
|-|-|
|`@clear(clearVal)`||

  </div>
  <div class="inline-block q-pa-md">

**QColor Methods**

|Legacy|v1|
|-|-|
|`clear()`||
|`hide()`||
|`show()`||
|`toggle()`||

  </div>
</div>

#### QContextMenu

- **removed**, use [QMenu](/vue-components/menu) with `context-menu` prop

#### QDatePicker

- **replaced** by [QDate](/vue-components/date)

<div class="row">
  <div class="inline-block q-pa-md">

**QDate Properties**

|Legacy|v1|
|-|-|
||`color`|
||`dark`|
||`disable`|
||`disable-year-month`|
||`event-color`|
||`events`|
||`first-day-of-week`|
||`landscape`|
||`minimal`|
||`options`|
||`readonly`|
||`text-color`|
||`today-btn`|

  </div>
</div>


#### QDatetime

- **removed**, use [QDate](/vue-components/date) and [QTime](/vue-components/time)

#### QDatetimePicker

- **removed**, use [QDate](/vue-components/date) and [QTime](/vue-components/time)

#### QDialog

<div class="row">
  <div class="inline-block q-pa-md">

**QDialog Properties**

|Legacy|v1|
|-|-|
|`cancel`||
|`color`||
|`ok`||
|`message`||
|`options`||
|`prevent-close`|`persistent`|
|`prompt`||
|`stack-buttons`||
|`title`||
||`content-class`|
||`content-style`|
||`full-height`|
||`full-width`|
||`maximized`|
||`seamless`|
||`no-refocus`|
||`no-focus`|
||`auto-close`|
||`transition-hide`|
||`transition-show`|

  </div>
  <div class="inline-block q-pa-md">

**QDialog Events**

|Legacy|v1|
|-|-|
|`@ok()`||
|`@cancel()`||
|`@hide()`||
|`@show()`||
||`@before-hide`|
||`@before-show`|
||`@shake`|

  </div>
  <div class="inline-block q-pa-md">

**QDialog Methods**

|Legacy|v1|
|-|-|
||`hide(evt)`|
||`show(evt)`|
||`toggle(evt)`|

  </div>
  <div class="inline-block q-pa-md">

**QDialog Slots**

|Legacy|v1|
|-|-|
|`body`||
|`buttons`||
|`message`||
|`title`||

  </div>
</div>

#### QFab (Floating Action Button)

<div class="row">
  <div class="inline-block q-pa-md">

**QFab Events**

|Legacy|v1|
|-|-|
|`@hide()`||
|`@show()`||
||`@before-hide(evt)`|
||`@before-show(evt)`|

  </div>
  <div class="inline-block q-pa-md">

**QFab Slots**

|Legacy|v1|
|-|-|
||`tooltip`|

  </div>
</div>

#### QFabAction


#### QField

- **updated**, **completely new**
- Do NOT use to wrap QInput or QSelect; the functionality of QField is now built into [QInput](/vue-components/input) and [QSelect](/vue-components/select).

If you use it to wrap Input, just move all attributes from QField to QInput. If you use `error` and `error-label`, enable `bottom-slots` on QInput and change `error-label` to `error-message`.

#### QIcon

<div class="row">
  <div class="inline-block q-pa-md">

**QIcon Properties**

|Legacy|v1|
|-|-|
||`left`|
||`right`|

  </div>
</div>

#### QInfiniteScroll

Replace `:handler` with `@load`.

<div class="row">
  <div class="inline-block q-pa-md">

**QInfiniteScroll Properties**

|Legacy|v1|
|-|-|
|`handler`||
|`inline`||
||`disable`|

  </div>
  <div class="inline-block q-pa-md">

**QInfiniteScroll Events**

|Legacy|v1|
|-|-|
||`@load(index, done)`|

  </div>
  <div class="inline-block q-pa-md">

**QInfiniteScroll Methods**

|Legacy|v1|
|-|-|
|`loadMore()`|`trigger`|
||`updateScrollTarget`|

  </div>
  <div class="inline-block q-pa-md">

**QInfiniteScroll Slots**

|Legacy|v1|
|-|-|
|`message`|`loading`|

  </div>
</div>

#### QInnerLoading

- Type of `size` was changed from `string|number` to `string`

<div class="row">
  <div class="inline-block q-pa-md">

**QInnerLoading Properties**

|Legacy|v1|
|-|-|
|`visible`||
||`showing`|
||`transition-hide`|
||`transition-show`|

  </div>
</div>

#### QInput

- Type of `stack-label` was changed from `string` to `boolean`
- Type of `autofocus` was changed from `boolean|string` to `boolean`

<div class="row">
  <div class="inline-block q-pa-md">

**QInput Properties**

|Legacy|v1|
|-|-|
|`after`||
|`align`||
|`before`||
|`clear-value`||
|`decimals`||
|`float-label`||
|`hide-underline`||
|`initial-show-password`||
|`inverted`||
|`inverted-light`||
|`lower-case`||
|`max-height`||
|`no-parent-field`||
|`no-pass-toggle`||
|`numeric-keyboard-toggle`||
|`step`||
|`upper-case`||
|`warning`||
||`autogrow`|
||`bg-color`|
||`borderless`|
||`bottom-slots`|
||`counter`|
||`debounce`|
||`dense`|
||`error-message`|
||`fill-mask`|
||`filled`|
||`hide-hint`|
||`hint`|
||`input-class`|
||`input-style`|
||`items-aligned`|
||`label`|
||`lazy-rules`|
||`mask`|
||`maxlength`|
||`outlined`|
||`rounded`|
||`rules`|
||`square`|
||`standout`|
||`unmasked-value`|

  </div>
  <div class="inline-block q-pa-md">

**QInput Methods**

|Legacy|v1|
|-|-|
|`clear()`||
|`select()`||
|`togglePass()`||
||`resetValidation()`|
||`validate(value)`|

  </div>
  <div class="inline-block q-pa-md">

**QInput Slots**

|Legacy|v1|
|-|-|
||`prepend`|
||`append`|
||`before`|
||`after`|
||`error`|
||`hint`|
||`counter`|

  </div>
</div>

#### QItem

<div class="row">
  <div class="inline-block q-pa-md">

**QItem Properties**

|Legacy|v1|
|-|-|
|`event`||
|`highlight`||
|`inset-separator`||
|`link`||
|`multiline`||
|`separator`||
|`sparse`||
||`clickable`|
||`disabled`|
||`focused`|
||`inset-level`|
||`manual-focus`|
||`tabindex`|

  </div>
  <div class="inline-block q-pa-md">

**QItem Events**

|Legacy|v1|
|-|-|
||`@click(evt)`|
||`@keyup(evt)`|

  </div>
</div>

#### QItemMain

- **removed**, use [QItemLabel](/vue-components/list-and-list-items)

#### QItemSeparator

- **replaced** by [QSeparator](/vue-components/separator)

<div class="row">
  <div class="inline-block q-pa-md">

**QSeparator Properties**

|Legacy|v1|
|-|-|
||`color`|
||`dark`|
||`inset`|
||`spaced`|
||`vertical`|

  </div>
</div>

#### QItemSide

- **removed**, use [QItemSection](/vue-components/list-and-list-items)

#### QItemTile

- **removed**, use [QItemSection](/vue-components/list-and-list-items)
- `QItemTile` with `label` property, use [QItemLabel](/vue-components/list-and-list-items) with `header` property
- `QItemTile` with `sublabel` property, use [QItemLabel](/vue-components/list-and-list-items) with `caption` property

#### QJumbotron

- **removed**, use [QCard](/vue-components/card)

#### QKnob

<div class="row">
  <div class="inline-block q-pa-md">

**QKnob Properties**

|Legacy|v1|
|-|-|
|`decimals`||
|`line-width`||
||`angle`|
||`center-color`|
||`font-size`|
||`show-value`|
||`tabindex`|
||`thickness`|

  </div>
</div>

#### QLayout

<div class="row">
  <div class="inline-block q-pa-md">

**QLayout Properties**

|Legacy|v1|
|-|-|
|`@resize()`|`@resize(size)`|
|`@scroll()`|`@scroll(details)`|
|`@scroll-height()`|`@scroll-height(height)`|

  </div>
</div>

#### QLayoutDrawer

- **renamed** to **QDrawer**

<div class="row">
  <div class="inline-block q-pa-md">

**QDrawer Properties**

|Legacy|v1|
|-|-|
|`no-hide-on-route-change`||
||`bordered`|
||`elevated`|

  </div>
  <div class="inline-block q-pa-md">

**QDrawer Methods**

|Legacy|v1|
|-|-|
|`on-layout`||
||`hide`|
||`show`|
||`toggle`|

  </div>
</div>

#### QLayoutHeader & QLayoutFooter

- **renamed** to [QHeader](/layout/header-and-footer) and [QFooter](/layout/header-and-footer), respectively

<div class="row">
  <div class="inline-block q-pa-md">

**QFooter Properties**

|Legacy|v1|
|-|-|
||`bordered`|
||`elevated`|
||`reveal`|

  </div>
  <div class="inline-block q-pa-md">

**QHeader Properties**

|Legacy|v1|
|-|-|
||`bordered`|
||`elevated`|
||`reveal`|
||`reveal-offset`|

  </div>
</div>

#### QList

<div class="row">
  <div class="inline-block q-pa-md">

**QList Properties**

|Legacy|v1|
|-|-|
|`highlight`||
|`inset-separator`||
|`link`||
|`no-border`||
|`sparse`||
|`striped`||
|`striped-odd`||

  </div>
</div>

#### QListHeader

- **removed**, use [QItemLabel](/vue-components/list-and-list-items) with `header` property

#### QModal

- **removed**, use [QDialog](/vue-components/dialog)

#### QModalLayout

- **removed**, use [QDialog](/vue-components/dialog) with a [QLayout](/layout/layout) (and its `container` prop)

#### QOptionGroup

<div class="row">
  <div class="inline-block q-pa-md">

**QOptionGroup Properties**

|Legacy|v1|
|-|-|
|`no-parent-group`||
|`readonly`||
||`dense`|

  </div>
</div>

#### QPagination

<div class="row">
  <div class="inline-block q-pa-md">

**QPagination Methods**

|Legacy|v1|
|-|-|
||`set(pageNumber)`|
||`setOffset(offset)`|

  </div>
</div>

#### QParallax

<div class="row">
  <div class="inline-block q-pa-md">

**QParallax Events**

|Legacy|v1|
|-|-|
||`@scroll(percentage)`|

  </div>
  <div class="inline-block q-pa-md">

**QParallax Slots**

|Legacy|v1|
|-|-|
|`loading`||
||`content`|

  </div>
</div>

#### QPopover

- **replaced** by [QMenu](/vue-components/menu)
- Type of `anchor` was changed from `object` to `string`
- Type of `self` was changed from `object` to `string`
- Type of `offset` was changed from `array of 2 numbers` to `array`

<div class="row">
  <div class="inline-block q-pa-md">

**QMenu Properties**

|Legacy|v1|
|-|-|
|`anchor-click`||
|`disabled`||
|`keep-on-screen`||
||`auto-close`|
||`context-class`|
||`context-menu`|
||`context-style`|
||`max-width`|
||`no-parent-event`|
||`target`|
||`transition-hide`|
||`transition-show`|

  </div>
  <div class="inline-block q-pa-md">

**QMenu Events**

|Legacy|v1|
|-|-|
||`@before-hide(evt)`|
||`@before-show(evt)`|
||`@escape-key`|

  </div>
  <div class="inline-block q-pa-md">

**QMenu Methods**

|Legacy|v1|
|-|-|
||`hide(evt)`|
||`show(evt)`|
||`toggle(evt)`|
||`updatePosition()`|

  </div>
</div>

#### QPopupEdit

<div class="row">
  <div class="inline-block q-pa-md">

**QPopupEdit Properties**

|Legacy|v1|
|-|-|
|`keep-on-screen`||
|`validate`||

  </div>
  <div class="inline-block q-pa-md">

**QPopupEdit Methods**

|Legacy|v1|
|-|-|
||`cancel()`|
||`set()`|

  </div>
  <div class="inline-block q-pa-md">

**QPopupEdit Slots**

|Legacy|v1|
|-|-|
||`title`|

  </div>
</div>

#### QProgress

- **replaced** by [QLinearProgress](/vue-components/linear-progress) (alternatively, use [QCircularProgress](/vue-components/circular-progress))

<div class="row">
  <div class="inline-block q-pa-md">

**QLinearProgress Properties**

|Legacy|v1|
|-|-|
|`animate`||
|`height`||
|`keep-on-percentage`||
||`dark`|
||`query`|
||`reverse`|
||`rounded`|
||`track-color`|

  </div>
</div>

#### QPullToRefresh

<div class="row">
  <div class="inline-block q-pa-md">

**QPullToRefresh Properties**

|Legacy|v1|
|-|-|
|`handler`|use `refresh` event|
|`distance`||
|`inline`||
|`pull-message`||
|`release-message`||
|`refresh-icon`||
|`refresh-message`||
||`icon`|
||`no-mouse`|

  </div>
  <div class="inline-block q-pa-md">

**QPullToRefresh Events**

|Legacy|v1|
|-|-|
||`@refresh(done)`|

  </div>
</div>

#### QRadio

<div class="row">
  <div class="inline-block q-pa-md">

**QRadio Properties**

|Legacy|v1|
|-|-|
|`checked-icon`||
|`no-focus`||
|`readonly`||
|`unchecked-icon`||

  </div>
</div>

#### QRange

<div class="row">
  <div class="inline-block q-pa-md">

**QRange Properties**

|Legacy|v1|
|-|-|
|`decimals`||
|`error`||
|`fill-handle-always`||
|`square`||
|`warning`||

  </div>
</div>

#### QRating

- Type of `max` was changed from `number` to `string|number`

#### QResizeObservable

- **renamed** to [QResizeObserver](/vue-components/resize-observer)

#### QRouteTab

- Type of `name` was changed from `string` to `string|number`
- Type of `alert` was changed from `boolean` to `boolean|string`
- Type of `label` was changed from `string` to `string|number`
- Type of `to` was changed from `string|object` to `any`
- Do not use `slot="title"` on it anymore

<div class="row">
  <div class="inline-block q-pa-md">

**QRouteTab Properties**

|Legacy|v1|
|-|-|
|`color`||
|`count`||
|`hidden`||
|`hide`||

  </div>
</div>

<div class="inline-block q-pa-md">

**QRouteTab Methods**

|Legacy|v1|
|-|-|
|`select()`||

  </div>
</div>

#### QScrollArea

- Type of `delay` was changed from `number` to `string|number`

#### QScrollObservable

- **renamed** to [QScrollObserver](/vue-components/scroll-observer)



#### QSearch

- **removed**, use [QInput](/vue-components/input) with `debounce` property (and optionally some icons on `append` or `prepend` slots)

#### QSelect

- Type of `stack-label` was changed from `string` to `boolean`
- Type of `display-value` was changed from `string` to `string|number`
- When the option list is an array of objects (as opposed to simple strings or numbers), upgraders may want to turn on the `emit-value` and `map-options` flags to preserve the behavior of previous versions. 1.0 defaults to emitting the entire object, not just the `value` property, upon selection.

<div class="row">
  <div class="inline-block q-pa-md">

**QSelect Properties**

|Legacy|v1|
|-|-|
|`after`||
|`before`||
|`chips`||
|`chips-bg-color`||
|`chips-color`||
|`clear-value`||
|`filter`||
|`filter-placeholder`||
|`float-label`||
|`hide-underline`||
|`inverted`||
|`inverted-light`||
|`no-parent-field`||
|`popup-cover`||
|`popup-max-height`||
|`radio`||
|`separator`||
|`toggle`||
|`warning`||

  </div>
  <div class="inline-block q-pa-md">

**QSelect Slots**

|Legacy|v1|
|-|-|
||`prepend`|
||`append`|
||`before`|
||`after`|
||`error`|
||`hint`|
||`counter`|
||`selected`|
||`no-option`|
||`loading`|
||`selected-item`|
||`option`|

  </div>

</div>

#### QSlider

<div class="row">
  <div class="inline-block q-pa-md">

**QSlider Properties**

|Legacy|v1|
|-|-|
|`decimals`||
|`error`||
|`fill-handle-always`||
|`square`||
|`warning`||

  </div>
</div>

#### QSpinnerMat

- **removed**, use [QSpinner](/vue-components/spinners)

#### QStep

- Type of `name` was changed from `string|number` to `any`

<div class="row">
  <div class="inline-block q-pa-md">

**QStep Properties**

|Legacy|v1|
|-|-|
|`default`||
|`order`||
|`subtitle`||

  </div>
</div>

#### QStepper

- Type of `done-icon` was changed from `boolean` to `string`
- Type of `active-icon` was changed from `boolean` to `string`
- Type of `error-icon` was changed from `boolean` to `string`

<div class="row">
  <div class="inline-block q-pa-md">

**QStepper Properties**

|Legacy|v1|
|-|-|
|`color`||
|`contractable`||
|`no-header-navigation`||

  </div>
  <div class="inline-block q-pa-md">

**QStepper Slots**

|Legacy|v1|
|-|-|
||`navigation`|

  </div>
</div>

#### QTab

- Type of `name` was changed from `string` to `string|number`
- Type of `alert` was changed from `boolean` to `boolean|string`
- Type of `label` was changed from `string` to `string|number`
- Type of `tabindex` was changed from `number` to `string`
- Do not use `slot="title"` on it anymore

<div class="row">
  <div class="inline-block q-pa-md">

**QTab Properties**

|Legacy|v1|
|-|-|
|`color`||
|`count`||
|`default`||
|`hidden`||
|`hide`||

  </div>
  <div class="inline-block q-pa-md">

**QTab Slots**

|Legacy|v1|
|-|-|
|`title`||

  </div>
</div>

<div class="inline-block q-pa-md">

**QTab Methods**

|Legacy|v1|
|-|-|
|`select()`||

  </div>
</div>

#### QTable

`filter` - type changed from `String` to `String,Object`

<div class="row">
  <div class="inline-block q-pa-md">

**QTable Properties**

|Legacy|v1|
|-|-|
|`selected-rows-label`||
|`pagination-label`||
||`bordered`|
||`flat`|
||`wrap-cells`|

  </div>
  <div class="inline-block q-pa-md">

**QTable Events**

|Legacy|v1|
|-|-|
|`@fullscreen()`||
|`@request()`|`@request(pagination, filter, getCellValue)`|
||`@update:pagination(newPagination)`|
||`@update:selected(newSelected)`|

  </div>
  <div class="inline-block q-pa-md">

**QTable Methods**

|Legacy|v1|
|-|-|
||`clearSelection()`|
||`isRowSelected(key)`|
||`nextPage()`|
||`prevPage()`|
||`requestServerInteraction(props)`|
||`setPagination(pagination, forceServerRequest)`|
||`sort(col)`|
||`toggleFullscreen()`|

  </div>
  <div class="inline-block q-pa-md">

**QTable Slots**

|Legacy|v1|
|-|-|
||`body-cell`|
||`header-cell`|

  </div>
</div>


#### QTableColumns

- **removed**, use a `QSelect` with columns as options (see docs for example)

#### QTabPane

- **removed**, use [QTabPanels](/vue-components/tab-panels) and [QTabPanel](/vue-components/tab-panels) (outside of a QTabs)

#### QTabs

Remove `slot="title"` from all tabs. It's not needed anymore. If you use QTabs with QTabPanes, remove them from the QTab container and put them into separate QTabPanel container. Put `v-model` on both containers and point it to the same variable. If you have `default` on some tab, put its name as default value of the model.

<div class="row">
  <div class="inline-block q-pa-md">

**QTabs Properties**

|Legacy|v1|
|-|-|
|`animated`||
|`color`||
|`glossy`||
|`inverted`||
|`panes-container-class`||
|`position`||
|`swipeable`||
|`text-color`||
|`two-lines`||
|`underline-color`|`indicator-color`|
|`no-pane-border`||
||`breakpoint`|
||`active-color`|
||`active-bg-color`|
||`indicator-color`|
||`left-icon`|
||`right-icon`|
||`switch-indicator`|
||`narrow-indicator`|
||`inline-label`|
||`no-caps`|
||`dense`|

  </div>
  <div class="inline-block q-pa-md">

**QTab Events**

|Legacy|v1|
|-|-|
|`select`||

  </div>
  <div class="inline-block q-pa-md">

**QTabs Methods**

|Legacy|v1|
|-|-|
|`go(offset)`||
|`next()`||
|`previous()`||
|`selectTab(name)`||

  </div>
</div>

#### QTimeline

<div class="row">
  <div class="inline-block q-pa-md">

**QTimeline Properties**

|Legacy|v1|
|-|-|
|`no-hover`||
|`responsive`||

  </div>
</div>

#### QTimelineEntry

<div class="row">
  <div class="inline-block q-pa-md">

**QTimelineEntry Slots**

|Legacy|v1|
|-|-|
|`subtitle`||
|`title`||

  </div>
</div>

#### QTimePicker

- **replaced** by [QTime](/vue-components/time)

**QTime Properties**

|Legacy|v1|
|-|-|
||`color`|
||`dark`|
||`disable`|
||`format24h`|
||`hour-options`|
||`landscape`|
||`minute-options`|
||`now-btn`|
||`options`|
||`readonly`|
||`second-options`|
||`text-color`|
||`with-seconds`|

  </div>

</div>

#### QToggle

- Type of `val` was changed from `object` to `any`
- `checked-icon` and `indeterminate-icon` were dropped to make `QCheckbox` more compliant with Material Standards. If you still need similar functionality, consider using `QToggle` with [icons](/vue-components/toggle#example--icons).

<div class="row">
  <div class="inline-block q-pa-md">

**QToggle Properties**

|Legacy|v1|
|-|-|
|`no-focus`||
|`readonly`||
||`dense`|
||`tabindex`|

  </div>
</div>

#### QToolbar

<div class="row">
  <div class="inline-block q-pa-md">

**QToolbar Properties**

|Legacy|v1|
|-|-|
|`color`||
|`glossy`||
|`inverted`||
|`shrink`||
|`text-color`||
||`inset`|

  </div>
  <div class="inline-block q-pa-md">

**QToolbar Slots**

|Legacy|v1|
|-|-|
|`subtitle`||

  </div>
</div>

#### QTooltip

<div class="row">
  <div class="inline-block q-pa-md">

**QTooltip Properties**

|Legacy|v1|
|-|-|
|`disabled`||
||`content-class`|
||`content-style`|
||`max-width`|
||`target`|
||`transition-hide`|
||`transition-show`|

  </div>
  <div class="inline-block q-pa-md">

**QTooltip Events**

|Legacy|v1|
|-|-|
||`@before-hide(evt)`|
||`@before-show(evt)`|
||`@hide(evt)`|
||`@input(value)`|
||`@show(evt)`|

  </div>
  <div class="inline-block q-pa-md">

**QTooltip Methods**

|Legacy|v1|
|-|-|
||`updatePosition()`|

  </div>
</div>

#### QTree

<div class="row">
  <div class="inline-block q-pa-md">

**QTree Properties**

|Legacy|v1|
|-|-|
||`selected-color`|

  </div>
  <div class="inline-block q-pa-md">

**QTree Events**

|Legacy|v1|
|-|-|
||`@lazy-load(details)`|
||`@update:expanded(expanded)`|
||`@update:selected(target)`|
||`@update:ticked(target)`|

  </div>
  <div class="inline-block q-pa-md">

**QTree Methods**

|Legacy|v1|
|-|-|
||`setExpanded(key, state)`|
||`setTicked(keys, state)`|

  </div>
</div>

#### QUploader

- Type of `headers` was changed from `object` to `function|array`
- Type of `url` was changed from `string` to `function|string`
- Type of `method` was changed from `string` to `function|string`

<div class="row">
  <div class="inline-block q-pa-md">

**QUploader Properties**

|Legacy|v1|
|-|-|
|`additional-fields`|`form-fields`|
|`after`||
|`align`||
|`auto-expand`||
|`before`||
|`clear-value`||
|`clearable`||
|`error`||
|`expand-style`||
|`extensions`||
|`float-label`||
|`hide-underline`||
|`hide-upload-button`|`hide-upload-btn`|
|`hide-upload-progress`||
|`inverted`||
|`inverted-light`||
|`name`||
|`no-content-type`||
|`no-parent-field`||
|`placeholder`||
|`prefix`||
|`stack-label`||
|`suffix`||
|`upload-factory`||
|`url-factory`||
|`warning`||
||`accept`|
||`auto-upload`|
||`factory`|
||`batch`|
||`bordered`|
||`field-name`|
||`label`|
||`flat`|
||`max-file-size`|
||`max-total-size`|
||`square`|
||`text-color`|

  </div>
  <div class="inline-block q-pa-md">

**QUploader Events**

|Legacy|v1|
|-|-|
|`@fail(file, xhr)`|`@failed({ files, xhr })`|
|`@remove:abort(file)`||
|`@remove:cancel(file)`||
|`@remove:done(file)`||
|`@uploaded(file, xhr)`|`@uploaded({ files, xhr })`|
||`@uploading({ files, xhr })`|

  </div>
  <div class="inline-block q-pa-md">

**QUploader Methods**

|Legacy|v1|
|-|-|
|`add(files)`|`addFiles(files)`|
|`pick()`|`pickFiles()`|
||`removeFile(file)`|
||`removeQueuedFiles()`|
||`removeUploadedFiles()`|

  </div>
  <div class="inline-block q-pa-md">

**QUploader Slots**

|Legacy|v1|
|-|-|
||`header`|
||`list`|

  </div>

</div>

#### QWindowResizeObservable

- **removed**, directly use `this.$q.screen.width` and `this.$q.screen.height` (or create a watcher on them)
