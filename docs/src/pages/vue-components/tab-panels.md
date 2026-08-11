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

<DocApi file="QTabPanels" />

<DocApi file="QTabPanel" />

## Usage

::: tip

- Works great along with [QTabs](/vue-components/tabs), a component which offers a nice way to select the active tab panel to display.
- If the QTabpanel content also has images and you want to use swipe actions to navigate, you might want to add `draggable="false"` to them, otherwise the native browser behavior might interfere in a negative way.

:::

::: warning IMPORTANT
Do not be mistaken by the "QTabPanels" component name. Panels do not require QTabs. They can be used as standalone too.
:::

::: danger Keep Alive

- Please take notice of the Boolean `keep-alive` prop for QTabPanels, if you need this behavior. Do NOT use Vue's native `<keep-alive>` component over QTabPanel.
- Should you need the `keep-alive-include` or `keep-alive-exclude` props then the QTabPanel `name`s must be valid Vue component names (no spaces allowed, don't start with a number etc).

:::

### Basic

<DocExample title="Basic" file="Basic" />

### Accessibility <q-badge label="v2.25+" />

Each QTabPanel renders with the `tabpanel` ARIA role and is focusable (`tabindex="0"`), so keyboard and screen reader users can reach the panel content even when nothing inside it is focusable. Should your panel start with its own focusable content, you can remove the extra Tab stop with `tabindex="-1"`.

Since QTabPanels does not require a QTabs (and can be placed anywhere relative to one), the two components cannot wire the ARIA relationship between a tab and its panel for you. When pairing them, supply the attributes yourself:

```html
<q-tabs v-model="tab">
  <q-tab
    name="mails"
    id="mails-tab"
    aria-controls="mails-panel"
    label="Mails"
  />
</q-tabs>

<q-tab-panels v-model="tab">
  <q-tab-panel name="mails" id="mails-panel" aria-labelledby="mails-tab">
    ...
  </q-tab-panel>
</q-tab-panels>
```

### With QTabs

::: tip
QTabPanels can be used as standalone too. They do not depend on the presence of a QTabs. Also, they can be placed anywhere within a page, not just near QTabs.
:::

<DocExample title="With QTabs" file="WithQTabs" />

<DocExample title="A more complex example" file="WithNestedQTabs" />

### Coloring

<DocExample title="Coloring" file="Coloring" />

### With vertical QTabs and QSplitter

<DocExample title="With vertical QTabs and QSplitter" file="TabsAndSplitter" />

For a full list of transitions, please check out [Transitions](/options/transitions).

### Custom transitions

<DocExample title="Custom transition examples" file="Transition" />

In the example below, use your mouse to swipe through the panels or, if on a touch capable device, swipe with your fingers.

### Swipeable and infinite

<DocExample title="Swipeable and infinite" file="Swipeable" />

### Vertical swipeable and infinite

<DocExample title="Vertical swipeable and infinite" file="VerticalSwipeable" />
