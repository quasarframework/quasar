import { listenOpts } from '../../utils/event'

export default {
  name: 'QWindowResizeObservable',
  props: {
    debounce: {
      type: Number,
      default: 80
    }
  },
  render () {},
  methods: {
    trigger () {
      if (this.debounce === 0) {
        this.emit()
      }
      else if (!this.timer) {
        this.timer = setTimeout(this.emit, this.debounce)
      }
    },
    emit () {
      this.timer = null
      this.$emit('resize', {
        height: window.innerHeight,
        width: window.innerWidth
      })
    }
  },
  created () {
    this.emit()
  },
  mounted () {
    window.addEventListener('resize', this.trigger, listenOpts.passive)
  },
  beforeDestroy () {
    clearTimeout(this.timer)
    window.removeEventListener('resize', this.trigger, listenOpts.passive)
  }
}
