<template>
  <div class="q-progress">
    <div :style="{width: model + '%'}"></div>
  </div>
</template>

<script>
import Utils from '../../utils'

export default {
  props: {
    percentage: {
      type: Number,
      default: 0
    }
  },
  computed: {
    model () {
      return Utils.format.between(this.percentage, 0, 100)
    }
  }
}
</script>
