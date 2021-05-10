---
title: Spinners
desc: The QSpinner and its derived Vue components are used to show the user a timely process is currently taking place. It gives the user the feeling the system is continuing to work for longer term activities.
related:
  - /vue-components/linear-progress
  - /vue-components/circular-progress
  - /vue-components/skeleton
  - /vue-components/inner-loading
  - /quasar-plugins/loading
  - /quasar-plugins/loading-bar
---

A Spinner is used to show the user a timely process is currently taking place. It is an important UX feature, which gives the user the feeling the system is continuing to work for longer term activities, like grabbing data from the server or some heavy calculations.

## Installation
::: tip
Choose your spinner from the list below (you'll only need to specify the ones that you are using) if any installation is required.
:::

<doc-installation :components="[ 'QSpinner', 'QSpinnerAudio', 'QSpinnerBall', 'QSpinnerBars', 'QSpinnerBox', 'QSpinnerClock', 'QSpinnerComment', 'QSpinnerCube', 'QSpinnerDots', 'QSpinnerFacebook', 'QSpinnerGears', 'QSpinnerGrid', 'QSpinnerHearts', 'QSpinnerHourglass', 'QSpinnerInfinity', 'QSpinnerIos', 'QSpinnerOrbit', 'QSpinnerOval', 'QSpinnerPie', 'QSpinnerPuff', 'QSpinnerRadio', 'QSpinnerRings', 'QSpinnerTail' ]" />

## Usage

<doc-example title="QSpinner" file="QSpinner/Default" />

In the example below, hover over the spinners to see their names.

<doc-example title="Other spinners" file="QSpinner/Others" />

<doc-example title="Coloring" file="QSpinner/Color" />

Please note that by default, QSpinner and all other spinners inherit the font-size of the parent and applies it as its size.

<doc-example title="Size" file="QSpinner/Size" />

<doc-example title="Standard sizes" file="QSpinner/StandardSizes" />

## QSpinner API

<doc-api file="QSpinner" />

## Other Spinners API

::: tip
The API below applies to all spinners, except for QSpinner. Making an example with QSpinnerCube.
:::

<doc-api file="QSpinnerCube" />
