---
title: Tooltip
desc: The QTooltip Vue component is to be used when you want to offer the user more information about a certain area in your App. When hovering the mouse over the target element (or touching and holding on touch-capable devices), the tooltip will appear.
keys: QTooltip
examples: QTooltip
related:
  - /vue-components/menu
---

The QTooltip component is to be used when you want to offer the user more information about a certain area in your App. When hovering the mouse over the target element (or touching and holding on touch-capable devices), the tooltip will appear. A stylus behaves like a mouse while hovering and like touch while pressed to the screen.

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
The final position of QTooltip popup is calculated so that it will be displayed on the available screen real estate: when the requested placement does not fit, the popup switches to the opposite side of the anchor on that axis if it offers more room, otherwise it stays on the requested side (so a trigger with equal room above and below keeps your `anchor`/`self`) and gets capped to the room it has.

For horizontal positioning you can use `start` and `end` when you want to automatically take into account if on RTL or non-RTL. `start` and `end` mean "left" for non-RTL and "right" for RTL.

<script doc>
import TooltipPositioning from './TooltipPositioning.vue'
</script>

<TooltipPositioning />

::: tip
The `offset` prop does not translate the popup by a number of pixels. It expands the **anchor element's bounding box** outward: `offset[0]` moves that box's `left` edge to the left and its `right` edge to the right, while `offset[1]` moves `top` up and `bottom` down. The popup's `self` point is then aligned to the `anchor` point of the expanded box, and only after that is the result clamped to the available screen real estate.

Two consequences are worth knowing, because both make an `offset` look like it is being ignored on one axis:

- **A `middle` or `center` anchor point does not move with the offset.** Expanding both edges by the same amount leaves the midpoint exactly where it was, so `offset[0]` is a no-op for `anchor="... middle"` and `offset[1]` is a no-op for `anchor="center ..."`, no matter which value you pass. QTooltip's default `anchor` is `bottom middle`, so its horizontal offset only starts having an effect once you pick a `left`, `right`, `start` or `end` anchor.
- **A clamped popup does not move with the offset either.** Since the offset pushes the box outward, anchoring to a full-width or screen-edge element (or passing a very large value) can send the popup past a viewport edge, where it gets clamped back and the final position no longer depends on the offset value. Attach QTooltip to an inline or `inline-block` trigger and point `anchor`/`self` into free space, so the offset has room to take effect.

In short, to place the popup at a fixed pixel distance from one side of the anchor element, name that side in `anchor` instead of relying on `middle`/`center`.
:::

#### Following the pointer <q-badge label="v2.30+" />

On a large trigger, a popup placed against the anchor element's box ends up far from what the user is actually pointing at. The `cursor-position` prop places QTooltip at the pointer instead: `anchor` is then ignored, since the pointer itself is the anchor point, while `self` and `offset` keep working.

The `offset` reads differently in this mode, and more simply: with no anchor box to expand, it is the distance between the pointer and the tooltip, applied in the direction the tooltip grows away from it. A `self` naming a `top`/`left` edge grows down and right, so it clears the pointer that way; `bottom`/`right` grows up and left and clears it the other way; and a `middle`/`center` axis, which straddles the pointer and has no direction of its own, takes the positive one, where a mouse cursor's body sits below and right of the spot it points at. Unlike the anchor-box mode above, every `self` value therefore takes both offset values.

The tooltip waits for the pointer to settle before showing, so that a pointer sweeping across the trigger does not open it at a coordinate it has already left. Small movements are tolerated, and a `delay` longer than the settle window still wins. Once shown, the position is frozen: it stays where it opened and follows the trigger through scrolling, rather than trailing the pointer around.

Two shows report no pointer position at all and keep the regular `anchor`-relative placement: a keyboard focus, and a `v-model` toggle. A touch or stylus press opens at the contact point without waiting, since a press is already deliberate.

<DocExample title="Positioned at the cursor" file="CursorPosition" />

## Accessibility <q-badge label="v2.25+" />

QTooltip implements the [WAI-ARIA tooltip pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/): the popup renders with `role="tooltip"` and, while it is shown, its `id` is added to the anchor element's `aria-describedby` (any values you set there yourself are preserved and restored on hide), so screen readers announce the tooltip content as the anchor's description. The tooltip shows on keyboard focus (when the anchor matches `:focus-visible`) just as it does on hover, and <kbd>Escape</kbd> hides it without moving focus, as [WCAG 1.4.13](https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html) requires.

Two things to keep in mind. A tooltip is a _description_, not a name — an icon-only button still needs its own `aria-label`, with the tooltip merely supplementing it. And the tooltip itself is transparent to the mouse (it cannot be hovered, and it hides when the pointer leaves the anchor), so keep its content short and non-interactive.
