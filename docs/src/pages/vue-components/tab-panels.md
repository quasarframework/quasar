---
title: Tab Panels
desc: The QTabPanel Vue component is a way of displaying more information using less window real estate.
related:
  - /vue-components/tabs
---
Tab panels are a way of displaying more information using less window real estate.

::: tip
Works great along with [QTabs](/vue-components/tabs) but it is not required to be used with it.
:::

## Installation
<doc-installation :components="['QTabPanels', 'QTabPanel']" />

## Usage

::: tip
Works great along with [QTabs](/vue-components/tabs), a component which offers a nice way to select the active tab panel to display.
:::

::: warning IMPORTANT
Do not be mistaken by the "QTabPanels" component name. Panels do not require QTabs. They can be used as standalone too.
:::

::: danger
Please take notice of the Boolean `keep-alive` prop for QTabPanels, if you need this behavior. Do NOT use Vue's native `<keep-alive>` component over QTabPanel.
:::

<doc-example title="Basic" file="QTabPanels/Basic" />

::: tip
QTabPanels can be used as standalone too. They do not depend on the presence of a QTabs. Also, they can be placed anywhere within a page, not just near QTabs.
:::

<doc-example title="With QTabs" file="QTabPanels/WithQTabs" />

<doc-example title="Coloring" file="QTabPanels/Coloring" />

For a full list of transitions, please check out [Transitions](/options/transitions).

<doc-example title="Custom transition examples" file="QTabPanels/Transition" />

In the example below, use your mouse to swipe through the panels or, if on a touch capable device, swipe with your fingers.

<doc-example title="Swipeable and infinite" file="QTabPanels/Swipeable" />

## QTabPanels API

<doc-api file="QTabPanels" />

## QTabPanel API

<doc-api file="QTabPanel" />
