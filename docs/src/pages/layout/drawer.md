---
title: Layout Drawer
related:
  - /layout/layout
  - /vue-components/list-and-list-items
---

QLayout allows you to configure your views as a 3x3 matrix, containing optional left-side and/or right-side Drawers. If you haven’t already, please read [QLayout](/layout/layout) documentation page first.

## Installation
<doc-installation components="QDrawer" />

## Layout Builder
Scaffold your layout(s) by clicking on the button below.

<q-btn push color="primary" icon-right="launch" label="Layout Builder" type="a" href="/layout-builder" target="_blank" rel="noopener noreferrer" />

## Usage
::: tip
Since QDrawer needs a layout and QLayout by default manages the entire window, then for demoing purposes we are going to use containerized QLayouts. But remember that by no means you are required to use containerized QLayouts for QDrawer.
:::

### Basic

<doc-example title="Basic" file="QDrawer/Basic" />

Consider using QItems with routing props (like `to`) below. For demoing purposes these props have not been added as it would break the UMD version.

<doc-example title="With navigation menu" file="QDrawer/Menu" />

<doc-example title="Seamless menu" file="QDrawer/MenuSeamless" />

<doc-example title="Header Picture" file="QDrawer/HeaderPicture" />

### Mini-mode

Drawer can operate in two modes: 'normal' and 'mini', and you can switch between them by using the Boolean `mini` property on QLayoutDrawer.

::: warning
Please note that **`mini` mode** does not apply when in **mobile** behavior.
:::

There are some CSS classes that will help you customize the drawer when dealing with "mini" mode. These are very useful especially when using the "click" trigger:

| CSS Class | Description |
| --- | --- |
| `q-mini-drawer-hide` | Hide when drawer is in "mini" mode. |
| `q-mini-drawer-only` | Show only when drawer is in "mini" mode. |

You can also write your own CSS classes based on the fact that QLayoutDrawer has `q-layout-drawer-normal` CSS class when in "normal" mode and `q-layout-drawer-mini` when in "mini" mode. Also, when drawer is in "mobile" behavior, it gets `q-layout-drawer-mobile` CSS class.

#### Mouseover/mouseout trigger

Consider using QItems with routing props (like `to`) below. For demoing purposes these props have not been added as it would break the UMD version.

<doc-example title="Mini-mode with mouseover/mouseout trigger" file="QDrawer/MiniMouseEvents" />

#### Click trigger
In the example below, when in "mini" mode, if the user clicks on Drawer then we switch to normal mode.

Consider using QItems with routing props (like `to`) below. For demoing purposes these props have not been added as it would break the UMD version.

<doc-example title="Mini-mode with click trigger" file="QDrawer/MiniClickEvent" />

#### Slots
By default, when in "mini" mode, Quasar CSS hides a few DOM elements to provide a neat narrow drawer. But there may certainly be use-cases where you need a deep tweak. You can use the "mini" Vue slot of QLayoutDrawer just for that. The content of this slot will replace your drawer's default content when in "mini" mode.

<doc-example title="Mini-mode with slot" file="QDrawer/MiniSlot" />

## QDrawer API
<doc-api file="QDrawer" />
