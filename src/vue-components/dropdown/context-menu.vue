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
import vm from './dropdown-common'

export default {
  mixins: [vm],
  ready () {
    this.target = this.$el.parentNode
    this.handler = event => {
      if (event.srcElement === this.target) {
        this.open(event)
      }
    }
    this.target.addEventListener('contextmenu', this.handler)
  },
  destroy () {
    this.target.removeEventListener('contextmenu', this.handler)
    document.body.removeEventListener('mousedown', this.close)
  }
}
</script>
