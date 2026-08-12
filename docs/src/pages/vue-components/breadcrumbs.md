---
title: Breadcrumbs
desc: The QBreadcrumbs Vue component is a navigational aid for your UI. It allows users to keep track of their location within programs, documents, or websites.
keys: QBreadcrumbs,QBreadcrumbsEl
examples: QBreadcrumbs
---

The QBreadcrumbs component is used as a navigational aid in UI. It allows users to keep track of their location within programs, documents, or websites. Most common use is in a [QToolbar](/vue-components/toolbar), but it's not limited to it.

<DocApi file="QBreadcrumbs" />

<DocApi file="QBreadcrumbsEl" />

## Usage

### Basic

<DocExample title="Basic" file="Basic" />

<DocExample title="In a QToolbar" file="Toolbar" />

### Design

<DocExample title="Custom separators" file="Separator" />

<DocExample title="Gutters" file="Gutters" />

<DocExample title="Align" file="Align" />

### Connecting to Vue Router

The examples below won't work with UMD version (so in Codepen/jsFiddle too) because they depend on Vue Router.

<DocExample title="Router links" file="RouterLinks" />

You can also delay, cancel or redirect navigation, as seen below. For a more in-depth description of the `@click` event being used below, please refer to QBreadcrumbsEl API card at the top of the page.

<DocExample title="Links with delayed, cancelled or redirected navigation (v2.9+)" file="LinksWithGo" no-edit />

## Accessibility

QBreadcrumbs only renders the links themselves — it claims no landmark or list semantics of its own. To follow the [WAI-ARIA breadcrumb pattern](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/), wrap the component in a `<nav aria-label="Breadcrumb">` element and add `aria-current="page"` to the QBreadcrumbsEl representing the current page (attributes fall through to the rendered element) — the component does neither by itself.

Also be aware that the separator text is announced by screen readers between the links; if you want to avoid that, render the separator through the `separator` slot with `aria-hidden="true"` content.
