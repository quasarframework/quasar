---
title: Context Menu
---

The **QMenu** component allows you to display a context menu (popup) instead of the default browser one when user performs a right-click (or long tap on touch capable devices).

## Installation
<doc-installation components="QMenu" plugins="Notify" directives="CloseMenu" />

## Usage
Context menus can contain anything. In the example below, we display a menu.

<doc-example title="Basic" file="QMenu/Basic" />

The position of the popup is calculated so that it will be displayed on the available screen real estate, switching sides (right/left and/or top/bottom) when necessary.
Clicking/Tapping outside of the popup will close the Context Menu.

> Notice the "v-close-menu" directive. When applied to any element within a popup (Popover, Modal) like in this case, it closes it.

> **IMPORTANT**
> When on a mobile app and user hits the phone/tablet back button, the Context Menu will get closed automatically.
> When on a desktop browser and user hits the &lt;ESCAPE&gt; key, the Context Menu will get close automatically.

## API
<doc-api file="QMenu" />