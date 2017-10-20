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
        open: () => { this.$emit('open') },
        close: () => { this.$emit('close') }
      }
    }, this.$slots.default)
  },
  methods: {
    close () {
      this.$refs.popover.close()
    },
    __open (evt) {
      if (!evt || this.disable) {
        return
      }
      this.close()
      evt.preventDefault()
      evt.stopPropagation()
      /*
        Opening with a timeout for
        Firefox workaround
       */
      setTimeout(() => {
        this.$refs.popover.open(evt)
      }, 100)
    }
  },
  mounted () {
    this.target = this.$refs.popover.$el.parentNode
    this.target.addEventListener('contextmenu', this.__open)
  },
  beforeDestroy () {
    this.target.removeEventListener('contexmenu', this.__open)
  }
}
