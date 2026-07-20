# QTree API

Type: component

Canonical documentation: https://quasar.dev/vue-components/tree

## Props

### `nodes`

Type: `Array`

Required: yes

The array of nodes that designates the tree structure

Examples:

- `[{}, {}]`

### `node-key`

Type: `String`

Required: yes

The property name of each node object that holds a unique node id

Examples:

- `'key'`
- `'id'`

### `label-key`

Type: `String`

Default: `'label'`

The property name of each node object that holds the label of the node

Examples:

- `'name'`
- `'description'`

### `children-key`

Type: `String`

Default: `'children'`

The property name of each node object that holds the list of children of the node

Examples:

- `'roles'`
- `'relatives'`

### `no-connectors`

Type: `Boolean`

Do not display the connector lines between nodes

### `color`

Type: `String`

Color name for component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `control-color`

Type: `String`

Color name for controls (like checkboxes) from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `text-color`

Type: `String`

Overrides text color (if needed); Color name from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `selected-color`

Type: `String`

Color name for selected nodes (from the Quasar Color Palette)

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `dense`

Type: `Boolean`

Added in: v2.2.4

Dense mode; occupies less space

### `dark`

Type: `Boolean | null`

Default: `null`

Notify the component that the background is a dark color

### `icon`

Type: `String`

Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix; If 'none' (String) is used as value then no icon is rendered (but screen real estate will still be used for it)

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `tick-strategy`

Type: `String`

Default: `'none'`

The type of strategy to use for the selection of the nodes

Accepted values: `'none'`, `'strict'`, `'leaf'`, `'leaf-filtered'`

### `ticked`

Type: `Array`

Keys of nodes that are ticked

Examples:

- `# v-model:ticked="tickedKeys"`

### `expanded`

Type: `Array`

Keys of nodes that are expanded

Examples:

- `# v-model:expanded="expandedKeys"`

### `selected`

Type: `Any`

Key of node currently selected

Examples:

- `# v-model:selected="selectedKey"`

### `no-selection-unset`

Type: `Boolean`

Added in: v2.4.10

Do not allow un-selection when clicking currently selected node

### `default-expand-all`

Type: `Boolean`

Allow the tree to have all its branches expanded, when first rendered

### `accordion`

Type: `Boolean`

Allows the tree to be set in accordion mode

### `no-transition`

Type: `Boolean`

Added in: v2.9.2

Turn off transition effects when expanding/collapsing nodes; Also enhances perf by a lot as a side-effect; Recommended for big trees

### `filter`

Type: `String`

The text value to be used for filtering nodes

Examples:

- `'car'`

### `filter-method`

Type: `Function`

The function to use to filter the tree nodes; For best performance, reference it from your scope and do not define it inline

Examples:

- `(node, filter) => node.label.toLowerCase().includes(filter.toLowerCase())`

### `duration`

Type: `Number`

Default: `300`

Toggle animation duration (in milliseconds)

### `no-nodes-label`

Type: `String`

Override default such label for when no nodes are available

Examples:

- `'No nodes to show!'`

### `no-results-label`

Type: `String`

Override default such label for when no nodes are available due to filtering

Examples:

- `'No results'`

## Slots

### `default-header`

Slot to use for defining the header of a node

### `header-[name]`

Header template slot for describing node header; Used by nodes which have their 'header' prop set to '[name]', where '[name]' can be any string

### `default-body`

Slot to use for defining the body of a node

### `body-[name]`

Body template slot for describing node body; Used by nodes which have their 'body' prop set to '[name]', where '[name]' can be any string

## Events

### `update:expanded`

Triggered when nodes are expanded or collapsed; Used by Vue on 'v-model:update' to update its value

### `lazy-load`

Emitted when the lazy loading of nodes is finished

### `update:ticked`

Emitted when nodes are ticked/unticked via the checkbox; Used by Vue on 'v-model:ticked' to update its value

### `update:selected`

Emitted when selected node changes; Used by Vue on 'v-model:selected' to update its value

### `after-show`

Emitted when component show animation is finished

### `after-hide`

Emitted when component hide animation is finished

## Methods

### `getNodeByKey`

Get the node with the given key

### `getTickedNodes`

Get array of nodes that are ticked

### `getExpandedNodes`

Get array of nodes that are expanded

### `isExpanded`

Determine if a node is expanded

### `expandAll`

Use to expand all branches of the tree

### `collapseAll`

Use to collapse all branches of the tree

### `setExpanded`

Expands the tree at the point of the node with the key given

### `isTicked`

Method to check if a node's checkbox is selected or not

### `setTicked`

Method to set a node's checkbox programmatically
