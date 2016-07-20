<template>
  <div class="quasar-gallery">
    <div
      v-for="img in src"
      track-by="$index"
      :style="{width: width}"
    >
      <img :src="img">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: Array,
      required: true
    },
    width: {
      type: String,
      default: '150px'
    }
  }
}
</script>
