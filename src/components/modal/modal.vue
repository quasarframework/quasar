<template>
  <div class="modal hidden fullscreen flex items-center justify-center">
    <div class="modal-backdrop backdrop"></div>
    <div class="modal-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Modal from './modal'

export default {
  props: {
    set: Object,
    css: Object
  },
  methods: {
    show (onShow) {
      if (this.modal) {
        console.warn('Trying to show modal while it is being displayed.')
        return
      }

      this.modal = Modal.create(this.$el)
        .set(this.set || {})
        .css(this.css || {})
        .onClose(() => {
          this.modal = null
        })
        .show(onShow)
    },
    close (onClose) {
      if (!this.modal) {
        console.warn('Trying to close modal but no modal exists.')
      }

      this.modal.close(onClose)
    }
  },
  beforeDestroy () {
    if (this.modal) {
      this.modal.destroy()
    }
  }
}
</script>
