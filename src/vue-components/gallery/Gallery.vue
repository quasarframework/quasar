<template>
  <div class="q-gallery">
    <div
      v-for="(img, index) in src"
      :key="index"
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
