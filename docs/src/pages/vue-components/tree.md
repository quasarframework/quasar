---
title: Tree
desc: The QTree is a highly configurable Vue component which displays hierarchical data, such as a table of contents in a tree structure.
keys: QTree
examples: QTree
---

Quasar Tree represents a highly configurable component that displays hierarchical data, such as a table of contents in a tree structure.

<DocApi file="QTree" />

## Usage

### Basic

<DocExample title="Basic" file="Basic" />

### Accessibility <q-badge label="v2.25+" />

QTree follows the [WAI-ARIA tree pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/): the component exposes `role="tree"` and each node header is a `role="treeitem"` carrying `aria-expanded` on parents, `aria-selected` on selectable nodes, `aria-checked` on ticking ones (including the `mixed` state of partially ticked parents) and `aria-disabled` when disabled, while the nested child groups convey the hierarchy. In `virtual-scroll` mode the rows are rendered flat instead, so each one compensates with `aria-level`, `aria-setsize` and `aria-posinset`. Do give the tree an accessible name by setting `aria-label` (or `aria-labelledby`) on the component itself.

The tick checkboxes are pointer affordances only — the keyboard path is <kbd>Space</kbd> on the node header (see below), with the state announced through `aria-checked`. The "no nodes" and "no results" messages use localized strings from the [Quasar Language Pack](/options/quasar-language-packs).

Every node the user can see takes part in the roving Tab stop, as the tree pattern requires of a `role="treeitem"`. That includes the nodes nothing happens on (a leaf of a tree with no selection and no ticking) and the disabled ones: a disabled node stays reachable and announces itself through `aria-disabled`, but nothing acts on it — no selection, no expansion, no lazy loading and not even its own `handler`.

#### Keyboard navigation

When a tree node has focus:

- <kbd>Arrow Up</kbd> and <kbd>Arrow Down</kbd> move focus through the visible nodes.
- <kbd>Arrow Right</kbd> expands a collapsed parent or moves focus to its first visible child.
- <kbd>Arrow Left</kbd> collapses an expanded parent or moves focus to its parent.
- <kbd>Home</kbd> and <kbd>End</kbd> move focus to the first and last visible nodes.
- <kbd>Enter</kbd> performs the node's default action; <kbd>Space</kbd> toggles its expansion — or its checkbox, on tickable nodes (when using a `tick-strategy`). Both do nothing on a disabled node.

### No connector lines

<DocExample title="No connectors" file="NoConnectors" />

### Dense <q-badge label="v2.2.4+" />

<DocExample title="Dense" file="DenseTree" />

### Force dark mode

<DocExample title="Force dark mode" file="Dark" />

### Perf considerations <q-badge label="v2.25+" />

Starting with Quasar v2.25, QTree only pays for what is on screen: a collapsed node's children are not rendered until the node gets expanded for the first time (afterwards they are kept in the DOM — hidden — so that collapsing/expanding can still animate), and a state change (expanding, ticking, selecting, filtering, keyboard navigation) re-renders only the affected nodes. Rendering cost thus scales with the number of _visible_ nodes, not with the total tree size — most trees need no tuning at all. If your code queried the DOM for the children of never-expanded nodes, it needs to expand those nodes first.

When a lot of nodes are visible at the same time, the sheer amount of DOM becomes the bottleneck. There are two remedies, in increasing order of effect:

1. The `no-transition` Boolean prop turns off the expand/collapse animation, which also allows QTree to drop collapsed subtrees from the DOM instead of keeping them alive for animating (on older Quasar versions it is the only way to avoid rendering collapsed content altogether). Recommended when using relatively large data.

```html
<q-tree no-transition ...
```

2. The `virtual-scroll` Boolean prop (see the Virtual scroll section below) keeps only the rows around the scrolling viewport in the DOM. This is the mode for really big trees: mounting, expanding all nodes and filtering stay at a constant cost no matter how much of the tree is expanded.

### Virtual scroll <q-badge label="v2.25+" />

The `virtual-scroll` Boolean prop renders the visible nodes as a flat virtualized list: only the rows around the scrolling viewport (plus a configurable buffer — see the `virtual-scroll-*` props) exist in the DOM, so rendering cost stays constant regardless of how many nodes are expanded. The example below runs a fully expanded tree of 4,680 nodes; even the largest trees mount, expand-all and filter in milliseconds in this mode.

Things to be aware of in this mode:

- The tree itself becomes the scrolling container, so give it a height (through CSS) — or point `virtual-scroll-target` to a scrolling ancestor instead.
- Expanding and collapsing are instant: there is no slide transition, so the `duration` and `no-transition` props and the `@after-show`/`@after-hide` events do not apply.
- The `scrollTo` method scrolls any visible node's row into view; keyboard navigation does this automatically.

<DocExample title="Virtual scroll" file="VirtualScroll" />

### Integrated example

<DocExample title="With QSplitter and QTabPanels" file="Splitter" />

More info: [QSplitter](/vue-components/splitter), [QTabPanels](/vue-components/tab-panels).

### Customize content

Notice (in the example below) the default header and body slot customization.

<DocExample title="Default header and body slots" file="SlotsDefault" />

Notice (in the example below) the custom header and body slots.

<DocExample title="Customizing nodes" file="SlotsCustomized" />

::: warning
Clicking or pressing `ENTER` on the custom header selects the tree item (and the custom header is blurred). Pressing `SPACE` toggles its expansion.

