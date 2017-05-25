<template>
  <div class="q-loading animate-fade fullscreen column items-center justify-center z-absolute">
    <q-spinner :color="spinnerColor" :size="spinnerSize"></q-spinner>
    <div
      v-if="message"
      :class="`text-${messageColor}`"
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
    spinnerSize: {
      type: Number,
      default: 80
    },
    spinnerColor: {
      type: String,
      default: 'white'
    },
    messageColor: {
      type: String,
      default: 'white'
    }
  }
}
</script>
