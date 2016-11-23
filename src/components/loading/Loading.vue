<template>
  <div class="q-loading animate-fade fullscreen column items-center justify-center z-absolute">
    <spinner :name="spinner" :color="spinnerColor" :size="spinnerSize"></spinner>
    <div
      v-if="message"
      :style="{color: messageColor}"
    >{{ message }}</div>
  </div>
</template>

<script>
export default {
  props: {
    message: [String, Boolean],
    spinner: String,
    spinnerSize: {
      type: Number,
      default: 80
    },
    spinnerColor: {
      type: String,
      default: '#fff'
    },
    messageColor: {
      type: String,
      default: 'white'
    }
  }
}
</script>
