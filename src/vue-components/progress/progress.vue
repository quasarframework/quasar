<template>
  <div class="quasar-progress">
    <div :style="{width: model + '%'}"></div>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Number,
      default: 0
    }
  }
}
</script>
