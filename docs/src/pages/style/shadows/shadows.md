---
title: CSS Shadows (Elevation)
desc: The list of CSS classes supplied by Quasar for defining elevation on DOM elements.
examples: shadows
---

Simple yet effective way to add shadows to create a depth/elevation effect.
The shadows are in accordance to Material Design specifications (24 levels of depth).

## Usage

<script doc>
import ShadowClasses from './ShadowClasses.vue'
</script>

<ShadowClasses />

<DocExample title="Standard shadows" file="Standard" scrollable />

The shadows above point towards the bottom of the element. If you want them to point towards the top of the element, add `up` before the number:

<script doc>
import ShadowDepthClasses from './ShadowDepthClasses.vue'
</script>

<ShadowDepthClasses />

<DocExample title="Shadows pointing up" file="PointingUp" scrollable />

<DocExample title="Inset shadow" file="Inset" />
