---
title: Popup Proxy
---

QPopupProxy should be used when you want need either a [QMenu](/vue-components/menu) or a [QDialog](/vue-components/dialog) to be displayed as a result of device type/dimension. QPopupProxy also handles context-menus for both larger and smaller screens.

> Use your browsers development tools to toggle the device between mobile or desktop. Or, physically resize your browser's window to watch the QPopupProxy compnent switch between either a menu or a dialog whan a click event is fired. The default breakpoint is currently set at 450px. Changing this breakpoint value will be demostrated in an example below.

## Installation
<doc-installation components="QProxyPopup" />

## Usage
<doc-example title="Standard Menu" file="QPopupProxy/StandardMenuDialog" />
<doc-example title="Context Menu" file="QPopupProxy/ContextMenuDialog" />
<doc-example title="Menu Initial Shown" file="QPopupProxy/Value" />
<doc-example title="Breakpoint @850px" file="QPopupProxy/Breakpoint" />
<doc-example title="Disable" file="QPopupProxy/Disable" />

::: tip
Keep in mind that all props from both [QMenu](/vue-components/menu) & [QDialog](/vue-components/dialog) are pass through via this component. So the prop `:offset` or `transition-show` for example can be used in conjuction with the component.
:::

## Pass Through Props

<doc-example title="Props from QMenu or QDialog" file="QPopupProxy/PassThroughProps" />

<doc-api file="QPopupProxy" />
