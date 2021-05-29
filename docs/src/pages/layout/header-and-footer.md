---
title: Layout Header and Footer
desc: How to use the QHeader and QFooter components. The top and bottom bars of your Quasar app.
related:
  - /layout/layout
  - /layout/page
  - /vue-components/toolbar
  - /vue-components/breadcrumbs
  - /vue-components/tabs
  - /vue-components/bar
---

QLayout allows you to configure your views as a 3x3 matrix, containing an optional Header and/or Footer (mostly used for navbar, but can be anything). If you haven’t already, please read [QLayout](/layout/layout) documentation page first.

## QHeader API
<doc-api file="QHeader" />

## QFooter API
<doc-api file="QFooter" />

## Layout Builder
Scaffold your layout(s) by clicking on the button below.

<q-btn push color="brand-primary" icon-right="launch" label="Layout Builder" type="a" href="layout-builder" target="_blank" rel="noopener noreferrer" />

## Usage
::: tip
Since the header and footer needs a layout and QLayout by default manages the entire window, then for demoing purposes we are going to use containerized QLayouts. But remember that by no means you are required to use containerized QLayouts for QHeader or QFooter.
:::

<doc-example title="Basic" file="QHeader/Basic" />

You can use `glossy` class on toolbars in header and footer.

<doc-example title="Glossy" file="QHeader/Glossy" />

### Various content

<doc-example title="Playing with QToolbar" file="QHeader/Extended" />

<doc-example title="Playing with QBreadcrumb" file="QHeader/Breadcrumbs" />

<doc-example title="Playing with QTabs" file="QHeader/Tabs" />

### Reveal property

In the example below, scroll the page to see the QHeader and QFooter behavior.

<doc-example title="Reveal" file="QHeader/Reveal" />

### iOS look and feel
In the example below, you could use Ionicons icons with `ion-ios-` prefix for QTabs, which would perfectly match the iOS look and feel.

<doc-example title="iOS-like" file="QHeader/LookingIOS" />

### Desktop app look and feel
The example below is especially useful if you build an Electron app and you hide the default app frame.

<doc-example title="Desktop app-like" file="QHeader/AppLike" />
