---
title: QMenu
desc: The QMenu Vue component is a convenient way to show menus.
keys: QMenu
examples: QMenu
related:
  - /vue-directives/close-popup
  - /options/transitions
  - /vue-components/popup-proxy
---

The QMenu component is a convenient way to show menus. Goes very well with [QList](/vue-components/list-and-list-items) as dropdown content, but it's by no means limited to it.

<DocApi file="QMenu" />

## Usage

The idea with QMenu is to place it inside your DOM element / component that you want to be the trigger as direct child. Don’t worry about QMenu content inheriting CSS from the container as the QMenu will be injected as a direct child of `<body>` through a Quasar Portal.

::: tip
Don't forget to use the directive `v-close-popup` in your clickable menu items if you want the menu to close automatically.
Alternatively, you can use the QMenu's property `auto-close` or handle closing the menu yourself through its v-model.
:::

### Basic

<DocExample title="Basic" file="Basic" />

<DocExample title="Idea for content" file="VariousContent" />

<DocExample title="Toggle through v-model" file="VModel" />

::: warning
If you want to conditionally activate or de-activate a QMenu, please use `v-if` on it instead of `v-show`.
:::

### Submenus

<DocExample title="Menus in menus" file="MenuInMenu" />

### Sizing and styling

<DocExample title="Sizing" file="Sizing" />

<DocExample title="Style" file="Style" />

### Context menu

You can also set QMenu to act as a context menu. On desktop, you need to right click the parent target to trigger it, and on mobile a long tap will do the job.

<DocExample title="Context Menu" file="ContextMenu" />

### Persistent

If you want the QMenu to not close if app route changes or if hitting ESCAPE key or if clicking/tapping outside of the menu, then use `persistent` prop:

<DocExample title="Persistent" file="Persistent" />

### Transitions

In the example below there's a few transitions showcased. For a full list of transitions available, go to [Transitions](/options/transitions).

<DocExample title="Transition examples" file="Transitions" />

### Reusable

The example below shows how to create a re-usable menu that can be shared with different targets.

<DocExample title="Using target" file="Target" />

### Positioning

<DocExample title="Position examples" file="Positions" />

The position of QMenu can be customized. It keeps account of the `anchor` and `self` optional props.
The final position of QMenu popup is calculated so that it will be displayed on the available screen real estate, switching to the right-side and/or top-side when necessary.

For horizontal positioning you can use `start` and `end` when you want to automatically take into account if on RTL or non-RTL. `start` and `end` mean "left" for non-RTL and "right" for RTL.

<script doc>
import MenuPositioning from './MenuPositioning.vue'
</script>

<MenuPositioning />
