<template>
  <component :is="name" :size="size" :color="color"></component>
</template>

<script>
import SpinnerAudio from './svg-spinners/audio.vue'
import SpinnerBall from './svg-spinners/ball.vue'
import SpinnerBars from './svg-spinners/bars.vue'
import SpinnerCircles from './svg-spinners/circles.vue'
import SpinnerDots from './svg-spinners/dots.vue'
import SpinnerFacebook from './svg-spinners/facebook.vue'
import SpinnerGears from './svg-spinners/gears.vue'
import SpinnerGrid from './svg-spinners/grid.vue'
import SpinnerHearts from './svg-spinners/hearts.vue'
import SpinnerHourglass from './svg-spinners/hourglass.vue'
import SpinnerInf from './svg-spinners/infinity.vue'
import SpinnerIos from './svg-spinners/ios.vue'
import SpinnerOval from './svg-spinners/oval.vue'
import SpinnerPie from './svg-spinners/pie.vue'
import SpinnerPuff from './svg-spinners/puff.vue'
import SpinnerRadio from './svg-spinners/radio.vue'
import SpinnerRings from './svg-spinners/rings.vue'
import SpinnerTail from './svg-spinners/tail.vue'

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
    SpinnerAudio,
    SpinnerBall,
    SpinnerBars,
    SpinnerCircles,
    SpinnerDots,
    SpinnerFacebook,
    SpinnerGears,
    SpinnerGrid,
    SpinnerHearts,
    SpinnerHourglass,
    SpinnerInf,
    SpinnerIos,
    SpinnerOval,
    SpinnerPie,
    SpinnerPuff,
    SpinnerRadio,
    SpinnerRings,
    SpinnerTail
  }
}
</script>
