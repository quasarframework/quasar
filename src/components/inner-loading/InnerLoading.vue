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
export default {
  props: {
    spinner: String,
    dark: Boolean,
    visible: Boolean
  }
}
</script>
