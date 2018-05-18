import { stopAndPrevent } from '../../utils/event'
import { QModal } from '../modal'

export default {
  name: 'QContextMenu',
  props: {
    disable: Boolean
  },
  methods: {
    hide (evt) {
      this.target.classList.remove('non-selectable')
      return this.$refs.dialog.hide(evt)
    },
    show (evt) {
      if (!this.disable && this.$refs.dialog) {
        this.event = evt
        this.$refs.dialog.show(evt)
      }
    },
    __touchStartHandler (evt) {
      this.target.classList.add('non-selectable')
      this.touchTimer = setTimeout(() => {
        evt && stopAndPrevent(evt)
        setTimeout(() => {
          this.__cleanup()
          this.show(evt)
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
        show: () => { this.$emit('show', this.event) },
        hide: evt => { this.$emit('hide', this.event, evt) }
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
