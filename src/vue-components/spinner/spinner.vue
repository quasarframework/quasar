<template>
  <component :is="name" :size="size" :color="color"></component>
</template>

<script>
import Audio from './svg-spinners/audio.vue'
import Ball from './svg-spinners/ball.vue'
import Bars from './svg-spinners/bars.vue'
import Circles from './svg-spinners/circles.vue'
import Dots from './svg-spinners/dots.vue'
import Facebook from './svg-spinners/facebook.vue'
import Gears from './svg-spinners/gears.vue'
import Grid from './svg-spinners/grid.vue'
import Hearts from './svg-spinners/hearts.vue'
import Hourglass from './svg-spinners/hourglass.vue'
import Inf from './svg-spinners/infinity.vue'
import Ios from './svg-spinners/ios.vue'
import Oval from './svg-spinners/oval.vue'
import Pie from './svg-spinners/pie.vue'
import Puff from './svg-spinners/puff.vue'
import Radio from './svg-spinners/radio.vue'
import Rings from './svg-spinners/rings.vue'
import Tail from './svg-spinners/tail.vue'

import { current as theme } from '../../theme'

export default {
  props: {
    name: {
      type: String,
      default: theme === 'ios' ? 'ios' : 'tail'
    },
    size: {
      type: Number,
      default: 64
    },
    color: {
      type: String,
      default: '#000'
    }
  },
  components: {
    Audio,
    Ball,
    Bars,
    Circles,
    Dots,
    Facebook,
    Gears,
    Grid,
    Hearts,
    Hourglass,
    Inf,
    Ios,
    Oval,
    Pie,
    Puff,
    Radio,
    Rings,
    Tail
  }
}
</script>
