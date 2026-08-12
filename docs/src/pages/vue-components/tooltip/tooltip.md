---
title: Tooltip
desc: The QTooltip Vue component is to be used when you want to offer the user more information about a certain area in your App. When hovering the mouse over the target element (or briefly touching and holding on mobile platforms), the tooltip will appear.
keys: QTooltip
examples: QTooltip
related:
  - /vue-components/menu
---

The QTooltip component is to be used when you want to offer the user more information about a certain area in your App. When hovering the mouse over the target element (or briefly touching and holding on mobile platforms), the tooltip will appear.

<DocApi file="QTooltip" />

## Usage

The idea with QTooltip is to place it inside your DOM element / component that you want to be the trigger as direct child. Don’t worry about QTooltip content inheriting CSS from the container as the QTooltip will be injected as a direct child of `<body>` through a Quasar Portal.

<DocExample title="Basic" file="Basic" />

<DocExample title="Toggle through v-model" file="VModel" />

::: warning
If you want to conditionally activate or de-activate a QTooltip, please use `v-if` on it instead of `v-show`.
:::

### Customize

<DocExample title="Customize" file="Coloring" />

<DocExample title="Custom delay (1 second)" file="OneSecond" />

<DocExample title="With offset" file="Offset" />

### Transitions

In the example below there's a few transitions showcased. For a full list of transitions available, go to [Transitions](/options/transitions).

<DocExample title="Custom transition" file="CustomTransition" />

### Reusable

The example below shows how to create a re-usable menu that can be shared with different targets.

<DocExample title="Using target" file="Target" />

### Positioning

The position of QTooltip can be customized. It keeps account of the `anchor` and `self` optional props.
The final position of QTooltip popup is calculated so that it will be displayed on the available screen real estate, switching to the right-side and/or top-side when necessary.

For horizontal positioning you can use `start` and `end` when you want to automatically take into account if on RTL or non-RTL. `start` and `end` mean "left" for non-RTL and "right" for RTL.

::: tip
The `offset` prop is applied to the **anchor element's bounding box**, and only then is the final position clamped to the available screen real estate. As a result, a large offset — or anchoring QTooltip to a full-width / screen-edge element — can push the popup against a viewport edge, where it gets clamped and the offset appears to have no effect (the clamped position then becomes independent of the offset value). If an `offset` seems to be ignored on one axis, make sure the chosen `anchor`/`self` lets the popup expand into free space on that axis — for example, attach QTooltip to an inline / `inline-block` trigger rather than to a full-width block element.
:::

<script doc>
import TooltipPositioning from './TooltipPositioning.vue'
</script>

<TooltipPositioning />

## Accessibility

QTooltip implements the [WAI-ARIA tooltip pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/): the popup renders with `role="tooltip"` and, while it is shown, its `id` is added to the anchor element's `aria-describedby` (any values you set there yourself are preserved and restored on hide), so screen readers announce the tooltip content as the anchor's description. The tooltip shows on keyboard focus (when the anchor matches `:focus-visible`) just as it does on hover, and <kbd>Escape</kbd> hides it without moving focus, as [WCAG 1.4.13](https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html) requires.

Two things to keep in mind. A tooltip is a _description_, not a name — an icon-only button still needs its own `aria-label`, with the tooltip merely supplementing it. And the tooltip itself is transparent to the mouse (it cannot be hovered, and it hides when the pointer leaves the anchor), so keep its content short and non-interactive.
