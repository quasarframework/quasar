<template>
  <div class="modal hidden fullscreen flex items-center justify-center">
    <div class="modal-backdrop backdrop"></div>
    <div class="modal-content">
      <div class="modal-scroll">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from '../../components/modal/modal'

export default {
  props: {
    disable: {
      type: Boolean,
      default: false,
      coerce: Boolean
    }
  },
  methods: {
    open () {
      this.handler()
    },
    close () {
      this.target.classList.remove('non-selectable')
      this.modal.close()
    },
    toggle () {
      if (this.modal.active) {
        this.close()
      }
      else {
        this.open()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.target = this.$el.parentNode

      this.handler = () => {
        if (this.disable) {
          return
        }
        this.modal = Modal.create(this.$el)
          .set({
            minimized: true,
            closeWithBackdrop: true
          })
          .show()
      }

      this.touchStartHandler = (event) => {
        this.target.classList.add('non-selectable')
        this.touchTimer = setTimeout(() => {
          event.preventDefault()
          event.stopPropagation()
          this.cleanup()
          setTimeout(() => {
            this.handler()
          }, 10)
        }, 600)
      }
      this.cleanup = () => {
        this.target.classList.remove('non-selectable')
        if (this.touchTimer) {
          clearTimeout(this.touchTimer)
          this.touchTimer = null
        }
      }
      this.target.addEventListener('touchstart', this.touchStartHandler)
      this.target.addEventListener('touchcancel', this.cleanup)
      this.target.addEventListener('touchmove', this.cleanup)
      this.target.addEventListener('touchend', this.cleanup)
    })
  },
  beforeDestroy () {
    this.target.removeEventListener('touchstart', this.touchStartHandler)
    this.target.removeEventListener('touchcancel', this.cleanup)
    this.target.removeEventListener('touchmove', this.cleanup)
    this.target.removeEventListener('touchend', this.cleanup)
  }
}
</script>
