<script>
import { getScrollPosition, getScrollTarget } from '../../utils/scroll'

export default {
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
    __trigger () {
      if (!this.timer) {
        this.timer = requestAnimationFrame(this.__emit)
      }
    },
    __emit () {
      const
        pos = getScrollPosition(this.target),
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
    this.target.addEventListener('scroll', this.__trigger)
    this.__trigger()
  },
  beforeDestroy () {
    this.target.removeEventListener('scroll', this.__trigger)
  }
}
</script>
