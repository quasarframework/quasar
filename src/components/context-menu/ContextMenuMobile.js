import { QModal } from '../modal'

export default {
  name: 'q-context-menu',
  props: {
    disable: Boolean
  },
  methods: {
    hide () {
      this.target.classList.remove('non-selectable')
      return this.$refs.dialog.hide()
    },
    __show () {
      if (!this.disable && this.$refs.dialog) {
        this.$refs.dialog.show()
      }
    },
    __touchStartHandler (evt) {
      this.target.classList.add('non-selectable')
      this.touchTimer = setTimeout(() => {
        evt.preventDefault()
        evt.stopPropagation()
        setTimeout(() => {
          this.__cleanup()
          this.__show()
        }, 10)
      }, 600)
    },
    __cleanup () {
      this.target.classList.remove('non-selectable')
      clearTimeout(this.touchTimer)
    }
  },
  render (h) {
    return h(QModal, {
      ref: 'dialog',
      props: {
        minimized: true
      },
      on: {
        show: () => { this.$emit('show') },
        hide: () => { this.$emit('hide') }
      }
    }, this.$slots.default)
  },
  mounted () {
    this.$nextTick(() => {
      this.target = this.$el.parentNode
      this.target.addEventListener('touchstart', this.__touchStartHandler)
      ;['touchcancel', 'touchmove', 'touchend'].forEach(evt => {
        this.target.addEventListener(evt, this.__cleanup)
      })
    })
  },
  beforeDestroy () {
    this.target.removeEventListener('touchstart', this.__touchStartHandler)
    ;['touchcancel', 'touchmove', 'touchend'].forEach(evt => {
      this.target.removeEventListener(evt, this.__cleanup)
    })
  }
}
