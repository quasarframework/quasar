---
title: Close Popup Directive
desc: Helper Vue directive when working with QDialog or QMenu.
keys: close-popup
examples: ClosePopup
related:
  - /vue-components/dialog
  - /vue-components/menu
---

This directive is a helper when dealing with [QDialog](/vue-components/dialog) and [QMenu](/vue-components/menu) components. When attached to a DOM element or component then that component will close the QDialog or QMenu (whichever is first parent) when clicked/tapped.

<doc-api file="ClosePopup" />

## Usage

### Basic

<doc-example title="With a QMenu" file="Menu" />

<doc-example title="With a QDialog" file="Dialog" />

### Closing multiple levels

You can also close multiple levels of popups by supplying a level number to the directive:

```html
<... v-close-popup="3">
```

* If value is 0 or boolean `false` then directive is disabled
* If value is < 0 then it closes all popups in the chain
* If value is 1 or boolean `true` or undefined then it closes only the parent popup
* If value is > 1 it closes the specified number of parent popups in the chain (note that chained QMenus are considered 1 popup only & QPopupProxy separates chained menus)

Notice below that chained QMenus (one directly put under the other) do not require you to specify multiple levels. When `v-close-popup` is used in a chained QMenu, it considers all directly chained QMenus as one level only.

<doc-example title="Menu tree" file="MenuTree" />

In the example below, the menu uses 2 levels, which means it will also close the dialog, since the dialog is its parent:

<doc-example title="Dialog with menu" file="DialogMenu" />

Notice below that the inner dialog is a child of the main dialog. This is the only way for which `v-close-popup` will be able to close both dialogs while using multiple levels. Otherwise, if dialogs are siblings (or any other similar scenario where one dialog is not child of the other), you will have to use v-models on dialogs and handle closing of both dialogs yourself.

<doc-example title="Dialog in Dialog" file="DialogInDialog" />
