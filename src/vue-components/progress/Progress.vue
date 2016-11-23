<template>
  <div class="q-progress">
    <div :style="{width: model + '%'}"></div>
  </div>
</template>

<script>
export default {
  props: {
    percentage: {
      type: Number,
      default: 0
    }
  },
  computed: {
    model () {
      return Math.max(0, Math.min(100, this.percentage))
    }
  }
}
</script>
