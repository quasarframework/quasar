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
