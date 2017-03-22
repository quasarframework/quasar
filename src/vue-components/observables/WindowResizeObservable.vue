<script>
import { viewport } from '../../utils/dom'

export default {
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
    this.trigger()
    window.addEventListener('resize', this.trigger)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.trigger)
  }
}
</script>
