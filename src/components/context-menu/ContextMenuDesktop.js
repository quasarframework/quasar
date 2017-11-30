import { QPopover } from '../popover'

export default {
  name: 'q-context-menu',
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
        show: () => { this.$emit('show') },
        hide: () => { this.$emit('hide') }
      }
    }, this.$slots.default)
  },
  methods: {
    hide () {
      return this.$refs.popover.hide()
    },
    __show (evt) {
      if (!evt || this.disable) {
        return
      }
      this.hide()
      evt.preventDefault()
      evt.stopPropagation()
      /*
        Opening with a timeout for
        Firefox workaround
       */
      setTimeout(() => {
        this.$refs.popover.show(evt)
      }, 100)
    }
  },
  mounted () {
    this.target = this.$refs.popover.$el.parentNode
    this.target.addEventListener('contextmenu', this.__show)
  },
  beforeDestroy () {
    this.target.removeEventListener('contexmenu', this.__show)
  }
}
