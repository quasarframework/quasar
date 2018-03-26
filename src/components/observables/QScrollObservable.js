import { getScrollPosition, getScrollTarget, isScrollHidden } from '../../utils/scroll'
import { listenOpts } from '../../utils/event'

export default {
  name: 'QScrollObservable',
  render () {},
  data () {
    return {
      pos: 0,
      dir: 'down',
      dirChanged: false,
      dirChangePos: 0,
      scrollHidden: false
    }
  },
  methods: {
    getPosition () {
      return {
        position: this.pos,
        direction: this.dir,
        directionChanged: this.dirChanged,
        inflexionPosition: this.dirChangePos,
        scrollHidden: this.scrollHidden
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
        dir = delta < 0 ? 'up' : 'down',
        scrollHidden = isScrollHidden()

      this.dirChanged = this.dir !== dir
      if (this.dirChanged) {
        this.dir = dir
        this.dirChangePos = this.pos
      }
      if (scrollHidden) {
        this.scrollHidden = scrollHidden
      }

      this.timer = null
      this.pos = pos
      this.$emit('scroll', this.getPosition())

      if (!scrollHidden) {
        this.scrollHidden = scrollHidden
      }
    }
  },
  mounted () {
    this.target = getScrollTarget(this.$el.parentNode)
    this.target.addEventListener('scroll', this.trigger, listenOpts.passive)
    this.trigger()
  },
  beforeDestroy () {
    this.target.removeEventListener('scroll', this.trigger, listenOpts.passive)
  }
}
