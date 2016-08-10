<template>
  <div class="quasar-dropdown">
    <div class="quasar-dropdown-target" @click="toggle">
      <slot name="target"></slot>
    </div>
    <div
      v-el:menu
      class="quasar-dropdown-menu"
      style="display: none;"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
import vm from './dropdown-common'

export default {
  mixins: [vm],
  destroy () {
    document.body.removeEventListener('mousedown', this.close)
  }
}
</script>
