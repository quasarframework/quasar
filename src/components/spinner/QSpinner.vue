<template>
  <component :is="'q-spinner-' + name" :size="size" :color="color"></component>
</template>

<script>
import QSpinnerIos from './list/ios.vue'
import QSpinnerMat from './list/mat.vue'
import mixin from './spinner-mixin'

import { current as theme } from '../../features/theme'

export default {
  name: 'q-spinner',
  mixins: [mixin],
  computed: {
    name () {
      return theme
    }
  },
  components: {
    QSpinnerIos,
    QSpinnerMat
  }
}
</script>
