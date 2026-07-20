---
title: Spinners
description: The QSpinner and its derived Vue components are used to show the user a timely process is currently taking place. It gives the user the feeling the system is continuing to work for longer term activities.
canonical: https://quasar.dev/vue-components/spinners
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QSpinner](../../api/QSpinner.md)
- [QSpinnerAudio](../../api/QSpinnerAudio.md)
- [QSpinnerBall](../../api/QSpinnerBall.md)
- [QSpinnerBars](../../api/QSpinnerBars.md)
- [QSpinnerBox](../../api/QSpinnerBox.md)
- [QSpinnerClock](../../api/QSpinnerClock.md)
- [QSpinnerComment](../../api/QSpinnerComment.md)
- [QSpinnerCube](../../api/QSpinnerCube.md)
- [QSpinnerDots](../../api/QSpinnerDots.md)
- [QSpinnerFacebook](../../api/QSpinnerFacebook.md)
- [QSpinnerGears](../../api/QSpinnerGears.md)
- [QSpinnerGrid](../../api/QSpinnerGrid.md)
- [QSpinnerHearts](../../api/QSpinnerHearts.md)
- [QSpinnerHourglass](../../api/QSpinnerHourglass.md)
- [QSpinnerInfinity](../../api/QSpinnerInfinity.md)
- [QSpinnerIos](../../api/QSpinnerIos.md)
- [QSpinnerOrbit](../../api/QSpinnerOrbit.md)
- [QSpinnerOval](../../api/QSpinnerOval.md)
- [QSpinnerPie](../../api/QSpinnerPie.md)
- [QSpinnerPuff](../../api/QSpinnerPuff.md)
- [QSpinnerRadio](../../api/QSpinnerRadio.md)
- [QSpinnerRings](../../api/QSpinnerRings.md)
- [QSpinnerTail](../../api/QSpinnerTail.md)

A Spinner is used to show the user a timely process is currently taking place. It is an important UX feature, which gives the user the feeling the system is continuing to work for longer term activities, like grabbing data from the server or some heavy calculations.

**API reference:** [QSpinner](../../api/QSpinner.md)

::: tip
The API below applies to all spinners, except for QSpinner. Making an example with QSpinnerCube.
:::

**API reference:** [QSpinnerCube](../../api/QSpinnerCube.md)

## Usage

**Example: QSpinner**

