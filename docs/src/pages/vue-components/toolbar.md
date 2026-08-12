---
title: Toolbar
desc: The QToolbar and QToolbarTitle Vue components are usually part of QHeader or QFooter, but it can be used anywhere on the page.
keys: QToolbar,QToolbarTitle
examples: QToolbar
related:
  - /layout/header-and-footer
  - /vue-components/icon
  - /vue-components/avatar
  - /vue-components/breadcrumbs
  - /vue-components/separator
---

QToolbar is a component usually part of Layout Header and Footer, but it can be used anywhere on the page.

<DocApi file="QToolbar" />

<DocApi file="QToolbarTitle" />

## Usage

<DocExample title="Basic" file="Basic" />

<DocExample title="With Avatar" file="Avatar" />

You can use the `glossy` class to make the toolbar glossy.

<DocExample title="Glossy" file="Glossy" />

<DocExample title="Grouped vertically" file="GroupedVertically" />

<DocExample title="Grouped horizontally" file="GroupedHorizontally" />

<DocExample title="With Tabs" file="WithTabs" />

<DocExample title="With Button Dropdown" file="WithDropdown" />

<DocExample title="With Button Toggle" file="WithBtnToggle" />

## Accessibility

QToolbar carries `role="toolbar"`. Give each toolbar an `aria-label` (it falls through to the root element) when a page contains more than one, so screen reader users can tell them apart. Note that the controls inside remain independent Tab stops — QToolbar does not implement the single-Tab-stop, arrow-key navigation that the [WAI-ARIA toolbar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/) describes.
