---
title: Breadcrumbs
desc: The QBreadcrumbs Vue component is a navigational aid for your UI. It allows users to keep track of their location within programs, documents, or websites.
keys: QBreadcrumbs,QBreadcrumbsEl
---

The QBreadcrumbs component is used as a navigational aid in UI. It allows users to keep track of their location within programs, documents, or websites. Most common use is in a [QToolbar](/vue-components/toolbar), but it's not limited to it.


## QBreadcrumbs API

<doc-api file="QBreadcrumbs" />

## QBreadcrumbsEl API

<doc-api file="QBreadcrumbsEl" />

## Usage

### Basic

<doc-example title="Basic" file="QBreadcrumbs/Basic" />

<doc-example title="In a QToolbar" file="QBreadcrumbs/Toolbar" />

### Design

<doc-example title="Custom separators" file="QBreadcrumbs/Separator" />

<doc-example title="Gutters" file="QBreadcrumbs/Gutters" />

<doc-example title="Align" file="QBreadcrumbs/Align" />

### Connecting to Vue Router

The examples below won't work with UMD version (so in Codepen/jsFiddle too) because they depend on Vue Router.

<doc-example title="Router links" file="QBreadcrumbs/RouterLinks" />

You can also delay, cancel or redirect navigation, as seen below. For a more in-depth description of the `@click` event being used below, please refer to QBreadcrumbsEl API card at the top of the page.

<doc-example title="Links with delayed, cancelled or redirected navigation (v2.9+)" file="QBreadcrumbs/LinksWithGo" no-edit />
