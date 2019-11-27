---
title: Tooltip
desc: The QTooltip Vue component is to be used when you want to offer the user more information about a certain area in your App. When hovering the mouse over the target element (or briefly touching and holding on mobile platforms), the tooltip will appear.
related:
  - /vue-components/menu
components:
  - tooltip/TooltipPositioning
---
The QTooltip component is to be used when you want to offer the user more information about a certain area in your App. When hovering the mouse over the target element (or quickly tapping on mobile platforms), the tooltip will appear.

## Installation
<doc-installation components="QTooltip" />

## Usage
The idea with QTooltip is to place it inside your DOM element / component that you want to be the trigger as direct child. Don’t worry about QTooltip content inheriting CSS from the container as the QTooltip will be injected as a direct child of `<body>` through a Quasar Portal.

<doc-example title="Basic" file="QTooltip/Basic" />

<doc-example title="Toggle through v-model" file="QTooltip/VModel" />

### Customize

<doc-example title="Customize" file="QTooltip/Coloring" />

<doc-example title="Custom delay (1 second)" file="QTooltip/OneSecond" />

<doc-example title="With offset" file="QTooltip/Offset" />

### Transitions

In the example below there's a few transitions showcased. For a full list of transitions available, go to [Transitions](/options/transitions).

<doc-example title="Custom transition" file="QTooltip/CustomTransition" />

### Reusable

The example below shows how to create a re-usable menu that can be shared with different targets.

<doc-example title="Using target" file="QTooltip/Target" />

### Positioning
The position of QTooltip can be customized. It keeps account of the `anchor` and `self` optional props.
The final position of QTooltip popup is calculated so that it will be displayed on the available screen real estate, switching to the right-side and/or top-side when necessary.

<tooltip-positioning />

## QTooltip API
<doc-api file="QTooltip" />
