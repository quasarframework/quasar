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

### Basic

<DocExample title="Basic" file="Basic" />

<DocExample title="Various content" file="VariousContent" />

### Split

<DocExample title="Split" file="Split" />

### Hover <q-badge label="v2.26+" />

The `hover` prop also opens the dropdown when the pointer hovers the button (in `split` mode: either one of the two buttons) and closes it once the pointer has left both the button and the menu. Click/tap and keyboard interactions keep working as usual, so touch devices (which have no hover) simply fall back to them; a hover-opened dropdown does not move keyboard focus onto itself, and clicking the button while it is hover-shown switches it to a regular focused open instead of closing it. The `hover-delay` and `hover-hide-delay` props tune the timings (see [QMenu's Hover section](/vue-components/menu#hover)).

<DocExample title="Hover" file="Hover" />

### Customization and slots

<DocExample title="Custom button" file="CustomButton" />

<DocExample title="Custom dropdown icon" file="CustomDropdownIcon" />

<DocExample title="Label slot" file="LabelSlot" />

The `toggle` slot (v2.25+) adds content to the dropdown toggle itself, next to the arrow icon. In `split` mode it is the only way to reach the toggle button — attach a [QTooltip](/vue-components/tooltip) to it below (the `label` slot covers the main button):

<DocExample title="Toggle slot" file="ToggleSlot" />

### Other

<DocExample title="Using v-model" file="Model" />

<DocExample title="Disable" file="Disable" />

The following example won't work with UMD version (so in Codepen/jsFiddle too) because it relies on the existence of Vue Router.

<DocExample title="Split and router link on main" file="Link" no-edit />

## Accessibility <q-badge label="v2.25+" />

The toggle button follows the [WAI-ARIA disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/): it exposes `aria-expanded` (plus `aria-controls` while the popup exists — the reference must not point to a missing id) and deliberately claims no `aria-haspopup` — that attribute's value must name the popup's ARIA role, and the dropdown content (which has no default role) can be anything. Once you give the content an actual role, mirror it with the `toggle-aria-haspopup` prop — for instance when declaring `role="menu"` on a wrapped [QList](/vue-components/list-and-list-items) (see [QMenu's Accessibility section](/vue-components/menu#accessibility)):

```html
<q-btn-dropdown label="Actions" toggle-aria-haspopup="menu">
  <q-list role="menu">
    <!-- clickable QItems become menuitems automatically -->
  </q-list>
</q-btn-dropdown>
```

The prop is the reliable way to do this in both designs: in `split` mode the fall-through attributes land on the wrapping button group rather than on the toggle button, so setting `aria-haspopup` as a plain attribute would never reach the control that opens the popup.

The toggle also carries an accessible name of its own, built from the `label` prop and the active [Quasar Language Pack](/options/quasar-language-packs) and following the state — `Expand "Actions"` while collapsed, `Collapse "Actions"` once open (a dropdown without a `label` falls back to a bare `Expand`/`Collapse`). Since it describes the disclosure rather than the action behind it, override it with the `toggle-aria-label` prop whenever the label alone doesn't tell the story — and note that, like `toggle-aria-haspopup`, the prop is what reaches the toggle button in `split` mode.
