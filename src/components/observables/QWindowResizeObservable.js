import { viewport } from '../../utils/dom'
import { listenOpts } from '../../utils/event'

export default {
  name: 'QWindowResizeObservable',
  render () {},
  methods: {
    trigger () {
      if (!this.timer) {
        this.timer = window.requestAnimationFrame(this.emit)
      }
    },
    emit () {
      this.timer = null
      this.$emit('resize', viewport())
    }
  },
  created () {
    this.emit()
  },
  mounted () {
    window.addEventListener('resize', this.trigger, listenOpts.passive)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.trigger, listenOpts.passive)
  }
}
