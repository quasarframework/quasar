---
title: Chip
desc: The QChip Vue component is a simple UI block entity, representing for example more advanced underlying data, such as a contact, but in a compact way.
keys: QChip
examples: QChip
related:
  - /vue-components/avatar
  - /vue-components/icon
  - /vue-components/badge
---

The QChip component is basically a simple UI block entity, representing for example more advanced underlying data, such as a contact, in a compact way.

Chips can contain entities such as an avatar, text or an icon, optionally having a pointer too. They can also be closed or removed if configured so.

::: tip
Also check out [QBadge](/vue-components/badge).
:::

<DocApi file="QChip" />

## Usage

<DocExample title="Basic" file="Basic" />

<DocExample title="Dense" file="Dense" />

<DocExample title="Custom size" file="Sizes" />

<DocExample title="Square" file="Square" />

<DocExample title="Outline" file="Outline" />

<DocExample title="Clickable" file="Clickable" />

<DocExample title="Selected" file="Selected" />

<DocExample title="Removable" file="Removable" />

<DocExample title="Long label truncation" file="LongLabel" />

## Accessibility

A clickable chip (through the `clickable` prop or a `selected` model) exposes itself as `role="button"` and activates on <kbd>Enter</kbd> or <kbd>Space</kbd>. Only chips driven by a `selected` model additionally expose `aria-pressed` — a plain action chip does not claim toggle semantics. A disabled chip keeps its role (announced as dimmed via `aria-disabled`) but is taken out of the tab order.

The remove icon of a `removable` chip is a keyboard-operable control of its own, named by the localized "Remove" label from the [Quasar Language Pack](/options/quasar-language-packs). That generic name says nothing about what would be removed, so set `remove-aria-label` per chip for context — e.g. "Remove tag: Vue".
