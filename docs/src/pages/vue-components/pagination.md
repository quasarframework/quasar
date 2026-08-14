---
title: Pagination
desc: The QPagination Vue component allows you to easily display a pagination control on a page.
keys: QPagination
examples: QPagination
---

The QPagination component is available for whenever a pagination system is required. It offers the user a simple UI for moving between items or pages.

There are two modes in which QPagination operates: with buttons only or with an inputbox. The latter allows the user to go to a specific page by clicking/tapping on the inputbox, typing the page number then hitting Enter key. If the new page number is within valid limits, the model will be changed accordingly.

<DocApi file="QPagination" />

## Usage

### Design

<DocExample title="Standard" file="Standard" />

The following are a few examples, but not an exhaustive list:

<DocExample title="Button design (v2.10+)" file="BtnDesign" />

<DocExample title="Gutter (v2.10+)" file="BtnGutter" />

### Custom icons

<DocExample title="With icon replacement" file="Icons" />

### With input

<DocExample title="With input" file="Input" />

<DocExample title="With input color" file="InputColor" />

### Max pages shown

<DocExample title="Maximum pages shown" file="MaxPages" />

<DocExample title="Removing ellipses" file="Ellipses" />

### Handling boundary

<DocExample title="With boundary numbers" file="BoundaryNumbers" />

<DocExample title="With boundary links" file="BoundaryLinks" />

<DocExample title="With direction links" file="DirectionLinks" />

## Accessibility

QPagination renders as a `navigation` landmark. The first/previous/next/last buttons get localized `aria-label`s from the [Quasar Language Pack](/options/quasar-language-packs) in use, the numbered buttons are labeled with the page they lead to, and the active page's button is marked with `aria-current="page"`. The landmark itself is named from the same language pack (`pagination.label`); pass your own `aria-label` (it falls through to the root element) to tell several paginations on one page apart.

In input mode, the typed page number is committed when the user hits <kbd>Enter</kbd> or when the field loses focus.
