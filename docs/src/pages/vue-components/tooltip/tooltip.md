---
title: Tooltip
desc: The QTooltip Vue component is to be used when you want to offer the user more information about a certain area in your App. When hovering the mouse over the target element (or briefly touching and holding on mobile platforms), the tooltip will appear.
keys: QTooltip
examples: QTooltip
related:
  - /vue-components/menu
components:
  - ./TooltipPositioning
---
The QTooltip component is to be used when you want to offer the user more information about a certain area in your App. When hovering the mouse over the target element (or quickly tapping on mobile platforms), the tooltip will appear.

<doc-api file="QTooltip" />

## Usage
The idea with QTooltip is to place it inside your DOM element / component that you want to be the trigger as direct child. Don’t worry about QTooltip content inheriting CSS from the container as the QTooltip will be injected as a direct child of `<body>` through a Quasar Portal.

<doc-example title="Basic" file="Basic" />

<doc-example title="Toggle through v-model" file="VModel" />

### Customize

<doc-example title="Customize" file="Coloring" />

<doc-example title="Custom delay (1 second)" file="OneSecond" />

<doc-example title="With offset" file="Offset" />

### Transitions

In the example below there's a few transitions showcased. For a full list of transitions available, go to [Transitions](/options/transitions).

<doc-example title="Custom transition" file="CustomTransition" />

### Reusable

The example below shows how to create a re-usable menu that can be shared with different targets.

<doc-example title="Using target" file="Target" />

### Positioning
The position of QTooltip can be customized. It keeps account of the `anchor` and `self` optional props.
The final position of QTooltip popup is calculated so that it will be displayed on the available screen real estate, switching to the right-side and/or top-side when necessary.

For horizontal positioning you can use `start` and `end` when you want to automatically take into account if on RTL or non-RTL. `start` and `end` mean "left" for non-RTL and "right" for RTL.

<tooltip-positioning />
