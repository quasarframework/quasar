---
title: Stepper
---

A Stepper conveys progress through numbered steps. Steppers display progress
through a sequence of logical and numbered steps. They may also be used for
navigation. It's usually useful when the user has to follow steps to complete a
process, like in a [wizard](https://en.wikipedia.org/wiki/Wizard_(software))

The stepper component is built from three different child components:

- **QStepper** - main Stepper encapsulating component
- **QStep** - individual steps
- **QStepperNavigation** - helper for encapsulating Stepper navigation buttons
  (within QStep or globally for the stepper in the 'navigation' slot of
  QStepper)

## Installation

<doc-installation :components="['QStepper', 'QStep', 'QStepperNavigation']" />

## Usage

Here's a small example showcasing a very basic Stepper to understand how
components fit together. This one uses global navigation assigned to the
"navigation" slot.

<doc-example title="Basic" file="QStepper/Basic" />

A more involved example. This one uses custom navigation on each step.

<doc-example title="Advanced" file="QStepper/Advanced" />

Each `QStep` has a name prop. Use this prop along with `v-model` to control the
current step.

The example below shows how you can use `v-model` alone to control navigation.
Notice the `@click` events. If you dynamically insert/remove steps it’s better
to use a Vue reference on `QStepper` and call `next()` or `previous()` methods
since these methods are not bound to specific step names.

<doc-example title="Using v-model" file="QStepper/UsingVModel" />

It is also possible to build a stepper, which presents itself in a vertical
fashion. To do this, simply use vertical property on QStepper:

<doc-example title="Vertical Stepper" file="QStepper/Vertical" />

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
