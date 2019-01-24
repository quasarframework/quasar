---
title: Stepper
---

A Stepper conveys progress through numbered steps. Steppers display progress through a sequence of logical and numbered steps. They may also be used for navigation. It's usually useful when the user has to follow steps to complete a process, like in a <a href="https://en.wikipedia.org/wiki/Wizard_(software)">wizard</a>.

The stepper component is built from three different child components:

- **QStepper** - main Stepper encapsulating component
- **QStep** - individual steps
- **QStepperNavigation** - helper for encapsulating Stepper navigation buttons (within QStep or globally for the stepper as direct child of QStepper)

## Installation

<doc-installation :components="['QStepper', 'QStep', 'QStepperNavigation']" />

## Usage

Here's a small example showcasing a very basic Stepper to understand how components fit together.

<doc-example title="Basic" file="QStepper/Basic" />

## QStepper API

<doc-api file="QStepper" />

## QStep API

<doc-api file="QStep" />

## QStepperNavigation API

<doc-api file="QStepperNavigation" />
