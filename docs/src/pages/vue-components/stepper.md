---
title: Stepper
related:
  - /options/transitions
---

A Stepper conveys progress through numbered steps. Steppers display progress
through a sequence of logical and numbered steps. They may also be used for
navigation. It's usually useful when the user has to follow steps to complete a
process, like in a [wizard](https://en.wikipedia.org/wiki/Wizard_(software)).

## Installation

<doc-installation :components="['QStepper', 'QStep', 'QStepperNavigation']" />

## Usage

<doc-example title="Horizontal" file="QStepper/TypeHorizontal" />

<doc-example title="Vertical" file="QStepper/TypeVertical" />

### Header navigation

<doc-example title="Non-linear header navigation" file="QStepper/NonLinearNavigation" />

<doc-example title="Linear header navigation" file="QStepper/LinearNavigation" />

### Header options

<doc-example title="Signaling step error" file="QStepper/StepError" />

<doc-example title="Alternative labels" file="QStepper/AlternativeLabels" />

::: tip
You can also connect `contracted` prop to `$q.screen` to make a responsive behavior, like `:contracted="$q.screen.lt.md`.
More info: [Quasar Screen Plugin](/options/screen-plugin).
:::

<doc-example title="Contracted" file="QStepper/Contracted" />

### Style

Play with coloring using the `*-icon` and `*-color` props (on QStepper or override on specific QStep).

<doc-example title="Coloring" file="QStepper/Coloring" />

<doc-example title="Dark" file="QStepper/Dark" />

## QStepper API

<doc-api file="QStepper" />

## QStep API

<doc-api file="QStep" />

## QStepperNavigation API

This component allows you to place buttons within `QStepper` or `QStep` to
navigate through the steps. It is up to you to add whatever buttons you require.

::: tip
To use global navigation, you must add it to the `QStepper` 'navigation' slot.
:::

<doc-api file="QStepperNavigation" />
