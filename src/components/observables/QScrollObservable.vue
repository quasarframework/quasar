<script>
import { getScrollPosition, getScrollTarget } from '../../utils/scroll'

export default {
  name: 'q-scroll-observable',
  render () {},
  data () {
    return {
      pos: 0,
      dir: 'down',
      dirChanged: false,
      dirChangePos: 0
    }
  },
  methods: {
    getPosition () {
      return {
        position: this.pos,
        direction: this.dir,
        directionChanged: this.dirChanged,
        inflexionPosition: this.dirChangePos
      }
    },
    trigger () {
      if (!this.timer) {
        this.timer = window.requestAnimationFrame(this.emit)
      }
    },
    emit () {
      const
        pos = Math.max(0, getScrollPosition(this.target)),
        delta = pos - this.pos,
        dir = delta < 0 ? 'up' : 'down'

      this.dirChanged = this.dir !== dir
      if (this.dirChanged) {
        this.dir = dir
        this.dirChangePos = this.pos
      }

      this.timer = null
      this.pos = pos
      this.$emit('scroll', this.getPosition())
    }
  },
  mounted () {
    this.target = getScrollTarget(this.$el.parentNode)
    this.target.addEventListener('scroll', this.trigger)
    this.trigger()
  },
  beforeDestroy () {
    this.target.removeEventListener('scroll', this.trigger)
  }
}
</script>
