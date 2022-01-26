---
title: Tabs
desc: The QTabs, QTab and QRouteTab Vue components are a way of helping the user navigate between pages or tab panels.
keys: QTabs,QTab,QRouteTab
related:
  - /vue-components/tab-panels
  - /vue-components/button-toggle
  - /vue-components/icon
  - /vue-components/badge
---
Tabs are a way of displaying more information using less window real estate. This page describes the tab selection part through QTabs, QTab and QRouteTab.

One common use case for this component is in Layout’s header/footer. Please refer to [Layouts](/layout/layout) and [Header & Footer](/layout/header-and-footer#example--playing-with-qtabs) for references.

::: tip
Works great along with [QTabPanels](/vue-components/tab-panels), a component which refers strictly to the panels (tab content) themselves.
:::

## QTabs API

<doc-api file="QTabs" />

## QTab API

<doc-api file="QTab" />

## QRouteTab API

<doc-api file="QRouteTab" />

## Usage

::: tip TIPS
* QTabs can be scrolled horizontally when the width is longer than the container width. Adjust your browser accordingly to see this in action.
* On a desktop you will see chevrons on either side that can be clicked.
* On a mobile, you can pan the tabs with your finger.
* If you want to force arrows to be visible on mobile use `mobile-arrows` prop.
:::

::: warning
QRouteTab won't and cannot work with the UMD version if you don't also install Vue Router.
:::

### Basic

<doc-example title="Basic" file="QTabs/Basic" />

### Outside, inside and visible on mobile arrows

<doc-example title="Outside, inside and visible on mobile arrows" file="QTabs/ArrowsModifiers" />

### Vertical

<doc-example title="Vertical (example with QSplitter)" file="QTabs/Vertical" />

### Dense

<doc-example title="Dense" file="QTabs/Dense" />

### Individual colors

<doc-example title="Individual colors" file="QTabs/IndividualColor" />

### Ripple

<doc-example title="No ripple and custom ripple color" file="QTabs/Ripples" />

### Custom indicator

In the examples below, please notice the last two QTabs: indicator at top and no indicator.

<doc-example title="Custom indicator" file="QTabs/CustomIndicator" />

### Tab notifications

There are multiple ways to display tab notifications: with a QBadge, through an alert dot or an alert icon (can be any).

<doc-example title="Tab notifications" file="QTabs/Notifying" />

### Alignment

QTabs are responsive and the `align` prop (see below) becomes active when the container width (not window width) is bigger than the configured breakpoint. For demoing purposes, the tabs below have breakpoint disabled.

<doc-example title="Alignment" file="QTabs/Alignment" />

In the second QTabs from the example below, if window width is below 1024px then the "Movies" and "Photos" tabs will be replaced by a "More..." dropdown.

### With dropdown

<doc-example title="With a dropdown" file="QTabs/Dropdown" />

### On QToolbar

Notice we need to specify the `shrink` prop. By default, QTabs tries to expand to all the available horizontal space, but in this case we are using it as a child of QToolbar so we don't want that.

<doc-example title="Tabs in a QToolbar" file="QTabs/TabsInToolbar" />

### Dynamic update

<doc-example title="Dynamic tabs" file="QTabs/DynamicTabs" />

### Along with QTabsPanel

::: tip
QTabPanels can be used as standalone too. They do not depend on the presence of a QTabs. Also, they can be placed anywhere within a page, not just near a QTabs.
:::

<doc-example title="Tabs with tab panels" file="QTabs/TabsWithTabpanels" />

More info: [Tab Panels](/vue-components/tab-panels).

## Connecting to Vue Router
You can use tabs together with Vue Router through `QRouteTab` component.
This component inherits everything from QTab, however it also has `router-link` properties bound to it. These allow for listening to the current app route and also triggering a route when clicked/tapped.

```html
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

### Handling custom navigation

```html
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
      <q-tabs
        no-caps
        class="bg-orange text-white shadow-2"
      >
        <q-route-tab :to="{ query: { tab: '1' } }" exact replace label="Activate in 2s" @click="navDelay" />
        <q-route-tab :to="{ query: { tab: '2' } }" exact replace label="Do nothing" @click="navCancel" />
        <q-route-tab :to="{ query: { tab: '3' } }" exact replace label="Navigate to the second tab" @click="navRedirect" />
        <q-route-tab :to="{ query: { tab: '4' } }" exact replace label="Navigate immediatelly" @click="navPass" />
      </q-tabs>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    navDelay (e, go) {
      e.preventDefault() // we cancel the default navigation

      // console.log('triggering navigation in 2s')
      setTimeout(() => {
        // console.log('navigating as promised 2s ago')
        go()
      }, 2000)
    },

    navCancel (e) {
      e.preventDefault() // we cancel the default navigation
    },

    navRedirect (e, go) {
      e.preventDefault() // we cancel the default navigation
      go({ query: { tab: '2', noScroll: true } })
    },

    navPass () {}
  }
}
</script>
```
