---
title: Tooltip
---
QTooltip should be used when you want to offer the user more information about a certain area in your App. When hovering the mouse over the target element (or quickly tapping on mobile platforms), the Tooltip will appear.

## Installation
<doc-installation components="Qtooltip" />

## Usage
In the example below we use a QBtn (as a target) and when hovering over it, Quasar will display some text.
You can replace QBtn and the Tooltip content with any DOM elements or components you like.
<doc-example title="Basic" file="QTooltip/Standard" />
The idea is to place QTooltip inside your DOM element / component (as **direct child in DOM hierarchy**), when you want it to be the trigger for the QTooltip. Don’t worry about QTooltip content inheriting CSS from the container. This won’t occur, since QTooltip will be injected as a direct child of `<body>`.

<doc-example title="Toggle through v-model" file="QTooltip/VModel" />

<doc-example title="One second delay" file="QTooltip/OneSecond" />

<doc-example title="With offset" file="QTooltip/Offset" />

<doc-example title="Custom transition" file="QTooltip/CustomTransition" />

## Positioning
The position of QTooltip can be customized. It keeps account of the anchor and self optional Vue properties. Check out the demo and play with them.

The final position of QTooltip popup is calculated so that it will be displayed on the available screen real estate, switching to the right-side and/or top-side when necessary.

<doc-example title="Configure" file="QTooltip/Config" />

## API
<doc-api file="QTooltip" />
