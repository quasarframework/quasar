import { getScrollPosition, getScrollTarget } from '../../utils/scroll.js'
import { listenOpts } from '../../utils/event.js'

export default {
  name: 'QScrollObservable',
  props: {
    debounce: Number
  },
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
    trigger (immediately) {
      if (immediately === true || this.debounce === 0) {
        this.emit()
      }
      else if (!this.timer) {
        this.timer = this.debounce
          ? setTimeout(this.emit, this.debounce)
          : requestAnimationFrame(this.emit)
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
    this.target.addEventListener('scroll', this.trigger, listenOpts.passive)
    this.trigger(true)
  },
  beforeDestroy () {
    clearTimeout(this.timer)
    cancelAnimationFrame(this.timer)
    this.target.removeEventListener('scroll', this.trigger, listenOpts.passive)
  }
}
