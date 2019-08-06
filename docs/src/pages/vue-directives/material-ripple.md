---
title: Material Ripples
desc: Vue directive for easily adding material ripples to your components and DOM elements.
---
Material Ripple effect can easily be added to any DOM element (or component) through the `v-ripple` Quasar directive.

::: danger
Do not use this directive on components that already have material ripples baked in (example: `QBtn`). Rather configure the internal ripples through those component's `ripple` property.
:::

## Installing
<doc-installation directives="Ripple" />

## Usage

::: warning
Make sure that your DOM element or component has CSS `position: relative` or Quasar CSS helper class `relative-position` attached to it.
:::

<doc-example title="Basic" file="Ripple/Basic" />

The Material Ripple takes the CSS color of text by default, but you can configure it:

<doc-example title="Colored" file="Ripple/Colored" />

You can also configure if the ripple should always start from center or not, regardless of the touch point:

<doc-example title="Positioning" file="Ripple/Positioning" />

If for some reason you have a scenario where the ripples need to be disabled, then you can assign a Boolean as value for the directive:

<doc-example title="Disable" file="Ripple/Disable" />

## API
<doc-api file="Ripple" />
