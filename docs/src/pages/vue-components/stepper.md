---
title: Stepper
desc: The QStepper Vue component conveys progress through a sequence of numbered steps. It may also be used for navigation. It's usually useful when the user has to follow steps to complete a process, like in a wizard.
related:
  - /options/transitions
---

Steppers display progress through a sequence of logical and numbered steps. They may also be used for navigation.
They're usually useful when the user has to follow steps to complete a process, like in a [wizard](https://en.wikipedia.org/wiki/Wizard_(software)).

## Installation

<doc-installation :components="['QStepper', 'QStep', 'QStepperNavigation']" />

## Usage

::: tip
If the QStep content also has images and you want to use swipe actions to navigate, you might want to add `draggable="false"` to them, otherwise the native browser behavior might interfere in a negative way.
:::

::: danger
Please take notice of the Boolean `keep-alive` prop for QStepper, if you need this behavior. Do NOT use Vue's native `<keep-alive>` component over QStep.
:::

### Horizontal

<doc-example title="Horizontal" file="QStepper/TypeHorizontal" />

### Vertical

<doc-example title="Vertical" file="QStepper/TypeVertical" />

### Header navigation

<doc-example title="Non-linear header navigation" file="QStepper/NonLinearNavigation" />

<doc-example title="Linear header navigation" file="QStepper/LinearNavigation" />

### Header options

<doc-example title="Signaling step error" file="QStepper/StepError" />

<doc-example title="Alternative labels" file="QStepper/AlternativeLabels" />

::: tip
You can also connect `contracted` prop to `$q.screen` to create a responsive behavior, like `:contracted="$q.screen.lt.md"`.
More info: [Quasar Screen Plugin](/options/screen-plugin).
:::

<doc-example title="Contracted" file="QStepper/Contracted" />

### Style

Play with coloring using the `*-icon` and `*-color` props (on QStepper or override on specific QStep).

<doc-example title="Coloring" file="QStepper/Coloring" />

You can also use `prefix` prop (max 2 characters) instead of an icon for each step's header. This will be displayed if the step is not currently being edited and it isn't marked with error or as "done".

<doc-example title="Step prefix" file="QStepper/Prefix" />

<doc-example title="Dark" file="QStepper/Dark" />

Starting with Quasar v1.9.13+, you can use the `header-class` prop to apply any CSS class(es) to the header. In the example below, we are applying bolded text:

<doc-example title="Header Class" file="QStepper/HeaderClass" />

### Message slot

<doc-example title="Message slot with fixed height steps" file="QStepper/MessageSlot" />

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
