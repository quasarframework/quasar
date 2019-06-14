import Vue from 'vue'

import { getScrollPosition, getScrollTarget, getHorizontalScrollPosition } from '../../utils/scroll.js'
import { listenOpts } from '../../utils/event.js'

export default Vue.extend({
  name: 'QScrollObserver',

  props: {
    debounce: [String, Number],
    horizontal: Boolean
  },

  render () {}, // eslint-disable-line

  data () {
    return {
      pos: 0,
      dir: this.horizontal === true ? 'right' : 'down',
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
      if (immediately === true || this.debounce === 0 || this.debounce === '0') {
        this.__emit()
      }
      else if (!this.timer) {
        this.timer = this.debounce
          ? setTimeout(this.__emit, this.debounce)
          : requestAnimationFrame(this.__emit)
      }
    },

    __emit () {
      const
        pos = Math.max(0, (this.horizontal === true ? getHorizontalScrollPosition(this.target) : getScrollPosition(this.target))),
        delta = pos - this.pos,
        dir = this.horizontal
          ? delta < 0 ? 'left' : 'right'
          : delta < 0 ? 'up' : 'down'
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
})
