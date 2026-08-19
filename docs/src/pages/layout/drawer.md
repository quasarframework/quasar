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

::: danger
By default, QDrawer has touch actions attached to it. If this interferes with your drawer content components, disable it by specifying the Boolean `no-swipe-close` property.
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

### Mini-mode

Drawer can operate in two modes: 'normal' and 'mini', and you can switch between them by using the Boolean `mini` property on QLayoutDrawer.

::: warning
Please note that **`mini` mode** does not apply when in **mobile** behavior.
:::

There are some CSS classes that will help you customize the drawer when dealing with "mini" mode. These are very useful especially when using the "click" trigger:

| CSS Class            | Description                                             |
| -------------------- | ------------------------------------------------------- |
| `q-mini-drawer-hide` | Hide when drawer is in "mini" mode or in "mobile" mode. |
| `q-mini-drawer-only` | Show only when drawer is in "mini" mode.                |

You can also write your own CSS classes based on the fact that QLayoutDrawer has `q-drawer--standard` CSS class when in "normal" mode and `q-drawer--mini` when in "mini" mode. Also, when drawer is in "mobile" behavior, it gets `q-drawer--mobile` CSS class.

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

By default, when in "mini" mode, Quasar CSS hides a few DOM elements to provide a neat narrow drawer. But there may certainly be use-cases where you need a deep tweak. You can use the "mini" Vue slot of QLayoutDrawer just for that. The content of this slot will replace your drawer's default content when in "mini" mode.

<DocExample title="Mini-mode with slot" file="MiniSlot" />

### Overlay mode

The overlay mode prevents the drawer from occupying space on the layout and rather hover over the page instead. This will always set your drawer with fixed position, regardless of your configuration from the `view` prop.

On the example below, click the menu icon to see the drawer in action. It's best viewed on a desktop with a window of at least 500px width (this is the breakpoint that is set on this demo).

<DocExample title="Overlay mode" file="OverlayMode" />

## Accessibility <q-badge label="v2.25+" />

QDrawer renders its panel as a real `<aside>` element, so it is exposed to assistive technology as a complementary landmark of your [QLayout](/layout/layout#accessibility). The backdrop shown in its overlay states and the invisible swipe-opener strip along the screen edge are hidden from assistive technology — they are redundant, pointer-only affordances. A closed drawer leaves the Tab order and the accessibility tree entirely, so nothing invisible stays reachable.

A `role` or any `aria-*` attribute set on QDrawer is applied to the `<aside>` element itself, since that is the element assistive technology interacts with. Give it an `aria-label` (or `aria-labelledby`) so that multiple drawers can be told apart, or a `role` when complementary does not fit — one [allowed on `aside`](https://www.w3.org/TR/html-aria/#el-aside), like `region`, `search` or `none`. All other fall-through attributes keep targeting the inner scrolling element.

### Keyboard dismissal

While the drawer is in a dismissible state (below its breakpoint or shown in overlay mode), hitting the <kbd>Escape</kbd> key closes it — the keyboard counterpart of the backdrop click and the swipe gesture. The `persistent` prop opts out of it, and an `escape-key` event is emitted whenever the key is handled.

### Your responsibilities

Be aware that in its overlay states the drawer only looks modal — it does not trap or move keyboard focus, so the page behind the backdrop remains keyboard-reachable and readable by screen readers. If your use case calls for it, move focus into the drawer yourself when opening it. The toggle button is app-provided too, so it should manage its own `aria-expanded` state.

When a drawer holds your primary navigation, wrap the menu inside it in a `<nav>` element (or add `role="navigation"`) and give it an `aria-label`, so it is announced as a navigation landmark distinct from the surrounding `aside`.
