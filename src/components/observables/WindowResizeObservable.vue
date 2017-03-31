<script>
import { viewport } from '../../utils/dom'

export default {
  name: 'q-window-resize-observable',
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
  mounted () {
    this.emit()
    window.addEventListener('resize', this.trigger)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.trigger)
  }
}
</script>
