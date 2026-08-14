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

The QMenu component is a convenient way to show menus. Goes very well with [QList](/vue-components/list-and-list-items) as dropdown content, but it's by no means limited to it. When the content is indeed a list of actions, declare it through `role="menu"` on the QList — see [Accessibility](#accessibility).

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

::: tip
The `offset` prop is applied to the **anchor element's bounding box**, and only then is the final position clamped to the available screen real estate. As a result, a large offset — or anchoring QMenu to a full-width / screen-edge element — can push the popup against a viewport edge, where it gets clamped and the offset appears to have no effect (the clamped position then becomes independent of the offset value). If an `offset` seems to be ignored on one axis, make sure the chosen `anchor`/`self` lets the popup expand into free space on that axis — for example, attach QMenu to an inline / `inline-block` trigger rather than to a full-width block element.
:::

<script doc>
import MenuPositioning from './MenuPositioning.vue'
</script>

<MenuPositioning />

## Accessibility

### Semantics <q-badge label="v2.25+" />

QMenu renders as a plain positioned container, deliberately claiming no ARIA role of its own: it can host any kind of content, while the [WAI-ARIA `menu` role](https://www.w3.org/TR/wai-aria-1.2/#menu) permits nothing but menu items as children — a form, a date picker or a list would all become invalid markup under it.

So when the popup content really is a menu — a list of commands — declare it as such by setting `role="menu"` on the wrapping [QList](/vue-components/list-and-list-items). The contained QItems then adapt automatically: actionable ones (clickable or link items, including disabled ones) expose themselves as `menuitem`, anything else (section headers etc.) stays neutral, and QSeparator already announces itself as a separator. An individual item can override its derived role — for instance with `role="menuitemcheckbox"` or `role="menuitemradio"` for toggle entries, in which case managing `aria-checked` is up to you. The "Basic" example above shows the declaration.

If you attach a role to the QMenu container itself instead (it forwards any `role` you pass), make sure its entire content satisfies that role's requirements.

### Anchor semantics <q-badge label="v2.25+" />

The anchor is your own markup, yet it is the control that opens the popup, so QMenu maintains the trigger's ARIA on it from the outside: `aria-expanded` follows the open state, and a `role` declared on the QMenu container itself is mirrored onto the anchor as `aria-haspopup` (that attribute names the popup's role, so only `menu`, `listbox`, `tree`, `grid` and `dialog` can be mirrored). A `<q-btn>` wrapping a QMenu is therefore announced as a collapsed or expanded trigger with no work on your part.

This requires an anchor that ARIA allows the state on — a `<button>`, a link with an `href`, or any element declaring a widget role such as `role="button"`. A plain `<div>` computes to the generic role, where `aria-expanded` is invalid, so QMenu leaves it untouched: give such an anchor a proper role (and a keyboard path to activate it) before using it as a trigger. Two more cases are deliberately left alone — a `context-menu` popup, which opens on right click or long tap rather than on activation, and any `aria-expanded`/`aria-haspopup` you set on the anchor yourself, which QMenu never overwrites.

Do keep in mind that when the role lives on the [QList](/vue-components/list-and-list-items) inside the popup — the shape recommended above — QMenu cannot see it, so add `aria-haspopup="menu"` on the anchor yourself:

```html
<q-btn label="Actions" aria-haspopup="menu">
  <q-menu>
    <q-list role="menu">
      <!-- ... -->
    </q-list>
  </q-menu>
</q-btn>
```

### Keyboard navigation <q-badge label="v2.25+" />

Since the menu renders next to the end of the page, letting <kbd>Tab</kbd> walk past its last focusable element (or <kbd>Shift</kbd> + <kbd>Tab</kbd> before its first one) would drop keyboard focus out of the page. Following the [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/), the menu instead closes and focus continues from its anchor, just like <kbd>Escape</kbd> closes it while returning focus to the anchor. Tabbing between multiple focusable elements _inside_ the menu works as usual, and a `persistent` menu opts out of this dismissal too.

Note that focusable menu items are plain Tab stops — QMenu does not (yet) provide the Arrow-key navigation that the [APG menu pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/) describes for `role="menu"` content.
