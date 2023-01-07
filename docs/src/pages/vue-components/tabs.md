---
title: Tabs
desc: The QTabs, QTab and QRouteTab Vue components are a way of helping the user navigate between pages or tab panels.
keys: QTabs,QTab,QRouteTab
examples: QTabs
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

<doc-api file="QTabs" />

<doc-api file="QTab" />

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

<doc-example title="Basic" file="Basic" />

### Outside, inside and visible on mobile arrows

<doc-example title="Outside, inside and visible on mobile arrows" file="ArrowsModifiers" />

### Vertical

<doc-example title="Vertical (example with QSplitter)" file="Vertical" />

### Dense

<doc-example title="Dense" file="Dense" />

### Individual colors

<doc-example title="Individual colors" file="IndividualColor" />

### Ripple

<doc-example title="No ripple and custom ripple color" file="Ripples" />

### Custom indicator

In the examples below, please notice the last two QTabs: indicator at top and no indicator.

<doc-example title="Custom indicator" file="CustomIndicator" />

### Tab notifications

There are multiple ways to display tab notifications: with a QBadge, through an alert dot or an alert icon (can be any).

<doc-example title="Tab notifications" file="Notifying" />

### Alignment

QTabs are responsive and the `align` prop (see below) becomes active when the container width (not window width) is bigger than the configured breakpoint. For demoing purposes, the tabs below have breakpoint disabled.

<doc-example title="Alignment" file="Alignment" />

In the second QTabs from the example below, if window width is below 1024px then the "Movies" and "Photos" tabs will be replaced by a "More..." dropdown.

### With dropdown

<doc-example title="With a dropdown" file="Dropdown" />

### On QToolbar

Notice we need to specify the `shrink` prop. By default, QTabs tries to expand to all the available horizontal space, but in this case we are using it as a child of QToolbar so we don't want that.

<doc-example title="Tabs in a QToolbar" file="TabsInToolbar" />

### Dynamic update

<doc-example title="Dynamic tabs" file="DynamicTabs" />

### Along with QTabsPanel

::: tip
QTabPanels can be used as standalone too. They do not depend on the presence of a QTabs. Also, they can be placed anywhere within a page, not just near a QTabs.
:::

<doc-example title="Tabs with tab panels" file="TabsWithTabpanels" />

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
When using QTabs with QRouteTab, it is not recommended to also use a v-model (though you still can), because the source of truth for the current active tab is determined by the current route instead of the v-model. Each QRouteTab becomes "active" depending on your app's route and not due to the v-model. So the initial value of v-model or changing the v-model directly will not also change the route of your app.
:::

### Matching QRouteTab to current route <q-badge label="updated for v2.9+" />

* If it is set to `exact` matching:
  1. The route that it points to must be considered "exact-active" by Vue Router (exactly matches route, disregards hash & query).
  2. Assuming Vue Router on history mode, it must match the configured route hash (if any)
  3. It must match the configured route query (if any) - any extra query params in the current route query will not make the tab active (should you want that, do not use `exact`)
* Else, if it is NOT set to `exact` matching:
  1. The route that it points to must be considered "active" by Vue Router (loosely matches route, disregards hash & query).
  2. Assuming Vue Router on history mode, is it configured with a hash? If so, it must match exactly.
  3. Is it configured with a query? If so, then the configured query must be included in the current route query.
  4. If multiple QRouteTab still match the current route (ex: route is /cars/brands/tesla and we have QRouteTabs pointing to non-exact /cars, non-exact /cars/brands, non-exact /cars/brands/tesla), then the most specific one that matches current route wins (in this case /cars/brands/tesla)
  5. If there are still multiple QRouteTabs matching the criteria above, then the one with the query that is closest to the current route query wins (has the configured query and the current route query has the least number of extra params).
  6. If there are still multiple QRouteTabs matching the criteria above, then the one with the resulting href that is the lengthier one wins.

The `exact` configured QRouteTabs always win over loose-matching (non-exact) ones.

### Handling custom navigation <q-badge label="updated for v2.9+" />

::: tip
Please refer to the QRouteTab API card at the top of the page for a more in-depth description of the `@click` event being used below.
:::

```html
<template>
  <q-tabs
    no-caps
    class="bg-orange text-white shadow-2"
  >
    <q-route-tab :to="{ query: { tab: '1' } }" exact replace label="Activate in 2s" @click="navDelay" />
    <q-route-tab :to="{ query: { tab: '2' } }" exact replace label="Do nothing" @click="navCancel" />
    <q-route-tab :to="{ query: { tab: '3' } }" exact replace label="Navigate to the second tab" @click="navRedirect" />
    <q-route-tab :to="{ query: { tab: '4' } }" exact replace label="Navigate immediately" @click="navPass" />
  </q-tabs>
</template>

<script>
export default {
  setup () {
    function navDelay (e, go) {
      e.preventDefault() // we cancel the default navigation

      // console.log('triggering navigation in 2s')
      setTimeout(() => {
        // console.log('navigating as promised 2s ago')
        go()
      }, 2000)
    }

    function navCancel (e) {
      e.preventDefault() // we cancel the default navigation
    }

    function navRedirect (e, go) {
      e.preventDefault() // we cancel the default navigation

      // call this at your convenience
      go({
        to: { query: { tab: '2', noScroll: true } },
        // replace: boolean; default is what the tab is configured with
        // returnRouterError: boolean; default is false
      })
      .then(vueRouterResult => { /* ... */ })
      .catch(vueRouterError => {
        /* ...will not reach here unless returnRouterError === true */
      })
    }

    function navPass () {}

    return { navDelay, navCancel, navRedirect, navPass }
  }
}
</script>
```
