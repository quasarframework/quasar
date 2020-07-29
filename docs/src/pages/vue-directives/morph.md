---
title: Morph Directive
desc: Vue directive that morphs DOM elements between two states.
badge: "v1.13+"
related:
  - /quasar-utils/morph-utils
---

"Morph" is a Quasar directive that provides the ability to morph DOM elements between two states.

Under the covers, it uses the Quasar [Morph function util](/quasar-utils/morph-utils).

## Installation

<doc-installation directives="Morph" />

## Usage

Reading the [Morph function util](/quasar-utils/morph-utils) first will be best in your understanding of how this directive works.

This directive morphs one element in a group into another. The morphing is activated by changing the value of the directive (or the `trigger` key of the object passed to the directive if a configuration object is used).
If the trigger value is **falsy** then the element is hidden, else the element is morphed from the currently visible element.

<doc-example title="Morph between multiple elements in a group" file="Morph/BasicGroup" />

<doc-example title="Morph a button into a card" file="Morph/Card" />

## Morph API

<doc-api file="Morph" />
