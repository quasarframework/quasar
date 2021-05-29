---
title: Popup Proxy
desc: The QPopupProxy is a Vue component that should be used when you need either a QMenu or a QDialog (on smaller screens) to be displayed.
related:
  - /vue-components/menu
  - /vue-components/dialog
  - /vue-directives/close-popup
---

QPopupProxy should be used when you need either a [QMenu](/vue-components/menu) (on bigger screens) or a [QDialog](/vue-components/dialog) (on smaller screens) to be displayed. It acts as a proxy which picks either of the two components to use. QPopupProxy also handles context-menus.

## QPopupProxy API
<doc-api file="QPopupProxy" />

## Usage
::: tip
Use your browsers development tools to toggle the device between mobile or desktop (with browser refresh after each change) or, physically resize your browser's window to watch the QPopupProxy component switch between either a QMenu or a QDialog before clicking/tapping on its container. The default breakpoint is set at 450px.
:::

### Standard

<doc-example title="Standard" file="QPopupProxy/Standard" />

### Context menu

<doc-example title="Context menu (right click / long tap)" file="QPopupProxy/ContextMenu" />

### Breakpoint

On the example below, click on the icon in the input.

<doc-example title="Breakpoint @600px" file="QPopupProxy/Breakpoint" />

### Pass-through props
Keep in mind that all props from both [QMenu](/vue-components/menu) and [QDialog](/vue-components/dialog) are passed through via this component. So props like `offset` or `transition-show` (as a mere example) can be used in conjunction with QPopupProxy.

<doc-example title="Props from QMenu or QDialog" file="QPopupProxy/Passthrough" />

::: warning
QPopupProxy treats some components ([QDate](/vue-components/date), [QTime](/vue-components/time), [QCarousel](/vue-components/carousel) and [QColor](/vue-components/color-picker)) as special ones and forces `cover: true` and `maxHeight: '99vh'` on them. If you don't want this behavior just place a `div` as the first level child of QPopupProxy.
:::
