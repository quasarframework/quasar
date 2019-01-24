---
title: Layout Drawer
---

QLayout allows you to configure your views as a 3x3 matrix, containing optional left-side and/or right-side Drawers. If you haven’t already, please read [QLayout](/layout/layout) documentation page first.

## Installation
<doc-installation components="QDrawer" />

## Layout Builder
Scaffold your layout(s) by clicking on the button below.

<q-btn
  push
  color="primary"
  icon-right="launch"
  label="Layout Builder"
  type="a"
  href="/layout-builder"
  target="_blank"
  rel="noopener noreferrer"
/>

## Usage
::: tip
Since QDrawer needs a layout and QLayout by default manages the entire window, then for demoing purposes we are going to use containerized QLayouts. But remember that by no means you are required to use containerized QLayouts for QDrawer.
:::

<doc-example title="Basic" file="QHeader/Basic" />

<doc-example title="Playing with QToolbar" file="QHeader/Extended" />

<doc-example title="Playing with QBreadcrumb" file="QHeader/Breadcrumbs" />

<doc-example title="Playing with QTabs" file="QHeader/Tabs" />

### iOS look and feel
In the example below, you could use Ionicons icons with `ion-ios-` prefix for QTabs, which would perfectly match the iOS look and feel.

<doc-example title="iOS-like" file="QHeader/LookingIOS" />

### Desktop app look and feel
<doc-example title="Desktop app-like" file="QHeader/AppLike" />

## API
<doc-api file="QDrawer" />