If you don't want this to happen just wrap the content of the custom header in a `<div @click.stop @keydown.stop>` (or add the listeners to the respective component/element that is emitting them).
:::

### Accordion, filtering and selectable

In the example below, sibling nodes get contracted when one gets expanded.

<DocExample title="Accordion mode" file="Accordion" />

<DocExample title="Filtering nodes" file="FilterDefault" />

<DocExample title="Selectable nodes" file="Selectable" />

### Lazy loading

<DocExample title="Lazy loading nodes" file="LazyLoad" />

### Selection vs ticking, expansion

- Selection (through QTree `selected` prop) refers to the currently selected node. By default only its label color changes (see the `selected-color` prop); the node header also gets the `q-tree__node--selected` CSS class, so you can style it further (a background, for example) with your own CSS.
- Ticking (through QTree `ticked` prop) refers to the checkbox associated with each node.
- Expansion (through QTree `expanded` prop) refers to the nodes that are expanded.

All properties above require to be dynamically bound using `v-model:<prop_name>` directive in order for them to work correctly (example: `v-model:expanded`).

<DocExample title="Syncing node properties" file="Sync" />

### Tick strategy

There are three ticking strategy: 'leaf', 'leaf-filtered', 'strict' with an additional (and default) 'none' which disables ticking.

| Strategy      | Description                                                                                                                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| leaf          | Ticked nodes are only the leaves. Ticking a node influences the parent's ticked state too (parent becomes partially ticked or ticked), as well as its children (all tickable children become ticked). |
| leaf-filtered | Same concept as `leaf`, only that this strategy applies only to filtered nodes (the nodes that remain visible after filtering).                                                                       |
| strict        | Ticked nodes are independent of parent or children tick state.                                                                                                                                        |

You can apply a global tick strategy for a QTree and locally change the ticking strategy for a certain node by specifying the `tickStrategy` in the `nodes` model.

<DocExample title="Tick strategy" file="TickStrategy" />

### Partially ticked nodes <q-badge label="v2.25+" />

With the `leaf` and `leaf-filtered` strategies, a parent whose tickable children are only partly ticked is neither ticked nor unticked, so it does not show up in the `ticked` model. Use the `getIndeterminateNodes()` method to get such nodes (in the order of the `nodes` model), or `isIndeterminate(key)` to check one of them.

Both always report nothing for the `strict` strategy, where a node's tick state is independent of its children.

When you need all three states at once, `getTickState(key)` returns them in the tri-state form that a QCheckbox takes as its model: `true` when ticked, `null` when partially ticked and `false` when unticked. It is the very value that the node's own tickbox gets, so it can be bound to a QCheckbox of yours as is.

The header and body slots also get an `indeterminate` boolean in their scope, next to the `ticked` one. It is read-only — a node becomes partially ticked through its children, so tick those instead.

<DocExample title="Partially ticked nodes" file="Indeterminate" />

### Custom filter method

You can customize the filtering method by specifying the `filter-method` prop. The method below filters by input if it also has '(\*)':

<DocExample title="Custom filter" file="FilterCustom" />

### Nodes model structure

The following describes a node's properties that are taken into account by QTree's v-model.

| Node Property | Type           | Behavior when not present                       | Description                                                                                                                 |
| ------------- | -------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| \<nodeKey\>   | String, Number | An error is generated                           | Node's key. The key is picked from the key specified in `nodeKey` property.                                                 |
| label         | String         | The item has no label                           | Node's label. When `labelKey` prop is set the label is picked from that key.                                                |
| icon          | String         | The default icon is used                        | Node's icon.                                                                                                                |
| iconColor     | String         | The inherited color is used                     | Node's icon color. One from Quasar Color Palette.                                                                           |
| img           | String         | No image is displayed                           | Node's image. Use /public folder. Example: 'mountains.png'                                                                  |
| avatar        | String         | No avatar is displayed                          | Node's avatar. Use /public folder. Example: 'boy-avatar.png'                                                                |
| children      | Array          | This node has no sub-nodes                      | Array of nodes as children.                                                                                                 |
| disabled      | Boolean        | The node is enabled                             | Is node disabled?                                                                                                           |
| expandable    | Boolean        | The node is expandable                          | Is node expandable?                                                                                                         |
| selectable    | Boolean        | The node is selectable                          | Is node selectable?                                                                                                         |
| handler       | Function       | No extra function is called                     | Custom function that should be called on click on node. Receives `node` as parameter.                                       |
| tickable      | Boolean        | The node is tickable according to tick strategy | When using a tick strategy, each node shows a checkbox. Should a node's checkbox be disabled?                               |
| noTick        | Boolean        | Node displays a checkbox                        | When using a tick strategy, should node display a checkbox?                                                                 |
| tickStrategy  | String         | Tick strategy 'none' is used                    | Override global tick strategy for this node only. One of 'leaf', 'leaf-filtered', 'strict', 'none'.                         |
| lazy          | Boolean        | Children are not lazy loaded                    | Should children be lazy loaded? In this case also don't specify 'children' prop.                                            |
| header        | String         | Slot 'default-header' is used                   | Node header scoped slot name, without the required 'header-' prefix. Example: 'story' refers to 'header-story' scoped slot. |
| body          | String         | Slot 'default-body' is used                     | Node body scoped slot name, without the required 'body-' prefix. Example: 'story' refers to 'body-story' scoped slot.       |
