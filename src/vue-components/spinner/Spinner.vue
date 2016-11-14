<template>
  <component :is="'s-' + name" :size="size" :color="color"></component>
</template>

<script>
import SAudio from './svg-spinners/audio.vue'
import SBall from './svg-spinners/ball.vue'
import SBars from './svg-spinners/bars.vue'
import SCircles from './svg-spinners/circles.vue'
import SDots from './svg-spinners/dots.vue'
import SFacebook from './svg-spinners/facebook.vue'
import SGears from './svg-spinners/gears.vue'
import SGrid from './svg-spinners/grid.vue'
import SHearts from './svg-spinners/hearts.vue'
import SHourglass from './svg-spinners/hourglass.vue'
import SInfinity from './svg-spinners/infinity.vue'
import SIos from './svg-spinners/ios.vue'
import SOval from './svg-spinners/oval.vue'
import SPie from './svg-spinners/pie.vue'
import SPuff from './svg-spinners/puff.vue'
import SRadio from './svg-spinners/radio.vue'
import SRings from './svg-spinners/rings.vue'
import STail from './svg-spinners/tail.vue'

import { current as theme } from '../../features/theme'

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
    SAudio,
    SBall,
    SBars,
    SCircles,
    SDots,
    SFacebook,
    SGears,
    SGrid,
    SHearts,
    SHourglass,
    SInfinity,
    SIos,
    SOval,
    SPie,
    SPuff,
    SRadio,
    SRings,
    STail
  }
}
</script>
