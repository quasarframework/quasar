import { listenOpts } from '../../utils/event'
import { isSSR } from '../../plugins/platform'

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
    emit (ssr) {
      this.timer = null
      this.$emit('resize', {
        height: ssr ? 0 : window.innerHeight,
        width: ssr ? 0 : window.innerWidth
      })
    }
  },
  created () {
    this.emit(isSSR || this.$q.platform.is.fromSSR)
  },
  mounted () {
    this.$q.platform.is.fromSSR && this.emit()
    window.addEventListener('resize', this.trigger, listenOpts.passive)
  },
  beforeDestroy () {
    clearTimeout(this.timer)
    window.removeEventListener('resize', this.trigger, listenOpts.passive)
  }
}
