import { getScrollTarget, getScrollPosition } from '../../utils/scroll'
import { cssTransform } from '../../utils/dom'
import { QIcon } from '../icon'
import TouchPan from '../../directives/touch-pan'

export default {
  name: 'q-pull-to-refresh',
  directives: {
    TouchPan
  },
  props: {
    handler: {
      type: Function,
      required: true
    },
    distance: {
      type: Number,
      default: 35
    },
    pullMessage: String,
    releaseMessage: String,
    refreshMessage: String,
    refreshIcon: String,
    inline: Boolean,
    disable: Boolean
  },
  data () {
    let height = 65

    return {
      state: 'pull',
      pullPosition: -height,
      height: height,
      animating: false,
      pulling: false,
      scrolling: false
    }
  },
  computed: {
    message () {
      switch (this.state) {
        case 'pulled':
          return this.releaseMessage || this.$q.i18n.pullToRefresh.release
        case 'refreshing':
          return this.refreshMessage || this.$q.i18n.pullToRefresh.refresh
        case 'pull':
        default:
          return this.pullMessage || this.$q.i18n.pullToRefresh.pull
      }
    },
    style () {
      return cssTransform(`translateY(${this.pullPosition}px)`)
    }
  },
  methods: {
    __pull (event) {
      if (this.disable) {
        return
      }

      if (event.isFinal) {
        this.scrolling = false
        this.pulling = false
        if (this.scrolling) {
          return
        }
        if (this.state === 'pulled') {
          this.state = 'refreshing'
          this.__animateTo(0)
          this.trigger()
        }
        else if (this.state === 'pull') {
          this.__animateTo(-this.height)
        }
        return
      }
      if (this.animating || this.scrolling || this.state === 'refreshing') {
        return true
      }

      let top = getScrollPosition(this.scrollContainer)
      if (top !== 0 || (top === 0 && event.direction !== 'down')) {
        this.scrolling = true
        if (this.pulling) {
          this.pulling = false
          this.state = 'pull'
          this.__animateTo(-this.height)
        }
        return true
      }

      event.evt.preventDefault()
      this.pulling = true
      this.pullPosition = -this.height + Math.max(0, Math.pow(event.distance.y, 0.85))
      this.state = this.pullPosition > this.distance ? 'pulled' : 'pull'
    },
    __animateTo (target, done, previousCall) {
      if (!previousCall && this.animationId) {
        cancelAnimationFrame(this.animating)
      }

      this.pullPosition -= (this.pullPosition - target) / 7

      if (this.pullPosition - target > 1) {
        this.animating = window.requestAnimationFrame(() => {
          this.__animateTo(target, done, true)
        })
      }
      else {
        this.animating = window.requestAnimationFrame(() => {
          this.pullPosition = target
          this.animating = false
          done && done()
        })
      }
    },
    trigger () {
      this.handler(() => {
        this.__animateTo(-this.height, () => {
          this.state = 'pull'
        })
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.scrollContainer = this.inline ? this.$el.parentNode : getScrollTarget(this.$el)
    })
  },
  render (h) {
    return h('div', { staticClass: 'pull-to-refresh' }, [
      h('div', {
        staticClass: 'pull-to-refresh-container',
        style: this.style,
        directives: [{
          name: 'touch-pan',
          modifiers: {
            vertical: true,
            scroll: true
          },
          value: this.__pull
        }]
      }, [
        h('div', { staticClass: 'pull-to-refresh-message row flex-center' }, [
          h(QIcon, {
            'class': { 'rotate-180': this.state === 'pulled' },
            props: { name: this.$q.icon.pullToRefresh.arrow },
            directives: [{
              name: 'show',
              value: this.state !== 'refreshing'
            }]
          }),
          h(QIcon, {
            staticClass: 'animate-spin',
            props: { name: this.refreshIcon || this.$q.icon.pullToRefresh.refresh },
            directives: [{
              name: 'show',
              value: this.state === 'refreshing'
            }]
          }),
          ` ${this.message}`
        ]),
        this.$slots.default
      ])
    ])
  }
}
