<template>
  <div class="quasar-loading fullscreen column items-center justify-center z-absolute">
    <spinner :name="spinner" color="#fff" :size="80"></spinner>
    <div v-if="message" style="margin: 40px 20px 0 20px; max-width: 450px; text-align: center; color: white; text-shadow: 0 0 7px black">{{ message }}</div>
  </div>
</template>

<script>
export default {
  props: {
    message: [String, Boolean],
    spinner: String
  }
}
</script>