Source: [Default.vue](../../examples/QSpinner/Default.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <q-spinner color="primary" size="3em" />

      <q-spinner color="primary" size="3em" :thickness="2" />

      <q-spinner color="primary" size="3em" :thickness="10" />
    </div>
  </div>
</template>
````

In the example below, hover over the spinners to see their names.

**Example: Other spinners**

Source: [Others.vue](../../examples/QSpinner/Others.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-xs">
    <div class="q-gutter-md row justify-center">
      <div>
        <q-spinner-audio color="primary" size="2em" />
        <q-tooltip :offset="[0, 8]">QSpinnerAudio</q-tooltip>
      </div>
      <div>
        <q-spinner-ball color="primary" size="2em" />
        <q-tooltip :offset="[0, 8]">QSpinnerBall</q-tooltip>
      </div>
      <div>
        <q-spinner-bars color="primary" size="2em" />
        <q-tooltip :offset="[0, 8]">QSpinnerBars</q-tooltip>
      </div>
      <div>
        <q-spinner-box color="primary" size="2em" />
        <q-tooltip :offset="[0, 8]">QSpinnerBox</q-tooltip>
      </div>
      <div>
        <q-spinner-clock color="primary" size="2em" />
        <q-tooltip :offset="[0, 8]">QSpinnerClock</q-tooltip>
      </div>
      <div>
        <q-spinner-comment color="primary" size="2em" />
        <q-tooltip :offset="[0, 8]">QSpinnerComment</q-tooltip>
      </div>
      <div>
        <q-spinner-cube color="primary" size="2em" />
        <q-tooltip :offset="[0, 8]">QSpinnerCube</q-tooltip>
      </div>
      <div>
        <q-spinner-dots color="primary" size="2em" />
        <q-tooltip :offset="[0, 8]">QSpinnerDots</q-tooltip>
      </div>
      <div>
        <q-spinner-facebook color="primary" size="2em" />
        <q-tooltip :offset="[0, 8]">QSpinnerFacebook</q-tooltip>
      </div>
      <div>
        <q-spinner-gears color="primary" size="2em" />
        <q-tooltip :offset="[0, 8]">QSpinnerGears</q-tooltip>
      </div>
      <div>
        <q-spinner-grid color="primary" size="2em" />
        <q-tooltip :offset="[0, 8]">QSpinnerGrid</q-tooltip>
      </div>
      <div>
        <q-spinner-hearts color="primary" size="2em" />
        <q-tooltip :offset="[0, 8]">QSpinnerHearts</q-tooltip>
      </div>
      <div>
        <q-spinner-hourglass color="primary" size="2em" />
        <q-tooltip :offset="[0, 8]">QSpinnerHourglass</q-tooltip>
      </div>
      <div>
        <q-spinner-infinity color="primary" size="2em" />
        <q-tooltip :offset="[0, 8]">QSpinnerInfinity</q-tooltip>
      </div>
      <div>
        <q-spinner-ios color="primary" size="2em" />
        <q-tooltip :offset="[0, 8]">QSpinnerIos</q-tooltip>
      </div>
      <div>
        <q-spinner-orbit color="primary" size="2em" />
        <q-tooltip :offset="[0, 8]">QSpinnerOrbit</q-tooltip>
      </div>
      <div>
        <q-spinner-oval color="primary" size="2em" />
        <q-tooltip :offset="[0, 8]">QSpinnerOval</q-tooltip>
      </div>
      <div>
        <q-spinner-pie color="primary" size="2em" />
        <q-tooltip :offset="[0, 8]">QSpinnerPie</q-tooltip>
      </div>
      <div>
        <q-spinner-puff color="primary" size="2em" />
        <q-tooltip :offset="[0, 8]">QSpinnerPuff</q-tooltip>
      </div>
      <div>
        <q-spinner-radio color="primary" size="2em" />
        <q-tooltip :offset="[0, 8]">QSpinnerRadio</q-tooltip>
      </div>
      <div>
        <q-spinner-rings color="primary" size="2em" />
        <q-tooltip :offset="[0, 8]">QSpinnerRings</q-tooltip>
      </div>
      <div>
        <q-spinner-tail color="primary" size="2em" />
        <q-tooltip :offset="[0, 8]">QSpinnerTail</q-tooltip>
      </div>
    </div>
  </div>
</template>
````

**Example: Coloring**

Source: [Color.vue](../../examples/QSpinner/Color.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-xs">
    <div class="q-gutter-md row justify-center" style="font-size: 2em">
      <q-spinner-audio color="secondary" />
      <q-spinner-ball color="red" />
      <q-spinner-bars color="purple" />
      <q-spinner-box color="deep-orange" />
      <q-spinner-clock color="brown" />
      <q-spinner-comment color="deep-purple" />
      <q-spinner-cube color="indigo" />
      <q-spinner-dots color="blue" />
      <q-spinner-facebook color="light-blue" />
      <q-spinner-gears color="cyan" />
      <q-spinner-grid color="teal" />
      <q-spinner-hearts color="green" />
      <q-spinner-hourglass color="light-green" />
      <q-spinner-infinity color="lime" />
      <q-spinner-ios color="yellow" />
      <q-spinner-orbit color="blue" />
      <q-spinner-oval color="amber" />
      <q-spinner-pie color="orange" />
      <q-spinner-puff color="deep-orange" />
      <q-spinner-radio color="brown" />
      <q-spinner-rings color="grey" />
      <q-spinner-tail color="blue-grey" />
    </div>
  </div>
</template>
````

Please note that by default, QSpinner and all other spinners inherit the font-size of the parent and applies it as its size.

**Example: Size**

Source: [Size.vue](../../examples/QSpinner/Size.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-xs">
    <div class="q-gutter-md row items-center">
      <q-spinner-comment color="secondary" size="2em" />

      <q-spinner-radio color="red" size="3em" />

      <q-spinner-hourglass color="purple" size="4em" />

      <q-spinner-cube color="orange" size="5.5em" />
    </div>
  </div>
</template>
````

**Example: Standard sizes**

Source: [StandardSizes.vue](../../examples/QSpinner/StandardSizes.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-center">
      <q-spinner-cube
        v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']"
        :key="size"
        :size="size"
        color="primary"
      />
    </div>
  </div>
</template>
````
