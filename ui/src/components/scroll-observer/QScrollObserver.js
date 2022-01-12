import Vue from 'vue'

import { getScrollPosition, getScrollTarget, getHorizontalScrollPosition } from '../../utils/scroll.js'
import { listenOpts, noop } from '../../utils/event.js'

const { passive } = listenOpts

export default Vue.extend({
  name: 'QScrollObserver',

  props: {
    debounce: [ String, Number ],
    horizontal: Boolean,

    scrollTarget: {
      default: void 0
    }
  },

  render: noop, // eslint-disable-line

  data () {
    return {
      pos: 0,
      dir: this.horizontal === true ? 'right' : 'down',
      dirChanged: false,
      dirChangePos: 0
    }
  },

  watch: {
    scrollTarget () {
      this.__unconfigureScrollTarget()
      this.__configureScrollTarget()
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
      else if (this.clearTimer === void 0) {
        const [ timer, fn ] = this.debounce
          ? [ setTimeout(this.__emit, this.debounce), clearTimeout ]
          : [ requestAnimationFrame(this.__emit), cancelAnimationFrame ]

        this.clearTimer = () => {
          fn(timer)
          this.clearTimer = void 0
        }
      }
    },

    __emit () {
      this.clearTimer !== void 0 && this.clearTimer()

      const fn = this.horizontal === true
        ? getHorizontalScrollPosition
        : getScrollPosition

      const
        pos = Math.max(0, fn(this.__scrollTarget)),
        delta = pos - this.pos,
        dir = this.horizontal === true
          ? delta < 0 ? 'left' : 'right'
          : delta < 0 ? 'up' : 'down'

      this.dirChanged = this.dir !== dir

      if (this.dirChanged) {
        this.dir = dir
        this.dirChangePos = this.pos
      }

      this.pos = pos
      this.$emit('scroll', this.getPosition())
    },

    __configureScrollTarget () {
      this.__scrollTarget = getScrollTarget(this.$el.parentNode, this.scrollTarget)
      this.__scrollTarget.addEventListener('scroll', this.trigger, passive)
      this.trigger(true)
    },

    __unconfigureScrollTarget () {
      if (this.__scrollTarget !== void 0) {
        this.__scrollTarget.removeEventListener('scroll', this.trigger, passive)
        this.__scrollTarget = void 0
      }
    }
  },

  mounted () {
    this.__configureScrollTarget()
  },

  beforeDestroy () {
    this.clearTimer !== void 0 && this.clearTimer()
    this.__unconfigureScrollTarget()
  }
})
