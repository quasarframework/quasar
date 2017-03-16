<template>
  <div
    v-if="show"
    class="q-inner-loading absolute-full row items-center justify-center"
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
    show: Boolean
  }
}
</script>
