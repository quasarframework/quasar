---
title: Popup Proxy
desc: The QPopupProxy is a Vue component that should be used when you need either a QMenu or a QDialog (on smaller screens) to be displayed.
keys: QPopupProxy
examples: QPopupProxy
related:
  - /vue-components/menu
  - /vue-components/dialog
  - /vue-directives/close-popup
---

QPopupProxy should be used when you need either a [QMenu](/vue-components/menu) (on bigger screens) or a [QDialog](/vue-components/dialog) (on smaller screens) to be displayed. It acts as a proxy which picks either of the two components to use. QPopupProxy also handles context-menus.

<DocApi file="QPopupProxy" />

## Usage

::: tip
Use your browsers development tools to toggle the device between mobile or desktop (with browser refresh after each change) or, physically resize your browser's window to watch the QPopupProxy component switch between either a QMenu or a QDialog before clicking/tapping on its container. The default breakpoint is set at 450px.
:::

### Standard

<DocExample title="Standard" file="Standard" />

### Context menu

<DocExample title="Context menu (right click / long tap)" file="ContextMenu" />

### Breakpoint

On the example below, click on the icon in the input. The QInput stays focused for as long as the popup is open, whichever of the two components got rendered.

<DocExample title="Breakpoint @600px" file="Breakpoint" />

### Pass-through props

Keep in mind that all props from both [QMenu](/vue-components/menu) and [QDialog](/vue-components/dialog) are passed through via this component. So props like `offset` or `transition-show` (as a mere example) can be used in conjunction with QPopupProxy. The only exception is `separate-close-popup`, which QPopupProxy manages internally.

<DocExample title="Props from QMenu or QDialog" file="Passthrough" />

::: tip
When a Menu is used, QPopupProxy applies a default `max-height` of `99vh` to it. Set the `max-height` prop to override this.
:::

## Accessibility <q-badge label="v2.25+" />

QPopupProxy has no semantics of its own — it exposes whatever the rendered component provides. Below the breakpoint that is a QDialog (`role="dialog"` with a managed `aria-modal`), above it a QMenu (a positioned container that deliberately claims no ARIA role). See [QDialog's Accessibility section](/vue-components/dialog#accessibility) and [QMenu's Accessibility section](/vue-components/menu#accessibility) for what each mode announces and how it handles keyboard interaction and focus.

::: warning
Just like props, attributes fall through to whichever component is currently active — and that includes `role`. A role you intend for menu mode (e.g. `role="menu"`) would, under the breakpoint, land on the QDialog and replace its `role="dialog"`. If you need to declare a role, put it on an element inside the popup content (such as the wrapping QList) rather than on QPopupProxy itself.
:::
