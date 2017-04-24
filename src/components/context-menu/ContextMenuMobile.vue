<template>
  <q-modal class="minimized" ref="dialog">
    <slot></slot>
  </q-modal>
</template>

<script>
import { QModal } from '../modal'

export default {
  name: 'q-context-menu',
  components: {
    QModal
  },
  props: {
    disable: Boolean
  },
  methods: {
    open () {
      this.handler()
    },
    close () {
      this.target.classList.remove('non-selectable')
      this.$refs.dialog.close()
    },
    toggle () {
      if (this.$refs.dialog.active) {
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
        if (!this.disable) {
          this.$refs.dialog.open()
        }
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
        clearTimeout(this.touchTimer)
        this.touchTimer = null
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
