<template>
  <div class="q-loading animate-fade fullscreen column items-center justify-center z-absolute">
    <q-spinner :name="spinner" :color="spinnerColor" :size="spinnerSize"></q-spinner>
    <div
      v-if="message"
      :style="{color: messageColor}"
    >{{ message }}</div>
  </div>
</template>

<script>
import { QSpinner } from '../spinner'

export default {
  name: 'q-loading',
  components: {
    QSpinner
  },
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
