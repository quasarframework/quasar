---
title: Tab Panels
desc: The QTabPanel Vue component is a way of displaying more information using less window real estate.
keys: QTabPanel,QTabPanels
examples: QTabPanels
related:
  - /vue-components/tabs
---
Tab panels are a way of displaying more information using less window real estate.

::: tip
Works great along with [QTabs](/vue-components/tabs) but it is not required to be used with it.
:::

<doc-api file="QTabPanels" />

<doc-api file="QTabPanel" />

## Usage

::: tip
* Works great along with [QTabs](/vue-components/tabs), a component which offers a nice way to select the active tab panel to display.
* If the QTabpanel content also has images and you want to use swipe actions to navigate, you might want to add `draggable="false"` to them, otherwise the native browser behavior might interfere in a negative way.
:::

::: warning IMPORTANT
Do not be mistaken by the "QTabPanels" component name. Panels do not require QTabs. They can be used as standalone too.
:::

::: danger Keep Alive
* Please take notice of the Boolean `keep-alive` prop for QTabPanels, if you need this behavior. Do NOT use Vue's native `<keep-alive>` component over QTabPanel.
* Should you need the `keep-alive-include` or `keep-alive-exclude` props then the QTabPanel `name`s must be valid Vue component names (no spaces allowed, don't start with a number etc).
:::

### Basic

<doc-example title="Basic" file="Basic" />

### With QTabs

::: tip
QTabPanels can be used as standalone too. They do not depend on the presence of a QTabs. Also, they can be placed anywhere within a page, not just near QTabs.
:::

<doc-example title="With QTabs" file="WithQTabs" />

<doc-example title="A more complex example" file="WithNestedQTabs" />

### Coloring

<doc-example title="Coloring" file="Coloring" />

### With vertical QTabs and QSplitter

<doc-example title="With vertical QTabs and QSplitter" file="TabsAndSplitter" />

For a full list of transitions, please check out [Transitions](/options/transitions).

### Custom transitions

<doc-example title="Custom transition examples" file="Transition" />

In the example below, use your mouse to swipe through the panels or, if on a touch capable device, swipe with your fingers.

### Swipeable and infinite

<doc-example title="Swipeable and infinite" file="Swipeable" />

### Vertical swipeable and infinite

<doc-example title="Vertical swipeable and infinite" file="VerticalSwipeable" />
