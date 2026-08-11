---
title: Dropdown Button
desc: The QBtnDropdown Vue component is used to display dropdown content on a button.
keys: QBtnDropdown
examples: QBtnDropdown
related:
  - /vue-components/button
  - /vue-components/button-group
---

QBtnDropdown is a very convenient dropdown button. Goes very well with [QList](/vue-components/list-and-list-items) as dropdown content, but it's by no means limited to it.

In case you are looking for a dropdown "input" instead of "button" use [Select](/vue-components/select) instead.

<DocApi file="QBtnDropdown" />

## Usage

<DocExample title="Basic" file="Basic" />

<DocExample title="Various content" file="VariousContent" />

<DocExample title="Split" file="Split" />

<DocExample title="Custom button" file="CustomButton" />

<DocExample title="Custom dropdown icon" file="CustomDropdownIcon" />

<DocExample title="Label slot" file="LabelSlot" />

The `toggle` slot (v2.25+) adds content to the dropdown toggle itself, next to the arrow icon. In `split` mode it is the only way to reach the toggle button — attach a [QTooltip](/vue-components/tooltip) to it below (the `label` slot covers the main button):

<DocExample title="Toggle slot" file="ToggleSlot" />

<DocExample title="Using v-model" file="Model" />

<DocExample title="Disable" file="Disable" />

The following example won't work with UMD version (so in Codepen/jsFiddle too) because it relies on the existence of Vue Router.

<DocExample title="Split and router link on main" file="Link" no-edit />

## Accessibility <q-badge label="v2.25+" />

The toggle button follows the [WAI-ARIA disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/): it exposes `aria-expanded` (plus `aria-controls` while the popup exists — the reference must not point to a missing id) and deliberately claims no `aria-haspopup` — that attribute's value must name the popup's ARIA role, and the dropdown content (which has no default role) can be anything. If you give the content an actual role, mirror it on the button yourself — for instance `aria-haspopup="menu"` when declaring `role="menu"` on a wrapped [QList](/vue-components/list-and-list-items) (see [QMenu's Accessibility section](/vue-components/menu#accessibility)):

```html
<q-btn-dropdown label="Actions" aria-haspopup="menu">
  <q-list role="menu">
    <!-- clickable QItems become menuitems automatically -->
  </q-list>
</q-btn-dropdown>
```

Note that in `split` mode the fall-through attributes land on the wrapping button group rather than on the toggle button, so the technique above applies to the regular (non-split) design only.
