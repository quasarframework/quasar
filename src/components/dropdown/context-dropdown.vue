<template>
  <div
    v-el:menu
    class="quasar-dropdown-menu"
    style="display: none;"
  >
    <slot></slot>
  </div>
</template>

<script>
import $ from 'jquery'
import vm from './dropdown-common'

export default {
  mixins: [vm],
  ready () {
    this.target = $(this.$el).parent()
    this.target.on('contextmenu', this.open)
  },
  destroy () {
    this.target.off('contextmenu', this.open)
    $('body').off('mousedown', this.close)
  }
}
</script>
