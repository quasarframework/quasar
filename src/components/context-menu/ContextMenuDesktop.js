import { stopAndPrevent } from '../../utils/event'
import { QPopover } from '../popover'

export default {
  name: 'QContextMenu',
  components: {
    QPopover
  },
  props: {
    disable: Boolean
  },
  render (h) {
    return h(QPopover, {
      ref: 'popover',
      props: {
        anchorClick: false
      },
      on: {
        show: this.__onShow,
        hide: this.__onHide
      }
    }, this.$slots.default)
  },
  methods: {
    hide (evt) {
      if (this.$refs.popover) {
        return this.$refs.popover.hide(evt)
      }
    },
    show (evt) {
      if (!evt || this.disable) {
        return
      }
      stopAndPrevent(evt)
      /*
        Opening with a timeout for
        Firefox workaround
       */
      setTimeout(() => {
        if (this.$refs.popover) {
          this.event = evt
          this.$refs.popover.show(evt)
        }
      }, 100)
    },
    __bodyHide (evt) {
      if (!this.$el.contains(evt.target)) {
        this.hide(evt)
      }
    },
    __onShow () {
      document.body.addEventListener('contextmenu', this.__bodyHide, true)
      document.body.addEventListener('click', this.__bodyHide, true)
      this.$emit('show', this.event)
    },
    __onHide (evt) {
      document.body.removeEventListener('contextmenu', this.__bodyHide, true)
      document.body.removeEventListener('click', this.__bodyHide, true)
      this.$emit('hide', this.event, evt)
    }
  },
  mounted () {
    this.target = this.$refs.popover.$el.parentNode
    this.target.addEventListener('contextmenu', this.show)
  },
  beforeDestroy () {
    this.target.removeEventListener('contextmenu', this.show)
  }
}
