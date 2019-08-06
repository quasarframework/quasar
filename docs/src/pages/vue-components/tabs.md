---
title: Tabs
desc: The QTabs, QTab and QRouteTab Vue components are a way of helping the user navigate between pages or tab panels.
related:
  - /vue-components/tab-panels
  - /vue-components/button-toggle
  - /vue-components/icon
  - /vue-components/badge
---
Tabs are a way of displaying more information using less window real estate. This page describes the tab selection part through QTabs, QTab and QRouteTab.

One common use case for this component is in Layout’s header/footer. Please refer to [Layouts](/layout/layout) and [Header & Footer](/layout/header-and-footer#Example--Playing-with-QTabs) for references.

::: tip
Works great along with [QTabPanels](/vue-components/tab-panels), a component which refers strictly to the panels (tab content) themselves.
:::

## Installation
Cherry-pick only what you are using from list below.

<doc-installation :components="['QTabs', 'QTab', 'QRouteTab']" />

::: warning
QRouteTab won't and cannot work with the UMD version because in that environment you don't have Vue Router.
:::

## Usage

::: tip
QTabs can be scrolled horizontally when the width is longer than the container width. Adjust your browser accordingly to see this in action. On a desktop you will see chevons on either side that can be clicked. On a mobile, you can pan the tabs with your finger.
:::

<doc-example title="Basic" file="QTabs/Basic" />

<doc-example title="Vertical (example with QSplitter)" file="QTabs/Vertical" />

<doc-example title="Dense" file="QTabs/Dense" />

<doc-example title="Individual colors" file="QTabs/IndividualColor" />

<doc-example title="No ripple and custom ripple color" file="QTabs/Ripples" />

In the examples below, please notice the last two QTabs: indicator at top and no indicator.

<doc-example title="Custom indicator" file="QTabs/CustomIndicator" />

<doc-example title="Tab notifications" file="QTabs/Notifying" />

QTabs are responsive and the `align` prop (see below) becomes active when the container width (not window width) is bigger than the configured breakpoint. For demoing purposes, the tabs below have breakpoint disabled.

<doc-example title="Alignment" file="QTabs/Alignment" />

In the second QTabs from the example below, if window width is below 1024px then the "Movies" and "Photos" tabs will be replaced by a "More..." dropdown.

<doc-example title="With a dropdown" file="QTabs/Dropdown" />

## Using along QToolbar

Notice we need to specify the `shrink` prop. By default, QTabs tries to expand to all the available horizontal space, but in this case we are using it as a child of QToolbar so we don't want that.

<doc-example title="Tabs in a QToolbar" file="QTabs/TabsInToolbar" />

## Using along QTabsPanel

::: tip
QTabPanels can be used as standalone too. They do not depend on the presence of a QTabs. Also, they can be placed anywhere within a page, not just near a QTabs.
:::

<doc-example title="Tabs with tab panels" file="QTabs/TabsWithTabpanels" />

More info: [Tab Panels](/vue-components/tab-panels).

## Connecting to Vue Router
You can use tabs together with Vue Router through `QRouteTab` component.
This component inherits everything from QTab, however it also has `router-link` properties bound to it. These allow for listening to the current app route and also triggering a route when clicked/tapped.

```vue
<q-tabs>
  <q-route-tab
    icon="mail"
    to="/mails"
    exact
  />
  <q-route-tab
    icon="alarm"
    to="/alarms"
    exact
  />
</q-tabs>
```

::: warning
QRouteTab becomes "active" depending on your app's route and not due to the v-model. So the initial value of v-model or changing the v-model directly will not also change the route of your app.
:::

## QTabs API

<doc-api file="QTabs" />

## QTab API

<doc-api file="QTab" />

## QRouteTab API

<doc-api file="QRouteTab" />
