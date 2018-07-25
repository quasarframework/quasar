import { getScrollTarget, getScrollPosition } from '../../utils/scroll.js'
import { cssTransform } from '../../utils/dom.js'
import QIcon from '../icon/QIcon.js'
import TouchPan from '../../directives/touch-pan.js'

const height = -65

export default {
  name: 'QPullToRefresh',
  directives: {
    TouchPan
  },
  props: {
    handler: {
      type: Function,
      required: true
    },
    color: {
      type: String,
      default: 'primary'
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
    return {
      state: 'pull',
      pullPosition: height,
      animating: false,
      pulling: false,
      scrolling: false
    }
  },
  watch: {
    inline (val) {
      this.setScrollContainer(val)
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
      const css = cssTransform(`translateY(${this.pullPosition}px)`)
      css.marginBottom = `${height}px`
      return css
    },
    messageClass () {
      return `text-${this.color}`
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
        if (this.state === 'pulled') {
          this.state = 'refreshing'
          this.__animateTo(0)
          this.trigger()
        }
        else if (this.state === 'pull') {
          this.__animateTo(height)
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
          this.__animateTo(height)
        }
        return true
      }

      event.evt.preventDefault()
      this.pulling = true
      this.pullPosition = height + Math.max(0, Math.pow(event.distance.y, 0.85))
      this.state = this.pullPosition > this.distance ? 'pulled' : 'pull'
    },
    __animateTo (target, done, previousCall) {
      if (!previousCall && this.animationId) {
        cancelAnimationFrame(this.animating)
      }

      this.pullPosition -= (this.pullPosition - target) / 7

      if (this.pullPosition - target > 1) {
        this.animating = requestAnimationFrame(() => {
          this.__animateTo(target, done, true)
        })
      }
      else {
        this.animating = requestAnimationFrame(() => {
          this.pullPosition = target
          this.animating = false
          done && done()
        })
      }
    },
    trigger () {
      this.handler(() => {
        this.__animateTo(height, () => {
          this.state = 'pull'
        })
      })
    },
    setScrollContainer (inline) {
      this.$nextTick(() => {
        this.scrollContainer = inline ? this.$el.parentNode : getScrollTarget(this.$el)
      })
    }
  },
  mounted () {
    this.setScrollContainer(this.inline)
  },
  render (h) {
    return h('div', { staticClass: 'pull-to-refresh overflow-hidden-y' }, [
      h('div', {
        staticClass: 'pull-to-refresh-container',
        style: this.style,
        directives: this.disable
          ? null
          : [{
            name: 'touch-pan',
            modifiers: {
              vertical: true,
              mightPrevent: true
            },
            value: this.__pull
          }]
      }, [
        h('div', {
          staticClass: 'pull-to-refresh-message row flex-center',
          'class': this.messageClass
        }, [
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
