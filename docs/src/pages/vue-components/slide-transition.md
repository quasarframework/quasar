---
title: Slide Transition
desc: The QSlideTransition Vue component slides the encapsulated element up or down, based on its visibility. Works alongside v-show and v-if.
keys: QSlideTransition
examples: QSlideTransition
related:
  - /vue-components/expansion-item
  - /options/transitions
---

QSlideTransition slides the DOM element (or component) up or down, based on its visibility: works alongside `v-show` and `v-if` on a single element, similar to Vue's Transition component with the only difference being that it's not a group transition too (it only applies to one DOM element or component).

<DocApi file="QSlideTransition" />

## Usage

<DocExample title="Basic" file="Basic" />

## Accessibility <q-badge label="v2.25+" />

QSlideTransition is renderless and only animates the height of its child, so it has no ARIA surface of its own. Note that the animation runs in JavaScript and therefore plays regardless of the user's `prefers-reduced-motion` setting — motion-sensitive apps may want to skip the animated collapse for such users.
