---
title: Layout Drawer
desc: How to use the QDrawer component. The sidebars of your Quasar app.
keys: QDrawer
examples: QDrawer
related:
  - /layout/layout
  - /vue-components/list-and-list-items
---

QLayout allows you to configure your views as a 3x3 matrix, containing optional left-side and/or right-side Drawers. If you haven’t already, please read [QLayout](/layout/layout) documentation page first.

QDrawer is the sidebar part of your QLayout.

<DocApi file="QDrawer" />

## Layout Builder

Scaffold your layout(s) by clicking on the button below.

<q-btn icon-right="launch" label="Layout Builder" href="/layout-builder" target="_blank" />

## Usage

::: tip

- Since QDrawer needs a layout and QLayout by default manages the entire window, then for demoing purposes we are going to use containerized QLayouts. But remember that by no means you are required to use containerized QLayouts for QDrawer.
- If the QDrawer content also has images and you want to use touch actions to close it, you might want to add `draggable="false"` to them, otherwise the native browser behavior might interfere in a negative way.

:::

::: danger Touch gestures
While the drawer is in its "mobile" behavior (the layout is below the drawer's `breakpoint`, or `behavior` is forced to "mobile"), QDrawer attaches three touch gestures, each with its own opt-out:

- swiping the drawer content sideways to close it, disabled by `no-swipe-close`
- swiping the backdrop to close it, disabled by `no-swipe-backdrop`
- swiping in from that edge of the screen to open it, disabled by `no-swipe-open`

Reach for `no-swipe-close` when your drawer holds components of your own that need to be swiped or panned. None of these gestures are attached while the drawer is in its "desktop" behavior, so setting these props there changes nothing.
:::

::: warning
The swipe-to-open gesture is served by an invisible strip (`.q-drawer__opener`) which is 15px wide, spans the full height of that side of the screen and sits above your page content, so it captures the pointer events landing in that band. If you have something anchored to the same edge (a QPageSticky, for instance), disable the strip with `no-swipe-open`.
:::

::: warning
While the drawer is shown in "mobile" behavior it locks the scrolling of the `<body>` element, the same way a modal does. Containerized [QLayouts](/layout/layout) are exempt, since they scroll their own container rather than the page.
:::

::: warning
When QDrawer is set into overlay mode, **it will force it to go into fixed position**, regardless if QLayout's "view" prop is configured with "l/r" or "L/R". Also, **if on iOS platform and QLayout is containerized**, the fixed position will also be forced upon QDrawer due to platform limitations that cannot be overcome.
:::

### Basic

<DocExample title="Basic" file="Basic" />

Consider using QItems with routing props (like `to`) below. For demoing purposes these props have not been added as it would break the UMD version.

<DocExample title="With navigation menu" file="Menu" />

<DocExample title="Seamless menu" file="MenuSeamless" />

<DocExample title="Header Picture" file="HeaderPicture" />

### Desktop and mobile behavior

QDrawer runs in one of two behaviors, and a number of its props mean different things in each:

|                     | "desktop" behavior                   | "mobile" behavior                  |
| ------------------- | ------------------------------------ | ---------------------------------- |
| Space on the layout | occupies it, unless `overlay` is set | never occupies it                  |
| Backdrop            | none                                 | shown for as long as the drawer is |
| Touch gestures      | none                                 | attached, as described above       |
| Body scroll         | untouched                            | locked while the drawer is shown   |
| `mini` mode         | applies                              | ignored                            |

The `breakpoint` prop (default: 1023) decides which of the two is used: the drawer is in "mobile" behavior for as long as the width of the layout is smaller than or equal to it. Note that this is the width of the layout, which is the width of the window unless you are using a containerized QLayout.

Set the `behavior` prop to "desktop" or "mobile" to pin the drawer into one of them regardless of the width. Its default value ("default") is the dynamic switch described above.

::: warning
A layout can hold one drawer per side, but the two cannot be on screen at the same time while both are in "mobile" behavior, where each of them covers the page with a backdrop of its own. Showing one closes the other, which also syncs its `v-model` to `false`. In "desktop" behavior they coexist.
:::

#### Showing it above the breakpoint

The `show-if-above` Boolean prop shows the drawer whenever the layout is in "desktop" behavior, even though its `v-model` is `false`, and it syncs that `v-model` back to `true` when it does so on the first render.

It also takes part in what happens when the layout crosses the breakpoint. Going into "mobile" behavior always hides the drawer and remembers whether it was shown, and coming back into "desktop" behavior shows it again if it was. What `show-if-above` adds is that a drawer which the user never opened comes back too. This restore is skipped when the drawer has `overlay` set or its `behavior` pinned to "mobile".

#### Persistence

While the drawer is in a dismissible state (in "mobile" behavior, or shown while in `overlay` mode), it can close itself in three ways beyond your `v-model`: the <kbd>Escape</kbd> key, a change of the app's route, and the Cordova/Capacitor back button. The `persistent` Boolean prop turns off all three.

It does not affect closing through a click on the backdrop or through a swipe, so pair it with `no-swipe-close` and `no-swipe-backdrop` for a drawer that only your `v-model` can close.

### Mini-mode

Drawer can operate in two modes: 'normal' and 'mini', and you can switch between them by using the Boolean `mini` property on QDrawer.

::: warning
Please note that **`mini` mode** does not apply when in **mobile** behavior.
:::

The transition played while switching between the two modes can be turned off with the `no-mini-animation` Boolean prop.

There are some CSS classes that will help you customize the drawer when dealing with "mini" mode. These are very useful especially when using the "click" trigger:

| CSS Class            | Description                                             |
| -------------------- | ------------------------------------------------------- |
| `q-mini-drawer-hide` | Hide when drawer is in "mini" mode or in "mobile" mode. |
| `q-mini-drawer-only` | Show only when drawer is in "mini" mode.                |

You can also write your own CSS classes based on the fact that QDrawer has `q-drawer--standard` CSS class when in "normal" mode and `q-drawer--mini` when in "mini" mode. Also, when drawer is in "mobile" behavior, it gets `q-drawer--mobile` CSS class.

#### Mouseover/mouseout trigger

Consider using QItems with routing props (like `to`) below. For demoing purposes these props have not been added as it would break the UMD version.

<DocExample title="Mini-mode with mouseover/mouseout trigger" file="MiniMouseEvents" />

#### Mini to overlay

The `mini-to-overlay` Boolean property will always set your drawer with fixed position, regardless of your configuration from the `view` prop, but will occupy space on the layout only as wide as when in mini-mode.

<DocExample title="Mini to overlay" file="MiniToOverlay" />

#### Click trigger

In the example below, when in "mini" mode, if the user clicks on Drawer then we switch to normal mode.

Consider using QItems with routing props (like `to`) below. For demoing purposes these props have not been added as it would break the UMD version.

<DocExample title="Mini-mode with click trigger" file="MiniClickEvent" />

#### Slots

By default, when in "mini" mode, Quasar CSS hides a few DOM elements to provide a neat narrow drawer. But there may certainly be use-cases where you need a deep tweak. You can use the "mini" Vue slot of QDrawer just for that. The content of this slot will replace your drawer's default content when in "mini" mode.

<DocExample title="Mini-mode with slot" file="MiniSlot" />

### Overlay mode

The overlay mode prevents the drawer from occupying space on the layout and rather hover over the page instead. This will always set your drawer with fixed position, regardless of your configuration from the `view` prop.

On the example below, click the menu icon to see the drawer in action. It's best viewed on a desktop with a window of at least 500px width (this is the breakpoint that is set on this demo).

<DocExample title="Overlay mode" file="OverlayMode" />

## Accessibility <q-badge label="v2.25+" />

QDrawer renders its panel as a real `<aside>` element, so it is exposed to assistive technology as a complementary landmark of your [QLayout](/layout/layout#accessibility). The backdrop shown in its overlay states and the invisible swipe-opener strip along the screen edge are hidden from assistive technology, since they are redundant, pointer-only affordances. A closed drawer leaves the Tab order and the accessibility tree entirely, so nothing invisible stays reachable.

A `role` or any `aria-*` attribute set on QDrawer is applied to the `<aside>` element itself, since that is the element assistive technology interacts with. Give it an `aria-label` (or `aria-labelledby`) so that multiple drawers can be told apart, or a `role` when complementary does not fit, one [allowed on `aside`](https://www.w3.org/TR/html-aria/#el-aside), like `region`, `search` or `none`. All other fall-through attributes keep targeting the inner scrolling element.

### Keyboard dismissal

While the drawer is in a dismissible state (below its breakpoint or shown in overlay mode), hitting the <kbd>Escape</kbd> key closes it, the keyboard counterpart of the backdrop click and the swipe gesture. The `persistent` prop opts out of it, and an `escape-key` event is emitted whenever the key is handled.

### Your responsibilities

Be aware that in its overlay states the drawer only looks modal: it does not trap or move keyboard focus, so the page behind the backdrop remains keyboard-reachable and readable by screen readers. If your use case calls for it, move focus into the drawer yourself when opening it. The toggle button is app-provided too, so it should manage its own `aria-expanded` state.

When a drawer holds your primary navigation, wrap the menu inside it in a `<nav>` element (or add `role="navigation"`) and give it an `aria-label`, so it is announced as a navigation landmark distinct from the surrounding `aside`.
