---
title: Button Group
desc: The QBtnGroup Vue component groups QBtn and QBtnDropdown into a single unit.
keys: QBtnGroup
examples: QBtnGroup
related:
  - /vue-components/button
  - /vue-components/button-dropdown
  - /vue-components/button-toggle
---

You can conveniently group [QBtn](/vue-components/button) and [QBtnDropdown](/vue-components/button-dropdown) using QBtnGroup. Be sure to check those component's respective pages to see their props and methods.

<DocApi file="QBtnGroup" />

## Usage

<DocExample title="Examples" file="Group" />

::: warning
You must use same design props (flat, outline, push, ...) on both the parent QBtnGroup and the children QBtn/QBtnDropdown.
:::

<DocExample title="Spread horizontally" file="GroupSpread" />

<DocExample title="With QBtnDropdown" file="WithDropdown" />

## Accessibility

QBtnGroup is purely presentational: it renders a plain `div` with no ARIA role, and the buttons inside manage their own semantics — each one is its own Tab stop. If the grouping is semantically meaningful (a set of related actions), pass `role="group"` along with an `aria-label` yourself; both fall through to the wrapping element.
