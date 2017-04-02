<template>
  <div
    v-if="visible"
    class="q-inner-loading animate-fade absolute-full column items-center justify-center"
    :class="{dark: dark}"
  >
    <spinner :name="spinner"></spinner>
  </div>
</template>

<script>
import { QSpinner } from '../spinner'

export default {
  name: 'q-inner-loading',
  components: {
    QSpinner
  },
  props: {
    spinner: String,
    dark: Boolean,
    visible: Boolean
  }
}
</script>
