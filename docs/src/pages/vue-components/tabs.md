---
title: Tabs
---
Quasar Tabs are a way of displaying more information using less window real estate.
One common use case for this component is in Layout’s header/footer in a QToolbar. Please refer to [Layouts](/layout/layout) and [Toolbar](/vue-components/toolbar) for references.

## Installation

<doc-installation :components="['QTabs','QTab','QTabPane','QRouteTab']" />

## Usage

<doc-example title="Standard" file="QTabs/Standard" />

Tabs can show icon, text or both.

<doc-example title="Types" file="QTabs/Types" />

You can use `v-model` to hold the current tab. It is set to the name of the current tab.

<doc-example title="Usage with V-model" file="QTabs/VModel" />

You can also the `value` prop just by itself to set default tab.

<doc-example title="Default Tab" file="QTabs/DefaultTab" />

You can color tabs with with classes `text-*` and `bg-*` (see [Color Pallete](/style/color-pallete))

<doc-example title="Colors" file="QTabs/Colors" />

Use `active-color` and `active-bg-color` to customize selected tab. Indicator color can be changed with `indicator-color` prop

<doc-example title="Custom Colors for Active Tab and Indicator" file="QTabs/ActiveColor" />

<doc-example title="Glossy" file="QTabs/Glossy" />

With animated bar on top

<doc-example title="Bar on Top" file="QTabs/TopBar" />

Use `alert` prop or [QBadge](/vue-components/badge) to add count

<doc-example title="With Alerts and Counts" file="QTabs/AlertsAndCounts" />

Use `align` prop for different alignments

<doc-example title="Alignments" file="QTabs/Alignments" />

### Tab Panels
Use `q-tab-panels` container with `q-tab-panel` children to create tabs content. These two are coupled with v-model.

Panels can be `swipeable` and use different animations (see `transition-prev` and `transition-next`).

<doc-example title="Swipeable Animated Panels" file="QTabs/Panels" />

<doc-example title="Panels Above Tabs" file="QTabs/PanelsAbove" />

Keeping tabs alive (Vue won't destroy content on Tab selection change)

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

## API

<doc-api file="QTabs" />

<doc-api file="QTab" />

<doc-api file="QRouteTab" />

<doc-api file="QTabPanels" />

<doc-api file="QTabPanel" />
