---
title: Tabs
---
Quasar Tabs are a way of displaying more information using less window real estate.
One common use case for this component is in Layout’s header/footer in a QToolbar. Please refer to [Layouts](/layout/layout) and [Toolbar](/vue-components/toolbar) for references.

## Installation
Cherry-pick only what you are using from list below.

<doc-installation :components="['QTabs', 'QTab', 'QRouteTab', 'QTabPanels', 'QTabPanel']" />

## Usage

<doc-example title="Basic" file="QTabs/Basic" />

::: tip
Tabs can show icon, text or both.
:::

<doc-example title="Types" file="QTabs/Types" />

::: tip
You can use `v-model` to hold the current tab. You need to set `name` prop on each tab. Model will then hold the name of currently selected tab.
:::

<doc-example title="Usage with V-model" file="QTabs/VModel" />

::: tip
You can also use the `value` prop just by itself to set default tab.
:::

<doc-example title="Default Tab" file="QTabs/DefaultTab" />

::: tip
You can color tabs with classes `text-*` and `bg-*` (see [Color Pallete](/style/color-pallete)).
:::

<doc-example title="Colors" file="QTabs/Colors" />

::: tip
Use `active-color` and `active-bg-color` to customise selected tab. Indicator color can be changed with `indicator-color` prop.
:::

<doc-example title="Custom Colors for Active Tab and Indicator" file="QTabs/ActiveColor" />

<doc-example title="Glossy" file="QTabs/Glossy" />

<doc-example title="Animated Bar on Top" file="QTabs/TopBar" />

::: tip
Use `alert` prop or [QBadge](/vue-components/badge) to add count.
:::

<doc-example title="With Alerts and Counts" file="QTabs/AlertsAndCounts" />

::: tip
Use `align` prop for different alignments.
:::

<doc-example title="Alignments" file="QTabs/Alignments" />

### Tab Panels
Use `q-tab-panels` container with `q-tab-panel` children to create tabs content. These two are coupled with v-model.

Panels can be `swipeable` and use different animations (see `transition-prev` and `transition-next`).

<doc-example title="Swipeable Animated Panels" file="QTabs/Panels" />

<doc-example title="Panels Above Tabs" file="QTabs/PanelsAbove" />

::: tip
Keeping tabs alive (Vue won't destroy content on Tab selection change).
:::

<doc-example title="Panels With Keep Alive" file="QTabs/PanelsKeepAlive" />

### Usage with Vue router
You can use tabs together with vue-router using `QRouteTab` component.
The Tabs Router component is just like the QTab component and shares the same properties, however it also has `router-link` properties bound to it. These allow the triggering of your specific routing.

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

## QTabs API

<doc-api file="QTabs" />

## QTab API

<doc-api file="QTab" />

## QRouteTab API

<doc-api file="QRouteTab" />

## QTabPanels API

<doc-api file="QTabPanels" />

## QTabPanel API

<doc-api file="QTabPanel" />
