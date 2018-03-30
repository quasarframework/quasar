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
        show: () => { this.$emit('show', this.event) },
        hide: (evt) => { this.$emit('hide', this.event, evt) }
      }
    }, this.$slots.default)
  },
  methods: {
    hide (evt) {
      return this.$refs.popover.hide(evt)
    },
    show (evt) {
      if (!evt || this.disable) {
        return
      }
      this.hide(evt)
      stopAndPrevent(evt)
      /*
        Opening with a timeout for
        Firefox workaround
       */
      setTimeout(() => {
        this.event = evt
        this.$refs.popover.show(evt)
      }, 100)
    }
  },
  mounted () {
    this.target = this.$refs.popover.$el.parentNode
    this.target.addEventListener('contextmenu', this.show)
    this.target.addEventListener('click', this.hide)
  },
  beforeDestroy () {
    this.target.removeEventListener('contexmenu', this.show)
    this.target.removeEventListener('click', this.hide)
  }
}
