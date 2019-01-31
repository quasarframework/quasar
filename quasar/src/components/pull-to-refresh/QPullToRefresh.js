import Vue from 'vue'

import QIcon from '../icon/QIcon.js'
import QSpinner from '../spinner/QSpinner.js'
import TouchPan from '../../directives/TouchPan.js'

import { getScrollTarget, getScrollPosition } from '../../utils/scroll.js'
import { between } from '../../utils/format.js'

const
  PULLER_HEIGHT = 40,
  OFFSET_TOP = 20

export default Vue.extend({
  name: 'QPullToRefresh',

  directives: {
    TouchPan
  },

  props: {
    color: String,
    icon: String,
    noMouse: Boolean,
    disable: Boolean
  },

  data () {
    return {
      state: 'pull',
      pullRatio: 0,
      pulling: false,
      pullPosition: -PULLER_HEIGHT,
      animating: false,
      positionCSS: {}
    }
  },

  computed: {
    style () {
      return {
        opacity: this.pullRatio,
        transform: `translate3d(0, ${this.pullPosition}px, 0) rotate3d(0, 0, 1, ${this.pullRatio * 360}deg)`
      }
    }
  },

  methods: {
    trigger () {
      this.$emit('refresh', () => {
        this.__animateTo({ pos: -PULLER_HEIGHT, ratio: 0 }, () => {
          this.state = 'pull'
        })
      })
    },

    updateScrollTarget () {
      this.scrollContainer = getScrollTarget(this.$el)
    },

    __pull (event) {
      if (event.isFinal) {
        this.scrolling = false

        if (this.pulling) {
          this.pulling = false

          if (this.state === 'pulled') {
            this.state = 'refreshing'
            this.__animateTo({ pos: OFFSET_TOP })
            this.trigger()
          }
          else if (this.state === 'pull') {
            this.__animateTo({ pos: -PULLER_HEIGHT, ratio: 0 })
          }
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
          this.__animateTo({ pos: -PULLER_HEIGHT, ratio: 0 })
        }

        return true
      }

      if (event.isFirst) {
        this.pulling = true

        if (window.getSelection) {
          const sel = window.getSelection()
          sel.empty && sel.empty()
        }

        const { top, left } = this.$el.getBoundingClientRect()
        this.positionCSS = {
          top: top + 'px',
          left: left + 'px',
          width: window.getComputedStyle(this.$el).getPropertyValue('width')
        }
      }

      event.evt.preventDefault()

      const distance = Math.max(0, event.distance.y)
      this.pullPosition = distance - PULLER_HEIGHT
      this.pullRatio = between(distance / (OFFSET_TOP + PULLER_HEIGHT), 0, 1)

      const state = this.pullPosition > OFFSET_TOP ? 'pulled' : 'pull'
      if (this.state !== state) {
        this.state = state
      }
    },

    __animateTo ({ pos, ratio }, done) {
      this.animating = true
      this.pullPosition = pos

      if (ratio !== void 0) {
        this.pullRatio = ratio
      }

      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.animating = false
        done && done()
      }, 300)
    }
  },

  mounted () {
    this.updateScrollTarget()
  },

  beforeDestroy () {
    clearTimeout(this.timer)
  },

  render (h) {
    return h('div', {
      staticClass: 'q-pull-to-refresh relative-position overflow-hidden',
      directives: this.disable
        ? null
        : [{
          name: 'touch-pan',
          modifiers: {
            vertical: true,
            mightPrevent: true,
            noMouse: this.noMouse
          },
          value: this.__pull
        }]
    }, [
      h('div', {
        staticClass: 'q-pull-to-refresh__content',
        class: this.pulling ? 'no-pointer-events' : null
      }, this.$slots.default),

      h('div', {
        staticClass: 'q-pull-to-refresh__puller-container fixed row flex-center no-pointer-events z-top',
        style: this.positionCSS
      }, [
        h('div', {
          staticClass: 'q-pull-to-refresh__puller row flex-center',
          style: this.style,
          class: this.animating ? 'q-pull-to-refresh__puller--animating' : null
        }, [
          this.state !== 'refreshing'
            ? h(QIcon, {
              props: {
                name: this.icon || this.$q.iconSet.pullToRefresh.icon,
                color: this.color,
                size: '32px'
              }
            })
            : h(QSpinner, {
              props: {
                size: '24px',
                color: this.color
              }
            })
        ])
      ])
    ])
  }
})
