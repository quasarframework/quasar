---
title: Dashboard Panel
desc: The QDashboardPanel Vue component provides a resizable, collapsible, and locally-persisted dashboard panel that extends QCard, perfect for building dashboard layouts.
keys: QDashboardPanel
examples: QDashboardPanel
related:
  - /vue-components/card
  - /vue-components/splitter
  - /vue-composables/use-dashboard-panels
---

The QDashboardPanel component is a resizable, collapsible, locally-persisted dashboard panel that extends QCard. It's perfect for building dashboard layouts where users can customize panel sizes and states, with automatic persistence to localStorage.

## Features

- **Resizable**: Drag the right edge to resize the panel width
- **Collapsible**: Toggle to hide/show body and footer content
- **Maximizable**: Double-click the resize handle to maximize/restore
- **Persisted**: Panel size and state are automatically saved to localStorage
- **Responsive**: Full width on mobile with resize disabled
- **Accessible**: Keyboard navigation and ARIA attributes on resize handle
- **Extends QCard**: Inherits all QCard styling props (dark, flat, bordered, square)

<DocApi file="QDashboardPanel" />

## Usage

### Basic

A simple dashboard panel with header, body, and footer slots.

<DocExample title="Basic Panel" file="Basic" />

### Two Panels Side by Side

Create a dashboard layout with multiple resizable panels.

<DocExample title="Side by Side" file="SideBySide" />

### Collapsed State

Panels can be collapsed to show only the header.

<DocExample title="Collapsed Panel" file="Collapsed" />

### Maximized State

Double-click the resize handle to maximize, double-click again to restore.

<DocExample title="Maximized Panel" file="Maximized" />

### Custom Resize Handle

Provide a custom resize handle via the `resize-handle` slot.

<DocExample title="Custom Handle" file="CustomHandle" />

### Different Units

Size can be specified in `%`, `px`, or `rem`.

<DocExample title="Size Units" file="Units" />

### Group Storage with useDashboardPanels

Use the `useDashboardPanels` composable for centralized state management across multiple panels.

<DocExample title="Group Storage" file="GroupStorage" />

### Responsive Behavior

On mobile (xs and sm breakpoints), panels automatically become full width and resize is disabled.

<DocExample title="Responsive" file="Responsive" />

### With Header Actions

Add collapse/maximize buttons to the header using scoped slot props.

<DocExample title="Header Actions" file="HeaderActions" />

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `String` | — (required) | Unique identifier for persistence |
| `resizable` | `Boolean` | `true` | Enable/disable resize behavior |
| `default-size` | `Number` | `35` | Initial width in specified unit |
| `min-size` | `Number` | `15` | Minimum allowed width |
| `max-size` | `Number` | `100` | Maximum allowed width |
| `collapsed` | `Boolean` | `false` | Collapsed state (hides body/footer) |
| `maximized` | `Boolean` | `false` | Maximized state (full width) |
| `unit` | `String` | `'%'` | Size unit: `'%'`, `'px'`, or `'rem'` |
| `storage` | `String` | `'local'` | Storage strategy: `'local'` or `'group'` |
| `disable-on-mobile` | `Boolean` | `true` | Disable resize on xs/sm breakpoints |
| `keyboard-increment` | `Number` | `1` | Size change per arrow key press |

Plus all QCard props: `dark`, `square`, `flat`, `bordered`, `tag`.

### Slots

| Slot | Scoped Props | Description |
|------|--------------|-------------|
| `default` | — | Main content (hidden when collapsed) |
| `header` | `{ collapsed, maximized, toggleCollapsed, toggleMaximized }` | Header content (always visible) |
| `body` | — | Body content (hidden when collapsed) |
| `footer` | — | Footer content (hidden when collapsed) |
| `resize-handle` | `{ onMousedown, onTouchstart, onDblclick, onKeydown, disabled, size, unit, minSize, maxSize }` | Custom resize handle |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:size` | `Number` | Size changed |
| `update:collapsed` | `Boolean` | Collapsed state changed |
| `update:maximized` | `Boolean` | Maximized state changed |
| `resize-start` | `{ size, unit }` | Resize operation started |
| `resize` | `{ size, unit }` | During resize |
| `resize-end` | `{ size, unit }` | Resize operation ended |
| `collapse` | — | Panel collapsed |
| `expand` | — | Panel expanded |
| `maximize` | — | Panel maximized |
| `restore` | — | Panel restored from maximized |

### Methods

| Method | Arguments | Description |
|--------|-----------|-------------|
| `toggleCollapsed` | — | Toggle collapsed state |
| `toggleMaximized` | — | Toggle maximized state |
| `setSize` | `(size: Number)` | Set size programmatically |
| `setCollapsed` | `(value: Boolean)` | Set collapsed state |
| `setMaximized` | `(value: Boolean)` | Set maximized state |

## useDashboardPanels Composable

For managing multiple panels with shared state, use the `useDashboardPanels` composable.

```js
import { useDashboardPanels } from 'quasar'

export default {
  setup () {
    const {
      panelStates,
      registerPanel,
      setPanelSize,
      toggleCollapsed,
      resetAll
    } = useDashboardPanels({
      storageKey: 'my-dashboard',
      persist: true
    })

    return { panelStates }
  }
}
```

Panels using `storage="group"` will automatically use the parent `useDashboardPanels` context instead of individual localStorage keys.

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storageKey` | `String` | `'default'` | Key for localStorage |
| `persist` | `Boolean` | `true` | Enable/disable persistence |

### Returns

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `panelStates` | `Object` | Readonly reactive panel states |
| `registeredPanels` | `Ref<Set>` | Set of registered panel IDs |
| `registerPanel` | `Function` | Register a panel |
| `unregisterPanel` | `Function` | Unregister a panel |
| `getPanelState` | `Function` | Get panel state by ID |
| `setPanelSize` | `Function` | Set panel size |
| `setPanelCollapsed` | `Function` | Set collapsed state |
| `setPanelMaximized` | `Function` | Set maximized state |
| `toggleCollapsed` | `Function` | Toggle collapsed |
| `toggleMaximized` | `Function` | Toggle maximized |
| `resetAll` | `Function` | Reset all panels |
| `saveState` | `Function` | Force save to storage |

## Accessibility

The resize handle includes proper ARIA attributes:

- `role="separator"` - Identifies the handle as a separator
- `aria-orientation="vertical"` - Indicates vertical orientation
- `aria-valuenow` - Current size value
- `aria-valuemin` - Minimum size
- `aria-valuemax` - Maximum size

Keyboard support:
- **Arrow Right/Up**: Increase size
- **Arrow Left/Down**: Decrease size
- Focus is indicated with a visual highlight

## Persistence

Panel state is automatically persisted to localStorage using the `id` prop as the key. The following is saved:

- `size` - Current width
- `collapsed` - Collapsed state
- `maximized` - Maximized state

Invalid or corrupted data is handled gracefully by falling back to default values.







