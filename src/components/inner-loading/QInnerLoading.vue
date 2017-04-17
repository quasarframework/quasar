<template>
  <div
    v-if="visible"
    class="q-inner-loading animate-fade absolute-full column items-center justify-center"
    :class="{dark: dark}"
  >
    <slot>
      <q-spinner :size="size"></q-spinner>
    </slot>
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
    dark: Boolean,
    visible: Boolean,
    size: {
      type: Number,
      default: 42
    }
  }
}
</script>
